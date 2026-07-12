import { apiEndpoints, endpointWithId } from '@/constants/apiEndpoints'
import { apiRequest } from './api'
import { dataSource } from './dataSource'
import { mockStore } from './mockStore'

// El backend filtrará por sucursal en la consulta SQL. Con mocks se filtra aquí para
// que la demostración se comporte igual. Sin sucursal, devuelve todas.
export function listarOrdenesTrabajo(sucursalId) {
  if (dataSource === 'mock') {
    const ordenes = mockStore.workOrders()
    return Promise.resolve(
      sucursalId ? ordenes.filter((item) => item.idSucursal === sucursalId) : ordenes,
    )
  }
  const query = sucursalId ? `?sucursalId=${sucursalId}` : ''
  return apiRequest(`${apiEndpoints.workOrders}${query}`)
}

export function cerrarOrdenTrabajo(id) {
  if (dataSource === 'mock') return Promise.resolve(mockStore.closeWorkOrder(id))
  return apiRequest(endpointWithId(apiEndpoints.workOrders, id), {
    method: 'PATCH',
    body: JSON.stringify({ estado: 'CERRADA' }),
  })
}
