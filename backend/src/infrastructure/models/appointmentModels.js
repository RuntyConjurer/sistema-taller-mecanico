'use strict';

const { DataTypes, modelOptions, id, fk } = require('./modelHelpers');

function defineAppointmentModels(sequelize) {
  const Cita = sequelize.define('Cita', {
    id: id('id_cita'), clienteId: fk('id_cliente', false), vehiculoId: fk('id_vehiculo', false), sucursalId: fk('id_sucursal'),
    servicioId: fk('id_servicio'), fechaCita: { type: DataTypes.DATE, field: 'fecha_cita' }, estado: DataTypes.STRING(20),
    motivo: DataTypes.STRING(250), observaciones: DataTypes.TEXT, creadoEn: { type: DataTypes.DATE, field: 'creado_en' },
  }, modelOptions(sequelize, 'citas'));

  return { Cita };
}

module.exports = { defineAppointmentModels };
