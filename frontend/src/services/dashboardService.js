import { apiEndpoints } from '@/constants/apiEndpoints'
import {
  dashboardStats,
  recentOrdenes,
  stockAlerts,
  upcomingCitas,
} from '@/data/mocks/dashboard.mock'
import { apiRequest } from './api'
import { dataSource } from './dataSource'

// El backend armará este resumen con las vistas que ya existen en PostgreSQL:
// vw_ordenes_trabajo_resumen, vw_estado_inventario y vw_reporte_ingresos_pagos.
// Se pide todo en una sola llamada porque es una sola pantalla.
export function obtenerResumen(sucursalId) {
  if (dataSource === 'mock') {
    return Promise.resolve({
      stats: dashboardStats,
      ordenesRecientes: sucursalId
        ? recentOrdenes.filter((item) => !item.idSucursal || item.idSucursal === sucursalId)
        : recentOrdenes,
      citasProximas: upcomingCitas,
      alertasStock: stockAlerts,
    })
  }
  const query = sucursalId ? `?sucursalId=${sucursalId}` : ''
  return apiRequest(`${apiEndpoints.dashboard}${query}`)
}
