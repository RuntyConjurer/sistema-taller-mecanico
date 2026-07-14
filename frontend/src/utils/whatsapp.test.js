import { describe, expect, it } from 'vitest'
import { buildWhatsAppUrl, normalizeWhatsAppNumber } from './whatsapp'

describe('enlaces públicos de WhatsApp', () => {
  it('normaliza números internacionales sin exponer otros caracteres', () => {
    expect(normalizeWhatsAppNumber('+1 (829) 755-9416')).toBe('18297559416')
  })

  it('usa el número seguro por defecto cuando la configuración es inválida', () => {
    expect(normalizeWhatsAppNumber('javascript:alert(1)')).toBe('15556552000')
  })

  it('codifica el texto y mantiene el dominio oficial de WhatsApp', () => {
    const url = new URL(buildWhatsAppUrl('Hola SGTRA: quiero agendar', '+1 555-655-2000'))

    expect(url.origin).toBe('https://wa.me')
    expect(url.pathname).toBe('/15556552000')
    expect(url.searchParams.get('text')).toBe('Hola SGTRA: quiero agendar')
  })
})
