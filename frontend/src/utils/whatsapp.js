const DEFAULT_WHATSAPP_NUMBER = '15556552000'

/**
 * WhatsApp exige el número en formato internacional, sin el signo + ni separadores.
 * Si la variable de entorno es inválida se usa el número de prueba configurado.
 */
export function normalizeWhatsAppNumber(value, fallback = DEFAULT_WHATSAPP_NUMBER) {
  const digits = String(value ?? '').replace(/\D/g, '')
  return /^\d{7,15}$/.test(digits) ? digits : fallback
}

export const WHATSAPP_PUBLIC_NUMBER = normalizeWhatsAppNumber(import.meta.env.VITE_WHATSAPP_NUMBER)

export function buildWhatsAppUrl(message, number = WHATSAPP_PUBLIC_NUMBER) {
  const url = new URL(`https://wa.me/${normalizeWhatsAppNumber(number)}`)
  const text = String(message ?? '').trim()
  if (text) url.searchParams.set('text', text)
  return url.toString()
}
