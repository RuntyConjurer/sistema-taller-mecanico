import { beforeEach, describe, expect, it } from 'vitest'
import {
  endSession,
  getAccessToken,
  getBranchId,
  getCurrentUser,
  getRole,
  isSignedIn,
  startSession,
} from './sessionStore'

describe('sesión del frontend', () => {
  beforeEach(() => window.sessionStorage.clear())

  it('normaliza la respuesta real del login y conserva la sucursal', () => {
    startSession({
      token: 'jwt-demo',
      usuario: {
        id: '8',
        nombre: 'Angelo',
        sucursalId: '2',
        roles: ['TECNICO'],
      },
    })

    expect(getAccessToken()).toBe('jwt-demo')
    expect(getCurrentUser()).toMatchObject({ id: 8, nombre: 'Angelo', idSucursal: 2 })
    expect(getRole()).toBe('TECNICO')
    expect(getBranchId()).toBe(2)
    expect(isSignedIn()).toBe(true)
  })

  it('limpia token, rol y sucursal al cerrar sesión', () => {
    startSession({ token: 'jwt-demo', user: { id: 1, roles: ['ADMINISTRADOR'] } })
    endSession()
    expect(getAccessToken()).toBeNull()
    expect(getBranchId()).toBeNull()
    expect(isSignedIn()).toBe(false)
  })

  it('descarta JSON corrupto sin bloquear la aplicación', () => {
    window.sessionStorage.setItem('sgtra-session', '{invalido')
    expect(getCurrentUser()).toBeNull()
    expect(window.sessionStorage.getItem('sgtra-session')).toBeNull()
  })
})
