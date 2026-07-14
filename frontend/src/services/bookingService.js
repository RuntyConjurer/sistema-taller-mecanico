import { apiEndpoints } from '@/constants/apiEndpoints'
import { apiRequest } from './api'
import { dataSource } from './dataSource'
import { mockStore } from './mockStore'

/** Agrupa cliente, vehículo y solicitud para evitar registros parciales cuando exista API. */
export async function crearSolicitudCita(form) {
  if (dataSource === 'api') {
    // En modo API, el backend debe encargarse de crear cliente, vehiculo y cita
    // dentro de una transaccion para que no queden datos incompletos.
    return apiRequest(apiEndpoints.appointmentRequests, {
      method: 'POST',
      body: JSON.stringify(form),
    })
  }

  // En modo mock se crea una cita resumida con los datos visibles en la agenda.
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
