'use strict';

const { AppError } = require('../errors/AppError');
const { STATES } = require('../constants/domainStates');
const { validateRequired, validateState } = require('../validators');
const { Cotizacion, CotizacionDetalle, Servicio, Material, sequelize } = require('../infrastructure/models');

class QuoteUseCase {
  async list(query, user) {
    const where = !user.roles.includes('ADMINISTRADOR') ? { sucursalId: user.sucursalId } : {};
    return Cotizacion.findAll({ where, include: [{ model: CotizacionDetalle, as: 'detalles', include: [{ model: Servicio, as: 'servicio' }, { model: Material, as: 'material' }] }], order: [['id', 'DESC']] });
  }
  async get(id, user) { const quote = await this.find(id, user); return quote; }
  async create(input, user) {
    validateRequired(input, ['clienteId', 'vehiculoId', 'detalles']);
    if (!Array.isArray(input.detalles) || !input.detalles.length) throw new AppError(422, 'EMPTY_QUOTE', 'Agrega al menos un servicio.');
    return sequelize.transaction(async (transaction) => {
      let subtotal = 0;
      let impuesto = 0;
      const details = [];
      for (const item of input.detalles) {
        const service = item.servicioId ? await Servicio.findByPk(item.servicioId, { transaction }) : null;
        const material = item.materialId ? await Material.findByPk(item.materialId, { transaction }) : null;
        if (!service && !material) throw new AppError(422, 'QUOTE_ITEM_NOT_FOUND', 'Cada línea debe indicar un servicio o material existente.');
        const cantidad = Number(item.cantidad || 1);
        const precio = Number(item.precioUnitario ?? service?.precioBase ?? material?.precioVenta);
        const tax = Number(item.porcentajeImpuesto ?? service?.porcentajeImpuesto ?? 18);
        if (cantidad <= 0 || precio < 0 || tax < 0) throw new AppError(422, 'INVALID_QUOTE_ITEM', 'Cantidad, precio e impuesto deben ser valores válidos.');
        const lineSubtotal = roundMoney(cantidad * precio);
        const lineTax = roundMoney(lineSubtotal * tax / 100);
        subtotal += lineSubtotal;
        impuesto += lineTax;
        details.push({
          servicioId: service?.id || null,
          materialId: material?.id || null,
          tipoItem: service ? 'SERVICIO' : material.categoria === 'REFRIGERANTE' ? 'REFRIGERANTE' : material.categoria === 'CONSUMIBLE' ? 'CONSUMIBLE' : 'MATERIAL',
          descripcion: service?.nombre || material.nombre,
          cantidad,
          precioUnitario: precio,
          porcentajeImpuesto: tax,
          montoImpuesto: lineTax,
        });
      }
      subtotal = roundMoney(subtotal);
      impuesto = roundMoney(impuesto);
      const descuento = roundMoney(input.descuento || 0);
      if (descuento < 0 || descuento > subtotal + impuesto) throw new AppError(422, 'INVALID_DISCOUNT', 'El descuento de la cotización no es válido.');
      const quote = await Cotizacion.create({
        numero: `COT-${Date.now()}`,
        clienteId: input.clienteId,
        vehiculoId: input.vehiculoId,
        sucursalId: user.roles.includes('ADMINISTRADOR') ? input.sucursalId : user.sucursalId,
        estado: 'BORRADOR',
        subtotal,
        impuesto,
        descuento,
        total: roundMoney(subtotal + impuesto - descuento),
        observaciones: input.observaciones,
        vigencia: input.vigencia || input.vigenciaHasta || new Date(Date.now() + 15 * 86400000),
        creadoPor: user.id,
      }, { transaction });
      await CotizacionDetalle.bulkCreate(details.map((item) => ({ ...item, cotizacionId: quote.id })), { transaction });
      return Cotizacion.findByPk(quote.id, { include: [{ model: CotizacionDetalle, as: 'detalles' }], transaction });
    });
  }
  async update(id, input, user) {
    const quote = await this.find(id, user);
    if (!['BORRADOR', 'ENVIADA'].includes(quote.estado)) throw new AppError(409, 'QUOTE_LOCKED', 'La cotización ya no puede editarse.');
    return quote.update({ observaciones: input.observaciones, vigencia: input.vigencia || input.vigenciaHasta });
  }
  async updateState(id, state, user) { validateState(state, STATES.quote); const quote = await this.find(id, user); return quote.update({ estado: state }); }
  async find(id, user) {
    const quote = await Cotizacion.findByPk(id, { include: [{ model: CotizacionDetalle, as: 'detalles', include: [{ model: Servicio, as: 'servicio' }, { model: Material, as: 'material' }] }] });
    if (!quote) throw new AppError(404, 'QUOTE_NOT_FOUND', 'No se encontró la cotización.');
    if (!user.roles.includes('ADMINISTRADOR') && Number(quote.sucursalId) !== Number(user.sucursalId)) throw new AppError(403, 'BRANCH_FORBIDDEN', 'La cotización pertenece a otra sucursal.');
    return quote;
  }
}

module.exports = { QuoteUseCase };

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}
