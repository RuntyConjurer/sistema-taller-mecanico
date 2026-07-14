'use strict';

const { DataTypes, modelOptions, id, fk, money } = require('./modelHelpers');

function defineQuoteModels(sequelize) {
  const Cotizacion = sequelize.define('Cotizacion', {
    id: id('id_cotizacion'), clienteId: fk('id_cliente', false), vehiculoId: fk('id_vehiculo', false), sucursalId: fk('id_sucursal'),
    numero: DataTypes.STRING(30), estado: DataTypes.STRING(20), subtotal: money('subtotal'), impuesto: money('impuesto'),
    descuento: money('descuento'), total: money('total'), observaciones: DataTypes.TEXT, vigencia: DataTypes.DATEONLY,
    creadoPor: fk('creado_por'), creadoEn: { type: DataTypes.DATE, field: 'creado_en' }, actualizadoEn: { type: DataTypes.DATE, field: 'actualizado_en' },
  }, modelOptions(sequelize, 'cotizaciones'));

  const CotizacionDetalle = sequelize.define('CotizacionDetalle', {
    id: id('id_cotizacion_detalle'), cotizacionId: fk('id_cotizacion', false), servicioId: fk('id_servicio'),
    materialId: fk('id_material'), tipoItem: { type: DataTypes.STRING(20), field: 'tipo_item' }, descripcion: DataTypes.STRING(150),
    cantidad: DataTypes.DECIMAL(12, 2), precioUnitario: { type: DataTypes.DECIMAL(12, 2), field: 'precio_unitario' },
    subtotal: DataTypes.DECIMAL(14, 2), porcentajeImpuesto: { type: DataTypes.DECIMAL(5, 2), field: 'porcentaje_impuesto' },
    montoImpuesto: { type: DataTypes.DECIMAL(14, 2), field: 'monto_impuesto' },
  }, modelOptions(sequelize, 'cotizacion_detalles'));

  return { Cotizacion, CotizacionDetalle };
}

module.exports = { defineQuoteModels };
