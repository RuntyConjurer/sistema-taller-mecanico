import { apiEndpoints, endpointWithId } from '@/constants/apiEndpoints'
import { clientes } from '@/data/mocks/clientes.mock'
import { apiRequest, withQuery } from './api'
import { mapClient, mapList } from './apiMappers'
import { dataSource } from './dataSource'

export async function listarClientes(filtros = {}) {
  if (dataSource === 'mock') return clientes.map(mapClient)
  return mapList(await apiRequest(withQuery(apiEndpoints.clients, filtros)), mapClient)
}

export async function obtenerCliente(id) {
  if (dataSource === 'mock') return mapClient(clientes.find((item) => item.id === Number(id)))
  return mapClient(await apiRequest(endpointWithId(apiEndpoints.clients, id)))
}

export async function crearCliente(datos) {
  return mapClient(await apiRequest(apiEndpoints.clients, { method: 'POST', body: JSON.stringify(datos) }))
}

export async function actualizarCliente(id, datos) {
  return mapClient(await apiRequest(endpointWithId(apiEndpoints.clients, id), { method: 'PATCH', body: JSON.stringify(datos) }))
}
