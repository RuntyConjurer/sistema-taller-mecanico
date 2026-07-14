'use strict';

const models = require('../infrastructure/models');
const { AppError } = require('../errors/AppError');
const { roundMoney } = require('../utils/money');
const { assertWorkOrderAccess } = require('./repositoryAccess');

class BillingRepository {
  constructor(db = models) {
    this.db = db;
  }

  async createInvoice(data, user) {
    const {
      OrdenTrabajo, OrdenServicio, OrdenMaterial, Servicio, Material,
      Factura, FacturaOrden, FacturaDetalle, sequelize,
    } = this.db;
    return sequelize.transaction(async (transaction) => {
      const order = await OrdenTrabajo.findByPk(data.ordenTrabajoId, {
        include: [
          { model: OrdenServicio, as: 'servicios', include: [{ model: Servicio, as: 'servicio' }] },
          { model: OrdenMaterial, as: 'materiales', include: [{ model: Material, as: 'material' }] },
        ],
        transaction,
        lock: { level: transaction.LOCK.UPDATE, of: OrdenTrabajo },
      });
      assertWorkOrderAccess(order, user);
      const already = await FacturaOrden.findOne({ where: { ordenTrabajoId: order.id }, transaction });
      if (already) throw new AppError(409, 'ORDER_ALREADY_INVOICED', 'La orden ya fue facturada.');

      const details = [];
      for (const item of order.servicios) {
        details.push({
          tipoItem: 'SERVICIO',
          descripcion: item.servicio.nombre,
          cantidad: Number(item.cantidad),
          precioUnitario: Number(item.precioUnitario),
          porcentajeImpuesto: Number(item.servicio.porcentajeImpuesto || 0),
        });
      }
      for (const item of order.materiales) {
        details.push({
          tipoItem: item.material.categoria === 'REFRIGERANTE' ? 'REFRIGERANTE' : 'MATERIAL',
          descripcion: item.material.nombre,
          cantidad: Number(item.cantidad),
          precioUnitario: Number(item.precioUnitario),
          porcentajeImpuesto: 18,
        });
      }
      if (!details.length) throw new AppError(409, 'EMPTY_INVOICE', 'Agrega servicios o materiales antes de facturar.');

      for (const item of details) {
        item.subtotal = roundMoney(item.cantidad * item.precioUnitario);
        item.montoImpuesto = roundMoney(item.subtotal * item.porcentajeImpuesto / 100);
      }
      const subtotal = roundMoney(details.reduce((sum, item) => sum + item.subtotal, 0));
      const impuesto = roundMoney(details.reduce((sum, item) => sum + item.montoImpuesto, 0));
      const descuento = roundMoney(Number(data.descuento || 0));
      if (descuento > subtotal + impuesto) {
        throw new AppError(422, 'INVALID_DISCOUNT', 'El descuento no puede superar el importe.');
      }

      const invoice = await Factura.create({
        numeroFactura: `SGTRA-${Date.now()}`,
        subtotal,
        impuesto,
        descuento,
        total: roundMoney(subtotal + impuesto - descuento),
        estado: 'PENDIENTE',
        observaciones: data.observaciones,
        creadoPor: user.id,
      }, { transaction });
      await FacturaOrden.create({ facturaId: invoice.id, ordenTrabajoId: order.id }, { transaction });
      await FacturaDetalle.bulkCreate(details.map((item) => ({
        facturaId: invoice.id,
        ordenTrabajoId: order.id,
        tipoItem: item.tipoItem,
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        porcentajeImpuesto: item.porcentajeImpuesto,
        montoImpuesto: item.montoImpuesto,
      })), { transaction });
      await order.update({ estado: 'FACTURADA' }, { transaction });
      return Factura.findByPk(invoice.id, {
        include: [{ model: FacturaDetalle, as: 'detalles' }],
        transaction,
      });
    });
  }

  async registerPayment(invoiceId, data, user) {
    const { Factura, Pago, PagoFactura, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const invoice = await Factura.findByPk(invoiceId, {
        include: [{ model: PagoFactura, as: 'aplicacionesPago' }],
        transaction,
        lock: { level: transaction.LOCK.UPDATE, of: Factura },
      });
      if (!invoice) throw new AppError(404, 'INVOICE_NOT_FOUND', 'No se encontró la factura.');
      if (invoice.estado !== 'PENDIENTE') throw new AppError(409, 'INVOICE_NOT_PAYABLE', 'La factura no admite pagos.');

      const applied = invoice.aplicacionesPago.reduce((sum, item) => sum + Number(item.montoAplicado), 0);
      const balance = roundMoney(Number(invoice.total) - applied);
      if (Number(data.monto) > balance) {
        throw new AppError(409, 'OVERPAYMENT', `El saldo pendiente es RD$ ${balance.toFixed(2)}.`);
      }
      const payment = await Pago.create({
        montoTotal: data.monto,
        formaPago: data.formaPago,
        referencia: data.referencia,
        recibidoPor: user.id,
      }, { transaction });
      await PagoFactura.create({
        pagoId: payment.id,
        facturaId: invoice.id,
        montoAplicado: data.monto,
      }, { transaction });
      const remaining = roundMoney(balance - Number(data.monto));
      if (remaining === 0) await invoice.update({ estado: 'PAGADA' }, { transaction });
      return { payment, invoice, saldoPendiente: remaining };
    });
  }

  async cancelInvoice(id, user) {
    const invoice = await this.getInvoice(id, user);
    if (invoice.estado !== 'PENDIENTE') {
      throw new AppError(409, 'INVOICE_NOT_CANCELABLE', 'Solo puede anularse una factura pendiente.');
    }
    if (invoice.aplicacionesPago.length) {
      throw new AppError(409, 'INVOICE_HAS_PAYMENTS', 'No se puede anular una factura con pagos registrados.');
    }
    return invoice.update({ estado: 'ANULADA' });
  }

  async listInvoices(user) {
    const where = user.roles.includes('ADMINISTRADOR') ? undefined : { sucursalId: user.sucursalId };
    return this.db.Factura.findAll({
      include: [
        { model: this.db.FacturaDetalle, as: 'detalles' },
        { model: this.db.PagoFactura, as: 'aplicacionesPago' },
        {
          model: this.db.OrdenTrabajo,
          as: 'ordenes',
          where,
          through: { attributes: [] },
          include: [{
            model: this.db.Vehiculo,
            as: 'vehiculo',
            include: [{ model: this.db.Cliente, as: 'cliente' }],
          }],
        },
      ],
      order: [['id', 'DESC']],
    });
  }

  async getInvoice(id, user) {
    const invoices = await this.listInvoices(user);
    const invoice = invoices.find((item) => Number(item.id) === Number(id));
    if (!invoice) throw new AppError(404, 'INVOICE_NOT_FOUND', 'No se encontró la factura.');
    return invoice;
  }
}

module.exports = { BillingRepository };
