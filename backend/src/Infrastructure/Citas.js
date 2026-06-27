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
        references: {
            model: Cientes,
            key: 'id_cliente',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    id_vehiculo: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references:{
            model: Vehiculos,
            key: 'id_vehiculo',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    id_sucursal: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Sucursales,
            key: 'id_sucursal',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    fecha_cita:{
        type: DataTypes.Date,
        allowNull: false,
    },
    estado:{
        type: DataTypes.STRING(20),
        allowNull: false,
        deafaultValue: 'PROGRAMADA',
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
    timestamp: true,
    createdAt: 'creado_en',
    updatedAt: false,    
})

module.exports = Citas;