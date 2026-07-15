'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  validateBookingPayload,
  validateRequired,
  validateState,
  validatePositive,
} = require('../src/validators');
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

test('validateBookingPayload rechaza datos irreales de agenda pública', () => {
  assert.throws(
    () => validateBookingPayload({
      cliente: {
        tipoCliente: 'PERSONA',
        tipoIdentificacion: 'CEDULA',
        identificacion: '123',
        nombre: 'Cliente Prueba',
        telefono: '1111111111',
        email: 'correo@@sgtra',
      },
      vehiculo: {
        chasis: 'ABC',
        marca: 'Toyota',
        modelo: 'Corolla',
        placa: '***',
        anio: 1979,
      },
      cita: { sucursalId: 'x' },
    }),
    (error) => {
      assert.equal(error.code, 'VALIDATION_ERROR');
      assert.deepEqual(
        ['anio', 'chasis', 'email', 'identificacion', 'placa', 'sucursalId', 'telefono'].every((field) => field in error.fieldErrors),
        true,
      );
      return true;
    },
  );
});

test('validateBookingPayload acepta una solicitud plausible', () => {
  assert.doesNotThrow(() => validateBookingPayload({
    cliente: {
      tipoCliente: 'PERSONA',
      tipoIdentificacion: 'CEDULA',
      identificacion: '00112345678',
      nombre: 'Cliente Prueba',
      telefono: '8095550142',
      email: 'cliente@sgtra.test',
    },
    vehiculo: {
      chasis: 'JTDBT923503012345',
      marca: 'Toyota',
      modelo: 'Corolla',
      placa: 'A123456',
      anio: 2027,
    },
    cita: { sucursalId: 1 },
  }));
});
