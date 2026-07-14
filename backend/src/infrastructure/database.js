'use strict';

const { Sequelize } = require('sequelize');
const { env } = require('../config/env');

const sequelize = new Sequelize(env.databaseUrl, {
  dialect: 'postgres',
  logging: env.nodeEnv === 'development' && process.env.SQL_LOG === 'true' ? console.log : false,
  dialectOptions: env.databaseSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  define: { timestamps: false, freezeTableName: true },
});

module.exports = { sequelize };
