import { apiEndpoints } from '@/constants/apiEndpoints'
import { dashboardStats, recentOrdenes, stockAlerts, upcomingCitas } from '@/data/mocks/dashboard.mock'
import { apiRequest, withQuery } from './api'
import { mapAppointment, mapList, mapMaterial, mapWorkOrder } from './apiMappers'
import { dataSource } from './dataSource'

export async function obtenerResumen(sucursalId) {
  if (dataSource === 'mock') {
    return {
      stats: dashboardStats,
      ordenesRecientes: sucursalId
        ? recentOrdenes.filter((item) => !item.idSucursal || item.idSucursal === sucursalId)
        : recentOrdenes,
      citasProximas: upcomingCitas,
      alertasStock: stockAlerts,
      ordenesPorEstado: [
        { label: 'Abiertas', value: 6 },
        { label: 'Diagnóstico', value: 5 },
        { label: 'Reparación', value: 3 },
        { label: 'Facturadas', value: 4 },
      ],
      ingresosPeriodo: [21000, 28000, 18500, 42500, 31500, 48500, 39000],
    }
  }

  const result = await apiRequest(withQuery(apiEndpoints.dashboard, { sucursalId }))
  const rawStats = result.stats || {}
  const stats = Array.isArray(rawStats)
    ? rawStats
    : [
        { key: 'citas', title: 'Citas hoy', value: String(rawStats.citasHoy ?? 0), hint: 'Agenda del día', tone: 'default' },
        { key: 'ordenes', title: 'Órdenes activas', value: String(rawStats.ordenesActivas ?? 0), hint: 'Pendientes de cierre', tone: 'warning' },
        { key: 'pago', title: 'Pendientes de pago', value: String(rawStats.facturasPendientes ?? 0), hint: 'Facturas abiertas', tone: 'danger' },
        { key: 'ingresos', title: 'Ingresos cobrados', value: `RD$ ${Number(rawStats.ingresosPagados ?? 0).toLocaleString('es-DO')}`, hint: 'Período acumulado', tone: 'success' },
      ]
  const statusLabels = {
    ABIERTA: 'Abiertas',
    EN_DIAGNOSTICO: 'Diagnóstico',
    EN_REPARACION: 'Reparación',
    FACTURADA: 'Facturadas',
    CERRADA: 'Cerradas',
    CANCELADA: 'Canceladas',
  }
  return {
    ...result,
    stats,
    ordenesRecientes: mapList(result.ordenesRecientes, mapWorkOrder),
    citasProximas: mapList(result.citasProximas, mapAppointment).map((cita) => ({
      ...cita,
      hora: cita.hora || String(cita.fecha || '').slice(11, 16),
    })),
    alertasStock: mapList(result.alertasStock, mapMaterial),
    ordenesPorEstado: (result.ordenesPorEstado || []).map((item) => ({
      label: item.label || statusLabels[item.estado] || item.estado,
      value: Number(item.value ?? item.cantidad ?? 0),
    })),
    ingresosPeriodo: (result.ingresosPeriodo || []).map((item) =>
      Number(typeof item === 'number' ? item : item.total ?? item.value ?? 0),
    ),
  }
}
