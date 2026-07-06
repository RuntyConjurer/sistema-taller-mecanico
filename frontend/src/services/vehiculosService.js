import { apiRequest } from './api'

const VEHICULOS_ENDPOINT = ''

export function listarVehiculos() {
  return apiRequest(VEHICULOS_ENDPOINT)
}
