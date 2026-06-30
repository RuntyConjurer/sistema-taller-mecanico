const {DataTypes} = require('sequelize');
const sequelize = require('./Database/db');


const UsuarioRoles = sequelize.define('UsuarioRoles', {
    id_usuario: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        onDelete: 'CASCADE',
    },

    id_rol: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        onDelete: 'CASCADE',
    },
    
},
{
    tableName: 'usuario_roles',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: false,
});
module.exports = UsuarioRoles;