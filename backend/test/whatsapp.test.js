'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { WhatsAppCloudService, normalizePhone, parseAllowedTemplates, validateTemplateParameters } = require('../src/services/WhatsAppCloudService');
const { WhatsAppUseCase } = require('../src/domain/WhatsAppUseCase');
const { WhatsAppRepository, shouldAdvanceStatus } = require('../src/repositories/WhatsAppRepository');

function config(overrides = {}) {
  return {
    enabled: true,
    accessToken: 'token-de-prueba',
    appId: '123456',
    appSecret: 'secreto-de-prueba',
    phoneNumberId: '1148119201719935',
    wabaId: '2245119546238685',
    businessNumber: '15556552000',
    testRecipient: '18297559416',
    testMode: true,
    verifyToken: 'verify-de-prueba',
    graphVersion: 'v23.0',
    defaultTemplate: 'hello_world',
    defaultLanguage: 'en_US',
    allowedTemplates: ['hello_world:en_US'],
    timeoutMs: 8000,
    ...overrides,
  };
}

test('normaliza teléfonos internacionales sin aceptar caracteres arbitrarios', () => {
  assert.equal(normalizePhone('+1 (829) 755-9416'), '18297559416');
  assert.equal(normalizePhone('829-755-9416'), '18297559416');
  assert.throws(() => normalizePhone('809-ABC-1234'), (error) => error.code === 'INVALID_WHATSAPP_PHONE');
});

test('la allowlist vincula cada plantilla con sus idiomas permitidos', () => {
  const allowed = parseAllowedTemplates(['hello_world:en_US', 'confirmacion_cita:es_DO', 'entrada-invalida']);
  assert.deepEqual([...allowed.get('hello_world')], ['en_US']);
  assert.deepEqual([...allowed.get('confirmacion_cita')], ['es_DO']);
  assert.equal(allowed.size, 2);
});

test('limita los parámetros de plantilla a texto breve de una sola línea', () => {
  assert.deepEqual(validateTemplateParameters([' María ', 42]), ['María', '42']);
  assert.throws(() => validateTemplateParameters(['línea 1\nlínea 2']), (error) => error.code === 'INVALID_WHATSAPP_PARAMETERS');
});

test('verifica el challenge y la firma HMAC del cuerpo original', () => {
  const service = new WhatsAppCloudService(config());
  assert.equal(service.verifyChallenge('subscribe', 'verify-de-prueba', '12345'), '12345');
  assert.equal(service.verifyChallenge('subscribe', 'incorrecto', '12345'), null);
  const rawBody = Buffer.from('{"object":"whatsapp_business_account"}');
  const signature = `sha256=${crypto.createHmac('sha256', 'secreto-de-prueba').update(rawBody).digest('hex')}`;
  assert.equal(service.verifySignature(rawBody, signature), true);
  assert.equal(service.verifySignature(Buffer.from('{}'), signature), false);
});

test('envía hello_world solamente al host fijo de Meta y devuelve wamid', async () => {
  let captured;
  const fakeFetch = async (url, options) => {
    captured = { url, options };
    return { ok: true, json: async () => ({ contacts: [{ wa_id: '18297559416' }], messages: [{ id: 'wamid.test' }] }) };
  };
  const service = new WhatsAppCloudService(config(), fakeFetch);
  const result = await service.sendTemplate({ to: '+1 829 755 9416' });
  assert.equal(captured.url, 'https://graph.facebook.com/v23.0/1148119201719935/messages');
  assert.match(captured.options.headers.Authorization, /^Bearer /);
  assert.equal(JSON.parse(captured.options.body).template.name, 'hello_world');
  assert.equal(result.messageId, 'wamid.test');
});

test('comprueba número, plantilla y suscripción sin exponer credenciales', async () => {
  const fakeFetch = async (url) => {
    if (url.includes('message_templates')) {
      return { ok: true, json: async () => ({ data: [{ name: 'hello_world', language: 'en_US', status: 'APPROVED' }] }) };
    }
    if (url.includes('subscribed_apps')) {
      return { ok: true, json: async () => ({ data: [{ id: '123456' }] }) };
    }
    return { ok: true, json: async () => ({ display_phone_number: '+1 555-655-2000', verified_name: 'SGTRA', quality_rating: 'GREEN' }) };
  };
  const status = await new WhatsAppCloudService(config(), fakeFetch).getPublicStatus();
  assert.equal(status.connected, true);
  assert.equal(status.templateReady, true);
  assert.equal(status.webhookSubscribed, true);
  assert.equal('accessToken' in status, false);
  assert.equal('phoneNumberId' in status, false);
});

