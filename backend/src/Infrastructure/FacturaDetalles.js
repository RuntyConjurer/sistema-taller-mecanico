const {DataTypes} = require('sequelize');
const sequelize = require('./Database/db');


const FacturaDetalles = sequelize.define('FacturaDetalles', {
    id_factura_detalle: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    id_factura: {
        type: DataTypes.BIGINT,
        allowNull: false,
       
    },
    tipo_item: {
        type: DataTypes.STRING(20),
        allowNull: false, 
        validate: {
            isIn: [['SERVICIO', 'MATERIAL', 'REFRIGERANTE']]
        }
    },
    descripcion: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    cantidad: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
    },
    precio_unitario:{
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
    },
    subtotal: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: true,
    },
},
{
    tableName: 'factura_detalles',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: false,
});

module.exports = FacturaDetalles;