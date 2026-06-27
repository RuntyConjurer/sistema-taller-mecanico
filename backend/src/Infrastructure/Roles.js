const {DataTypes} = require('sequelize');
const sequelize = require('./Database/db');

const Roles = sequelize.define('Roles',{
    id_rol: {
        type: DataType.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nombre: {
        type: DataType.BIGINT,
        allowNull: false,
    },
    descripcion: {
        type: DataType.TEXT,
        allowNull: true,
    },
    activo:{
        type: DataType.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    }, 
},
{
    tableName: 'roles',
    timestamp: true,
    createdAt: 'creado_en',
    updatedAt: 'false',
})
