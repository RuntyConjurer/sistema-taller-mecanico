'use strict';

const { toApi } = require('../mappers/toApi');

class InventoryController {
  constructor(useCase) {
    this.useCase = useCase;
  }

  refrigerants = async (req, res) => {
    const refrigerants = await this.useCase.listRefrigerants();
    res.json({ data: toApi(refrigerants) });
  };

  createMovement = async (req, res) => {
    const movement = await this.useCase.createMovement(req.body, req.user);
    res.status(201).json({ data: toApi(movement) });
  };
}

module.exports = { InventoryController };
