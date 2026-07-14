'use strict';

const { AppError } = require('../errors/AppError');

function assertWorkOrderAccess(order, user) {
  if (!order) throw new AppError(404, 'WORK_ORDER_NOT_FOUND', 'No se encontró la orden de trabajo.');
  if (!user.roles.includes('ADMINISTRADOR') && Number(order.sucursalId) !== Number(user.sucursalId)) {
    throw new AppError(403, 'BRANCH_FORBIDDEN', 'La orden pertenece a otra sucursal.');
  }
}

function resolveBranchId(user, requestedBranchId) {
  if (!user.roles.includes('ADMINISTRADOR')) return user.sucursalId;
  return requestedBranchId ? Number(requestedBranchId) : null;
}

module.exports = { assertWorkOrderAccess, resolveBranchId };
