'use strict';

const { validateRequired, validatePositive } = require('../validators');

class WorkOrderUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  convertQuote(id, input, user) {
    return this.repository.quoteToOrder(id, input, user);
  }

  diagnose(id, input, user) {
    validateRequired(input, ['fallaDetectada']);
    for (const field of ['presionBaja', 'presionAlta']) {
      if (input[field] !== undefined && Number(input[field]) < 0) validatePositive(input[field], field);
    }
    return this.repository.upsertDiagnosis(id, input, user);
  }

  consumeMaterial(id, input, user) {
    validateRequired(input, ['materialId', 'cantidad']);
    validatePositive(input.cantidad, 'cantidad');
    return this.repository.addMaterial(id, input, user);
  }

  addService(id, input, user) {
    validateRequired(input, ['servicioId']);
    if (input.cantidad !== undefined) validatePositive(input.cantidad, 'cantidad');
    return this.repository.addService(id, input, user);
  }

  close(id, input, user) {
    return this.repository.closeOrder(id, input, user);
  }
}

module.exports = { WorkOrderUseCase };
