import { apiEndpoints } from '@/constants/apiEndpoints'
import { apiRequest } from './api'
import { mapAppointment } from './apiMappers'
import { dataSource } from './dataSource'
import { mockStore } from './mockStore'

/** Agrupa cliente, vehículo y cita para que el backend los registre en una transacción. */
export async function crearSolicitudCita(form) {
  if (dataSource === 'api') {
    const fechaCita = new Date(`${form.fecha}T${form.hora}:00-04:00`).toISOString()
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
          sucursalId: Number(form.sucursal),
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
