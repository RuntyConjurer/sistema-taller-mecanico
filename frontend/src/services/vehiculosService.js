import { apiEndpoints } from '@/constants/apiEndpoints'
import { vehiculos as vehiculosIniciales } from '@/data/mocks/clientes.mock'
import { apiRequest } from './api'
import { mapList, mapVehicle } from './apiMappers'
import { dataSource } from './dataSource'

let vehiculosMock = [...vehiculosIniciales]

export async function listarVehiculos() {
  if (dataSource === 'mock') {
    return [...vehiculosMock]
  }

  return mapList(await apiRequest(apiEndpoints.vehicles), mapVehicle)
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

  const payload = {
    ...datosVehiculo,
    clienteId: Number(datosVehiculo.clienteId ?? datosVehiculo.idCliente),
  }
  delete payload.idCliente
  return mapVehicle(await apiRequest(apiEndpoints.vehicles, {
    method: 'POST',
    body: JSON.stringify(payload),
  }))
}
