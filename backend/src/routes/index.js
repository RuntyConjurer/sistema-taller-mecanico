'use strict';

const { Router } = require('express');
const { asyncHandler } = require('../middleware/asyncHandler');
const { createAuthMiddleware, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants/domainStates');
const { toApi } = require('../mappers/toApi');

const ALL = Object.values(ROLES);
const RECEPTION = [ROLES.ADMINISTRADOR, ROLES.RECEPCIONISTA];
const TECHNICAL = [ROLES.ADMINISTRADOR, ROLES.TECNICO];
const BILLING = [ROLES.ADMINISTRADOR, ROLES.CAJERO];

function createApiRouter(container) {
  const router = Router();
  const auth = createAuthMiddleware(container.jwtService);
  const { resources, workshopController: workshop, authController } = container;

  router.get('/health', (req, res) => res.json({ data: { status: 'ok', service: 'sgtra-api' } }));
  router.get('/ready', asyncHandler(async (req, res) => {
    await container.models.sequelize.authenticate();
    res.json({ data: { status: 'ready', database: 'connected' } });
  }));
  router.post('/sesiones', asyncHandler(authController.login));
  router.get('/servicios', asyncHandler(resources.servicios.controller.list));
  router.get('/servicios/:id', asyncHandler(resources.servicios.controller.get));
  router.get('/sucursales', asyncHandler(resources.sucursales.controller.list));
  router.post('/solicitudes-cita', asyncHandler(workshop.booking));

  router.use(auth);
  router.post('/sucursales', authorize(ROLES.ADMINISTRADOR), asyncHandler(resources.sucursales.controller.create));
  router.patch('/sucursales/:id', authorize(ROLES.ADMINISTRADOR), asyncHandler(resources.sucursales.controller.update));
  router.post('/servicios', authorize(ROLES.ADMINISTRADOR), asyncHandler(resources.servicios.controller.create));
  router.patch('/servicios/:id', authorize(ROLES.ADMINISTRADOR), asyncHandler(resources.servicios.controller.update));
  mountCrud(router, '/clientes', resources.clientes.controller, RECEPTION, ALL);
  mountCrud(router, '/vehiculos', resources.vehiculos.controller, RECEPTION, ALL);
  mountCrud(router, '/citas', resources.citas.controller, RECEPTION, ALL);
  router.patch('/citas/:id/estado', authorize(...RECEPTION), asyncHandler(workshop.appointmentState));
  router.post('/citas/:id/orden', authorize(...RECEPTION), asyncHandler(workshop.appointmentOrder));

  mountCrud(router, '/cotizaciones', resources.cotizaciones.controller, RECEPTION, ALL);
  router.patch('/cotizaciones/:id/estado', authorize(...RECEPTION), asyncHandler(resources.cotizaciones.controller.updateState));
  router.post('/cotizaciones/:id/orden', authorize(...RECEPTION), asyncHandler(workshop.quoteOrder));

  mountCrud(router, '/ordenes-trabajo', resources.ordenes.controller, [...RECEPTION, ROLES.TECNICO], ALL);
  router.patch('/ordenes-trabajo/:id/estado', authorize(...TECHNICAL), asyncHandler(resources.ordenes.controller.updateState));
  router.put('/ordenes-trabajo/:id/diagnostico', authorize(...TECHNICAL), asyncHandler(workshop.diagnosis));
  router.post('/ordenes-trabajo/:id/materiales', authorize(...TECHNICAL), asyncHandler(workshop.material));
  router.post('/ordenes-trabajo/:id/servicios', authorize(...TECHNICAL), asyncHandler(workshop.service));
  router.post('/ordenes-trabajo/:id/cerrar', authorize(...TECHNICAL), asyncHandler(workshop.close));

  mountCrud(router, '/materiales', resources.materiales.controller, [ROLES.ADMINISTRADOR], ALL);
  router.get('/refrigerantes', asyncHandler(async (req, res) => {
    const rows = await resources.materiales.repository.list({ where: { categoria: 'REFRIGERANTE', activo: true } });
    res.json({ data: toApi(rows) });
  }));
  router.get('/inventario-movimientos', authorize(...ALL), asyncHandler(resources.movimientos.controller.list));
  router.get('/inventario-movimientos/:id', authorize(...ALL), asyncHandler(resources.movimientos.controller.get));
  router.post('/inventario-movimientos', authorize(ROLES.ADMINISTRADOR), asyncHandler(workshop.inventoryMovement));

  router.get('/facturas', authorize(...BILLING), asyncHandler(workshop.invoices));
  router.get('/facturas/:id', authorize(...BILLING), asyncHandler(workshop.invoiceById));
  router.post('/facturas', authorize(...BILLING), asyncHandler(workshop.invoice));
  router.post('/facturas/:id/pagos', authorize(...BILLING), asyncHandler(workshop.payment));
  router.patch('/facturas/:id/anular', authorize(...BILLING), asyncHandler(workshop.cancelInvoice));
  router.get('/pagos', authorize(...BILLING), asyncHandler(resources.pagos.controller.list));
  router.get('/pagos/:id', authorize(...BILLING), asyncHandler(resources.pagos.controller.get));

  mountCrud(router, '/usuarios', resources.usuarios.controller, [ROLES.ADMINISTRADOR], [ROLES.ADMINISTRADOR]);
  router.get('/vehiculos/:id/historial', authorize(...ALL), asyncHandler(async (req, res) => {
    const rows = await resources.historial.repository.list({ where: { vehiculoId: req.params.id }, order: [['fechaRegistro', 'DESC']] });
    res.json({ data: toApi(rows) });
  }));
  router.get('/dashboard', authorize(...ALL), asyncHandler(workshop.dashboard));
  router.get('/reportes/ingresos', authorize(ROLES.ADMINISTRADOR, ROLES.CAJERO), asyncHandler(workshop.incomeReport));
  router.get('/reportes/ordenes', authorize(...ALL), asyncHandler(async (req, res) => {
    const rows = await resources.ordenes.repository.list({ user: req.user, limit: req.query.limit || 250 });
    res.json({ data: toApi(rows) });
  }));

  return router;
}

function mountCrud(router, path, controller, writeRoles, readRoles) {
  router.get(path, authorize(...readRoles), asyncHandler(controller.list));
  router.get(`${path}/:id`, authorize(...readRoles), asyncHandler(controller.get));
  router.post(path, authorize(...writeRoles), asyncHandler(controller.create));
  router.patch(`${path}/:id`, authorize(...writeRoles), asyncHandler(controller.update));
}

module.exports = { createApiRouter };
