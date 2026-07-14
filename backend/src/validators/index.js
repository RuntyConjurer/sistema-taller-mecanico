'use strict';

const { AppError } = require('../errors/AppError');

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

module.exports = { validateRequired, validateState, validatePositive };
