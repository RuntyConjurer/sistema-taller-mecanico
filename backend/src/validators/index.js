'use strict';

const { AppError } = require('../errors/AppError');

const MIN_VEHICLE_YEAR = 1980;
const MAX_VEHICLE_YEAR = 2027;
const DOMINICAN_AREA_CODES = new Set(['809', '829', '849']);

function validateRequired(input, fields) {
  const fieldErrors = {};
  for (const field of fields) {
    const value = input?.[field];
    if (value === undefined || value === null || String(value).trim() === '') fieldErrors[field] = 'Este campo es obligatorio.';
  }
  if (Object.keys(fieldErrors).length) throw new AppError(422, 'VALIDATION_ERROR', 'Revisa los campos indicados.', fieldErrors);
}

function validateState(value, allowed, field = 'estado') {
  if (!allowed.includes(value)) throw new AppError(422, 'INVALID_STATE', `El estado debe ser uno de: ${allowed.join(', ')}.`, { [field]: 'Estado no permitido.' });
}

function validatePositive(value, field) {
  if (!Number.isFinite(Number(value)) || Number(value) <= 0) throw new AppError(422, 'VALIDATION_ERROR', 'Revisa los campos indicados.', { [field]: 'Debe ser mayor que cero.' });
}

function normalizeDominicanPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
}

function addIf(condition, fieldErrors, field, message) {
  if (condition) fieldErrors[field] = message;
}

function validateBookingPayload(input) {
  const fieldErrors = {};
  const cliente = input?.cliente || {};
  const vehiculo = input?.vehiculo || {};
  const cita = input?.cita || {};

  const phone = normalizeDominicanPhone(cliente.telefono);
  addIf(
    phone.length !== 10 || !DOMINICAN_AREA_CODES.has(phone.slice(0, 3)) || !/^[2-9]/.test(phone.slice(3)) || /^(\d)\1+$/.test(phone),
    fieldErrors,
    'telefono',
    'Usa un teléfono dominicano real: 809, 829 o 849 + 7 dígitos.'
  );

  if (cliente.email) {
    const email = String(cliente.email).trim();
    addIf(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) || email.includes('..'), fieldErrors, 'email', 'Escribe un correo con formato válido.');
  }

  const identification = String(cliente.identificacion || '').trim();
  if (cliente.tipoIdentificacion === 'CEDULA') addIf(!/^\d{11}$/.test(identification), fieldErrors, 'identificacion', 'La cédula debe tener 11 dígitos.');
  else if (cliente.tipoIdentificacion === 'RNC') addIf(!/^\d{9}$/.test(identification), fieldErrors, 'identificacion', 'El RNC debe tener 9 dígitos.');
  else if (cliente.tipoIdentificacion === 'PASAPORTE') addIf(!/^[A-Z0-9]{6,20}$/i.test(identification), fieldErrors, 'identificacion', 'El pasaporte debe tener de 6 a 20 letras o números.');
  else fieldErrors.tipoIdentificacion = 'Tipo de identificación no permitido.';

  addIf(!['PERSONA', 'EMPRESA'].includes(cliente.tipoCliente), fieldErrors, 'tipoCliente', 'Tipo de cliente no permitido.');

  const year = Number(vehiculo.anio);
  addIf(!Number.isInteger(year) || year < MIN_VEHICLE_YEAR || year > MAX_VEHICLE_YEAR, fieldErrors, 'anio', `El año debe estar entre ${MIN_VEHICLE_YEAR} y ${MAX_VEHICLE_YEAR}.`);
  addIf(!/^[A-Z0-9]{6,17}$/i.test(String(vehiculo.chasis || '').trim()), fieldErrors, 'chasis', 'El chasis debe tener de 6 a 17 letras o números, sin espacios.');
  if (vehiculo.placa) addIf(!/^[A-Z0-9][A-Z0-9-]{3,9}$/i.test(String(vehiculo.placa).trim()), fieldErrors, 'placa', 'La placa debe tener de 4 a 10 letras, números o guiones.');
  addIf(!Number.isInteger(Number(cita.sucursalId)) || Number(cita.sucursalId) <= 0, fieldErrors, 'sucursalId', 'Selecciona una sucursal válida.');

  if (Object.keys(fieldErrors).length) throw new AppError(422, 'VALIDATION_ERROR', 'Revisa los campos indicados.', fieldErrors);
}

module.exports = {
  MAX_VEHICLE_YEAR,
  MIN_VEHICLE_YEAR,
  normalizeDominicanPhone,
  validateBookingPayload,
  validatePositive,
  validateRequired,
  validateState,
};

