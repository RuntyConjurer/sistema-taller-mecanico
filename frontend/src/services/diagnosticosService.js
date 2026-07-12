import { apiEndpoints, endpointWithId } from '@/constants/apiEndpoints'
import { apiRequest } from './api'
import { dataSource } from './dataSource'
import { mockStore } from './mockStore'

export function guardarDiagnostico(ordenId, diagnostico) {
  if (dataSource === 'mock') {
    return Promise.resolve(
      mockStore.updateWorkOrder(ordenId, { diagnosticoRegistrado: true, diagnostico }),
    )
  }
  return apiRequest(endpointWithId(apiEndpoints.diagnostics, ordenId), {
    method: 'PUT',
    body: JSON.stringify(diagnostico),
  })
}
