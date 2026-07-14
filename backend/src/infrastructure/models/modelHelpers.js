'use strict';

const { DataTypes } = require('sequelize');

function modelOptions(sequelize, tableName) {
  return { sequelize, tableName, timestamps: false };
}

function id(field) {
  return { type: DataTypes.BIGINT, field, primaryKey: true, autoIncrement: true };
}

function fk(field, allowNull = true) {
  return { type: DataTypes.BIGINT, field, allowNull };
}

function money(field, allowNull = false) {
  return { type: DataTypes.DECIMAL(14, 2), field, allowNull };
}

module.exports = { DataTypes, modelOptions, id, fk, money };
