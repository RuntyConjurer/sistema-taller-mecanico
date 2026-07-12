import { apiEndpoints, endpointWithId } from '@/constants/apiEndpoints'
import { apiRequest } from './api'
import { dataSource } from './dataSource'
import { mockStore } from './mockStore'

// Igual que en órdenes: el backend filtrará por sucursal; con mocks se filtra aquí.
export async function listarCitas(sucursalId) {
  if (dataSource === 'mock') {
    const citas = mockStore.appointments()
    return sucursalId ? citas.filter((item) => item.idSucursal === sucursalId) : citas
  }
  const query = sucursalId ? `?sucursalId=${sucursalId}` : ''
  return apiRequest(`${apiEndpoints.appointments}${query}`)
}

export async function actualizarEstadoCita(id, estado) {
  return dataSource === 'mock'
    ? mockStore.updateAppointment(id, { estado })
    : apiRequest(`${endpointWithId(apiEndpoints.appointments, id)}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado }),
      })
}

export async function convertirCitaEnOrden(id) {
  if (dataSource === 'mock') {
    const appointment = mockStore.updateAppointment(id, { estado: 'COMPLETADA' })
    return {
      appointment,
      workOrder: { id: Date.now(), numero: `OT-DEMO-${id}`, estado: 'ABIERTA' },
    }
  }
  return apiRequest(`${endpointWithId(apiEndpoints.appointments, id)}/ordenes`, { method: 'POST' })
}
