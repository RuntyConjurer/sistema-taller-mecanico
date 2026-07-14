'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { toApi } = require('../src/mappers/toApi');
const { round } = require('../src/repositories/WorkshopRepository');

test('toApi convierte IDs y decimales, serializa fechas y oculta hashes', () => {
  const value = toApi({ id: '12', total: '1250.50', fecha: new Date('2026-07-14T12:00:00Z'), passwordHash: 'secret' });
  assert.deepEqual(value, { id: 12, total: 1250.5, fecha: '2026-07-14T12:00:00.000Z' });
});

test('round conserva dos decimales para cálculos monetarios', () => {
  assert.equal(round(10.005), 10.01);
});
