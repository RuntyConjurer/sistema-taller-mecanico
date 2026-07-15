import { describe, expect, it } from 'vitest'
import { buildAppointmentDate } from './bookingService'

describe('buildAppointmentDate', () => {
  it('usa el inicio de la franja horaria para crear una fecha ISO valida', () => {
    expect(buildAppointmentDate('2026-07-20', '8:00 - 10:00')).toBe('2026-07-20T12:00:00.000Z')
  })

  it('rechaza una hora sin formato esperado', () => {
    expect(() => buildAppointmentDate('2026-07-20', 'manana')).toThrow(
      'Selecciona una fecha y hora validas.',
    )
  })
})
