'use strict';

const { Op, fn, col, QueryTypes } = require('sequelize');
const models = require('../infrastructure/models');
const { resolveBranchId } = require('./repositoryAccess');

class ReportRepository {
  constructor(db = models, orderRepository, historyRepository) {
    this.db = db;
    this.orderRepository = orderRepository;
    this.historyRepository = historyRepository;
  }

  listWorkOrders(user, limit) {
    return this.orderRepository.list({ user, limit: limit || 250 });
  }

  listVehicleHistory(vehicleId) {
    return this.historyRepository.list({
      where: { vehiculoId: vehicleId },
      order: [['fechaRegistro', 'DESC']],
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

    const [
      citasHoy, ordenes, facturacion, ordenesRecientes, citasProximas,
      alertasStock, facturasPendientes, ingresosPeriodo,
    ] = await Promise.all([
      Cita.count({ where: { ...where, fechaCita: { [Op.gte]: start, [Op.lt]: end } } }),
      OrdenTrabajo.findAll({
        attributes: ['estado', [fn('COUNT', col('id_ot')), 'cantidad']],
        where,
        group: ['estado'],
        raw: true,
      }),
      this.totalPaidByBranch(branchId),
      OrdenTrabajo.findAll({
        where,
        include: [
          { model: Vehiculo, as: 'vehiculo', include: [{ model: Cliente, as: 'cliente' }] },
          { model: Usuario, as: 'tecnico', attributes: ['id', 'nombre'] },
        ],
        limit: 5,
        order: [['fechaApertura', 'DESC']],
      }),
      Cita.findAll({
        where: {
          ...where,
          fechaCita: { [Op.gte]: new Date() },
          estado: { [Op.in]: ['PROGRAMADA', 'CONFIRMADA'] },
        },
        include: [
          { model: Cliente, as: 'cliente' },
          { model: Vehiculo, as: 'vehiculo' },
        ],
        limit: 5,
        order: [['fechaCita', 'ASC']],
      }),
      Material.findAll({
        where: { activo: true, stockActual: { [Op.lte]: col('stock_minimo') } },
        limit: 10,
        order: [['stockActual', 'ASC']],
      }),
      this.countPendingInvoices(branchId),
      this.incomeReport(user, {
        desde: new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10),
        hasta: new Date().toISOString().slice(0, 10),
        sucursalId: branchId,
      }),
    ]);
    const activeOrders = ordenes
      .filter((row) => !['CERRADA', 'CANCELADA'].includes(row.estado))
      .reduce((sum, row) => sum + Number(row.cantidad), 0);

    return {
      stats: {
        citasHoy,
        ordenesActivas: activeOrders,
        facturasPendientes,
        ingresosPagados: Number(facturacion),
      },
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
    const [result] = await this.db.sequelize.query(
      `SELECT COALESCE(SUM(f.total), 0)::numeric(14,2) total
       FROM facturas f
       JOIN factura_ordenes_trabajo fot ON fot.id_factura=f.id_factura
       JOIN ordenes_trabajo ot ON ot.id_ot=fot.id_ot
       WHERE f.estado='PAGADA' ${branch}`,
      { replacements, type: QueryTypes.SELECT },
    );
    return Number(result.total);
  }

  async countPendingInvoices(branchId) {
    const replacements = { sucursalId: branchId };
    const branch = branchId ? 'AND ot.id_sucursal = :sucursalId' : '';
    const [result] = await this.db.sequelize.query(
      `SELECT COUNT(DISTINCT f.id_factura)::integer cantidad
       FROM facturas f
       JOIN factura_ordenes_trabajo fot ON fot.id_factura=f.id_factura
       JOIN ordenes_trabajo ot ON ot.id_ot=fot.id_ot
       WHERE f.estado='PENDIENTE' ${branch}`,
      { replacements, type: QueryTypes.SELECT },
    );
    return Number(result.cantidad);
  }

  incomeReport(user, query) {
    const branchId = resolveBranchId(user, query.sucursalId);
    const replacements = {
      desde: query.desde || '2000-01-01',
      hasta: query.hasta || '2100-01-01',
      sucursalId: branchId,
    };
    const branch = branchId ? 'AND ot.id_sucursal = :sucursalId' : '';
    return this.db.sequelize.query(
      `SELECT DATE(f.fecha) fecha, SUM(f.total)::numeric(14,2) total
       FROM facturas f
       JOIN factura_ordenes_trabajo fot ON fot.id_factura=f.id_factura
       JOIN ordenes_trabajo ot ON ot.id_ot=fot.id_ot
       WHERE f.estado='PAGADA'
         AND f.fecha >= CAST(:desde AS DATE)
         AND f.fecha < (CAST(:hasta AS DATE) + INTERVAL '1 day')
         ${branch}
       GROUP BY DATE(f.fecha)
       ORDER BY fecha`,
      { replacements, type: QueryTypes.SELECT },
    );
  }
}

module.exports = { ReportRepository };
