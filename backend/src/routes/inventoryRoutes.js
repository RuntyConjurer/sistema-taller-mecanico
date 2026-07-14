'use strict';

const { asyncHandler } = require('../middleware/asyncHandler');
const { authorize } = require('../middleware/auth');
const { ROLES } = require('../constants/domainStates');
const { registerCrudRoutes } = require('./registerCrudRoutes');
const { ALL } = require('./routeRoles');

function registerInventoryRoutes(router, container) {
  const { resources, inventoryController } = container;
  registerCrudRoutes(router, '/materiales', resources.materiales.controller, [ROLES.ADMINISTRADOR], ALL);
  router.get('/refrigerantes', asyncHandler(inventoryController.refrigerants));
  router.get('/inventario-movimientos', authorize(...ALL), asyncHandler(resources.movimientos.controller.list));
  router.get('/inventario-movimientos/:id', authorize(...ALL), asyncHandler(resources.movimientos.controller.get));
  router.post('/inventario-movimientos', authorize(ROLES.ADMINISTRADOR), asyncHandler(inventoryController.createMovement));
}

module.exports = { registerInventoryRoutes };
