'use strict';

const { AppError } = require('../errors/AppError');

const META_STATUS = Object.freeze({
  sent: 'ENVIADO',
  delivered: 'ENTREGADO',
  read: 'LEIDO',
  failed: 'FALLIDO',
});

const STATUS_RANK = Object.freeze({
  PENDIENTE: 0,
  ENVIANDO: 0,
  ENVIADO: 1,
  ENTREGADO: 2,
  LEIDO: 3,
  FALLIDO: 1,
});

class WhatsAppRepository {
  constructor(models) {
    this.db = models;
  }

  async setConsent(clientId, accepts, source) {
    const client = await this.db.Cliente.findByPk(clientId);
    if (!client) throw new AppError(404, 'CLIENT_NOT_FOUND', 'No se encontró el cliente.');
    return client.update({
      whatsappOptIn: accepts,
      whatsappOptInAt: accepts ? new Date() : null,
      whatsappOptInSource: accepts ? source : null,
    });
  }

  async getAppointment(id, user) {
    const appointment = await this.db.Cita.findByPk(id, {
      include: [{ model: this.db.Cliente, as: 'cliente' }],
    });
    if (!appointment) throw new AppError(404, 'APPOINTMENT_NOT_FOUND', 'No se encontró la cita.');
    if (!user.roles.includes('ADMINISTRADOR') && Number(appointment.sucursalId) !== Number(user.sucursalId)) {
      throw new AppError(403, 'BRANCH_FORBIDDEN', 'La cita pertenece a otra sucursal.');
    }
    return appointment;
  }

  createOutbound(data) {
    return this.db.WhatsAppMessage.create({
      clienteId: data.clientId || null,
      citaId: data.appointmentId || null,
      usuarioId: data.userId || null,
      telefonoDestino: data.phone,
      direccion: 'SALIENTE',
      tipo: 'PLANTILLA',
      plantilla: data.templateName,
      idioma: data.languageCode,
      estado: 'ENVIANDO',
    });
  }

  markSent(message, result) {
    return message.update({
      wamid: result.messageId,
      telefonoDestino: result.contactId || result.phone,
      estado: 'ENVIADO',
      fechaEvento: new Date(),
      actualizadoEn: new Date(),
      errorCodigo: null,
      errorMensaje: null,
    });
  }

  markFailed(message, error) {
    return message.update({
      estado: 'FALLIDO',
      errorCodigo: String(error.metaCode || error.code || 'UNKNOWN').slice(0, 80),
      errorMensaje: String(error.message || 'Error al enviar el mensaje.').slice(0, 1000),
      fechaEvento: new Date(),
      actualizadoEn: new Date(),
    });
  }

  list({ appointmentId, limit = 100, user } = {}) {
    const where = appointmentId ? { citaId: appointmentId } : {};
    const include = user && !user.roles.includes('ADMINISTRADOR')
      ? [{ model: this.db.Cita, as: 'cita', required: true, where: { sucursalId: user.sucursalId } }]
      : [];
    return this.db.WhatsAppMessage.findAll({
      where,
      include,
      limit: Math.min(Math.max(Number(limit) || 100, 1), 250),
      order: [['id', 'DESC']],
    });
  }

  async processWebhook(payload) {
    const changes = (payload?.entry || []).flatMap((entry) => entry?.changes || []);
    let messages = 0;
    let statuses = 0;
    await this.db.sequelize.transaction(async (transaction) => {
      for (const change of changes) {
        const value = change?.value || {};
        for (const message of value.messages || []) {
          await this.recordInbound(message, transaction);
          messages += 1;
        }
        for (const status of value.statuses || []) {
          await this.recordStatus(status, transaction);
          statuses += 1;
        }
      }
    });
    return { messages, statuses };
  }

  async recordInbound(message, transaction) {
    const wamid = stringOrNull(message?.id, 255);
    const phone = stringOrNull(message?.from, 20);
    if (!wamid || !phone) return;
    await this.db.WhatsAppMessage.findOrCreate({
      where: { wamid },
      defaults: {
        wamid,
        telefonoDestino: phone,
        direccion: 'ENTRANTE',
        tipo: stringOrNull(message.type, 30) || 'DESCONOCIDO',
        contenido: inboundContent(message),
        estado: 'RECIBIDO',
        fechaEvento: fromUnixSeconds(message.timestamp),
      },
      transaction,
    });
  }

  async recordStatus(status, transaction) {
    const wamid = stringOrNull(status?.id, 255);
    const phone = stringOrNull(status?.recipient_id, 20);
    const state = META_STATUS[status?.status];
    if (!wamid || !phone || !state) return;
    const error = status.errors?.[0];
    const [message, created] = await this.db.WhatsAppMessage.findOrCreate({
      where: { wamid },
      defaults: {
        wamid,
        telefonoDestino: phone,
        direccion: 'SALIENTE',
        tipo: 'ESTADO',
        estado: state,
        fechaEvento: fromUnixSeconds(status.timestamp),
        errorCodigo: stringOrNull(error?.code, 80),
        errorMensaje: stringOrNull(error?.title || error?.message, 1000),
      },
      transaction,
    });
    // Meta puede reenviar eventos o entregarlos fuera de orden.
    if (!created && shouldAdvanceStatus(message.estado, state)) {
      await message.update({
        estado: state,
        fechaEvento: fromUnixSeconds(status.timestamp),
        actualizadoEn: new Date(),
        errorCodigo: stringOrNull(error?.code, 80),
        errorMensaje: stringOrNull(error?.title || error?.message, 1000),
      }, { transaction });
    }
  }
}

function inboundContent(message) {
  if (message?.type === 'text') return stringOrNull(message.text?.body, 4000);
  return null;
}

function stringOrNull(value, maxLength) {
  if (value === undefined || value === null) return null;
  return String(value).slice(0, maxLength);
}

function fromUnixSeconds(value) {
  const milliseconds = Number(value) * 1000;
  return Number.isFinite(milliseconds) && milliseconds > 0 ? new Date(milliseconds) : new Date();
}

function shouldAdvanceStatus(current, incoming) {
  if (current === 'FALLIDO' || current === 'LEIDO') return false;
  if (incoming === 'FALLIDO') return ['PENDIENTE', 'ENVIANDO', 'ENVIADO'].includes(current);
  const currentRank = STATUS_RANK[current];
  const incomingRank = STATUS_RANK[incoming];
  if (currentRank === undefined || incomingRank === undefined) return false;
  return incomingRank > currentRank;
}

module.exports = { WhatsAppRepository, META_STATUS, shouldAdvanceStatus };
