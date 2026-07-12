import { apiEndpoints, endpointWithId } from '@/constants/apiEndpoints'
import { movimientos } from '@/data/mocks/inventario.mock'
import { apiRequest } from './api'
import { dataSource } from './dataSource'
import { mockStore } from './mockStore'

export async function listarMateriales() {
  return dataSource === 'mock' ? mockStore.materials() : apiRequest(apiEndpoints.materials)
}

export async function listarMovimientos() {
  return dataSource === 'mock' ? movimientos : apiRequest(apiEndpoints.inventoryMovements)
}

// Los refrigerantes son los materiales de categoría REFRIGERANTE, no una tabla aparte.
export async function listarRefrigerantes() {
  if (dataSource === 'mock') return mockStore.refrigerants()
  return apiRequest(`${apiEndpoints.materials}?categoria=REFRIGERANTE`)
}

export async function listarOrdenesParaConsumo() {
  return dataSource === 'mock' ? mockStore.workOrders() : apiRequest(apiEndpoints.workOrders)
}

// Insertar el consumo es lo único que hace el backend: el trigger de PostgreSQL valida
// el stock, lo descuenta y registra el movimiento de inventario.
export async function registrarConsumoRefrigerante({ ordenId, refrigeranteId, cantidad }) {
  if (dataSource === 'mock') {
    const resultado = mockStore.consumeRefrigerant(Number(refrigeranteId), Number(cantidad))
    return { ...resultado, ordenId }
  }
  return apiRequest(`${endpointWithId(apiEndpoints.workOrders, ordenId)}/materiales`, {
    method: 'POST',
    body: JSON.stringify({ materialId: refrigeranteId, cantidad }),
  })
}
