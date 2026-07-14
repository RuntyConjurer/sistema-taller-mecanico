'use strict';

require('dotenv').config();

function required(name, fallback) {
  const value = process.env[name] || fallback;
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
}

function whatsappTemplates(value) {
  return String(value || 'hello_world:en_US')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  databaseUrl: required('DATABASE_URL', 'postgres://postgres:postgres@localhost:5432/sgtra'),
  jwtSecret: required('JWT_SECRET', 'solo-desarrollo-cambiar-esta-clave'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  databaseSsl: process.env.DATABASE_SSL === 'true',
  corsOrigins: (process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173')).split(',').map((value) => value.trim()).filter(Boolean),
  whatsapp: Object.freeze({
    enabled: process.env.WHATSAPP_ENABLED === 'true',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    appId: process.env.WHATSAPP_APP_ID || '',
    appSecret: process.env.WHATSAPP_APP_SECRET || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    wabaId: process.env.WHATSAPP_WABA_ID || '',
    businessNumber: process.env.WHATSAPP_BUSINESS_NUMBER || '',
    testRecipient: process.env.WHATSAPP_TEST_RECIPIENT || '',
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || '',
    graphVersion: process.env.WHATSAPP_GRAPH_VERSION || 'v23.0',
    defaultTemplate: process.env.WHATSAPP_TEMPLATE_NAME || 'hello_world',
    defaultLanguage: process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en_US',
    allowedTemplates: whatsappTemplates(process.env.WHATSAPP_ALLOWED_TEMPLATES),
    timeoutMs: Number(process.env.WHATSAPP_TIMEOUT_MS || 8000),
  }),
});

module.exports = { env };
