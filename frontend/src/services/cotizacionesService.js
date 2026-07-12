import { apiEndpoints } from '@/constants/apiEndpoints'
import { cotizaciones } from '@/data/mocks/cotizaciones.mock'
import { apiRequest } from './api'
import { dataSource } from './dataSource'

// El endpoint de la API todavía no existe: depende de las tablas cotizaciones y
// cotizacion_detalles, solicitadas al equipo de base de datos. El servicio ya está
// escrito para que, cuando existan, solo haya que cambiar VITE_DATA_SOURCE.
export async function listarCotizaciones() {
  return dataSource === 'mock' ? cotizaciones : apiRequest(apiEndpoints.quotes)
}
