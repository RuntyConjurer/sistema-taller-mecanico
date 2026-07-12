import { describe, expect, it } from 'vitest'
import { loadBookingDraft, validateBookingField } from './bookingValidation'

describe('validación de agenda', () => {
  it('requiere los datos de identidad y vehículo', () => {
    expect(validateBookingField('documento', '')).toContain('Completa')
    expect(validateBookingField('chasis', '123')).toContain('al menos 6')
    expect(validateBookingField('anio', '20')).toContain('año válido')
  })

  it('recupera un borrador seguro si sessionStorage está dañado', () => {
    sessionStorage.setItem('sgtra-booking-draft', '{no es json')
    expect(loadBookingDraft().nombre).toBe('')
  })
})
