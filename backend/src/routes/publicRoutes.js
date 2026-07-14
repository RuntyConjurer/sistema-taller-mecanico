'use strict';

const { asyncHandler } = require('../middleware/asyncHandler');

function registerPublicRoutes(router, container) {
  const { resources, appointmentController, whatsappController } = container;
  router.get('/servicios', asyncHandler(resources.servicios.controller.list));
  router.get('/servicios/:id', asyncHandler(resources.servicios.controller.get));
  router.get('/sucursales', asyncHandler(resources.sucursales.controller.list));
  router.post('/solicitudes-cita', asyncHandler(appointmentController.request));
  router.get('/webhooks/whatsapp', asyncHandler(whatsappController.verifyWebhook));
  router.post('/webhooks/whatsapp', asyncHandler(whatsappController.receiveWebhook));
}

module.exports = { registerPublicRoutes };
