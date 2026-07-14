'use strict';

const { asyncHandler } = require('../middleware/asyncHandler');
const { authorize } = require('../middleware/auth');
const { ROLES } = require('../constants/domainStates');
const { ALL } = require('./routeRoles');

function registerWhatsAppRoutes(router, controller) {
  router.get('/whatsapp/estado', authorize(...ALL), asyncHandler(controller.status));
  router.get('/whatsapp/mensajes', authorize(...ALL), asyncHandler(controller.listMessages));
  router.post('/whatsapp/pruebas', authorize(ROLES.ADMINISTRADOR), asyncHandler(controller.sendTest));
}

module.exports = { registerWhatsAppRoutes };
