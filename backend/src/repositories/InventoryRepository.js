'use strict';

const models = require('../infrastructure/models');
const { AppError } = require('../errors/AppError');

class InventoryRepository {
  constructor(db = models) {
    this.db = db;
  }

  listRefrigerants() {
    return this.db.Material.findAll({
      where: { categoria: 'REFRIGERANTE', activo: true },
      order: [['id', 'DESC']],
      limit: 100,
    });
  }

  async createMovement(data, user) {
    const { Material, InventarioMovimiento, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const material = await Material.findByPk(data.materialId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!material) throw new AppError(404, 'MATERIAL_NOT_FOUND', 'No se encontró el material.');

      const current = Number(material.stockActual);
      let next;
      let amount;
      if (data.tipoMovimiento === 'ENTRADA') {
        amount = Number(data.cantidad);
        next = current + amount;
      } else if (data.tipoMovimiento === 'SALIDA') {
        amount = Number(data.cantidad);
        next = current - amount;
      } else if (data.tipoMovimiento === 'AJUSTE') {
        next = Number(data.nuevoStock);
        amount = Math.abs(next - current);
      } else {
        throw new AppError(422, 'INVALID_MOVEMENT_TYPE', 'El movimiento debe ser ENTRADA, SALIDA o AJUSTE.');
      }
      if (amount === 0) throw new AppError(422, 'EMPTY_ADJUSTMENT', 'El ajuste no modifica el inventario.');
      if (next < 0) throw new AppError(409, 'INSUFFICIENT_STOCK', `Disponible: ${current} ${material.unidadMedida}.`);

      await material.update({ stockActual: next }, { transaction });
      const movement = await InventarioMovimiento.create({
        materialId: material.id,
        tipoMovimiento: data.tipoMovimiento,
        cantidad: amount,
        costoUnitario: data.costoUnitario,
        motivo: data.motivo,
        usuarioId: user.id,
      }, { transaction });
      return { movimiento: movement, stockAnterior: current, stockActual: next };
    });
  }
}

module.exports = { InventoryRepository };
