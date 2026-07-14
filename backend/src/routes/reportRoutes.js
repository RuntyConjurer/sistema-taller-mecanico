'use strict';

const { asyncHandler } = require('../middleware/asyncHandler');
const { authorize } = require('../middleware/auth');
const { ROLES } = require('../constants/domainStates');
const { ALL } = require('./routeRoles');

function registerReportRoutes(router, reportController) {
  router.get('/vehiculos/:id/historial', authorize(...ALL), asyncHandler(reportController.vehicleHistory));
  router.get('/dashboard', authorize(...ALL), asyncHandler(reportController.dashboard));
  router.get('/reportes/ingresos', authorize(ROLES.ADMINISTRADOR, ROLES.CAJERO), asyncHandler(reportController.income));
  router.get('/reportes/ordenes', authorize(...ALL), asyncHandler(reportController.workOrders));
}

module.exports = { registerReportRoutes };
