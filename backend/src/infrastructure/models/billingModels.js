'use strict';

const { DataTypes, modelOptions, id, fk, money } = require('./modelHelpers');

function defineBillingModels(sequelize) {
  const Factura = sequelize.define('Factura', {
    id: id('id_factura'), numeroFactura: { type: DataTypes.STRING(30), field: 'numero_factura' }, fecha: DataTypes.DATE,
    subtotal: money('subtotal'), impuesto: money('impuesto'), descuento: money('descuento'), total: money('total'), estado: DataTypes.STRING(20),
    observaciones: DataTypes.TEXT, creadoPor: fk('creado_por'), creadoEn: { type: DataTypes.DATE, field: 'creado_en' },
  }, modelOptions(sequelize, 'facturas'));

  const FacturaOrden = sequelize.define('FacturaOrden', {
    facturaId: { ...fk('id_factura', false), primaryKey: true }, ordenTrabajoId: { ...fk('id_ot', false), primaryKey: true },
  }, modelOptions(sequelize, 'factura_ordenes_trabajo'));

  const FacturaDetalle = sequelize.define('FacturaDetalle', {
    id: id('id_factura_detalle'), facturaId: fk('id_factura', false), ordenTrabajoId: fk('id_ot'), tipoItem: { type: DataTypes.STRING(20), field: 'tipo_item' },
    descripcion: DataTypes.STRING(150), cantidad: DataTypes.DECIMAL(12, 2), precioUnitario: { type: DataTypes.DECIMAL(12, 2), field: 'precio_unitario' },
    subtotal: DataTypes.DECIMAL(14, 2), porcentajeImpuesto: { type: DataTypes.DECIMAL(5, 2), field: 'porcentaje_impuesto' },
    montoImpuesto: { type: DataTypes.DECIMAL(14, 2), field: 'monto_impuesto' },
  }, modelOptions(sequelize, 'factura_detalles'));

  const Pago = sequelize.define('Pago', {
    id: id('id_pago'), montoTotal: { type: DataTypes.DECIMAL(14, 2), field: 'monto_total' }, formaPago: { type: DataTypes.STRING(30), field: 'forma_pago' },
    referencia: DataTypes.STRING(100), fechaPago: { type: DataTypes.DATE, field: 'fecha_pago' }, recibidoPor: fk('recibido_por'),
  }, modelOptions(sequelize, 'pagos'));

  const PagoFactura = sequelize.define('PagoFactura', {
    id: id('id_pago_factura'), pagoId: fk('id_pago', false), facturaId: fk('id_factura', false),
    montoAplicado: { type: DataTypes.DECIMAL(14, 2), field: 'monto_aplicado' },
  }, modelOptions(sequelize, 'pago_facturas'));

  return { Factura, FacturaOrden, FacturaDetalle, Pago, PagoFactura };
}

module.exports = { defineBillingModels };
