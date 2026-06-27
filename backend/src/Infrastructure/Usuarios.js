const {DataTypes} = require ('sequelize');
const sequelize = require('./Database/db');

const Usuarios = sequelize.define ('Usuarios',{
     id_usuario:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    id_sucursal:{
        type: DataTypes.BIGINT,
        allowNull: false,
        references:{
            model: Sucursales,
            key: 'id_sucursal',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    
},
{
   tableName: 'usuarios',
   timestamp: false, 
});

module.exports = Usuarios;
   
    

