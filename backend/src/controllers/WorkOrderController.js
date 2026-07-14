'use strict';

const { toApi } = require('../mappers/toApi');

class WorkOrderController {
  constructor(useCase) {
    this.useCase = useCase;
  }

  convertQuote = async (req, res) => {
    const order = await this.useCase.convertQuote(req.params.id, req.body, req.user);
    res.status(201).json({ data: toApi(order) });
  };

  diagnose = async (req, res) => {
    const diagnosis = await this.useCase.diagnose(req.params.id, req.body, req.user);
    res.json({ data: toApi(diagnosis) });
  };

  consumeMaterial = async (req, res) => {
    const material = await this.useCase.consumeMaterial(req.params.id, req.body, req.user);
    res.status(201).json({ data: toApi(material) });
  };

  addService = async (req, res) => {
    const service = await this.useCase.addService(req.params.id, req.body, req.user);
    res.status(201).json({ data: toApi(service) });
  };

  close = async (req, res) => {
    const order = await this.useCase.close(req.params.id, req.body, req.user);
    res.json({ data: toApi(order) });
  };
}

module.exports = { WorkOrderController };
