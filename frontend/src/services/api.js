import { endSession, getAccessToken } from './sessionStore'

// Una URL vacía usa el mismo origen; Vite o Nginx enrutan /api hacia Express.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export async function apiRequest(path, options = {}) {
  if (!path) throw new Error('Endpoint de API no configurado.')

  const token = getAccessToken()
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
  } catch (cause) {
    const error = new Error('No se pudo conectar con el servidor. Revisa tu conexión e intenta otra vez.')
    error.code = 'NETWORK_ERROR'
    error.cause = cause
    throw error
  }

  if (response.status === 401 && token) {
    endSession()
    window.dispatchEvent(new CustomEvent('sgtra:session-expired'))
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    const error = new Error(payload?.error?.message || `Error de API: ${response.status}`)
    error.code = payload?.error?.code || response.status
    error.status = response.status
    error.fieldErrors = payload?.error?.fieldErrors || {}
    throw error
  }

  if (response.status === 204) return null
  const payload = await response.json().catch(() => null)
  return payload?.data ?? payload
}

export function withQuery(path, params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value)
  })
  const suffix = query.toString()
  return suffix ? `${path}?${suffix}` : path
}

export { API_BASE_URL }
