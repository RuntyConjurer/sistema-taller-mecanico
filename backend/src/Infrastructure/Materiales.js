const {DataTypes} = require('sequelize');
const sequelize = require('./Database/db');

const Materiales = sequelize.define('Materiales', {
    id_material: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    unidad_medida: {
        type: DataTypes.STRING(30),
        allowNull: false,
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
    tableName: 'materiales',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: false,
});

module.exports = Materiales;