'use strict';

const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

class JwtService {
  sign(user) {
    return jwt.sign({ sub: String(user.id), roles: user.roles, sucursalId: user.sucursalId || null }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  }

  verify(token) {
    return jwt.verify(token, env.jwtSecret);
  }
}

module.exports = { JwtService };
