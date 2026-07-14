'use strict';

const { createApp } = require('./src/app');
const { env } = require('./src/config/env');
const { sequelize } = require('./src/infrastructure/database');

async function start() {
  await sequelize.authenticate();
  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`SGTRA API disponible en el puerto ${env.port}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal}: cerrando conexiones`);
    server.close(async () => {
      await sequelize.close();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch((error) => {
  console.error('No fue posible iniciar SGTRA API:', error.message);
  process.exit(1);
});
