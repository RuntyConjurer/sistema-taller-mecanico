import { apiEndpoints, endpointWithId } from '@/constants/apiEndpoints'
import { apiRequest } from './api'
import { dataSource } from './dataSource'
import { mockStore } from './mockStore'

export function listarRefrigerantes() {
  return Promise.resolve(
    dataSource === 'mock'
      ? mockStore.refrigerants()
      : apiRequest(`${apiEndpoints.materials}?categoria=REFRIGERANTE`),
  )
}

export function listarOrdenesParaConsumo() {
  return Promise.resolve(
    dataSource === 'mock' ? mockStore.workOrders() : apiRequest(apiEndpoints.workOrders),
  )
}

export function registrarConsumoRefrigerante({ ordenId, refrigeranteId, cantidad }) {
  if (dataSource === 'mock') {
    const result = mockStore.consumeRefrigerant(Number(refrigeranteId), Number(cantidad))
    return Promise.resolve({ ...result, ordenId })
  }
  return apiRequest(`${endpointWithId(apiEndpoints.workOrders, ordenId)}/materiales`, {
    method: 'POST',
    body: JSON.stringify({ materialId: refrigeranteId, cantidad }),
  })
}
