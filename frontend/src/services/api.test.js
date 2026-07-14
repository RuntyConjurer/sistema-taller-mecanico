import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from './api'
import { getAccessToken, startSession } from './sessionStore'

describe('cliente HTTP', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => vi.unstubAllGlobals())

  it('usa mismo origen, agrega Bearer y desempaqueta data', async () => {
    startSession({ token: 'jwt-demo', usuario: { id: 1, roles: ['ADMINISTRADOR'] } })
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: [{ id: 1 }] }),
    })

    await expect(apiRequest('/api/v1/clientes')).resolves.toEqual([{ id: 1 }])
    expect(fetch).toHaveBeenCalledWith(
      '/api/v1/clientes',
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer jwt-demo' }) }),
    )
  })

  it('limpia la sesión y anuncia expiración ante 401', async () => {
    startSession({ token: 'jwt-vencido', usuario: { id: 1, roles: ['TECNICO'] } })
    const expired = vi.fn()
    window.addEventListener('sgtra:session-expired', expired, { once: true })
    fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: { code: 'TOKEN_EXPIRED', message: 'Sesión vencida.' } }),
    })

    await expect(apiRequest('/api/v1/ordenes-trabajo')).rejects.toMatchObject({
      message: 'Sesión vencida.',
      code: 'TOKEN_EXPIRED',
    })
    expect(getAccessToken()).toBeNull()
    expect(expired).toHaveBeenCalledOnce()
  })
})
