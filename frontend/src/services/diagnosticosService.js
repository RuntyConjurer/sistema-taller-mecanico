import { apiEndpoints, endpointWithId } from '@/constants/apiEndpoints'
import { apiRequest } from './api'
import { mapWorkOrder } from './apiMappers'
import { dataSource } from './dataSource'
import { mockStore } from './mockStore'

export async function guardarDiagnostico(ordenId, diagnostico) {
  if (dataSource === 'mock') {
    return mockStore.updateWorkOrder(ordenId, { diagnosticoRegistrado: true, diagnostico })
  }
  const payload = {
    presionBaja: diagnostico.presionBaja ?? diagnostico.presion_baja,
    presionAlta: diagnostico.presionAlta ?? diagnostico.presion_alta,
    temperatura: diagnostico.temperatura,
    fallaDetectada: diagnostico.fallaDetectada ?? diagnostico.falla_detectada,
    observaciones: diagnostico.observaciones,
  }
  const result = await apiRequest(endpointWithId(apiEndpoints.diagnostics, ordenId), {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return result.workOrder ? mapWorkOrder(result.workOrder) : result
}
