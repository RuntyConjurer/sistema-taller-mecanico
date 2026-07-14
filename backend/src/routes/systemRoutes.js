'use strict';

const { asyncHandler } = require('../middleware/asyncHandler');

function registerSystemRoutes(router, container) {
  router.get('/health', (req, res) => res.json({ data: { status: 'ok', service: 'sgtra-api' } }));
  router.get('/ready', asyncHandler(async (req, res) => {
    await container.models.sequelize.authenticate();
    res.json({ data: { status: 'ready', database: 'connected' } });
  }));
  router.post('/sesiones', asyncHandler(container.authController.login));
}

module.exports = { registerSystemRoutes };
