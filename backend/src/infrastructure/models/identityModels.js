'use strict';

const { DataTypes, modelOptions, id, fk } = require('./modelHelpers');

function defineIdentityModels(sequelize) {
  const Rol = sequelize.define('Rol', {
    id: id('id_rol'), nombre: { type: DataTypes.STRING(50), allowNull: false }, descripcion: DataTypes.TEXT, activo: DataTypes.BOOLEAN,
  }, modelOptions(sequelize, 'roles'));

  const Usuario = sequelize.define('Usuario', {
    id: id('id_usuario'), sucursalId: fk('id_sucursal'), tipoIdentificacion: { type: DataTypes.STRING(15), field: 'tipo_identificacion' },
    identificacion: DataTypes.STRING(20), nombre: DataTypes.STRING(120), email: DataTypes.STRING(120),
    passwordHash: { type: DataTypes.TEXT, field: 'password_hash' }, telefono: DataTypes.STRING(20), activo: DataTypes.BOOLEAN,
    creadoEn: { type: DataTypes.DATE, field: 'creado_en' },
  }, modelOptions(sequelize, 'usuarios'));

  const UsuarioRol = sequelize.define('UsuarioRol', {
    usuarioId: { ...fk('id_usuario', false), primaryKey: true }, rolId: { ...fk('id_rol', false), primaryKey: true },
  }, modelOptions(sequelize, 'usuario_roles'));

  const Cliente = sequelize.define('Cliente', {
    id: id('id_cliente'), tipoCliente: { type: DataTypes.STRING(10), field: 'tipo_cliente' },
    tipoIdentificacion: { type: DataTypes.STRING(15), field: 'tipo_identificacion' }, identificacion: DataTypes.STRING(20),
    nombre: DataTypes.STRING(150), telefono: DataTypes.STRING(20), direccion: DataTypes.STRING(250), email: DataTypes.STRING(100),
    activo: DataTypes.BOOLEAN,
    whatsappOptIn: { type: DataTypes.BOOLEAN, field: 'whatsapp_opt_in' },
    whatsappOptInAt: { type: DataTypes.DATE, field: 'whatsapp_opt_in_en' },
    whatsappOptInSource: { type: DataTypes.STRING(40), field: 'whatsapp_opt_in_fuente' },
    creadoEn: { type: DataTypes.DATE, field: 'creado_en' },
  }, modelOptions(sequelize, 'clientes'));

  const Vehiculo = sequelize.define('Vehiculo', {
    id: id('id_vehiculo'), clienteId: fk('id_cliente', false), chasis: DataTypes.STRING(50), marca: DataTypes.STRING(80),
    modelo: DataTypes.STRING(80), placa: DataTypes.STRING(20), color: DataTypes.STRING(50), anio: DataTypes.SMALLINT,
    tipoRefrigerante: { type: DataTypes.STRING(60), field: 'tipo_refrigerante' }, activo: DataTypes.BOOLEAN,
    creadoEn: { type: DataTypes.DATE, field: 'creado_en' },
  }, modelOptions(sequelize, 'vehiculos'));

  return { Rol, Usuario, UsuarioRol, Cliente, Vehiculo };
}

module.exports = { defineIdentityModels };
