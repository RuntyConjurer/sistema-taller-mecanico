import { beforeEach, describe, expect, it } from 'vitest'
import { listarOrdenesTrabajo } from './ordenesService'
import { listarCitas } from './citasService'
import { endSession, getBranchId, isSignedIn, setBranchId, startSession } from './sessionStore'

describe('filtro por sucursal', () => {
  it('solo devuelve las órdenes de la sucursal indicada', async () => {
    const sucursal1 = await listarOrdenesTrabajo(1)
    const sucursal2 = await listarOrdenesTrabajo(2)

    expect(sucursal1.length).toBeGreaterThan(0)
    expect(sucursal2.length).toBeGreaterThan(0)
    expect(sucursal1.every((item) => item.idSucursal === 1)).toBe(true)
    expect(sucursal2.every((item) => item.idSucursal === 2)).toBe(true)
  })

  it('devuelve todas las órdenes cuando no se indica sucursal', async () => {
    const todas = await listarOrdenesTrabajo()
    const sucursal1 = await listarOrdenesTrabajo(1)
    expect(todas.length).toBeGreaterThan(sucursal1.length)
  })

  it('filtra también la agenda de citas', async () => {
    const citas = await listarCitas(2)
    expect(citas.length).toBeGreaterThan(0)
    expect(citas.every((item) => item.idSucursal === 2)).toBe(true)
  })
})

describe('sesión de demostración', () => {
  beforeEach(() => {
    endSession()
  })

  it('no hay sesión hasta que se inicia', () => {
    expect(isSignedIn()).toBe(false)
    startSession('TECNICO')
    expect(isSignedIn()).toBe(true)
  })

  it('salir borra el rol y la sucursal', () => {
    startSession('CAJERO')
    setBranchId(2)
    expect(getBranchId()).toBe(2)

    endSession()

    expect(isSignedIn()).toBe(false)
    expect(getBranchId()).toBeNull()
  })
})
