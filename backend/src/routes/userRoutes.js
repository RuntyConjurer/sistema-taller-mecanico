'use strict';

const { ROLES } = require('../constants/domainStates');
const { registerCrudRoutes } = require('./registerCrudRoutes');

function registerUserRoutes(router, resources) {
  registerCrudRoutes(
    router,
    '/usuarios',
    resources.usuarios.controller,
    [ROLES.ADMINISTRADOR],
    [ROLES.ADMINISTRADOR],
  );
}

module.exports = { registerUserRoutes };
