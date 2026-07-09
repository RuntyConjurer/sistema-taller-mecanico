import { apiRequest } from './api'

const INVENTARIO_ENDPOINT = ''

export function listarInventario() {
  return apiRequest(INVENTARIO_ENDPOINT)
}
