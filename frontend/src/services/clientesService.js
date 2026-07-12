import { apiEndpoints } from '@/constants/apiEndpoints'
import { clientes } from '@/data/mocks/clientes.mock'
import { apiRequest } from './api'
import { dataSource } from './dataSource'

export function listarClientes() {
  return Promise.resolve(dataSource === 'mock' ? clientes : apiRequest(apiEndpoints.clients))
}
