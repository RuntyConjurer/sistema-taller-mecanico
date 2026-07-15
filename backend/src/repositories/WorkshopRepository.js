'use strict';

const { Op, fn, col, QueryTypes } = require('sequelize');
const models = require('../infrastructure/models');
const { AppError } = require('../errors/AppError');

class WorkshopRepository {
  constructor(db = models) { this.db = db; }

  async createBooking(payload) {
    const { Cliente, Vehiculo, Cita, Sucursal, Servicio, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const branch = await Sucursal.findOne({ where: { id: payload.cita.sucursalId, activa: true }, transaction });
      if (!branch) throw new AppError(422, 'BRANCH_NOT_AVAILABLE', 'La sucursal seleccionada no está disponible.');
      if (payload.cita.servicioId) {
        const service = await Servicio.findOne({ where: { id: payload.cita.servicioId, activo: true }, transaction });
        if (!service) throw new AppError(422, 'SERVICE_NOT_AVAILABLE', 'El servicio seleccionado no está disponible.');
      }
      const acceptsWhatsApp = payload.cliente.whatsappOptIn === true;
      const clientData = { ...payload.cliente };
      delete clientData.whatsappOptIn;
      let cliente = await Cliente.findOne({ where: { identificacion: payload.cliente.identificacion }, transaction, lock: transaction.LOCK.UPDATE });
      if (!cliente) {
        cliente = await Cliente.create({
          ...clientData,
          whatsappOptIn: acceptsWhatsApp,
          whatsappOptInAt: acceptsWhatsApp ? new Date() : null,
          whatsappOptInSource: acceptsWhatsApp ? 'AGENDA_PUBLICA' : null,
        }, { transaction });
      } else if (acceptsWhatsApp && !cliente.whatsappOptIn) {
        await cliente.update({ whatsappOptIn: true, whatsappOptInAt: new Date(), whatsappOptInSource: 'AGENDA_PUBLICA' }, { transaction });
      }

      const identity = [{ chasis: payload.vehiculo.chasis }];
      if (payload.vehiculo.placa) identity.push({ placa: payload.vehiculo.placa });
      let vehiculo = await Vehiculo.findOne({ where: { [Op.or]: identity }, transaction, lock: transaction.LOCK.UPDATE });
      if (vehiculo && Number(vehiculo.clienteId) !== Number(cliente.id)) throw new AppError(409, 'VEHICLE_OWNER_MISMATCH', 'El vehículo ya está registrado a nombre de otro cliente.');
      if (!vehiculo) vehiculo = await Vehiculo.create({ ...payload.vehiculo, clienteId: cliente.id }, { transaction });

      const cita = await Cita.create({ ...payload.cita, clienteId: cliente.id, vehiculoId: vehiculo.id, estado: 'PROGRAMADA' }, { transaction });
      return { cliente, vehiculo, cita };
    });
  }

  async appointmentToOrder(appointmentId, data = {}, user) {
    const { Cita, OrdenTrabajo, OrdenServicio, Servicio, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const cita = await Cita.findByPk(appointmentId, { transaction, lock: transaction.LOCK.UPDATE });
      if (!cita) throw new AppError(404, 'APPOINTMENT_NOT_FOUND', 'No se encontró la cita.');
      if (!user.roles.includes('ADMINISTRADOR') && Number(cita.sucursalId) !== Number(user.sucursalId)) throw new AppError(403, 'BRANCH_FORBIDDEN', 'La cita pertenece a otra sucursal.');
      const existing = await OrdenTrabajo.findOne({ where: { citaId: appointmentId }, transaction });
      if (existing) throw new AppError(409, 'APPOINTMENT_ALREADY_CONVERTED', 'La cita ya tiene una orden de trabajo.');
      const order = await OrdenTrabajo.create({ vehiculoId: cita.vehiculoId, sucursalId: cita.sucursalId, citaId: cita.id, tecnicoId: data.tecnicoId || null, descripcionProblema: cita.motivo, observaciones: data.observaciones, estado: 'ABIERTA' }, { transaction });
      if (cita.servicioId) {
        const service = await Servicio.findOne({ where: { id: cita.servicioId, activo: true }, transaction });
        if (service) await OrdenServicio.create({ ordenTrabajoId: order.id, servicioId: service.id, cantidad: 1, precioUnitario: service.precioBase }, { transaction });
      }
      await cita.update({ estado: 'COMPLETADA' }, { transaction });
      return order;
    });
  }

  async quoteToOrder(quoteId, data = {}, user) {
    const { Cotizacion, CotizacionDetalle, OrdenTrabajo, OrdenServicio, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const quote = await Cotizacion.findByPk(quoteId, { include: [{ model: CotizacionDetalle, as: 'detalles' }], transaction, lock: { level: transaction.LOCK.UPDATE, of: Cotizacion } });
      if (!quote) throw new AppError(404, 'QUOTE_NOT_FOUND', 'No se encontró la cotización.');
      if (quote.estado !== 'APROBADA') throw new AppError(409, 'QUOTE_NOT_APPROVED', 'Solo una cotización aprobada puede convertirse en orden.');
      if (!user.roles.includes('ADMINISTRADOR') && Number(quote.sucursalId) !== Number(user.sucursalId)) throw new AppError(403, 'BRANCH_FORBIDDEN', 'La cotización pertenece a otra sucursal.');
      const existing = await OrdenTrabajo.findOne({ where: { cotizacionId: quoteId }, transaction });
      if (existing) throw new AppError(409, 'QUOTE_ALREADY_CONVERTED', 'La cotización ya tiene una orden de trabajo.');
      const order = await OrdenTrabajo.create({ vehiculoId: quote.vehiculoId, sucursalId: quote.sucursalId, cotizacionId: quote.id, tecnicoId: data.tecnicoId || null, descripcionProblema: quote.observaciones, estado: 'ABIERTA' }, { transaction });
      const details = (quote.detalles || []).filter((item) => item.servicioId).map((item) => ({ ordenTrabajoId: order.id, servicioId: item.servicioId, cantidad: item.cantidad, precioUnitario: item.precioUnitario }));
      if (details.length) await OrdenServicio.bulkCreate(details, { transaction });
      return order;
    });
  }

  async upsertDiagnosis(orderId, data, user) {
    const { OrdenTrabajo, Diagnostico, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const order = await OrdenTrabajo.findByPk(orderId, { transaction, lock: transaction.LOCK.UPDATE });
      this.assertOrderAccess(order, user);
      const [diagnosis] = await Diagnostico.upsert({ ...data, ordenTrabajoId: orderId, creadoPor: user.id, fechaDiagnostico: new Date() }, { transaction, returning: true });
      if (order.estado === 'ABIERTA') await order.update({ estado: 'EN_DIAGNOSTICO' }, { transaction });
      return diagnosis;
    });
  }

  async addMaterial(orderId, data, user) {
    const { OrdenTrabajo, Material, OrdenMaterial, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const order = await OrdenTrabajo.findByPk(orderId, { transaction, lock: transaction.LOCK.UPDATE });
      this.assertOrderAccess(order, user);
      const material = await Material.findByPk(data.materialId, { transaction, lock: transaction.LOCK.UPDATE });
      if (!material || !material.activo) throw new AppError(404, 'MATERIAL_NOT_FOUND', 'No se encontró el material.');
      // El trigger de PostgreSQL vuelve a validar y descuenta el stock de forma atómica.
      if (Number(material.stockActual) < Number(data.cantidad)) throw new AppError(409, 'INSUFFICIENT_STOCK', `Disponible: ${Number(material.stockActual)} ${material.unidadMedida}.`);
      return OrdenMaterial.create({ ordenTrabajoId: orderId, materialId: material.id, cantidad: data.cantidad, precioUnitario: data.precioUnitario ?? material.precioVenta, registradoPor: user.id }, { transaction });
    });
  }

  async addService(orderId, data, user) {
    const { OrdenTrabajo, Servicio, OrdenServicio, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const order = await OrdenTrabajo.findByPk(orderId, { transaction }); this.assertOrderAccess(order, user);
      const service = await Servicio.findByPk(data.servicioId, { transaction });
      if (!service || !service.activo) throw new AppError(404, 'SERVICE_NOT_FOUND', 'No se encontró el servicio.');
      return OrdenServicio.create({ ordenTrabajoId: orderId, servicioId: service.id, cantidad: data.cantidad || 1, precioUnitario: data.precioUnitario ?? service.precioBase }, { transaction });
    });
  }

  async createInvoice(data, user) {
    const { OrdenTrabajo, OrdenServicio, OrdenMaterial, Servicio, Material, Factura, FacturaOrden, FacturaDetalle, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const order = await OrdenTrabajo.findByPk(data.ordenTrabajoId, { include: [{ model: OrdenServicio, as: 'servicios', include: [{ model: Servicio, as: 'servicio' }] }, { model: OrdenMaterial, as: 'materiales', include: [{ model: Material, as: 'material' }] }], transaction, lock: { level: transaction.LOCK.UPDATE, of: OrdenTrabajo } });
      this.assertOrderAccess(order, user);
      const already = await FacturaOrden.findOne({ where: { ordenTrabajoId: order.id }, transaction });
      if (already) throw new AppError(409, 'ORDER_ALREADY_INVOICED', 'La orden ya fue facturada.');
      const details = [];
      for (const item of order.servicios) details.push({ tipoItem: 'SERVICIO', descripcion: item.servicio.nombre, cantidad: Number(item.cantidad), precioUnitario: Number(item.precioUnitario), porcentajeImpuesto: Number(item.servicio.porcentajeImpuesto || 0) });
      for (const item of order.materiales) details.push({ tipoItem: item.material.categoria === 'REFRIGERANTE' ? 'REFRIGERANTE' : 'MATERIAL', descripcion: item.material.nombre, cantidad: Number(item.cantidad), precioUnitario: Number(item.precioUnitario), porcentajeImpuesto: 18 });
      if (!details.length) throw new AppError(409, 'EMPTY_INVOICE', 'Agrega servicios o materiales antes de facturar.');
      for (const item of details) { item.subtotal = round(item.cantidad * item.precioUnitario); item.montoImpuesto = round(item.subtotal * item.porcentajeImpuesto / 100); }
      const subtotal = round(details.reduce((sum, item) => sum + item.subtotal, 0));
      const impuesto = round(details.reduce((sum, item) => sum + item.montoImpuesto, 0));
      const descuento = round(Number(data.descuento || 0));
      if (descuento > subtotal + impuesto) throw new AppError(422, 'INVALID_DISCOUNT', 'El descuento no puede superar el importe.');
      const invoice = await Factura.create({ numeroFactura: `SGTRA-${Date.now()}`, subtotal, impuesto, descuento, total: round(subtotal + impuesto - descuento), estado: 'PENDIENTE', observaciones: data.observaciones, creadoPor: user.id }, { transaction });
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
      return Factura.findByPk(invoice.id, { include: [{ model: FacturaDetalle, as: 'detalles' }], transaction });
    });
  }

  async registerPayment(invoiceId, data, user) {
    const { Factura, Pago, PagoFactura, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const invoice = await Factura.findByPk(invoiceId, { include: [{ model: PagoFactura, as: 'aplicacionesPago' }], transaction, lock: { level: transaction.LOCK.UPDATE, of: Factura } });
      if (!invoice) throw new AppError(404, 'INVOICE_NOT_FOUND', 'No se encontró la factura.');
      if (invoice.estado !== 'PENDIENTE') throw new AppError(409, 'INVOICE_NOT_PAYABLE', 'La factura no admite pagos.');
      const applied = invoice.aplicacionesPago.reduce((sum, item) => sum + Number(item.montoAplicado), 0);
      const balance = round(Number(invoice.total) - applied);
      if (Number(data.monto) > balance) throw new AppError(409, 'OVERPAYMENT', `El saldo pendiente es RD$ ${balance.toFixed(2)}.`);
      const payment = await Pago.create({ montoTotal: data.monto, formaPago: data.formaPago, referencia: data.referencia, recibidoPor: user.id }, { transaction });
      await PagoFactura.create({ pagoId: payment.id, facturaId: invoice.id, montoAplicado: data.monto }, { transaction });
      if (round(balance - Number(data.monto)) === 0) await invoice.update({ estado: 'PAGADA' }, { transaction });
      return { payment, invoice, saldoPendiente: round(balance - Number(data.monto)) };
    });
  }

  async inventoryMovement(data, user) {
    const { Material, InventarioMovimiento, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const material = await Material.findByPk(data.materialId, { transaction, lock: transaction.LOCK.UPDATE });
      if (!material) throw new AppError(404, 'MATERIAL_NOT_FOUND', 'No se encontró el material.');
      const current = Number(material.stockActual);
      let next;
      let amount;
      if (data.tipoMovimiento === 'ENTRADA') {
        amount = Number(data.cantidad);
        next = current + amount;
      } else if (data.tipoMovimiento === 'SALIDA') {
        amount = Number(data.cantidad);
        next = current - amount;
      } else if (data.tipoMovimiento === 'AJUSTE') {
        next = Number(data.nuevoStock);
        amount = Math.abs(next - current);
      } else {
        throw new AppError(422, 'INVALID_MOVEMENT_TYPE', 'El movimiento debe ser ENTRADA, SALIDA o AJUSTE.');
      }
      if (amount === 0) throw new AppError(422, 'EMPTY_ADJUSTMENT', 'El ajuste no modifica el inventario.');
      if (next < 0) throw new AppError(409, 'INSUFFICIENT_STOCK', `Disponible: ${current} ${material.unidadMedida}.`);
      await material.update({ stockActual: next }, { transaction });
      const movement = await InventarioMovimiento.create({ materialId: material.id, tipoMovimiento: data.tipoMovimiento, cantidad: amount, costoUnitario: data.costoUnitario, motivo: data.motivo, usuarioId: user.id }, { transaction });
      return { movimiento: movement, stockAnterior: current, stockActual: next };
    });
  }

  async cancelInvoice(id, user) {
    const invoice = await this.getInvoice(id, user);
    if (invoice.estado !== 'PENDIENTE') throw new AppError(409, 'INVOICE_NOT_CANCELABLE', 'Solo puede anularse una factura pendiente.');
    if (invoice.aplicacionesPago.length) throw new AppError(409, 'INVOICE_HAS_PAYMENTS', 'No se puede anular una factura con pagos registrados.');
    return invoice.update({ estado: 'ANULADA' });
  }

  async closeOrder(orderId, data = {}, user) {
    const { OrdenTrabajo, Diagnostico, Historial, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const order = await OrdenTrabajo.findByPk(orderId, { include: [{ model: Diagnostico, as: 'diagnostico' }], transaction, lock: { level: transaction.LOCK.UPDATE, of: OrdenTrabajo } });
      this.assertOrderAccess(order, user);
      if (!order.diagnostico) throw new AppError(409, 'DIAGNOSIS_REQUIRED', 'Registra el diagnóstico antes de cerrar la orden.');
      // PostgreSQL es la autoridad final para confirmar diagnóstico y factura pagada.
      await order.update({ estado: 'CERRADA', fechaCierre: new Date() }, { transaction });
      await Historial.findOrCreate({ where: { ordenTrabajoId: order.id }, defaults: { vehiculoId: order.vehiculoId, descripcion: data.descripcion || order.diagnostico.fallaDetectada, recomendaciones: data.recomendaciones, registradoPor: user.id }, transaction });
      return order;
    });
  }

  async dashboard(user, query = {}) {
    const branchId = resolveBranchId(user, query.sucursalId);
    const where = branchId ? { sucursalId: branchId } : {};
    const { Cita, Cliente, OrdenTrabajo, Usuario, Vehiculo, Material } = this.db;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const [citasHoy, ordenes, facturacion, ordenesRecientes, citasProximas, alertasStock, facturasPendientes, ingresosPeriodo] = await Promise.all([
      Cita.count({ where: { ...where, fechaCita: { [Op.gte]: start, [Op.lt]: end } } }),
      OrdenTrabajo.findAll({ attributes: ['estado', [fn('COUNT', col('id_ot')), 'cantidad']], where, group: ['estado'], raw: true }),
      this.totalPaidByBranch(branchId),
      OrdenTrabajo.findAll({ where, include: [{ model: Vehiculo, as: 'vehiculo', include: [{ model: Cliente, as: 'cliente' }] }, { model: Usuario, as: 'tecnico', attributes: ['id', 'nombre'] }], limit: 5, order: [['fechaApertura', 'DESC']] }),
      Cita.findAll({ where: { ...where, fechaCita: { [Op.gte]: new Date() }, estado: { [Op.in]: ['PROGRAMADA', 'CONFIRMADA'] } }, include: [{ model: Cliente, as: 'cliente' }, { model: Vehiculo, as: 'vehiculo' }], limit: 5, order: [['fechaCita', 'ASC']] }),
      Material.findAll({ where: { activo: true, stockActual: { [Op.lte]: col('stock_minimo') } }, limit: 10, order: [['stockActual', 'ASC']] }),
      this.countPendingInvoices(branchId),
      this.incomeReport(user, { desde: new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10), hasta: new Date().toISOString().slice(0, 10), sucursalId: branchId }),
    ]);
    const activeOrders = ordenes
      .filter((row) => !['CERRADA', 'CANCELADA'].includes(row.estado))
      .reduce((sum, row) => sum + Number(row.cantidad), 0);
    return {
      stats: { citasHoy, ordenesActivas: activeOrders, facturasPendientes, ingresosPagados: Number(facturacion) },
      ordenesRecientes,
      citasProximas,
      alertasStock,
      ordenesPorEstado: ordenes,
      ingresosPeriodo,
    };
  }

  async totalPaidByBranch(branchId) {
    const replacements = { sucursalId: branchId };
    const branch = branchId ? 'AND ot.id_sucursal = :sucursalId' : '';
    const [result] = await this.db.sequelize.query(`SELECT COALESCE(SUM(f.total), 0)::numeric(14,2) total FROM facturas f JOIN factura_ordenes_trabajo fot ON fot.id_factura=f.id_factura JOIN ordenes_trabajo ot ON ot.id_ot=fot.id_ot WHERE f.estado='PAGADA' ${branch}`, { replacements, type: QueryTypes.SELECT });
    return Number(result.total);
  }

  async countPendingInvoices(branchId) {
    const replacements = { sucursalId: branchId };
    const branch = branchId ? 'AND ot.id_sucursal = :sucursalId' : '';
    const [result] = await this.db.sequelize.query(`SELECT COUNT(DISTINCT f.id_factura)::integer cantidad FROM facturas f JOIN factura_ordenes_trabajo fot ON fot.id_factura=f.id_factura JOIN ordenes_trabajo ot ON ot.id_ot=fot.id_ot WHERE f.estado='PENDIENTE' ${branch}`, { replacements, type: QueryTypes.SELECT });
    return Number(result.cantidad);
  }

  async listInvoices(user) {
    const where = user.roles.includes('ADMINISTRADOR') ? undefined : { sucursalId: user.sucursalId };
    return this.db.Factura.findAll({
      include: [
        { model: this.db.FacturaDetalle, as: 'detalles' },
        { model: this.db.PagoFactura, as: 'aplicacionesPago' },
        { model: this.db.OrdenTrabajo, as: 'ordenes', where, through: { attributes: [] }, include: [{ model: this.db.Vehiculo, as: 'vehiculo', include: [{ model: this.db.Cliente, as: 'cliente' }] }] },
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

  async incomeReport(user, query) {
    const branchId = resolveBranchId(user, query.sucursalId);
    const replacements = { desde: query.desde || '2000-01-01', hasta: query.hasta || '2100-01-01', sucursalId: branchId };
    const branch = branchId ? 'AND ot.id_sucursal = :sucursalId' : '';
    return this.db.sequelize.query(`SELECT DATE(f.fecha) fecha, SUM(f.total)::numeric(14,2) total FROM facturas f JOIN factura_ordenes_trabajo fot ON fot.id_factura=f.id_factura JOIN ordenes_trabajo ot ON ot.id_ot=fot.id_ot WHERE f.estado='PAGADA' AND f.fecha >= CAST(:desde AS DATE) AND f.fecha < (CAST(:hasta AS DATE) + INTERVAL '1 day') ${branch} GROUP BY DATE(f.fecha) ORDER BY fecha`, { replacements, type: QueryTypes.SELECT });
  }

  assertOrderAccess(order, user) {
    if (!order) throw new AppError(404, 'WORK_ORDER_NOT_FOUND', 'No se encontró la orden de trabajo.');
    if (!user.roles.includes('ADMINISTRADOR') && Number(order.sucursalId) !== Number(user.sucursalId)) throw new AppError(403, 'BRANCH_FORBIDDEN', 'La orden pertenece a otra sucursal.');
  }
}

function round(value) { return Math.round((Number(value) + Number.EPSILON) * 100) / 100; }

function resolveBranchId(user, requestedBranchId) {
  if (!user.roles.includes('ADMINISTRADOR')) return user.sucursalId;
  return requestedBranchId ? Number(requestedBranchId) : null;
}

module.exports = { WorkshopRepository, round };

