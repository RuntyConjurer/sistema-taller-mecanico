'use strict';

const { asyncHandler } = require('../middleware/asyncHandler');
const { authorize } = require('../middleware/auth');

function registerCrudRoutes(router, path, controller, writeRoles, readRoles) {
  router.get(path, authorize(...readRoles), asyncHandler(controller.list));
  router.get(`${path}/:id`, authorize(...readRoles), asyncHandler(controller.get));
  router.post(path, authorize(...writeRoles), asyncHandler(controller.create));
  router.patch(`${path}/:id`, authorize(...writeRoles), asyncHandler(controller.update));
}

module.exports = { registerCrudRoutes };
