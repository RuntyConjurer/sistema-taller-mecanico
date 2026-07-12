import { apiEndpoints } from '@/constants/apiEndpoints'
import { branches, services } from '@/data/mocks/landing.mock'
import { apiRequest } from './api'
import { dataSource } from './dataSource'

// Catálogo público: los servicios que ofrece el taller y las sucursales donde se
// prestan. Hoy salen de los mocks; mañana de las tablas `servicios` y `sucursales`.
export function listarServicios() {
  return Promise.resolve(dataSource === 'mock' ? services : apiRequest(apiEndpoints.services))
}

export function obtenerServicio(id) {
  if (dataSource === 'mock') {
    return Promise.resolve(services.find((item) => item.id === id) || null)
  }
  return apiRequest(`${apiEndpoints.services}/${id}`)
}

export function listarSucursalesPublicas() {
  return Promise.resolve(dataSource === 'mock' ? branches : apiRequest(apiEndpoints.branches))
}

export function obtenerSucursal(id) {
  if (dataSource === 'mock') {
    return Promise.resolve(branches.find((item) => item.id === id) || null)
  }
  return apiRequest(`${apiEndpoints.branches}/${id}`)
}
