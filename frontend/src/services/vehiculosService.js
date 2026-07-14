import { apiEndpoints } from '@/constants/apiEndpoints'
import { vehiculos as vehiculosIniciales } from '@/data/mocks/clientes.mock'
import { apiRequest } from './api'
import { dataSource } from './dataSource'

let vehiculosMock = [...vehiculosIniciales]

export async function listarVehiculos() {
  if (dataSource === 'mock') {
    return [...vehiculosMock]
  }

  return apiRequest(apiEndpoints.vehicles)
}

export async function crearVehiculo(datosVehiculo) {
  if (dataSource === 'mock') {
    const idMayor = vehiculosMock.reduce(
      (mayor, vehiculo) => Math.max(mayor, vehiculo.id),
      0,
    )

    const nuevoVehiculo = {
      ...datosVehiculo,
      id: idMayor + 1,
    }

    vehiculosMock = [...vehiculosMock, nuevoVehiculo]

    return nuevoVehiculo
  }

  return apiRequest(apiEndpoints.vehicles, {
    method: 'POST',
    body: JSON.stringify(datosVehiculo),
  })
}