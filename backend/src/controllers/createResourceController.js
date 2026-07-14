'use strict';

const { toApi } = require('../mappers/toApi');

function createResourceController(useCase) {
  return {
    list: async (req, res) => res.json({ data: toApi(await useCase.list(req.query, req.user)) }),
    get: async (req, res) => res.json({ data: toApi(await useCase.get(req.params.id, req.user)) }),
    create: async (req, res) => res.status(201).json({ data: toApi(await useCase.create(req.body, req.user)) }),
    update: async (req, res) => res.json({ data: toApi(await useCase.update(req.params.id, req.body, req.user)) }),
    updateState: async (req, res) => res.json({ data: toApi(await useCase.updateState(req.params.id, req.body.estado, req.user)) }),
  };
}

module.exports = { createResourceController };
