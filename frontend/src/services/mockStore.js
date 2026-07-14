import { citas as initialAppointments } from '@/data/mocks/citas.mock'
import { ordenes as initialWorkOrders } from '@/data/mocks/ordenes.mock'
import {
  materiales as initialMaterials,
  consumoRefrigerantes as initialRefrigerantUsage,
} from '@/data/mocks/inventario.mock'
import { facturas as initialInvoices } from '@/data/mocks/facturas.mock'

const clone = (value) => JSON.parse(JSON.stringify(value))
const round = (value) => Number(value.toFixed(2))

// Estado mutable solo para la sesion actual del navegador. Permite demostrar
// acciones como pagar, cerrar OT o consumir refrigerante sin tocar una base real.
let appointments = clone(initialAppointments)
let workOrders = clone(initialWorkOrders).map((order) => ({
  ...order,
  diagnosticoRegistrado: order.id !== 1,
}))
let materials = clone(initialMaterials)
let refrigerantUsage = clone(initialRefrigerantUsage)
let invoices = clone(initialInvoices)

export const mockStore = {
  appointments: () => clone(appointments),
  updateAppointment(id, changes) {
    // Las actualizaciones devuelven una copia nueva para evitar que una pantalla
    // modifique accidentalmente el estado interno del mockStore.
    appointments = appointments.map((item) => (item.id === id ? { ...item, ...changes } : item))
    return clone(appointments.find((item) => item.id === id))
  },
  createAppointment(data) {
    const appointment = { id: Date.now(), estado: 'PROGRAMADA', ...data }
    appointments = [appointment, ...appointments]
    return clone(appointment)
  },
  workOrders: () => clone(workOrders),
  updateWorkOrder(id, changes) {
    workOrders = workOrders.map((item) => (item.id === id ? { ...item, ...changes } : item))
    return clone(workOrders.find((item) => item.id === id))
  },
  closeWorkOrder(id) {
    const order = workOrders.find((item) => item.id === id)
    const invoice = invoices.find((item) => item.ordenId === id)
    if (!order?.diagnosticoRegistrado)
      throw new Error('No se puede cerrar una OT sin diagnóstico registrado.')
    if (invoice?.estado !== 'PAGADA')
      throw new Error('No se puede cerrar una OT sin factura pagada.')
    return this.updateWorkOrder(id, { estado: 'CERRADA' })
  },
  materials: () => clone(materials),
  // Los refrigerantes no son una tabla aparte: son los materiales cuya categoría
  // es REFRIGERANTE, igual que en la base de datos. Aquí se les añade el consumo
  // del mes, que la API traerá agregado desde inventario_movimientos.
  refrigerants: () =>
    clone(
      materials
        .filter((item) => item.categoria === 'REFRIGERANTE')
        .map((item) => ({
          ...item,
          consumoMes: refrigerantUsage[item.id]?.consumoMes ?? 0,
          ordenes: refrigerantUsage[item.id]?.ordenes ?? 0,
        })),
    ),
  // Reproduce el trigger fn_validar_stock_inventario: la base de datos rechaza el
  // consumo si no hay existencia suficiente (error P0004). Validarlo también aquí
  // permite demostrar el flujo sin backend, pero la regla definitiva es la de PostgreSQL.
  consumeRefrigerant(id, quantity) {
    const material = materials.find((item) => item.id === id && item.categoria === 'REFRIGERANTE')
    if (!material) throw new Error('Refrigerante no encontrado.')
    if (quantity <= 0) throw new Error('Indica una cantidad mayor que cero.')
    if (quantity > material.stockActual)
      throw new Error('Stock insuficiente para registrar la recarga.')

    const remaining = round(material.stockActual - quantity)
    materials = materials.map((item) =>
      item.id === id ? { ...item, stockActual: remaining } : item,
    )
    refrigerantUsage = {
      ...refrigerantUsage,
      [id]: {
        consumoMes: round((refrigerantUsage[id]?.consumoMes ?? 0) + quantity),
        ordenes: (refrigerantUsage[id]?.ordenes ?? 0) + 1,
      },
    }
    return { remaining, unidadMedida: material.unidadMedida }
  },
  invoices: () => clone(invoices),
  applyPayment(id, amount) {
    // Simula la regla de negocio de facturacion: el pago no puede superar el
    // balance pendiente y cambia a PAGADA cuando el balance llega a cero.
    const invoice = invoices.find((item) => item.id === id)
    if (!invoice) throw new Error('Factura no encontrada.')
    if (amount <= 0) throw new Error('Indica un pago mayor que cero.')
    if (amount > invoice.balance) throw new Error('El pago no puede superar el balance pendiente.')
    const balance = Number((invoice.balance - amount).toFixed(2))
    const estado = balance === 0 ? 'PAGADA' : 'PENDIENTE'
    invoices = invoices.map((item) => (item.id === id ? { ...item, balance, estado } : item))
    return clone(invoices.find((item) => item.id === id))
  },
}
