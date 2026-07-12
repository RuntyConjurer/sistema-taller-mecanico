import { beforeAll, describe, expect, it } from 'vitest'
import { listarOrdenesTrabajo, cerrarOrdenTrabajo } from './ordenesService'
import { guardarDiagnostico } from './diagnosticosService'
import { listarRefrigerantes, registrarConsumoRefrigerante } from './inventarioService'
import { listarFacturas, registrarPago } from './facturacionService'

// Recorre el flujo completo del SRS sobre una misma orden de trabajo, en orden, y
// comprueba que las reglas de negocio se cumplen de verdad:
//
//   OT -> diagnóstico -> consumo de refrigerante -> factura -> pago -> cierre
//
// Las mismas reglas las impone PostgreSQL con triggers (P0001, P0002, P0004). Aquí se
// verifica que la demostración con datos en memoria se comporta igual, para que lo que
// se enseña coincida con lo que hará el sistema real.
describe('flujo completo del taller (SRS)', () => {
  const ID_ORDEN = 1
  let factura

  beforeAll(async () => {
    const facturas = await listarFacturas()
    factura = facturas.find((item) => item.ordenId === ID_ORDEN)
  })

  it('parte de una OT abierta, sin diagnóstico y con la factura sin pagar', async () => {
    const ordenes = await listarOrdenesTrabajo()
    const orden = ordenes.find((item) => item.id === ID_ORDEN)

    expect(orden).toBeDefined()
    expect(orden.diagnosticoRegistrado).toBe(false)
    expect(factura).toBeDefined()
    expect(factura.estado).toBe('PENDIENTE')
    expect(factura.balance).toBeGreaterThan(0)
  })

  it('rechaza cerrar la OT sin diagnóstico (regla del trigger P0001)', async () => {
    await expect(cerrarOrdenTrabajo(ID_ORDEN)).rejects.toThrow(/sin diagnóstico/i)
  })

  it('registra el diagnóstico y la OT queda marcada como diagnosticada', async () => {
    await guardarDiagnostico(ID_ORDEN, {
      presion_baja: 22,
      presion_alta: 210,
      temperatura: 12,
      falla_detectada: 'Fuga en manguera de baja',
      observaciones: 'Sustituir la manguera',
    })

    const ordenes = await listarOrdenesTrabajo()
    const orden = ordenes.find((item) => item.id === ID_ORDEN)
    expect(orden.diagnosticoRegistrado).toBe(true)
  })

  it('rechaza cerrar la OT con diagnóstico pero sin factura pagada (trigger P0002)', async () => {
    await expect(cerrarOrdenTrabajo(ID_ORDEN)).rejects.toThrow(/factura pagada/i)
  })

  it('rechaza consumir más refrigerante del que hay en existencia (trigger P0004)', async () => {
    const [refrigerante] = await listarRefrigerantes()
    const exceso = refrigerante.stockActual + 1

    await expect(
      registrarConsumoRefrigerante({
        ordenId: ID_ORDEN,
        refrigeranteId: refrigerante.id,
        cantidad: exceso,
      }),
    ).rejects.toThrow(/stock insuficiente/i)
  })

  it('descuenta el inventario al registrar un consumo válido', async () => {
    const [antes] = await listarRefrigerantes()

    const resultado = await registrarConsumoRefrigerante({
      ordenId: ID_ORDEN,
      refrigeranteId: antes.id,
      cantidad: 1,
    })

    const [despues] = await listarRefrigerantes()
    expect(resultado.remaining).toBe(antes.stockActual - 1)
    expect(despues.stockActual).toBe(antes.stockActual - 1)
    expect(despues.consumoMes).toBe(antes.consumoMes + 1)
  })

  it('rechaza un pago mayor que el balance pendiente', async () => {
    await expect(registrarPago(factura.id, factura.balance + 1)).rejects.toThrow(
      /no puede superar/i,
    )
  })

  it('deja la factura en PAGADA al saldar el balance completo', async () => {
    const actualizada = await registrarPago(factura.id, factura.balance)

    expect(actualizada.balance).toBe(0)
    expect(actualizada.estado).toBe('PAGADA')
  })

  it('ahora sí permite cerrar la OT, con diagnóstico y factura pagada', async () => {
    const cerrada = await cerrarOrdenTrabajo(ID_ORDEN)
    expect(cerrada.estado).toBe('CERRADA')
  })
})
