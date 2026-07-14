import { apiEndpoints } from '@/constants/apiEndpoints'
import { servicios } from '@/data/mocks/servicios.mock'
import { sucursales } from '@/data/mocks/sucursales.mock'
import { apiRequest } from './api'
import { mapBranch, mapList, mapService } from './apiMappers'
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

function normalizeName(value = '') {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

function enrichService(item) {
  const apiService = mapService(item)
  const editorial = servicios.find(
    (service) => normalizeName(service.nombre) === normalizeName(apiService.nombre),
  )
  return {
    sintomas: [],
    proceso: ['Inspección del sistema', 'Medición técnica', 'Explicación del resultado'],
    faq: 'El alcance final se confirma después de revisar el vehículo.',
    duracion: 'Tiempo según diagnóstico',
    ...editorial,
    ...apiService,
    slug: editorial?.slug || apiService.slug,
  }
}

function enrichBranch(item) {
  const apiBranch = mapBranch(item)
  const editorial = sucursales.find(
    (branch) => normalizeName(branch.nombre) === normalizeName(apiBranch.nombre),
  )
  return {
    ciudad: 'Santo Domingo',
    horario: 'Consulta el horario al contactar la sucursal.',
    tecnicos: [],
    ...editorial,
    ...apiBranch,
    slug: editorial?.slug || apiBranch.slug,
  }
}

export async function listarServicios() {
  return dataSource === 'mock'
    ? servicios.map(enrichService)
    : mapList(await apiRequest(apiEndpoints.services), enrichService)
}

export async function obtenerServicio(clave) {
  if (dataSource === 'mock') return buscarPor(servicios, clave)
  const list = await listarServicios()
  return buscarPor(list, clave)
}

export async function listarSucursales() {
  return dataSource === 'mock'
    ? sucursales.map(enrichBranch)
    : mapList(await apiRequest(apiEndpoints.branches), enrichBranch)
}

export async function obtenerSucursal(clave) {
  if (dataSource === 'mock') return buscarPor(sucursales, clave)
  const list = await listarSucursales()
  return buscarPor(list, clave)
}
