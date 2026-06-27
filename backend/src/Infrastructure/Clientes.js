const {DataTypes} = require('sequelize');
const sequelize = require('./Database/db');

const Clientes = sequelize.define('Clientes',{
    id_cliente: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNulls: false,
    },
    tipo_cliente: {
        type: DataTypes.STRING(10),
        allowNulls: false,
    },
    tipo_identificacion: {
        type: DataTypes.STRING(15),
        allowNulls: false,

    },
    identificacion: {
        type: DataTypes.STRING(20),
        allowNulls: false,
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNulls: false,
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNulls: true,
    },
    direccion: {
        type: DataTypes.STRING(250),
        allowNulles: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNulls: true,
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNulls: false,
        DefaultValue: true,
    },

},
{
    tableName: 'clientes',
    timestamp: 'true',
    createdAt: 'creado_en',
    updatedAt: false,
})

module.exports = Clientes;