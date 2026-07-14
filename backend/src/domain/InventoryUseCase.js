'use strict';

const { validateRequired, validatePositive } = require('../validators');
const { AppError } = require('../errors/AppError');

class InventoryUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  listRefrigerants() {
    return this.repository.listRefrigerants();
  }

  createMovement(input, user) {
    validateRequired(input, ['materialId', 'tipoMovimiento']);
    if (input.tipoMovimiento === 'AJUSTE') {
      if (!Number.isFinite(Number(input.nuevoStock)) || Number(input.nuevoStock) < 0) {
        throw new AppError(422, 'VALIDATION_ERROR', 'Revisa los campos indicados.', {
          nuevoStock: 'Debe ser cero o mayor.',
        });
      }
    } else {
      validatePositive(input.cantidad, 'cantidad');
    }
    return this.repository.createMovement(input, user);
  }
}

module.exports = { InventoryUseCase };
