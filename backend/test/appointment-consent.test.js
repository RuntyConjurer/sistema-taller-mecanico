'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { AppointmentRepository } = require('../src/repositories/AppointmentRepository');

function repositoryWithClient(client) {
  const transaction = { LOCK: { UPDATE: 'UPDATE' } };
  return new AppointmentRepository({
    sequelize: { transaction: async (callback) => callback(transaction) },
    Sucursal: { findOne: async () => ({ id: 1 }) },
    Servicio: { findOne: async () => null },
    Cliente: { findOne: async () => client, create: async () => { throw new Error('No debe crear cliente'); } },
    Vehiculo: { findOne: async () => ({ id: 8, clienteId: 3 }) },
    Cita: { create: async (values) => values },
  });
}

function booking(phone) {
  return {
    cliente: {
      tipoCliente: 'PERSONA',
      tipoIdentificacion: 'CEDULA',
      identificacion: '00100000001',
      nombre: 'Cliente',
      telefono: phone,
      whatsappOptIn: true,
    },
    vehiculo: { chasis: 'VIN-DEMO', placa: 'A123456', marca: 'Toyota', modelo: 'Corolla', anio: 2020 },
    cita: { sucursalId: 1, fechaCita: new Date(Date.now() + 86_400_000), motivo: 'Diagnóstico' },
  };
}

test('la agenda reconoce formatos equivalentes antes de activar WhatsApp', async () => {
  let updated;
  const client = {
    id: 3,
    telefono: '+1 (829) 755-9416',
    whatsappOptIn: false,
    update: async (values) => { updated = values; Object.assign(client, values); },
  };
  await repositoryWithClient(client).createBooking(booking('829-755-9416'));
  assert.equal(updated.whatsappOptIn, true);
  assert.equal(updated.whatsappOptInSource, 'AGENDA_PUBLICA');
});

test('la agenda no activa WhatsApp si el teléfono del cliente existente no coincide', async () => {
  let updated = false;
  const client = {
    id: 3,
    telefono: '18297559416',
    whatsappOptIn: false,
    update: async () => { updated = true; },
  };
  await assert.rejects(
    () => repositoryWithClient(client).createBooking(booking('18095550000')),
    (error) => error.code === 'CLIENT_CONTACT_MISMATCH',
  );
  assert.equal(updated, false);
});
