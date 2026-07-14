import { describe, expect, it } from 'vitest'
import { mapAppointment, mapInvoice, mapMaterial, mapWorkOrder } from './apiMappers'

describe('mappers de API', () => {
  it('convierte relaciones Sequelize a la forma que usa la cita', () => {
    const cita = mapAppointment({
      id: '7',
      sucursalId: '2',
      fechaCita: '2026-08-01T13:00:00.000Z',
      estado: 'CONFIRMADA',
      cliente: { nombre: 'Ana Pérez' },
      vehiculo: { marca: 'Toyota', modelo: 'Corolla', placa: 'A123456' },
    })

    expect(cita).toMatchObject({
      id: 7,
      idSucursal: 2,
      cliente: 'Ana Pérez',
      vehiculo: 'Toyota Corolla · A123456',
      estado: 'CONFIRMADA',
    })
  })

  it('deriva diagnóstico y nombres legibles de una OT', () => {
    const order = mapWorkOrder({
      id: 11,
      sucursalId: 1,
      descripcionProblema: 'Aire tibio',
      vehiculo: { marca: 'Honda', modelo: 'Civic', placa: 'B765432' },
      diagnostico: { fallaDetectada: 'Fuga menor' },
    })

    expect(order.numero).toBe('OT-11')
    expect(order.sintomas).toBe('Aire tibio')
    expect(order.diagnosticoRegistrado).toBe(true)
  })

  it('calcula el balance de factura desde pagos aplicados', () => {
    const invoice = mapInvoice({
      id: 4,
      numeroFactura: 'SGTRA-4',
      total: '10000.00',
      estado: 'PENDIENTE',
      aplicacionesPago: [{ montoAplicado: '2500.00' }],
      ordenes: [{ id: 9 }],
    })

    expect(invoice).toMatchObject({ numero: 'SGTRA-4', total: 10000, balance: 7500, ordenId: 9 })
  })

  it('convierte decimales de inventario a números', () => {
    expect(mapMaterial({ id: '3', stockActual: '2.50', stockMinimo: '5.00' })).toMatchObject({
      id: 3,
      stockActual: 2.5,
      stockMinimo: 5,
    })
  })
})
