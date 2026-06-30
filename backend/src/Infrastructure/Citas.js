const {DataTypes} = require('sequelize');
const sequelize = require('./Database/db');


const Citas = sequelize.define('Citas', {
    id_cita: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    id_cliente: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    id_vehiculo: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    id_sucursal: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    fecha_cita:{
        type: DataTypes.Date,
        allowNull: false,
    },
    estado:{
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'PROGRAMADA',
    },
    motivo: {
        type: DataTypes.STRING(250),
        allowNull: true,
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

},
{
    tableName: 'citas',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: false,    
})

module.exports = Citas;