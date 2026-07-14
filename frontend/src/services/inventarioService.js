import { apiEndpoints, endpointWithId } from '@/constants/apiEndpoints'
import { movimientos } from '@/data/mocks/inventario.mock'
import { apiRequest } from './api'
import { mapInventoryMovement, mapList, mapMaterial, mapWorkOrder } from './apiMappers'
import { dataSource } from './dataSource'
import { mockStore } from './mockStore'

export async function listarMateriales() {
  return dataSource === 'mock'
    ? mockStore.materials().map(mapMaterial)
    : mapList(await apiRequest(apiEndpoints.materials), mapMaterial)
}

export async function listarMovimientos() {
  return dataSource === 'mock'
    ? movimientos.map(mapInventoryMovement)
    : mapList(await apiRequest(apiEndpoints.inventoryMovements), mapInventoryMovement)
}

// Los refrigerantes son los materiales de categoría REFRIGERANTE, no una tabla aparte.
export async function listarRefrigerantes() {
  if (dataSource === 'mock') return mockStore.refrigerants()
  return mapList(await apiRequest(apiEndpoints.refrigerants), mapMaterial)
}

export async function listarOrdenesParaConsumo() {
  return dataSource === 'mock'
    ? mockStore.workOrders().map(mapWorkOrder)
    : mapList(await apiRequest(apiEndpoints.workOrders), mapWorkOrder)
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
