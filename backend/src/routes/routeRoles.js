'use strict';

const { ROLES } = require('../constants/domainStates');

const ALL = Object.values(ROLES);
const RECEPTION = [ROLES.ADMINISTRADOR, ROLES.RECEPCIONISTA];
const TECHNICAL = [ROLES.ADMINISTRADOR, ROLES.TECNICO];
const BILLING = [ROLES.ADMINISTRADOR, ROLES.CAJERO];

module.exports = { ALL, RECEPTION, TECHNICAL, BILLING };
