const {DataTypes} = require('sequelize');
const sequelize = require('./Database/db');


const OrdenesTrabajo = seqelize.define('OrdenesTrabajo', {
    id_ot:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    id_vehiculo: {
        type: DataTypes.BIGINT,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },

    id_usuario: {
        type: DataTypes.BIGINT,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    id_sucursal: {
        type: DataTypes.BIGINT,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    id_cita: {
        type: DataTypes.BIGINT,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },

    estado: {
        type:DataTypes.STRING(20),
        allowNull:false,
        defaultValue: 'ABIERTA',
    },
    descripcion_problema: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    fecha_apertura: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    fecha_cierre: {
        type: DataTypes.DATE,
        allowNull: true,
    },


},
{
    tableName: 'ordenes_trabajo',
    timestamps: false,
})

module.exports = OrdenesTrabajo;    