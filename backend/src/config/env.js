'use strict';

require('dotenv').config();

function required(name, fallback) {
  const value = process.env[name] || fallback;
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
}

const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  databaseUrl: required('DATABASE_URL', 'postgres://postgres:postgres@localhost:5432/sgtra'),
  jwtSecret: required('JWT_SECRET', 'solo-desarrollo-cambiar-esta-clave'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  databaseSsl: process.env.DATABASE_SSL === 'true',
  corsOrigins: (process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173')).split(',').map((value) => value.trim()).filter(Boolean),
});

module.exports = { env };
