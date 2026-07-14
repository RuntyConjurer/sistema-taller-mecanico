import { apiEndpoints } from '@/constants/apiEndpoints'
import { demoRoles } from '@/constants/demoRoles'
import { usuarios } from '@/data/mocks/usuarios.mock'
import { apiRequest } from './api'
import { dataSource } from './dataSource'

export async function obtenerPerfilActual(role) {
  if (dataSource === 'mock') {
    const identidadDemostrativa = demoRoles[role]

    const usuario =
      usuarios.find(
        (item) => item.nombre === identidadDemostrativa?.name,
      ) ??
      usuarios.find(
        (item) =>
          item.activo &&
          Array.isArray(item.roles) &&
          item.roles.includes(role),
      )

    if (!usuario) {
      throw new Error(
        'No se encontró un usuario asociado con la sesión actual.',
      )
    }

    return { ...usuario }
  }

  return apiRequest(apiEndpoints.profile)
}