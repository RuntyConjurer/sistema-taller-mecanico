import { apiEndpoints } from '@/constants/apiEndpoints'
import { servicios } from '@/data/mocks/servicios.mock'
import { sucursales } from '@/data/mocks/sucursales.mock'
import { apiRequest } from './api'
import { dataSource } from './dataSource'

// Catálogo compartido: los servicios que ofrece el taller y las sucursales donde se
// prestan. Lo usan tanto el sitio público como el panel interno, y hay una sola forma
// de cada cosa para que el backend exponga un único endpoint por recurso.
//
// El sitio público identifica por `slug` (/sucursal/norte) y el panel por `id`
// numérico. Por eso las búsquedas aceptan cualquiera de los dos.
function buscarPor(coleccion, clave) {
  return coleccion.find((item) => item.slug === String(clave) || item.id === Number(clave)) || null
}

export function listarServicios() {
  return Promise.resolve(dataSource === 'mock' ? servicios : apiRequest(apiEndpoints.services))
}

export function obtenerServicio(clave) {
  if (dataSource === 'mock') return Promise.resolve(buscarPor(servicios, clave))
  return apiRequest(`${apiEndpoints.services}/${clave}`)
}

export function listarSucursales() {
  return Promise.resolve(dataSource === 'mock' ? sucursales : apiRequest(apiEndpoints.branches))
}

export function obtenerSucursal(clave) {
  if (dataSource === 'mock') return Promise.resolve(buscarPor(sucursales, clave))
  return apiRequest(`${apiEndpoints.branches}/${clave}`)
}
