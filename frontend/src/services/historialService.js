import { apiEndpoints, endpointWithId } from '@/constants/apiEndpoints'
import { historialTecnico } from '@/data/mocks/historial.mock'
import { apiRequest } from './api'
import { dataSource } from './dataSource'

// RF-11: consultar reparaciones y mantenimientos anteriores de un vehículo.
// El backend puede resolverlo directamente con la vista vw_historial_clinico_vehiculo.
export function listarHistorialPorVehiculo(idVehiculo) {
  if (dataSource === 'mock') {
    return Promise.resolve(
      idVehiculo
        ? historialTecnico.filter((item) => item.idVehiculo === Number(idVehiculo))
        : historialTecnico,
    )
  }
  return apiRequest(`${endpointWithId(apiEndpoints.vehicles, idVehiculo)}/historial`)
}
