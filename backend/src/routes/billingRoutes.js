'use strict';

const { asyncHandler } = require('../middleware/asyncHandler');
const { authorize } = require('../middleware/auth');
const { BILLING } = require('./routeRoles');

function registerBillingRoutes(router, container) {
  const { resources, billingController } = container;
  router.get('/facturas', authorize(...BILLING), asyncHandler(billingController.list));
  router.get('/facturas/:id', authorize(...BILLING), asyncHandler(billingController.get));
  router.post('/facturas', authorize(...BILLING), asyncHandler(billingController.create));
  router.post('/facturas/:id/pagos', authorize(...BILLING), asyncHandler(billingController.pay));
  router.patch('/facturas/:id/anular', authorize(...BILLING), asyncHandler(billingController.cancel));
  router.get('/pagos', authorize(...BILLING), asyncHandler(resources.pagos.controller.list));
  router.get('/pagos/:id', authorize(...BILLING), asyncHandler(resources.pagos.controller.get));
}

module.exports = { registerBillingRoutes };
