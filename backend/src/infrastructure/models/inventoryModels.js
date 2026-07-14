'use strict';

const { DataTypes, modelOptions, id, fk } = require('./modelHelpers');

function defineInventoryModels(sequelize) {
  const InventarioMovimiento = sequelize.define('InventarioMovimiento', {
    id: id('id_movimiento'), materialId: fk('id_material', false), tipoMovimiento: { type: DataTypes.STRING(20), field: 'tipo_movimiento' },
    cantidad: DataTypes.DECIMAL(12, 2), costoUnitario: { type: DataTypes.DECIMAL(12, 2), field: 'costo_unitario' }, motivo: DataTypes.TEXT,
    usuarioId: fk('id_usuario'), fechaMovimiento: { type: DataTypes.DATE, field: 'fecha_movimiento' },
  }, modelOptions(sequelize, 'inventario_movimientos'));

  return { InventarioMovimiento };
}

module.exports = { defineInventoryModels };
