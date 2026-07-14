'use strict';

const { asyncHandler } = require('../middleware/asyncHandler');
const { authorize } = require('../middleware/auth');
const { registerCrudRoutes } = require('./registerCrudRoutes');
const { RECEPTION, ALL } = require('./routeRoles');

function registerCustomerRoutes(router, container) {
  registerCrudRoutes(router, '/clientes', container.resources.clientes.controller, RECEPTION, ALL);
  router.patch(
    '/clientes/:id/consentimiento-whatsapp',
    authorize(...RECEPTION),
    asyncHandler(container.whatsappController.setConsent),
  );
  registerCrudRoutes(router, '/vehiculos', container.resources.vehiculos.controller, RECEPTION, ALL);
}

module.exports = { registerCustomerRoutes };
