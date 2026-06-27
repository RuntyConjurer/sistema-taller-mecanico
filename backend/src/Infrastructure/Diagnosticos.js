const{DataTypes} = requiere('sequelize');
const sequelize = require('./Database/db');

const Diagnosticos = sequelize.define('Diagnosticos', {
    id_diagnostico: {
        type: DataTypes.BIGSERIAL,
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
        onUpdate:'CASCADE',
        onDelete: 'CASCADE',
    },
    presion_baja: {
        type: DataTypes.NUMERIC(6,2),
        allowNull: true,
    },
    presion_alta: {
        type: DataTypes.NUMERIC(6,2),
        allowNull: true,
    },
    temperatura: {
        type: DataTypes.NUMERIC(5,2),
        allowNull: true,
    },
    falla_detectada: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    creado_por: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    fecha_diagnostico: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },

},
{
    tableName: 'diagnosticos',
    timestamp: false,
})

module.exports = Diagnosticos;