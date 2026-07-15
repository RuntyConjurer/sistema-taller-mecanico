import { apiEndpoints, endpointWithId } from '@/constants/apiEndpoints'
import { apiRequest } from './api'
import { mapInvoice, mapList } from './apiMappers'
import { dataSource } from './dataSource'
import { mockStore } from './mockStore'

export async function listarFacturas() {
  return dataSource === 'mock'
    ? mockStore.invoices().map(mapInvoice)
    : mapList(await apiRequest(apiEndpoints.invoices), mapInvoice)
}

export async function emitirFactura({ ordenTrabajoId, descuento = 0, observaciones }) {
  if (dataSource === 'mock') {
    throw new Error('La emisión de factura no persiste en modo demostración.')
  }
  return mapInvoice(await apiRequest(apiEndpoints.invoices, {
    method: 'POST',
    body: JSON.stringify({
      ordenTrabajoId: Number(ordenTrabajoId),
      descuento: Number(descuento),
      observaciones: observaciones || undefined,
    }),
  }))
}

export function parseDecimalAmount(value) {
  const normalized = String(value ?? '').trim().replace(',', '.')
  if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(normalized)) {
    throw new Error('Indica un monto recibido válido.')
  }
  const amount = Number(normalized)
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Indica un monto mayor que cero.')
  return amount
}

export async function registrarPago(facturaId, monto, formaPago = 'EFECTIVO', referencia) {
  const amount = parseDecimalAmount(monto)
  if (dataSource === 'mock') return mockStore.applyPayment(facturaId, amount)
  const result = await apiRequest(`${endpointWithId(apiEndpoints.invoices, facturaId)}/pagos`, {
    method: 'POST',
    body: JSON.stringify({ monto: amount, formaPago, referencia: referencia || undefined }),
  })
  return mapInvoice({
    ...(result.invoice || result.factura || result),
    balance: result.saldoPendiente ?? result.balance,
  })
}
