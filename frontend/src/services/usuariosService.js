import { apiEndpoints } from '@/constants/apiEndpoints'
import { sucursales, usuarios } from '@/data/mocks/usuarios.mock'
import { apiRequest } from './api'
import { dataSource } from './dataSource'

export function listarUsuarios() {
  return Promise.resolve(dataSource === 'mock' ? usuarios : apiRequest(apiEndpoints.users))
}

export function listarSucursales() {
  return Promise.resolve(dataSource === 'mock' ? sucursales : apiRequest(apiEndpoints.branches))
}
