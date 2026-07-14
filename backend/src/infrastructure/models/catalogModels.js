'use strict';

const { DataTypes, modelOptions, id } = require('./modelHelpers');

function defineCatalogModels(sequelize) {
  const Sucursal = sequelize.define('Sucursal', {
    id: id('id_sucursal'), nombre: { type: DataTypes.STRING(100), allowNull: false }, direccion: { type: DataTypes.TEXT, allowNull: false },
    telefono: DataTypes.STRING(20), email: DataTypes.STRING(120), activa: DataTypes.BOOLEAN, creadoEn: { type: DataTypes.DATE, field: 'creado_en' },
  }, modelOptions(sequelize, 'sucursales'));

  const Servicio = sequelize.define('Servicio', {
    id: id('id_servicio'), nombre: DataTypes.STRING(150), descripcion: DataTypes.TEXT,
    precioBase: { type: DataTypes.DECIMAL(12, 2), field: 'precio_base' },
    porcentajeImpuesto: { type: DataTypes.DECIMAL(5, 2), field: 'porcentaje_impuesto' }, activo: DataTypes.BOOLEAN,
    creadoEn: { type: DataTypes.DATE, field: 'creado_en' },
  }, modelOptions(sequelize, 'servicios'));

  const Material = sequelize.define('Material', {
    id: id('id_material'), nombre: DataTypes.STRING(100), descripcion: DataTypes.TEXT, categoria: DataTypes.STRING(30),
    unidadMedida: { type: DataTypes.STRING(30), field: 'unidad_medida' }, stockActual: { type: DataTypes.DECIMAL(12, 2), field: 'stock_actual' },
    stockMinimo: { type: DataTypes.DECIMAL(12, 2), field: 'stock_minimo' }, costoUnitario: { type: DataTypes.DECIMAL(12, 2), field: 'costo_unitario' },
    precioVenta: { type: DataTypes.DECIMAL(12, 2), field: 'precio_venta' }, activo: DataTypes.BOOLEAN,
  }, modelOptions(sequelize, 'materiales'));

  return { Sucursal, Servicio, Material };
}

module.exports = { defineCatalogModels };
