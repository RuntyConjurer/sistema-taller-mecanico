'use strict';

const { asyncHandler } = require('../middleware/asyncHandler');
const { authorize } = require('../middleware/auth');
const { ROLES } = require('../constants/domainStates');
const { registerCrudRoutes } = require('./registerCrudRoutes');
const { RECEPTION, TECHNICAL, ALL } = require('./routeRoles');

function registerWorkOrderRoutes(router, container) {
  const { resources, workOrderController } = container;
  registerCrudRoutes(router, '/ordenes-trabajo', resources.ordenes.controller, [...RECEPTION, ROLES.TECNICO], ALL);
  router.patch('/ordenes-trabajo/:id/estado', authorize(...TECHNICAL), asyncHandler(resources.ordenes.controller.updateState));
  router.put('/ordenes-trabajo/:id/diagnostico', authorize(...TECHNICAL), asyncHandler(workOrderController.diagnose));
  router.post('/ordenes-trabajo/:id/materiales', authorize(...TECHNICAL), asyncHandler(workOrderController.consumeMaterial));
  router.post('/ordenes-trabajo/:id/servicios', authorize(...TECHNICAL), asyncHandler(workOrderController.addService));
  router.post('/ordenes-trabajo/:id/cerrar', authorize(...TECHNICAL), asyncHandler(workOrderController.close));
}

module.exports = { registerWorkOrderRoutes };
