import { apiEndpoints } from '@/constants/apiEndpoints'
import { vehiculos } from '@/data/mocks/clientes.mock'
import { apiRequest } from './api'
import { dataSource } from './dataSource'

export function listarVehiculos() {
  return Promise.resolve(dataSource === 'mock' ? vehiculos : apiRequest(apiEndpoints.vehicles))
}
