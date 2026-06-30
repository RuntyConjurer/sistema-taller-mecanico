const {DataTypes} = require ('sequelize');
const sequelize = require('./Database/db');

const Sucursales = sequelize.define('Sucursales', {
    id_sucursal:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true, 
    },
    nombre:{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    direccion:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    telefono:{
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    email:{
        type: DataTypes.STRING(120),
        allowNull: true,
    },
    activa:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
   
        
},
{
    tableName: 'sucursales',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: false,
});

module.exports = Sucursales;