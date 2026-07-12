import { apiEndpoints } from '@/constants/apiEndpoints'
import { apiRequest } from './api'
import { dataSource } from './dataSource'
import { mockStore } from './mockStore'

/** Agrupa cliente, vehículo y solicitud para evitar registros parciales cuando exista API. */
export async function crearSolicitudCita(form) {
  if (dataSource === 'api') {
    return apiRequest(apiEndpoints.appointmentRequests, { method: 'POST', body: JSON.stringify(form) })
  }

  return mockStore.createAppointment({
    fecha: `${form.fecha} ${form.hora}`,
    cliente: form.nombre,
    vehiculo: `${form.marca} ${form.modelo} · ${form.placa}`,
    motivo: form.detalle || form.servicio,
    documento: form.documento,
    chasis: form.chasis,
    sucursal: form.sucursal,
  })
}
