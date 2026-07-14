'use strict';

const { Router } = require('express');
const { createAuthMiddleware } = require('../middleware/auth');
const { registerSystemRoutes } = require('./systemRoutes');
const { registerPublicRoutes } = require('./publicRoutes');
const { registerCatalogRoutes } = require('./catalogRoutes');
const { registerCustomerRoutes } = require('./customerRoutes');
const { registerAppointmentRoutes } = require('./appointmentRoutes');
const { registerWorkOrderRoutes } = require('./workOrderRoutes');
const { registerInventoryRoutes } = require('./inventoryRoutes');
const { registerBillingRoutes } = require('./billingRoutes');
const { registerUserRoutes } = require('./userRoutes');
const { registerReportRoutes } = require('./reportRoutes');
const { registerWhatsAppRoutes } = require('./whatsappRoutes');

function createApiRouter(container) {
  const router = Router();

  registerSystemRoutes(router, container);
  registerPublicRoutes(router, container);

  router.use(createAuthMiddleware(container.jwtService));
  registerWhatsAppRoutes(router, container.whatsappController);
  registerCatalogRoutes(router, container.resources);
  registerCustomerRoutes(router, container);
  registerAppointmentRoutes(router, container);
  registerWorkOrderRoutes(router, container);
  registerInventoryRoutes(router, container);
  registerBillingRoutes(router, container);
  registerUserRoutes(router, container.resources);
  registerReportRoutes(router, container.reportController);

  return router;
}

module.exports = { createApiRouter };
