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

test('la cita no se notifica sin consentimiento', async () => {
  const repository = {
    getAppointment: async () => ({ cliente: { whatsappOptIn: false, telefono: '18297559416' } }),
  };
  const useCase = new WhatsAppUseCase(repository, new WhatsAppCloudService(config()));
  await assert.rejects(() => useCase.sendAppointment(1, {}, { id: 1, roles: ['ADMINISTRADOR'] }), (error) => error.code === 'WHATSAPP_CONSENT_REQUIRED');
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
