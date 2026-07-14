import { describe, expect, it } from 'vitest'
import { enviarNotificacionCita, obtenerEstadoWhatsApp } from './whatsappService'

describe('servicio de WhatsApp en modo demostración', () => {
  it('informa que Meta no está conectado en modo mock', async () => {
    await expect(obtenerEstadoWhatsApp()).resolves.toMatchObject({
      enabled: false,
      configured: false,
      defaultTemplate: 'hello_world',
    })
  })

  it('simula el envío sin afirmar que Meta recibió el mensaje', async () => {
    await expect(enviarNotificacionCita(7)).resolves.toMatchObject({
      estado: 'SIMULADO',
      citaId: 7,
      wamid: null,
    })
  })

  it('requiere una cita antes de enviar', async () => {
    await expect(enviarNotificacionCita()).rejects.toThrow('Selecciona una cita')
  })
})
