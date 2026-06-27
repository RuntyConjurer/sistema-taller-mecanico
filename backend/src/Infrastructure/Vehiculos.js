const {DataTypes} = require('sequelize');
const sequelize = require('./Database/db');

const Vehiculos = sequelize.define('Vehiculos',{
    id_vehiculo: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNulls: false,
    },
    id_cliente:{
        type: DataTypes.BIGINT,
        allowNull: false,
        references:{
            model: Clientes,
            key: 'id_cliente',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    chasis:{
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    marca: {
        type: DataTypes.STRING(80),
        allowNull: false,
    },
    modelo: {
        type: DataTypes.STRING(80),
        allowNull: false,
    },
    placa: {
        type: DataTypes.STIRNG(20),
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    anio: {
        type: DataTypes.SMAILLINT,
        allowNull: true,
    },
    tipo_refrigerante: {
        type: DataTypes.STRING(60),
        allowNull: true,
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },


},
{
    tableName: 'vehiculos',
    timestamp: true,
    createdAt: 'creado_en',
    updatedAt: false,
})

module.exports = Vehiculos;