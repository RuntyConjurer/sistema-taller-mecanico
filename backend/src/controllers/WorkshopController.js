'use strict';

const { toApi } = require('../mappers/toApi');

class WorkshopController {
  constructor(useCase) { this.useCase = useCase; }
  booking = async (req, res) => res.status(201).json({ data: toApi(await this.useCase.requestAppointment(req.body)) });
  appointmentState = async (req, res) => res.json({ data: toApi(await this.useCase.updateAppointmentState(req.params.id, req.body, req.user)) });
  appointmentOrder = async (req, res) => res.status(201).json({ data: toApi(await this.useCase.appointmentToOrder(req.params.id, req.body, req.user)) });
  quoteOrder = async (req, res) => res.status(201).json({ data: toApi(await this.useCase.quoteToOrder(req.params.id, req.body, req.user)) });
  diagnosis = async (req, res) => res.json({ data: toApi(await this.useCase.diagnose(req.params.id, req.body, req.user)) });
  material = async (req, res) => res.status(201).json({ data: toApi(await this.useCase.consumeMaterial(req.params.id, req.body, req.user)) });
  service = async (req, res) => res.status(201).json({ data: toApi(await this.useCase.addService(req.params.id, req.body, req.user)) });
  invoice = async (req, res) => res.status(201).json({ data: toApi(await this.useCase.invoice(req.body, req.user)) });
  payment = async (req, res) => res.status(201).json({ data: toApi(await this.useCase.pay(req.params.id, req.body, req.user)) });
  close = async (req, res) => res.json({ data: toApi(await this.useCase.close(req.params.id, req.body, req.user)) });
  dashboard = async (req, res) => res.json({ data: toApi(await this.useCase.dashboard(req.user, req.query)) });
  incomeReport = async (req, res) => res.json({ data: toApi(await this.useCase.incomeReport(req.query, req.user)) });
  invoices = async (req, res) => res.json({ data: toApi(await this.useCase.listInvoices(req.user)) });
  invoiceById = async (req, res) => res.json({ data: toApi(await this.useCase.getInvoice(req.params.id, req.user)) });
  inventoryMovement = async (req, res) => res.status(201).json({ data: toApi(await this.useCase.inventoryMovement(req.body, req.user)) });
  cancelInvoice = async (req, res) => res.json({ data: toApi(await this.useCase.cancelInvoice(req.params.id, req.user)) });
}

module.exports = { WorkshopController };
