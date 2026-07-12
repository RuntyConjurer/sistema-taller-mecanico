import { apiEndpoints } from '@/constants/apiEndpoints'
import { usuarios } from '@/data/mocks/usuarios.mock'
import { apiRequest } from './api'
import { dataSource } from './dataSource'

export function listarUsuarios() {
  return Promise.resolve(dataSource === 'mock' ? usuarios : apiRequest(apiEndpoints.users))
}

// Las sucursales viven en catalogoService: son el mismo recurso para el panel y para
// el sitio público, así que no se duplican aquí.
export { listarSucursales } from './catalogoService'
