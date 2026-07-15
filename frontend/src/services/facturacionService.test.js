import { describe, expect, it } from 'vitest'
import { parseDecimalAmount } from './facturacionService'

describe('pagos de facturación', () => {
  it('acepta montos decimales con punto o coma', () => {
    expect(parseDecimalAmount('1250.75')).toBe(1250.75)
    expect(parseDecimalAmount('1250,75')).toBe(1250.75)
    expect(parseDecimalAmount('.5')).toBe(0.5)
    expect(parseDecimalAmount(',5')).toBe(0.5)
  })

  it('rechaza montos vacíos, negativos o no numéricos', () => {
    expect(() => parseDecimalAmount('')).toThrow(/monto recibido/i)
    expect(() => parseDecimalAmount('abc')).toThrow(/monto recibido/i)
    expect(() => parseDecimalAmount('-1.25')).toThrow(/monto recibido/i)
    expect(() => parseDecimalAmount('0')).toThrow(/mayor que cero/i)
  })
})