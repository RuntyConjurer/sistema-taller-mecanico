import { apiEndpoints } from '@/constants/apiEndpoints'
import { apiRequest } from './api'
import { mapAppointment } from './apiMappers'
import { dataSource } from './dataSource'
import { mockStore } from './mockStore'

function toPositiveId(value, field) {
  const id = Number(value)
  if (Number.isInteger(id) && id > 0) return id
  const error = new Error('Selecciona una opcion valida.')
  error.fieldErrors = { [field]: 'Selecciona una opcion valida.' }
  throw error
}

export function buildAppointmentDate(fecha, hora) {
  const [start] = String(hora || '').split('-')
  const match = start.trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!fecha || !match) {
    const error = new Error('Selecciona una fecha y hora validas.')
    error.fieldErrors = { fechaCita: 'Selecciona una fecha y hora validas.' }
    throw error
  }
  const hour = match[1].padStart(2, '0')
  return new Date(`${fecha}T${hour}:${match[2]}:00-04:00`).toISOString()
}

/** Agrupa cliente, vehículo y cita para que el backend los registre en una transacción. */
export async function crearSolicitudCita(form) {
  if (dataSource === 'api') {
    const fechaCita = buildAppointmentDate(form.fecha, form.hora)
    const sucursalId = toPositiveId(form.sucursalId ?? form.sucursal, 'sucursalId')
    const result = await apiRequest(apiEndpoints.appointmentRequests, {
      method: 'POST',
      body: JSON.stringify({
        cliente: {
          tipoCliente: form.tipoCliente,
          tipoIdentificacion: form.tipoIdentificacion,
          identificacion: form.documento.trim(),
          nombre: form.nombre.trim(),
          telefono: form.telefono.trim(),
          email: form.email?.trim() || undefined,
          whatsappOptIn: Boolean(form.whatsappOptIn),
        },
        vehiculo: {
          chasis: form.chasis.trim().toUpperCase(),
          marca: form.marca.trim(),
          modelo: form.modelo.trim(),
          placa: form.placa.trim().toUpperCase(),
          anio: Number(form.anio),
        },
        cita: {
          sucursalId,
          fechaCita,
          motivo: form.detalle?.trim() || form.servicioNombre || 'Revisión de climatización',
          observaciones: form.detalle?.trim() || undefined,
          servicioId: Number(form.servicioId) || undefined,
        },
      }),
    })
    return mapAppointment(result.cita || result.appointment || result)
  }

  return mockStore.createAppointment({
    fecha: `${form.fecha} ${form.hora}`,
    cliente: form.nombre,
    vehiculo: `${form.marca} ${form.modelo} · ${form.placa}`,
    motivo: form.detalle || form.servicio,
    documento: form.documento,
    chasis: form.chasis,
    sucursal: form.sucursal,
    whatsappOptIn: Boolean(form.whatsappOptIn),
  })
}
