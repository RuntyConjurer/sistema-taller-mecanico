'use strict';

const crypto = require('node:crypto');
const { AppError } = require('../errors/AppError');

const GRAPH_API_ORIGIN = 'https://graph.facebook.com';
const TEMPLATE_NAME = /^[a-z0-9_]{1,150}$/;
const LANGUAGE_CODE = /^[a-z]{2,3}(?:_[A-Z]{2})?$/;

class WhatsAppCloudService {
  constructor(config, fetchImpl = globalThis.fetch) {
    this.config = config;
    this.fetch = fetchImpl;
    this.allowedTemplates = parseAllowedTemplates(config.allowedTemplates);
  }

  getPublicStatus() {
    return {
      enabled: this.config.enabled,
      configured: this.isConfigured(),
      businessNumber: this.config.businessNumber || null,
      defaultTemplate: this.config.defaultTemplate,
      defaultLanguage: this.config.defaultLanguage,
      allowedTemplates: [...this.allowedTemplates.entries()].map(([name, languages]) => ({ name, languages: [...languages] })),
    };
  }

  isConfigured() {
    const required = ['accessToken', 'appSecret', 'phoneNumberId', 'verifyToken'];
    return Boolean(this.config.enabled && required.every((field) => this.config[field]));
  }

  assertConfigured() {
    if (!this.isConfigured()) {
      throw new AppError(503, 'WHATSAPP_NOT_CONFIGURED', 'WhatsApp no está configurado en este entorno.');
    }
  }

  verifyChallenge(mode, verifyToken, challenge) {
    if (mode !== 'subscribe' || !challenge || !this.config.verifyToken) return null;
    return safeEqualText(String(verifyToken || ''), this.config.verifyToken) ? String(challenge) : null;
  }

  verifySignature(rawBody, signature) {
    if (!this.config.appSecret || !Buffer.isBuffer(rawBody)) return false;
    const match = /^sha256=([0-9a-f]{64})$/i.exec(String(signature || ''));
    if (!match) return false;
    const expected = crypto.createHmac('sha256', this.config.appSecret).update(rawBody).digest();
    const received = Buffer.from(match[1], 'hex');
    return received.length === expected.length && crypto.timingSafeEqual(received, expected);
  }

  async sendTemplate({ to, templateName, languageCode, parameters = [] }) {
    this.assertConfigured();
    const phone = normalizePhone(to);
    const selected = this.validateTemplate(templateName, languageCode);
    const normalizedParameters = validateTemplateParameters(parameters);
    const body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phone,
      type: 'template',
      template: {
        name: selected.name,
        language: { code: selected.language },
      },
    };
    if (normalizedParameters.length) {
      body.template.components = [{
        type: 'body',
        parameters: normalizedParameters.map((text) => ({ type: 'text', text })),
      }];
    }

    const version = validateGraphVersion(this.config.graphVersion);
    const phoneNumberId = validateNumericId(this.config.phoneNumberId, 'WHATSAPP_PHONE_NUMBER_ID');
    const url = `${GRAPH_API_ORIGIN}/${version}/${phoneNumberId}/messages`;
    let response;
    try {
      response = await this.fetch(url, {
        method: 'POST',
        redirect: 'error',
        signal: AbortSignal.timeout(normalizeTimeout(this.config.timeoutMs)),
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      const timeout = error.name === 'TimeoutError' || error.name === 'AbortError';
      throw new AppError(timeout ? 504 : 502, timeout ? 'WHATSAPP_TIMEOUT' : 'WHATSAPP_UNAVAILABLE', timeout ? 'Meta no respondió dentro del tiempo esperado.' : 'No fue posible conectar con WhatsApp.');
    }

    const payload = await parseJson(response);
    if (!response.ok) {
      const metaCode = payload?.error?.code ? String(payload.error.code) : 'UNKNOWN';
      const message = payload?.error?.message || 'Meta rechazó la solicitud de WhatsApp.';
      const error = new AppError(502, 'WHATSAPP_META_ERROR', message);
      error.metaCode = metaCode;
      throw error;
    }

    const messageId = payload?.messages?.[0]?.id;
    if (!messageId) throw new AppError(502, 'WHATSAPP_INVALID_RESPONSE', 'Meta no devolvió el identificador del mensaje.');
    return {
      messageId,
      contactId: payload?.contacts?.[0]?.wa_id || null,
      phone,
      templateName: selected.name,
      languageCode: selected.language,
    };
  }

  validateTemplate(templateName, languageCode) {
    const name = String(templateName || this.config.defaultTemplate || '').trim();
    const language = String(languageCode || this.config.defaultLanguage || '').trim();
    if (!TEMPLATE_NAME.test(name) || !LANGUAGE_CODE.test(language)) {
      throw new AppError(422, 'INVALID_WHATSAPP_TEMPLATE', 'La plantilla o el idioma no tienen un formato válido.');
    }
    const languages = this.allowedTemplates.get(name);
    if (!languages?.has(language)) {
      throw new AppError(422, 'WHATSAPP_TEMPLATE_NOT_ALLOWED', 'La plantilla seleccionada no está habilitada para este proyecto.');
    }
    return { name, language };
  }
}

function normalizePhone(value) {
  const input = String(value || '').trim();
  let digits = input.replace(/[\s()+.-]/g, '');
  if (/^(809|829|849)\d{7}$/.test(digits)) digits = `1${digits}`;
  if (!/^\d{8,15}$/.test(digits)) {
    throw new AppError(422, 'INVALID_WHATSAPP_PHONE', 'El teléfono debe incluir el código de país y contener entre 8 y 15 dígitos.', { telefono: 'Usa el formato internacional, por ejemplo 18295551234.' });
  }
  return digits;
}

function parseAllowedTemplates(entries = []) {
  const allowed = new Map();
  for (const entry of entries) {
    const [name, language] = String(entry).split(':').map((value) => value.trim());
    if (!TEMPLATE_NAME.test(name || '') || !LANGUAGE_CODE.test(language || '')) continue;
    if (!allowed.has(name)) allowed.set(name, new Set());
    allowed.get(name).add(language);
  }
  return allowed;
}

function validateTemplateParameters(parameters) {
  if (!Array.isArray(parameters) || parameters.length > 10) {
    throw new AppError(422, 'INVALID_WHATSAPP_PARAMETERS', 'Los parámetros de plantilla no son válidos.');
  }
  return parameters.map((value) => {
    const text = String(value ?? '').trim();
    if (!text || text.length > 256 || /[\r\n\t]/.test(text)) {
      throw new AppError(422, 'INVALID_WHATSAPP_PARAMETERS', 'Cada parámetro debe contener entre 1 y 256 caracteres en una sola línea.');
    }
    return text;
  });
}

function validateGraphVersion(value) {
  const version = String(value || '');
  if (!/^v\d{1,2}\.\d$/.test(version)) throw new Error('WHATSAPP_GRAPH_VERSION no es válida.');
  return version;
}

function validateNumericId(value, name) {
  const id = String(value || '');
  if (!/^\d{5,25}$/.test(id)) throw new Error(`${name} no es válido.`);
  return id;
}

function normalizeTimeout(value) {
  const timeout = Number(value);
  return Number.isFinite(timeout) ? Math.min(Math.max(timeout, 1000), 30000) : 8000;
}

function safeEqualText(received, expected) {
  const a = Buffer.from(received);
  const b = Buffer.from(String(expected));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function parseJson(response) {
  try { return await response.json(); } catch { return {}; }
}

module.exports = {
  WhatsAppCloudService,
  normalizePhone,
  parseAllowedTemplates,
  validateTemplateParameters,
};
