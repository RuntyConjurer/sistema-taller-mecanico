import { apiEndpoints } from '@/constants/apiEndpoints'
import { clientes } from '@/data/mocks/clientes.mock'
import { apiRequest } from './api'
import { dataSource } from './dataSource'

export async function listarClientes() {
  return dataSource === 'mock' ? clientes : apiRequest(apiEndpoints.clients)
}
