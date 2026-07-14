import { apiEndpoints, endpointWithId } from '@/constants/apiEndpoints'
import { cotizaciones } from '@/data/mocks/cotizaciones.mock'
import { apiRequest } from './api'
import { mapList, mapQuote, mapWorkOrder } from './apiMappers'
import { dataSource } from './dataSource'

export async function listarCotizaciones() {
  return dataSource === 'mock'
    ? cotizaciones.map(mapQuote)
    : mapList(await apiRequest(apiEndpoints.quotes), mapQuote)
}

export async function crearCotizacion(datos) {
  if (dataSource === 'mock') return mapQuote({ ...datos, id: Date.now(), numero: 'COT-DEMO' })
  return mapQuote(await apiRequest(apiEndpoints.quotes, {
    method: 'POST',
    body: JSON.stringify(datos),
  }))
}

export async function actualizarEstadoCotizacion(id, estado) {
  if (dataSource === 'mock') {
    return mapQuote({ ...cotizaciones.find((item) => item.id === Number(id)), estado })
  }
  return mapQuote(await apiRequest(`${endpointWithId(apiEndpoints.quotes, id)}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estado }),
  }))
}

export async function convertirCotizacionEnOrden(id) {
  if (dataSource === 'mock') return mapWorkOrder({ id: Date.now(), numero: `OT-DEMO-${id}`, estado: 'ABIERTA' })
  const result = await apiRequest(`${endpointWithId(apiEndpoints.quotes, id)}/orden`, { method: 'POST' })
  return mapWorkOrder(result.workOrder || result.orden || result)
}
