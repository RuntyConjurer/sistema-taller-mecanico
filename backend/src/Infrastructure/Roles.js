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
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
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
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: false,
})

module.exports = Roles;