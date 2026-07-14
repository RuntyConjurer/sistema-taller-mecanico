'use strict';

const { validateRequired, validatePositive } = require('../validators');

class BillingUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  createInvoice(input, user) {
    validateRequired(input, ['ordenTrabajoId']);
    return this.repository.createInvoice(input, user);
  }

  registerPayment(id, input, user) {
    validateRequired(input, ['monto', 'formaPago']);
    validatePositive(input.monto, 'monto');
    return this.repository.registerPayment(id, input, user);
  }

  listInvoices(user) {
    return this.repository.listInvoices(user);
  }

  getInvoice(id, user) {
    return this.repository.getInvoice(id, user);
  }

  cancelInvoice(id, user) {
    return this.repository.cancelInvoice(id, user);
  }
}

module.exports = { BillingUseCase };
