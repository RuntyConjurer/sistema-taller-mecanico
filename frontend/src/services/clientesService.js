import { apiRequest } from './api'

const CLIENTES_ENDPOINT = ''

export function listarClientes() {
  return apiRequest(CLIENTES_ENDPOINT)
}
