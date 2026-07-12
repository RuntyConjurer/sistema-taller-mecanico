import { apiEndpoints, endpointWithId } from '@/constants/apiEndpoints'
import { apiRequest } from './api'
import { dataSource } from './dataSource'
import { mockStore } from './mockStore'

export async function listarCitas() {
  return dataSource === 'mock' ? mockStore.appointments() : apiRequest(apiEndpoints.appointments)
}

export async function actualizarEstadoCita(id, estado) {
  return dataSource === 'mock'
    ? mockStore.updateAppointment(id, { estado })
    : apiRequest(`${endpointWithId(apiEndpoints.appointments, id)}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) })
}

export async function convertirCitaEnOrden(id) {
  if (dataSource === 'mock') {
    const appointment = mockStore.updateAppointment(id, { estado: 'COMPLETADA' })
    return { appointment, workOrder: { id: Date.now(), numero: `OT-DEMO-${id}`, estado: 'ABIERTA' } }
  }
  return apiRequest(`${endpointWithId(apiEndpoints.appointments, id)}/ordenes`, { method: 'POST' })
}
