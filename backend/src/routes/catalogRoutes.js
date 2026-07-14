'use strict';

const { asyncHandler } = require('../middleware/asyncHandler');
const { authorize } = require('../middleware/auth');
const { ROLES } = require('../constants/domainStates');

function registerCatalogRoutes(router, resources) {
  router.post('/sucursales', authorize(ROLES.ADMINISTRADOR), asyncHandler(resources.sucursales.controller.create));
  router.patch('/sucursales/:id', authorize(ROLES.ADMINISTRADOR), asyncHandler(resources.sucursales.controller.update));
  router.post('/servicios', authorize(ROLES.ADMINISTRADOR), asyncHandler(resources.servicios.controller.create));
  router.patch('/servicios/:id', authorize(ROLES.ADMINISTRADOR), asyncHandler(resources.servicios.controller.update));
}

module.exports = { registerCatalogRoutes };
