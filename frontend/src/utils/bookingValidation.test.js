import { describe, expect, it } from 'vitest'
import { loadBookingDraft, sanitizeBookingField, validateBookingField } from './bookingValidation'

describe('validación de agenda', () => {
  it('requiere los datos de identidad y vehículo', () => {
    expect(validateBookingField('documento', '')).toContain('Completa')
    expect(validateBookingField('chasis', '123')).toContain('6 a 17')
    expect(validateBookingField('anio', '1979')).toContain('1980')
    expect(validateBookingField('anio', '2028')).toContain('2027')
  })

  it('valida teléfono dominicano, correo y documento', () => {
    expect(validateBookingField('telefono', '8095550142')).toBe('')
    expect(validateBookingField('telefono', '123')).toContain('teléfono dominicano')
    expect(validateBookingField('email', 'correo@sgtra.com')).toBe('')
    expect(validateBookingField('email', 'correo@@sgtra')).toContain('correo')
    expect(validateBookingField('documento', '00112345678', { tipoIdentificacion: 'CEDULA' })).toBe(
      '',
    )
    expect(validateBookingField('documento', '001123', { tipoIdentificacion: 'CEDULA' })).toContain(
      '11',
    )
    expect(validateBookingField('documento', '123456789', { tipoIdentificacion: 'RNC' })).toBe('')
    expect(validateBookingField('documento', 'AB123456', { tipoIdentificacion: 'PASAPORTE' })).toBe(
      '',
    )
  })

  it('limpia campos antes de guardarlos en el estado del formulario', () => {
    expect(sanitizeBookingField('telefono', '(809) 555-0142')).toBe('8095550142')
    expect(sanitizeBookingField('anio', '20277')).toBe('2027')
    expect(sanitizeBookingField('email', ' USER@EXAMPLE.COM ')).toBe('user@example.com')
    expect(sanitizeBookingField('chasis', 'jtd bt-923')).toBe('JTDBT923')
    expect(
      sanitizeBookingField('documento', '001-1234567-8', { tipoIdentificacion: 'CEDULA' }),
    ).toBe('00112345678')
  })

  it('recupera un borrador seguro si sessionStorage está dañado', () => {
    sessionStorage.setItem('sgtra-booking-draft', '{no es json')
    expect(loadBookingDraft().nombre).toBe('')
  })
})
