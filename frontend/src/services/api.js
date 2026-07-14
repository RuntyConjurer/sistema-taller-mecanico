// Cliente HTTP del proyecto. Toda petición al backend pasa por aquí.
//
// Contrato de los services: todos son `async`, así que devuelven siempre una promesa,
// y un error de negocio siempre llega como promesa rechazada, tanto con datos de
// prueba como contra la API. Antes no era así: en modo mock el error se lanzaba de
// forma síncrona y en modo API se rechazaba, que es el mismo fallo con dos
// comportamientos distintos.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL no esta configurada.')
  }

  if (!path) {
    throw new Error('Endpoint de API no configurado.')
  }

  // fetch es la llamada HTTP nativa del navegador. Aqui se centralizan headers,
  // URL base y opciones para que cada service no repita la misma configuracion.
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    // El backend devuelve errores con estructura conocida; se copian al Error para
    // que las pantallas puedan mostrar mensajes y errores por campo si aplica.
    const payload = await response.json().catch(() => null)
    const error = new Error(payload?.error?.message || `Error de API: ${response.status}`)
    error.code = payload?.error?.code || response.status
    error.fieldErrors = payload?.error?.fieldErrors || {}
    throw error
  }

  // La API puede devolver { data: ... }; si no viene asi, se retorna el payload tal
  // cual para mantener compatibilidad durante la integracion.
  const payload = await response.json().catch(() => null)
  return payload?.data ?? payload
}

export { API_BASE_URL }
