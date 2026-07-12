import { apiEndpoints } from '@/constants/apiEndpoints'
import { vehiculos } from '@/data/mocks/clientes.mock'
import { apiRequest } from './api'
import { dataSource } from './dataSource'

export async function listarVehiculos() {
  return dataSource === 'mock' ? vehiculos : apiRequest(apiEndpoints.vehicles)
}