test('informa token inválido sin devolver el mensaje interno de Meta', async () => {
  const fakeFetch = async () => ({
    ok: false,
    json: async () => ({ error: { code: 190, message: 'token secreto expirado' } }),
  });
  const status = await new WhatsAppCloudService(config(), fakeFetch).getPublicStatus();
  assert.equal(status.connected, false);
  assert.equal(status.connectionError, 'WHATSAPP_TOKEN_INVALID');
  assert.equal(JSON.stringify(status).includes('token secreto'), false);
});

test('la prueba solo permite el destinatario configurado', async () => {
  const useCase = new WhatsAppUseCase({}, new WhatsAppCloudService(config()));
  await assert.rejects(
    () => useCase.sendTest({ telefono: '18295550000' }, { id: 1 }),
    (error) => error.code === 'WHATSAPP_TEST_RECIPIENT_FORBIDDEN',
  );
});

test('la cita no se notifica sin consentimiento', async () => {
  const repository = {
    getAppointment: async () => ({ cliente: { whatsappOptIn: false, telefono: '18297559416' } }),
  };
  const useCase = new WhatsAppUseCase(repository, new WhatsAppCloudService(config()));
  await assert.rejects(() => useCase.sendAppointment(1, {}, { id: 1, roles: ['ADMINISTRADOR'] }), (error) => error.code === 'WHATSAPP_CONSENT_REQUIRED');
});

test('el modo de prueba bloquea citas dirigidas a números no aprobados', async () => {
  const repository = {
    getAppointment: async () => ({ cliente: { whatsappOptIn: true, telefono: '18095550000' } }),
  };
  const useCase = new WhatsAppUseCase(repository, new WhatsAppCloudService(config()));
  await assert.rejects(
    () => useCase.sendAppointment(1, {}, { id: 1, roles: ['ADMINISTRADOR'] }),
    (error) => error.code === 'WHATSAPP_TEST_RECIPIENT_ONLY',
  );
});

test('un webhook repetido o fuera de orden no degrada el estado del mensaje', () => {
  assert.equal(shouldAdvanceStatus('ENVIADO', 'ENTREGADO'), true);
  assert.equal(shouldAdvanceStatus('ENTREGADO', 'LEIDO'), true);
  assert.equal(shouldAdvanceStatus('LEIDO', 'ENTREGADO'), false);
  assert.equal(shouldAdvanceStatus('LEIDO', 'LEIDO'), false);
});

test('un mensaje entrante duplicado conserva un solo wamid', async () => {
  const stored = new Set();
  const repository = new WhatsAppRepository({
    WhatsAppMessage: {
      findOrCreate: async ({ where }) => {
        const created = !stored.has(where.wamid);
        stored.add(where.wamid);
        return [{ wamid: where.wamid }, created];
      },
    },
  });
  const event = { id: 'wamid.duplicado', from: '18297559416', type: 'text', text: { body: 'Hola' }, timestamp: '1750000000' };
  await repository.recordInbound(event, {});
  await repository.recordInbound(event, {});
  assert.equal(stored.size, 1);
});

test('reconcilia un estado anticipado con el mensaje saliente sin degradarlo', async () => {
  let originalDestroyed = false;
  const existing = {
    id: 2,
    estado: 'ENTREGADO',
    update: async (values) => Object.assign(existing, values),
  };
  const outbound = {
    id: 1,
    clienteId: 3,
    citaId: 4,
    usuarioId: 5,
    tipo: 'PLANTILLA',
    plantilla: 'hello_world',
    idioma: 'en_US',
    update: async () => {
      const error = new Error('duplicado');
      error.name = 'SequelizeUniqueConstraintError';
      throw error;
    },
    destroy: async () => { originalDestroyed = true; },
  };
  const repository = new WhatsAppRepository({
    WhatsAppMessage: { findOne: async () => existing },
  });
  const result = await repository.markSent(outbound, {
    messageId: 'wamid.temprano',
    contactId: '18297559416',
    phone: '18297559416',
  });
  assert.equal(result.id, 2);
  assert.equal(result.estado, 'ENTREGADO');
  assert.equal(result.citaId, 4);
  assert.equal(originalDestroyed, true);
});
