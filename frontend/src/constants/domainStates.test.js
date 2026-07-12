import { describe, expect, it } from 'vitest'
import { getStateMeta } from './domainStates'
import { mockStore } from '@/services/mockStore'

describe('estados y reglas mock', () => {
  it('traduce códigos técnicos sin cambiarlos', () => {
    expect(getStateMeta('cita', 'CONFIRMADA').label).toBe('Confirmada')
    expect(getStateMeta('factura', 'PAGADA').tone).toBe('success')
  })

  it('rechaza un consumo de refrigerante mayor al stock', () => {
    expect(() => mockStore.consumeRefrigerant(1, 999)).toThrow('Stock insuficiente')
  })
})
