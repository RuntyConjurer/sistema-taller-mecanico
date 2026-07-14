'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../src/app');
const { JwtService } = require('../src/services/JwtService');

test('GET /api/v1/health usa el envelope público', async () => {
  const response = await request(createApp()).get('/api/v1/health').expect(200);
  assert.deepEqual(response.body, { data: { status: 'ok', service: 'sgtra-api' } });
});

test('una ruta desconocida responde con el envelope de error', async () => {
  const token = new JwtService().sign({ id: 1, roles: ['ADMINISTRADOR'], sucursalId: null });
  const response = await request(createApp()).get('/api/v1/no-existe').set('Authorization', `Bearer ${token}`).expect(404);
  assert.equal(response.body.error.code, 'ROUTE_NOT_FOUND');
});

test('un técnico no puede crear clientes', async () => {
  const token = new JwtService().sign({ id: 3, roles: ['TECNICO'], sucursalId: 1 });
  const response = await request(createApp()).post('/api/v1/clientes').set('Authorization', `Bearer ${token}`).send({}).expect(403);
  assert.equal(response.body.error.code, 'FORBIDDEN');
});
