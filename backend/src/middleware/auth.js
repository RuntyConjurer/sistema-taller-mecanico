'use strict';

const { AppError } = require('../errors/AppError');

function createAuthMiddleware(jwtService) {
  return function authenticate(req, res, next) {
    const value = req.get('authorization') || '';
    const [scheme, token] = value.split(' ');
    if (scheme !== 'Bearer' || !token) return next(new AppError(401, 'AUTH_REQUIRED', 'Debes iniciar sesión.'));
    try {
      const payload = jwtService.verify(token);
      req.user = { id: Number(payload.sub), roles: payload.roles || [], sucursalId: payload.sucursalId ? Number(payload.sucursalId) : null };
      return next();
    } catch {
      return next(new AppError(401, 'INVALID_TOKEN', 'La sesión no es válida o expiró.'));
    }
  };
}

function authorize(...allowedRoles) {
  return function permission(req, res, next) {
    if (!req.user.roles.some((role) => allowedRoles.includes(role))) {
      return next(new AppError(403, 'FORBIDDEN', 'Tu rol no permite realizar esta acción.'));
    }
    return next();
  };
}

module.exports = { createAuthMiddleware, authorize };
