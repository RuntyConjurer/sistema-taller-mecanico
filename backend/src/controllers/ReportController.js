'use strict';

const { toApi } = require('../mappers/toApi');

class ReportController {
  constructor(useCase) {
    this.useCase = useCase;
  }

  dashboard = async (req, res) => {
    const dashboard = await this.useCase.dashboard(req.user, req.query);
    res.json({ data: toApi(dashboard) });
  };

  income = async (req, res) => {
    const report = await this.useCase.income(req.query, req.user);
    res.json({ data: toApi(report) });
  };

  workOrders = async (req, res) => {
    const orders = await this.useCase.workOrders(req.query, req.user);
    res.json({ data: toApi(orders) });
  };

  vehicleHistory = async (req, res) => {
    const history = await this.useCase.vehicleHistory(req.params.id);
    res.json({ data: toApi(history) });
  };
}

module.exports = { ReportController };
