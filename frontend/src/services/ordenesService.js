import { apiEndpoints, endpointWithId } from '@/constants/apiEndpoints'
import { ordenTimeline } from '@/data/mocks/ordenes.mock'
import { apiRequest } from './api'
import { mapList, mapWorkOrder } from './apiMappers'
import { dataSource } from './dataSource'
import { mockStore } from './mockStore'

// El backend filtrará por sucursal en la consulta SQL. Con mocks se filtra aquí para
// que la demostración se comporte igual. Sin sucursal, devuelve todas.
export async function listarOrdenesTrabajo(sucursalId) {
  if (dataSource === 'mock') {
    const ordenes = mockStore.workOrders()
    return sucursalId ? ordenes.filter((item) => item.idSucursal === sucursalId) : ordenes
  }
  const query = sucursalId ? `?sucursalId=${sucursalId}` : ''
  return mapList(await apiRequest(`${apiEndpoints.workOrders}${query}`), mapWorkOrder)
}

// La línea de tiempo de la OT saldrá de los cambios de estado que registre el backend.
// Con mocks se devuelve siempre la misma secuencia de ejemplo.
export async function obtenerHistorialOrden(id) {
  if (dataSource === 'mock') return ordenTimeline
  if (!id) return []
  return apiRequest(`${endpointWithId(apiEndpoints.workOrders, id)}/historial`)
}

export async function cerrarOrdenTrabajo(id) {
  if (dataSource === 'mock') return mockStore.closeWorkOrder(id)
  return mapWorkOrder(
    await apiRequest(`${endpointWithId(apiEndpoints.workOrders, id)}/cerrar`, {
      method: 'POST',
      body: JSON.stringify({}),
    }),
  )
}
