'use strict';

const { toApi } = require('../mappers/toApi');

class BillingController {
  constructor(useCase) {
    this.useCase = useCase;
  }

  list = async (req, res) => {
    const invoices = await this.useCase.listInvoices(req.user);
    res.json({ data: toApi(invoices) });
  };

  get = async (req, res) => {
    const invoice = await this.useCase.getInvoice(req.params.id, req.user);
    res.json({ data: toApi(invoice) });
  };

  create = async (req, res) => {
    const invoice = await this.useCase.createInvoice(req.body, req.user);
    res.status(201).json({ data: toApi(invoice) });
  };

  pay = async (req, res) => {
    const payment = await this.useCase.registerPayment(req.params.id, req.body, req.user);
    res.status(201).json({ data: toApi(payment) });
  };

  cancel = async (req, res) => {
    const invoice = await this.useCase.cancelInvoice(req.params.id, req.user);
    res.json({ data: toApi(invoice) });
  };
}

module.exports = { BillingController };
