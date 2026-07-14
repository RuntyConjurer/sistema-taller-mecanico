'use strict';

const { asyncHandler } = require('../middleware/asyncHandler');
const { authorize } = require('../middleware/auth');
const { registerCrudRoutes } = require('./registerCrudRoutes');
const { RECEPTION, ALL } = require('./routeRoles');

function registerAppointmentRoutes(router, container) {
  const { resources, appointmentController, workOrderController, whatsappController } = container;

  registerCrudRoutes(router, '/citas', resources.citas.controller, RECEPTION, ALL);
  router.patch('/citas/:id/estado', authorize(...RECEPTION), asyncHandler(appointmentController.updateState));
  router.post('/citas/:id/orden', authorize(...RECEPTION), asyncHandler(appointmentController.convertToOrder));
  router.post('/citas/:id/notificaciones/whatsapp', authorize(...RECEPTION), asyncHandler(whatsappController.sendAppointment));

  registerCrudRoutes(router, '/cotizaciones', resources.cotizaciones.controller, RECEPTION, ALL);
  router.patch('/cotizaciones/:id/estado', authorize(...RECEPTION), asyncHandler(resources.cotizaciones.controller.updateState));
  router.post('/cotizaciones/:id/orden', authorize(...RECEPTION), asyncHandler(workOrderController.convertQuote));
}

module.exports = { registerAppointmentRoutes };
