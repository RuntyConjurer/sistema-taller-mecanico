'use strict';

function convert(value, key = '', seen = new WeakSet()) {
  if (value === null || value === undefined) return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value?.toJSON === 'function') return convert(value.toJSON(), key, seen);
  if (typeof value === 'object') {
    if (seen.has(value)) return undefined;
    seen.add(value);
  }
  if (Array.isArray(value)) return value.map((item) => convert(item, '', seen)).filter((item) => item !== undefined);
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([name]) => name !== 'passwordHash' && name !== 'password_hash')
        .map(([name, item]) => [name, convert(item, name, seen)])
        .filter(([, item]) => item !== undefined),
    );
  }
  if (typeof value === 'string' && (/^(id|.*Id|subtotal|impuesto|descuento|total|cantidad|precio|monto|stock|costo|presion|temperatura|porcentaje)/i.test(key)) && /^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}

function toApi(value) {
  return convert(value);
}

module.exports = { toApi };
