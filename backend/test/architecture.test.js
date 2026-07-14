'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const models = require('../src/infrastructure/models');

const SRC = path.join(__dirname, '..', 'src');

function javascriptFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return javascriptFiles(filePath);
    return entry.name.endsWith('.js') ? [filePath] : [];
  });
}

test('los casos de uso no consultan Sequelize directamente', () => {
  const violations = javascriptFiles(path.join(SRC, 'domain'))
    .filter((file) => fs.readFileSync(file, 'utf8').includes("require('../infrastructure"))
    .map((file) => path.basename(file));

  assert.deepEqual(violations, []);
});

test('las rutas no acceden directamente a repositorios o modelos', () => {
  const violations = javascriptFiles(path.join(SRC, 'routes'))
    .filter((file) => /\.repository\.|infrastructure\/models/.test(fs.readFileSync(file, 'utf8')))
    .map((file) => path.basename(file));

  assert.deepEqual(violations, []);
});

test('el facade de modelos conserva el contrato usado por el backend', () => {
  const expected = [
    'sequelize', 'Sucursal', 'Rol', 'Usuario', 'UsuarioRol', 'Cliente', 'Vehiculo', 'Servicio',
    'Cita', 'Cotizacion', 'CotizacionDetalle', 'OrdenTrabajo', 'Diagnostico', 'OrdenServicio',
    'Material', 'OrdenMaterial', 'InventarioMovimiento', 'Factura', 'FacturaOrden',
    'FacturaDetalle', 'Pago', 'PagoFactura', 'Historial', 'WhatsAppMessage',
  ];

  assert.deepEqual(Object.keys(models), expected);
});
