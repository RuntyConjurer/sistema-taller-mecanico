const {DataTypes} = require('sequelize');
const sequelize = require('./Database/db');

const Servicios = sequelize.define('Servicios', {
    id_servicio: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    precio_base:{
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
        defaultValue: 0,
    },
    activo:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },

    
},
{
    tableName: 'servicios',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: false,
},
);

module.exports = Servicios