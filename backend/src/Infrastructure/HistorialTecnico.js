const {DataTypes} = require('sequelize');
const sequelize = require('./Database/db');


const HistorialTecnico = sequelize.define('HistorialTecnico', {
    id_historial: {
        type: DataTypes.BIGINT, 
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    id_ot: {
        type: DataTypes.BIGINT,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    id_vehiculo: {
        type: DataTypes.BIGINT,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    recomendaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    registrado_por: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },

},
{
    tableName: 'historial_tecnico',
    timestamps: false,
});
module.exports = HistorialTecnico;