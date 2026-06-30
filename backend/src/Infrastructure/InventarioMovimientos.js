const {DataTypes} = require('sequelize');
const sequelize = require('./Database/db');
const Refrigerantes = require('./Refrigerantes');
const Materiales = require('./Materiales');
const Usuarios = require('./Usuarios');

const InventarioMovimientos = sequelize.define('InventarioMovimientos', {
    id_movimiento: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    id_material: {
        type: DataTypes.BIGINT,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    id_refrigerante: {
        type: DataTypes.BIGINT,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    tipoMovimiento: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    cantidad: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
    },
    costo_unitario: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: true,
    },
    motivo: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    id_usuario: {
        type: DataTypes.BIGINT,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    fecha_movimiento: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
},
{
    tableName: 'inventario_movimientos',
    timestamps: false,

    validate: {
        soloUno() {
            if(
                (this.id_material && this.id_refrigerante) ||
                (!this.id_material && !this.id_refrigerante)
            ) {
                throw new Error('Debe ser material o refrigerante(solo uno)');
            }
        }
    }
});

module.exports = InventarioMovimientos;