const {DataTypes} = require('sequelize');
const sequelize = require('./Database/db');

const Materiales = sequelize.define('Materiales', {
    id_material: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING(100),
    }
})