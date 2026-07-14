'use strict';

const models = require('../infrastructure/models');
const { AppError } = require('../errors/AppError');
const { assertWorkOrderAccess } = require('./repositoryAccess');

class WorkOrderRepository {
  constructor(db = models) {
    this.db = db;
  }

  async quoteToOrder(quoteId, data, user) {
    const { Cotizacion, CotizacionDetalle, OrdenTrabajo, OrdenServicio, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const quote = await Cotizacion.findByPk(quoteId, {
        include: [{ model: CotizacionDetalle, as: 'detalles' }],
        transaction,
        lock: { level: transaction.LOCK.UPDATE, of: Cotizacion },
      });
      if (!quote) throw new AppError(404, 'QUOTE_NOT_FOUND', 'No se encontró la cotización.');
      if (quote.estado !== 'APROBADA') {
        throw new AppError(409, 'QUOTE_NOT_APPROVED', 'Solo una cotización aprobada puede convertirse en orden.');
      }
      if (!user.roles.includes('ADMINISTRADOR') && Number(quote.sucursalId) !== Number(user.sucursalId)) {
        throw new AppError(403, 'BRANCH_FORBIDDEN', 'La cotización pertenece a otra sucursal.');
      }
      const existing = await OrdenTrabajo.findOne({ where: { cotizacionId: quoteId }, transaction });
      if (existing) throw new AppError(409, 'QUOTE_ALREADY_CONVERTED', 'La cotización ya tiene una orden de trabajo.');

      const order = await OrdenTrabajo.create({
        vehiculoId: quote.vehiculoId,
        sucursalId: quote.sucursalId,
        cotizacionId: quote.id,
        tecnicoId: data.tecnicoId || null,
        descripcionProblema: quote.observaciones,
        estado: 'ABIERTA',
      }, { transaction });
      const details = (quote.detalles || [])
        .filter((item) => item.servicioId)
        .map((item) => ({
          ordenTrabajoId: order.id,
          servicioId: item.servicioId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
        }));
      if (details.length) await OrdenServicio.bulkCreate(details, { transaction });
      return order;
    });
  }

  async upsertDiagnosis(orderId, data, user) {
    const { OrdenTrabajo, Diagnostico, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const order = await OrdenTrabajo.findByPk(orderId, { transaction, lock: transaction.LOCK.UPDATE });
      assertWorkOrderAccess(order, user);
      const [diagnosis] = await Diagnostico.upsert({
        ...data,
        ordenTrabajoId: orderId,
        creadoPor: user.id,
        fechaDiagnostico: new Date(),
      }, { transaction, returning: true });
      if (order.estado === 'ABIERTA') await order.update({ estado: 'EN_DIAGNOSTICO' }, { transaction });
      return diagnosis;
    });
  }

  async addMaterial(orderId, data, user) {
    const { OrdenTrabajo, Material, OrdenMaterial, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const order = await OrdenTrabajo.findByPk(orderId, { transaction, lock: transaction.LOCK.UPDATE });
      assertWorkOrderAccess(order, user);
      const material = await Material.findByPk(data.materialId, { transaction, lock: transaction.LOCK.UPDATE });
      if (!material || !material.activo) throw new AppError(404, 'MATERIAL_NOT_FOUND', 'No se encontró el material.');
      // El trigger valida de nuevo y descuenta el stock de forma atómica.
      if (Number(material.stockActual) < Number(data.cantidad)) {
        throw new AppError(409, 'INSUFFICIENT_STOCK', `Disponible: ${Number(material.stockActual)} ${material.unidadMedida}.`);
      }
      return OrdenMaterial.create({
        ordenTrabajoId: orderId,
        materialId: material.id,
        cantidad: data.cantidad,
        precioUnitario: data.precioUnitario ?? material.precioVenta,
        registradoPor: user.id,
      }, { transaction });
    });
  }

  async addService(orderId, data, user) {
    const { OrdenTrabajo, Servicio, OrdenServicio, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const order = await OrdenTrabajo.findByPk(orderId, { transaction });
      assertWorkOrderAccess(order, user);
      const service = await Servicio.findByPk(data.servicioId, { transaction });
      if (!service || !service.activo) throw new AppError(404, 'SERVICE_NOT_FOUND', 'No se encontró el servicio.');
      return OrdenServicio.create({
        ordenTrabajoId: orderId,
        servicioId: service.id,
        cantidad: data.cantidad || 1,
        precioUnitario: data.precioUnitario ?? service.precioBase,
      }, { transaction });
    });
  }

  async closeOrder(orderId, data, user) {
    const { OrdenTrabajo, Diagnostico, Historial, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const order = await OrdenTrabajo.findByPk(orderId, {
        include: [{ model: Diagnostico, as: 'diagnostico' }],
        transaction,
        lock: { level: transaction.LOCK.UPDATE, of: OrdenTrabajo },
      });
      assertWorkOrderAccess(order, user);
      if (!order.diagnostico) throw new AppError(409, 'DIAGNOSIS_REQUIRED', 'Registra el diagnóstico antes de cerrar la orden.');
      // PostgreSQL confirma de manera definitiva el diagnóstico y la factura pagada.
      await order.update({ estado: 'CERRADA', fechaCierre: new Date() }, { transaction });
      await Historial.findOrCreate({
        where: { ordenTrabajoId: order.id },
        defaults: {
          vehiculoId: order.vehiculoId,
          descripcion: data.descripcion || order.diagnostico.fallaDetectada,
          recomendaciones: data.recomendaciones,
          registradoPor: user.id,
        },
        transaction,
      });
      return order;
    });
  }
}

module.exports = { WorkOrderRepository };
