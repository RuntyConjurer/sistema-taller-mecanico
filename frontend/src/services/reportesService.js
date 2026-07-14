import { apiEndpoints } from '@/constants/apiEndpoints'
import { apiRequest, withQuery } from './api'
import { dataSource } from './dataSource'

const mockReport = {
  ordenes: [
    { label: 'Abiertas', value: 18 },
    { label: 'Diagnóstico', value: 11 },
    { label: 'Reparación', value: 9 },
    { label: 'Facturadas', value: 14 },
  ],
  ingresos: [22000, 34000, 27500, 41000, 49500, 43000, 58000],
}

export async function obtenerReportes(filtros = {}) {
  if (dataSource === 'mock') return mockReport
  const [ordenes, ingresos] = await Promise.all([
    apiRequest(withQuery(`${apiEndpoints.reports}/ordenes`, filtros)),
    apiRequest(withQuery(`${apiEndpoints.reports}/ingresos`, filtros)),
  ])
  const orderRows = ordenes.items || ordenes.rows || ordenes
  const groupedOrders = Array.isArray(orderRows)
    ? Object.entries(
        orderRows.reduce((totals, order) => {
          const state = order.estado || 'SIN_ESTADO'
          totals[state] = (totals[state] || 0) + 1
          return totals
        }, {}),
      ).map(([estado, cantidad]) => ({ estado, cantidad }))
    : []
  return {
    ordenes: groupedOrders,
    ingresos: ingresos.items || ingresos.rows || ingresos,
  }
}
