'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { validateRequired, validateState, validatePositive } = require('../src/validators');
const { AppError } = require('../src/errors/AppError');

test('validateRequired informa cada campo ausente', () => {
  assert.throws(() => validateRequired({ nombre: '' }, ['nombre', 'telefono']), (error) => {
    assert.equal(error instanceof AppError, true);
    assert.deepEqual(Object.keys(error.fieldErrors), ['nombre', 'telefono']);
    return true;
  });
});

test('validateState rechaza un código fuera del dominio', () => {
  assert.throws(() => validateState('LISTA', ['ABIERTA', 'CERRADA']), { code: 'INVALID_STATE' });
});

test('validatePositive acepta decimales positivos y rechaza cero', () => {
  assert.doesNotThrow(() => validatePositive('1.25', 'cantidad'));
  assert.throws(() => validatePositive(0, 'cantidad'), { code: 'VALIDATION_ERROR' });
});
