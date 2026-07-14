'use strict';

const { toApi } = require('../mappers/toApi');

class AppointmentController {
  constructor(useCase) {
    this.useCase = useCase;
  }

  request = async (req, res) => {
    const booking = await this.useCase.request(req.body);
    res.status(201).json({ data: toApi(booking) });
  };

  updateState = async (req, res) => {
    const appointment = await this.useCase.updateState(req.params.id, req.body, req.user);
    res.json({ data: toApi(appointment) });
  };

  convertToOrder = async (req, res) => {
    const order = await this.useCase.convertToOrder(req.params.id, req.body, req.user);
    res.status(201).json({ data: toApi(order) });
  };
}

module.exports = { AppointmentController };
