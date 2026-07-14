import { apiEndpoints } from '@/constants/apiEndpoints'
import { usuarios } from '@/data/mocks/usuarios.mock'
import { apiRequest } from './api'
import { mapList, mapUser } from './apiMappers'
import { dataSource } from './dataSource'

export async function listarUsuarios() {
  return dataSource === 'mock'
    ? usuarios.map(mapUser)
    : mapList(await apiRequest(apiEndpoints.users), mapUser)
}

// Las sucursales viven en catalogoService: son el mismo recurso para el panel y para
// el sitio público, así que no se duplican aquí.
export { listarSucursales } from './catalogoService'
