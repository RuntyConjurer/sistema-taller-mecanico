import { apiEndpoints, endpointWithId } from '@/constants/apiEndpoints'
import { apiRequest } from './api'
import { dataSource } from './dataSource'

const mockConfiguration = {
  enabled: false,
  configured: false,
  businessNumber: '15556552000',
  defaultTemplate: 'hello_world',
  defaultLanguage: 'en_US',
}

export async function obtenerEstadoWhatsApp() {
  if (dataSource === 'mock') return mockConfiguration
  return apiRequest(apiEndpoints.whatsappStatus)
}

export async function enviarNotificacionCita(citaId, options = {}) {
  if (!citaId) throw new Error('Selecciona una cita antes de enviar la notificación.')

  const payload = Object.fromEntries(
    Object.entries({
      templateName: options.templateName,
      languageCode: options.languageCode,
    }).filter(([, value]) => Boolean(value)),
  )

  if (dataSource === 'mock') {
    return {
      id: `demo-${citaId}`,
      wamid: null,
      estado: 'SIMULADO',
      plantilla: payload.templateName || mockConfiguration.defaultTemplate,
      idioma: payload.languageCode || mockConfiguration.defaultLanguage,
      citaId: Number(citaId),
    }
  }

  return apiRequest(
    `${endpointWithId(apiEndpoints.appointments, citaId)}/notificaciones/whatsapp`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  )
}
