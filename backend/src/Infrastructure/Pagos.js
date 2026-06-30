const {DataTypes} = require('sequelize');
const sequelize = require('./Database/db');


const Pagos = sequelize.define('Pagos', {
    id_pago: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    id_factura: {
        type: DataTypes.BIGINT,
        allowNull: false,
        onDelete: 'CASCADE',
    },
    monto: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
    },
    forma_pago: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    referencia: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    recibido_por: {
        type: DataTypes.BIGINT,
        allowNull:true,
    },
    fecha_pago: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
},
{
    tableName: 'pagos',
    timestamps: false,
});
module.exports = Pagos;
