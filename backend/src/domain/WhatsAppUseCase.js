'use strict';

const { AppError } = require('../errors/AppError');

class WhatsAppUseCase {
  constructor(repository, cloudService) {
    this.repository = repository;
    this.cloudService = cloudService;
  }

  status() {
    return this.cloudService.getPublicStatus();
  }

  verifyWebhook(query) {
    return this.cloudService.verifyChallenge(query['hub.mode'], query['hub.verify_token'], query['hub.challenge']);
  }

  receiveWebhook(rawBody, signature, payload) {
    if (!this.cloudService.verifySignature(rawBody, signature)) {
      throw new AppError(401, 'INVALID_WHATSAPP_SIGNATURE', 'La firma del webhook no es válida.');
    }
    return this.repository.processWebhook(payload);
  }

  setConsent(clientId, input) {
    if (typeof input?.acepta !== 'boolean') {
      throw new AppError(422, 'VALIDATION_ERROR', 'Revisa los campos indicados.', { acepta: 'Indica true o false.' });
    }
    const source = String(input.fuente || 'PERSONAL_TALLER').trim().toUpperCase();
    if (!/^[A-Z0-9_]{3,40}$/.test(source)) {
      throw new AppError(422, 'VALIDATION_ERROR', 'Revisa los campos indicados.', { fuente: 'Usa una descripción breve.' });
    }
    return this.repository.setConsent(clientId, input.acepta, source);
  }

  listMessages(query, user) {
    return this.repository.list({ appointmentId: query.citaId, limit: query.limit, user });
  }

  async sendTest(input, user) {
    const phone = input?.telefono || this.cloudService.config.testRecipient;
    if (!phone) throw new AppError(422, 'WHATSAPP_TEST_RECIPIENT_REQUIRED', 'Configura o indica el destinatario de prueba.');
    return this.sendAndTrack({
      phone,
      templateName: input?.templateName,
      languageCode: input?.languageCode,
      parameters: input?.parameters,
      userId: user.id,
    });
  }

  async sendAppointment(appointmentId, input, user) {
    const appointment = await this.repository.getAppointment(appointmentId, user);
    if (!appointment.cliente?.whatsappOptIn) {
      throw new AppError(409, 'WHATSAPP_CONSENT_REQUIRED', 'El cliente debe autorizar las notificaciones por WhatsApp antes del envío.');
    }
    if (!appointment.cliente.telefono) {
      throw new AppError(422, 'WHATSAPP_PHONE_REQUIRED', 'El cliente no tiene un teléfono registrado.');
    }
    return this.sendAndTrack({
      phone: appointment.cliente.telefono,
      templateName: input?.templateName,
      languageCode: input?.languageCode,
      parameters: input?.parameters,
      clientId: appointment.clienteId,
      appointmentId: appointment.id,
      userId: user.id,
    });
  }

  async sendAndTrack(data) {
    const selected = this.cloudService.validateTemplate(data.templateName, data.languageCode);
    const message = await this.repository.createOutbound({
      ...data,
      templateName: selected.name,
      languageCode: selected.language,
    });
    try {
      const result = await this.cloudService.sendTemplate({
        to: data.phone,
        templateName: selected.name,
        languageCode: selected.language,
        parameters: data.parameters,
      });
      return this.repository.markSent(message, result);
    } catch (error) {
      await this.repository.markFailed(message, error);
      throw error;
    }
  }
}

module.exports = { WhatsAppUseCase };
