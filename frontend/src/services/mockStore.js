import { citas as initialAppointments } from '@/data/mocks/citas.mock'
import { ordenes as initialWorkOrders } from '@/data/mocks/ordenes.mock'
import { productos as initialProducts, refrigerantes as initialRefrigerants } from '@/data/mocks/inventario.mock'

const clone = (value) => JSON.parse(JSON.stringify(value))

let appointments = clone(initialAppointments)
let workOrders = clone(initialWorkOrders).map((order) => ({ ...order, diagnosticoRegistrado: order.id !== 1 }))
let products = clone(initialProducts)
let refrigerants = clone(initialRefrigerants)
let invoices = [
  { id: 1, numero: 'FAC-SDQ-501', cliente: 'Carlos Pérez', total: 8900, balance: 0, estado: 'PAGADA', ordenId: 3 },
  { id: 2, numero: 'FAC-SDQ-500', cliente: 'Grupo Nova SRL', total: 28400, balance: 14200, estado: 'PENDIENTE', ordenId: 2 },
  { id: 3, numero: 'FAC-SDQ-499', cliente: 'María López', total: 12500, balance: 12500, estado: 'PENDIENTE', ordenId: 1 },
]

export const mockStore = {
  appointments: () => clone(appointments),
  updateAppointment(id, changes) {
    appointments = appointments.map((item) => item.id === id ? { ...item, ...changes } : item)
    return clone(appointments.find((item) => item.id === id))
  },
  createAppointment(data) {
    const appointment = { id: Date.now(), estado: 'PROGRAMADA', ...data }
    appointments = [appointment, ...appointments]
    return clone(appointment)
  },
  workOrders: () => clone(workOrders),
  updateWorkOrder(id, changes) {
    workOrders = workOrders.map((item) => item.id === id ? { ...item, ...changes } : item)
    return clone(workOrders.find((item) => item.id === id))
  },
  closeWorkOrder(id) {
    const order = workOrders.find((item) => item.id === id)
    const invoice = invoices.find((item) => item.ordenId === id)
    if (!order?.diagnosticoRegistrado) throw new Error('No se puede cerrar una OT sin diagnóstico registrado.')
    if (invoice?.estado !== 'PAGADA') throw new Error('No se puede cerrar una OT sin factura pagada.')
    return this.updateWorkOrder(id, { estado: 'CERRADA' })
  },
  refrigerants: () => clone(refrigerants),
  products: () => clone(products),
  consumeRefrigerant(id, quantity) {
    const product = products.find((item) => item.id === id && item.esRefrigerante)
    if (!product) throw new Error('Refrigerante no encontrado.')
    const stock = Number.parseFloat(product.existencia)
    if (quantity <= 0) throw new Error('Indica una cantidad mayor que cero.')
    if (quantity > stock) throw new Error('Stock insuficiente para registrar la recarga.')
    const remaining = Number((stock - quantity).toFixed(2))
    products = products.map((item) => item.id === id ? { ...item, existencia: `${remaining} kg` } : item)
    refrigerants = refrigerants.map((item) => item.id === id ? { ...item, existencia: `${remaining} kg`, consumoMes: `${(Number.parseFloat(item.consumoMes) + quantity).toFixed(2)} kg` } : item)
    return { remaining }
  },
  invoices: () => clone(invoices),
  applyPayment(id, amount) {
    const invoice = invoices.find((item) => item.id === id)
    if (!invoice) throw new Error('Factura no encontrada.')
    if (amount <= 0) throw new Error('Indica un pago mayor que cero.')
    if (amount > invoice.balance) throw new Error('El pago no puede superar el balance pendiente.')
    const balance = Number((invoice.balance - amount).toFixed(2))
    const estado = balance === 0 ? 'PAGADA' : 'PENDIENTE'
    invoices = invoices.map((item) => item.id === id ? { ...item, balance, estado } : item)
    return clone(invoices.find((item) => item.id === id))
  },
}
