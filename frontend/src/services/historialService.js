import { apiEndpoints, endpointWithId } from '@/constants/apiEndpoints'
import { historialTecnico } from '@/data/mocks/historial.mock'
import { apiRequest } from './api'
import { dataSource } from './dataSource'

// RF-11: consultar reparaciones y mantenimientos anteriores de un vehículo.
// El backend puede resolverlo directamente con la vista vw_historial_clinico_vehiculo.
export async function listarHistorialPorVehiculo(idVehiculo) {
  if (dataSource === 'mock') {
    if (!idVehiculo) return historialTecnico
    return historialTecnico.filter((item) => item.idVehiculo === Number(idVehiculo))
  }
  return apiRequest(`${endpointWithId(apiEndpoints.vehicles, idVehiculo)}/historial`)
}
