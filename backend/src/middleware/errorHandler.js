'use strict';

const { AppError } = require('../errors/AppError');

const DATABASE_ERRORS = {
  '23505': [409, 'DUPLICATE_VALUE', 'Ya existe un registro con ese valor.'],
  '23503': [409, 'RELATED_RECORD', 'La operación depende de un registro relacionado.'],
  '23502': [422, 'REQUIRED_VALUE', 'Falta un dato obligatorio.'],
  '23514': [422, 'INVALID_VALUE', 'Uno de los datos no cumple las reglas del sistema.'],
  P0001: [409, 'WORK_ORDER_DIAGNOSIS_REQUIRED', 'La orden requiere un diagnóstico antes de cerrar.'],
  P0002: [409, 'WORK_ORDER_PAYMENT_REQUIRED', 'La orden requiere una factura pagada antes de cerrar.'],
  P0003: [409, 'MATERIAL_NOT_FOUND', 'El material indicado no está disponible.'],
  P0004: [409, 'INSUFFICIENT_STOCK', 'No hay inventario suficiente para registrar el consumo.'],
};

function notFound(req, res) {
  res.status(404).json({ error: { code: 'ROUTE_NOT_FOUND', message: 'La ruta solicitada no existe.' } });
}

function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  let normalized = error;
  const dbCode = error.original?.code || error.parent?.code || error.code;
  if (!(error instanceof AppError) && DATABASE_ERRORS[dbCode]) {
    const [status, code, fallback] = DATABASE_ERRORS[dbCode];
    normalized = new AppError(status, code, error.original?.detail || fallback);
  }
  if (!(normalized instanceof AppError)) {
    console.error(normalized);
    normalized = new AppError(500, 'INTERNAL_ERROR', 'Ocurrió un error inesperado.');
  }
  const body = { code: normalized.code, message: normalized.message };
  if (normalized.fieldErrors && Object.keys(normalized.fieldErrors).length) body.fieldErrors = normalized.fieldErrors;
  res.status(normalized.status).json({ error: body });
}

module.exports = { notFound, errorHandler };
