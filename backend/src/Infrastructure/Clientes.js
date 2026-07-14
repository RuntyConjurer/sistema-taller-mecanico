const {DataTypes} = require('sequelize');
const sequelize = require('./Database/db');

const Clientes = sequelize.define('Clientes',{
    id_cliente: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    tipo_cliente: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    tipo_identificacion: {
        type: DataTypes.STRING(15),
        allowNull: false,

    },
    identificacion: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    direccion: {
        type: DataTypes.STRING(250),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },

},
{
    tableName: 'clientes',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: false,
})

module.exports = Clientes;