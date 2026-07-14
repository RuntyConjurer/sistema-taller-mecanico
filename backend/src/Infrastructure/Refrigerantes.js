const {DataTypes} = require('sequelize');
const sequelize = require('./Database/db');

const Refrigerantes = sequelize.define('Refrigerantes', {
    id_refrigerante: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    unidad_medida: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'GRAMOS',
    },
    stock_actual: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
        defaultValue: 0,
    },
     stock_minimo: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
        defaultValue: 0,
    },
     costo_unitario: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
        defaultValue: 0,
    },
     precio_venta: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
        defaultValue: 0,
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
},
{
    tableName: 'refrigerantes',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: false,
});

module.exports = Refrigerantes;