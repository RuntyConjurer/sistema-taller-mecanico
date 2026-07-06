import { apiRequest } from './api'

const FACTURACION_ENDPOINT = ''

export function listarFacturas() {
  return apiRequest(FACTURACION_ENDPOINT)
}
