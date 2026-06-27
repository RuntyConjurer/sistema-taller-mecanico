const {DataTypes} = requier('sequelize');
const sequelize = require('./Database/db');

const OrdenTrabajoServicios = sequelize.define('OrdenTrabajoServicios', {
    id_ot_servicio: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    id_ot: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: OrdenesTrabajo,
            key: 'id_ot',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    id_servicio: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Servicios,
            key: 'id_servicio',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    contidad: {
        type: DataType.DECIMAL(8,2),
        allowNull: false,
        defaultValue: 1,
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
    },
    subtotal: {
        type: DataTypes.DECIMAL(14,2),
        allowNull: true,
    },


},
{
    tableName: 'orden_trabajo_servicios',
    timestamp: true,
    createdAt: 'creado_en',
    updatedAt: false,
});

module.exports = OrdenTrabajoServicios;