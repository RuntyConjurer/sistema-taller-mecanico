const { DataTypes } = require('sequelize');
const sequelize = require('./Database/db');

const Usuarios = sequelize.define('Usuarios', {
    id_usuario: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    id_sucursal: { type: DataTypes.BIGINT, allowNull: true },
    tipo_identificacion: { type: DataTypes.STRING(15), allowNull: false },
    identificacion: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    nombre: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    password_hash: { type: DataTypes.TEXT, allowNull: false },
    telefono: { type: DataTypes.STRING(20), allowNull: true },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    tableName: 'usuarios',
    timestamps: false // Porque usas 'creado_en' en la BD
});

module.exports = Usuarios;