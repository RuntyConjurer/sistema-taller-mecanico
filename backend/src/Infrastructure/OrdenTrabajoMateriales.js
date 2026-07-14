const {DataTypes} = require('sequelize');
const sequelize = require('./Database/db');


const OrdenTrabajoMateriales = sequelize.define('OrdenTrabajoMateriales', {
    id_ot_material: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    id_ot: {
        type: DataTypes.BIGINT,
        allowNull: false,

     onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    },
    id_material:{
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    id_refrigerante: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    cantidad: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
    },
     subtotal: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: true,
    },
    
},
{
    tableName: 'orden_trabajo_materiales',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: false,
});

module.exports = OrdenTrabajoMateriales;