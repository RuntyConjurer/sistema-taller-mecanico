import { apiRequest } from './api'

const ORDENES_TRABAJO_ENDPOINT = ''

export function listarOrdenesTrabajo() {
  return apiRequest(ORDENES_TRABAJO_ENDPOINT)
}
