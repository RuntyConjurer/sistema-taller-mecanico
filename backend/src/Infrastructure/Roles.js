const {DataTypes} = require('sequelize');
const sequelize = require('./Database/db');

const Roles = sequelize.define('Roles',{
    id_rol: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    activo:{
        type: DataTypes.BOOLEAN,
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

module.exports = Roles;