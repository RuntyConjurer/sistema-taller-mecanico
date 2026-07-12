import { describe, expect, it } from 'vitest'
import { getStateMeta, getStockState } from './domainStates'
import { mockStore } from '@/services/mockStore'

describe('estados y reglas mock', () => {
  it('traduce códigos técnicos sin cambiarlos', () => {
    expect(getStateMeta('cita', 'CONFIRMADA').label).toBe('Confirmada')
    expect(getStateMeta('factura', 'PAGADA').tone).toBe('success')
    expect(getStateMeta('cotizacion', 'APROBADA').label).toBe('Aprobada')
  })

  // Los tres casos son los mismos del CASE de vw_estado_inventario. Si la vista
  // cambia en la base de datos, este test debe cambiar con ella.
  it('calcula el estado de stock igual que la vista vw_estado_inventario', () => {
    expect(getStockState(0, 5)).toBe('AGOTADO')
    expect(getStockState(5, 5)).toBe('REORDEN_NECESARIA')
    expect(getStockState(2.5, 5)).toBe('REORDEN_NECESARIA')
    expect(getStockState(8, 3)).toBe('STOCK_OPTIMO')
  })

  it('rechaza un consumo de refrigerante mayor al stock', () => {
    expect(() => mockStore.consumeRefrigerant(1, 999)).toThrow('Stock insuficiente')
  })

  it('descuenta el stock y acumula el consumo del mes al registrar una recarga', () => {
    const antes = mockStore.refrigerants().find((item) => item.id === 4)
    const { remaining, unidadMedida } = mockStore.consumeRefrigerant(4, 1.5)

    expect(remaining).toBe(antes.stockActual - 1.5)
    expect(unidadMedida).toBe('kg')

    const despues = mockStore.refrigerants().find((item) => item.id === 4)
    expect(despues.stockActual).toBe(remaining)
    expect(despues.consumoMes).toBe(antes.consumoMes + 1.5)
  })
})
