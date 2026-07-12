import { apiEndpoints, endpointWithId } from '@/constants/apiEndpoints'
import { apiRequest } from './api'
import { dataSource } from './dataSource'
import { mockStore } from './mockStore'

export function listarFacturas() {
  return Promise.resolve(
    dataSource === 'mock' ? mockStore.invoices() : apiRequest(apiEndpoints.invoices),
  )
}

export function registrarPago(facturaId, monto) {
  if (dataSource === 'mock')
    return Promise.resolve(mockStore.applyPayment(facturaId, Number(monto)))
  return apiRequest(`${endpointWithId(apiEndpoints.invoices, facturaId)}/pagos`, {
    method: 'POST',
    body: JSON.stringify({ monto: Number(monto) }),
  })
}
