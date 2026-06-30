const {DataTypes} = require('sequelize');
const sequelize = require('./Database/db');


const Facturas = sequelize.define('Facturas', {
    id_factura: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    id_ot: {
        type: DataTypes.BIGINT,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    numero_factura:{
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    subtotal: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
        defaultValue: 0,
    },
    impuesto: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
        defaultValue: 0,
    },
    descuento: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
        defaultValue: 0,
    },
    total: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,

    },
    estado:{
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'PENDIENTE',
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    creado_por: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },

},
{
    tableName: 'facturas',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: false,
});

module.exports = Facturas;