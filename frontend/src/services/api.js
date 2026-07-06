const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL no esta configurada.')
  }

  if (!path) {
    throw new Error('Endpoint de API no configurado.')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Error de API: ${response.status}`)
  }

  return response.json()
}

export { API_BASE_URL }
