'use strict';

const express = require('express');
const cors = require('cors');
const { buildContainer } = require('./di/container');
const { createApiRouter } = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { env } = require('./config/env');

function createApp(options = {}) {
  const app = express();
  const container = options.container || buildContainer();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(cors({
    credentials: false,
    origin(origin, callback) {
      if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
  }));
  app.use(express.json({
    limit: '1mb',
    verify(req, res, buffer) {
      // Meta firma los bytes originales; JSON.parse no puede reconstruirlos exactamente.
      if (req.originalUrl.startsWith('/api/v1/webhooks/whatsapp')) req.rawBody = Buffer.from(buffer);
    },
  }));
  app.use('/api/v1', createApiRouter(container));
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
