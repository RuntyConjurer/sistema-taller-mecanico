import { apiEndpoints, endpointWithId } from '@/constants/apiEndpoints'
import { apiRequest } from './api'
import { dataSource } from './dataSource'
import { mockStore } from './mockStore'

export function listarOrdenesTrabajo() {
  return Promise.resolve(dataSource === 'mock' ? mockStore.workOrders() : apiRequest(apiEndpoints.workOrders))
}

export function cerrarOrdenTrabajo(id) {
  if (dataSource === 'mock') return Promise.resolve(mockStore.closeWorkOrder(id))
  return apiRequest(endpointWithId(apiEndpoints.workOrders, id), { method: 'PATCH', body: JSON.stringify({ estado: 'CERRADA' }) })
}
