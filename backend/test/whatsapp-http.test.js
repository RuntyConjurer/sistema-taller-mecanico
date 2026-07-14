'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const request = require('supertest');
const { createApp } = require('../src/app');
const { buildContainer } = require('../src/di/container');
const { WhatsAppCloudService } = require('../src/services/WhatsAppCloudService');
const { WhatsAppUseCase } = require('../src/domain/WhatsAppUseCase');
const { WhatsAppController } = require('../src/controllers/WhatsAppController');
const { JwtService } = require('../src/services/JwtService');

function appWithWhatsApp() {
  const repository = {
    processWebhook: async (payload) => ({ messages: payload.entry?.length || 0, statuses: 0 }),
  };
  const service = new WhatsAppCloudService({
    enabled: true,
    accessToken: 'token-de-prueba',
    appSecret: 'app-secret-de-prueba',
    phoneNumberId: '1148119201719935',
    verifyToken: 'verify-token-de-prueba',
    graphVersion: 'v23.0',
    defaultTemplate: 'hello_world',
    defaultLanguage: 'en_US',
    allowedTemplates: ['hello_world:en_US'],
    timeoutMs: 8000,
  });
  const container = buildContainer();
  container.whatsappController = new WhatsAppController(new WhatsAppUseCase(repository, service));
  return createApp({ container });
}

test('Meta puede verificar el webhook con el token correcto', async () => {
  await request(appWithWhatsApp())
    .get('/api/v1/webhooks/whatsapp')
    .query({ 'hub.mode': 'subscribe', 'hub.verify_token': 'verify-token-de-prueba', 'hub.challenge': '654321' })
    .expect(200, '654321');

  const invalid = await request(appWithWhatsApp())
    .get('/api/v1/webhooks/whatsapp')
    .query({ 'hub.mode': 'subscribe', 'hub.verify_token': 'incorrecto', 'hub.challenge': '654321' })
    .expect(403);
  assert.equal(invalid.body.error.code, 'WHATSAPP_WEBHOOK_FORBIDDEN');
});

test('acepta un evento firmado sobre los bytes originales y rechaza una firma inválida', async () => {
  const raw = '{"entry":[{}]}';
  const signature = `sha256=${crypto.createHmac('sha256', 'app-secret-de-prueba').update(raw).digest('hex')}`;
  const valid = await request(appWithWhatsApp())
    .post('/api/v1/webhooks/whatsapp')
    .set('Content-Type', 'application/json')
    .set('X-Hub-Signature-256', signature)
    .send(raw)
    .expect(200);
  assert.equal(valid.body.data.messages, 1);

  const invalid = await request(appWithWhatsApp())
    .post('/api/v1/webhooks/whatsapp')
    .set('Content-Type', 'application/json')
    .set('X-Hub-Signature-256', 'sha256='.padEnd(71, '0'))
    .send(raw)
    .expect(401);
  assert.equal(invalid.body.error.code, 'INVALID_WHATSAPP_SIGNATURE');
});

test('el estado de WhatsApp exige una sesión válida', async () => {
  await request(appWithWhatsApp()).get('/api/v1/whatsapp/estado').expect(401);
  const token = new JwtService().sign({ id: 1, roles: ['ADMINISTRADOR'], sucursalId: null });
  const response = await request(appWithWhatsApp())
    .get('/api/v1/whatsapp/estado')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  assert.equal(response.body.data.enabled, true);
  assert.equal('appId' in response.body.data, false);
  assert.equal('phoneNumberId' in response.body.data, false);
  assert.equal('wabaId' in response.body.data, false);
});
