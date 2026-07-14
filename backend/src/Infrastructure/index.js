const Sucursales = require('./Sucursales');
const Usuarios = require('./Usuarios');

Sucursales.hasMany(Usuarios,{
    foreignKey: 'id_sucursal',
    as: 'usuarios',
});

Usuarios.belongsTo(Sucursales, {
    foreignKey: 'id_sucursal',
    as: 'sucursal',
});

const Vehiculos = require('./Vehiculos');
const Clientes = require('./Clientes');

Clientes.hasMany(Vehiculos, {
    foreignKey: 'id_cliente',
    as: 'vehiculos',
});
Vehiculos.belongsTo(Clientes,{
    foreignKey: 'id_cliente',
    as: 'cliente',
});

const Citas = require('./Citas');


Clientes.hasMany(Citas, {
    foreignKey: 'id_cliente',
    as: 'citas',
});

Sucursales.hasMany(Citas, {
    foreignKey: 'id_sucursal',
    as: 'citas',
});

Citas.belongsTo(Clientes, {
    foreignKey: 'id_cliente',
    as: 'cliente',
});

Citas.belongsTo(Sucursales, {
    foreignKey: 'id_sucursal',
    as: 'sucursal',
});

Vehiculos.hasMany(Citas, {
    foreignKey: 'id_vehiculo',
    as: 'citas',
});

Citas.belongsTo(Vehiculos, {
    foreignKey: 'id_vehiculo',
    as: 'vehiculo',
});

const OrdenesTrabajo = require('./OrdenesTrabajo');
Vehiculos.hasMany(OrdenesTrabajo, {
    foreignKey: 'id_vehiculo',
    as: 'ordenes',
});

OrdenesTrabajo.belongsTo(Vehiculos,{
    foreignKey: 'id_vehiculo',
    as: 'vehiculo',
});

Usuarios.hasMany(OrdenesTrabajo, {
    foreignKey: 'id_usuario',
    as: 'ordenes',
});

OrdenesTrabajo.belongsTo(Usuarios, {
    foreignKey: 'id_usuario',
    as: 'tecnico',
});

Sucursales.hasMany(OrdenesTrabajo, {
    foreignKey: 'id_sucursal',
    as: 'ordenes',
});

OrdenesTrabajo.belongsTo(Sucursales, {
    foreignKey: 'id_sucursal',
    as: 'sucursal',
});

Citas.hasOne(OrdenesTrabajo, {
    foreignKey: 'id_cita',
    as: 'orden',
});

OrdenesTrabajo.belongsTo(Citas, {
    foreignKey: 'id_cita',
    as: 'cita',
});

const Diagnosticos = require('./Diagnosticos');
OrdenesTrabajo.hasMany(Diagnosticos, {
    foreignKey: 'id_ot',
    as: 'diagnosticos',
});

Diagnosticos.belongsTo(OrdenesTrabajo, {
    foreignKey: 'id_ot',
    as: 'orden',
});

const OrdenTrabajoServicios = require('./OrdenTrabajoServicios');
OrdenesTrabajo.hasMany(OrdenTrabajoServicios, {
    foreignKey: 'id_ot',
    as: 'detalles_servicio',
});

OrdenTrabajoServicios.belongsTo(OrdenesTrabajo, {
    foreignKey: 'id_ot',
    as: 'orden',
});

const Servicios = require('./Servicios');

Servicios.hasMany(OrdenTrabajoServicios, {
    foreignKey: 'id_servicio',
    as: 'detalles',
});

OrdenTrabajoServicios.belongsTo(Servicios, {
    foreignKey: 'id_servicio',
    as: 'servicio',
});

const Refrigerantes = require('./Refrigerantes');
const Materiales = require('./Materiales');
const InventarioMovimientos = require('./InventarioMovimientos');

Materiales.hasMany(InventarioMovimientos, {
    foreignKey: 'id_material',
    as: 'movimientos',
});

InventarioMovimientos.belongsTo(Materiales, {
    foreignKey: 'id_material',
    as: 'material',
});

Refrigerantes.hasMany(InventarioMovimientos, {
    foreignKey: 'id_refrigerante',
    as: 'movimientos',

});

InventarioMovimientos.belongsTo(Refrigerantes, {
    foreignKey: 'id_refrigerante',
    as: 'refrigerante',
});

Usuarios.hasMany(InventarioMovimientos, {
    foreignKey: 'id_usuario',
    as: 'movimientos',
});

InventarioMovimientos.belongsTo(Usuarios, {
    foreignKey: 'id_usuario',
    as: 'usuario',
});

const OrdenTrabajoMateriales = require('./OrdenTrabajoMateriales');
OrdenesTrabajo.hasMany(OrdenTrabajoMateriales, {
    foreignKey: 'id_ot',
    as: 'materiales',
});

OrdenTrabajoMateriales.belongsTo(OrdenesTrabajo, {
    foreignKey: 'id_ot',
    as: 'orden',
});

Materiales.hasMany(OrdenTrabajoMateriales, {
    foreignKey: 'id_material',
    as: 'ordenes_materiales',
});

OrdenTrabajoMateriales.belongsTo(Materiales, {
    foreignKey: 'id_material',
    as: 'material',
});

Refrigerantes.hasMany(OrdenTrabajoMateriales, {
    foreignKey: 'id_refrigerante',
    as: 'ordenes_refrigerantes',
});
OrdenTrabajoMateriales.belongsTo(Refrigerantes, {
    foreignKey: 'id_refrigerante',
    as: 'refrigerante',
});

const Facturas = require('./Facturas');
Usuarios.hasMany(Facturas, {
    foreignKey: 'creado_por',
    as: 'facturas_creadas',
});

Facturas.belongsTo(Usuarios, {
    foreignKey: 'creado_por',
    as: 'creador',
});

OrdenesTrabajo.hasOne(Facturas,{
    foreignKey:'id_ot',
    as:'factura'
});

Facturas.belongsTo(OrdenesTrabajo,{
    foreignKey:'id_ot',
    as:'orden'
});

const FacturaDetalles = require('./FacturaDetalles');

Facturas.hasMany(FacturaDetalles, {
    foreignKey: 'id_factura',
    as: 'detalles',
});

FacturaDetalles.belongsTo(Facturas, {
    foreignKey: 'id_factura',
    as: 'factura',
});

const UsuarioRoles = require('./UsuarioRoles');

const Roles = require('./Roles');
Usuarios.belongsToMany(Roles, {
    through: UsuarioRoles,
    foreignKey: 'id_usuario',
    otherKey: 'id_rol',
    as: 'roles',
});

Roles.belongsToMany(Usuarios, {
    through: UsuarioRoles,
    foreignKey: 'id_rol',
    otherKey: 'id_usuario',
    as: 'usuarios',
});
Usuarios.hasMany(UsuarioRoles, {
    foreignKey: 'id_usuario',
    as: 'usuarioroles',
});

const Pagos = require('./Pagos');

Usuarios.hasMany(Pagos, {
    foreignKey: 'recibido_por',
    as: 'pagos',
});
Pagos.belongsTo(Usuarios, {
    foreignKey: 'recibido_por',
    as: 'usuariopago',
});

const HistorialTecnico = require('./HistorialTecnico');

Vehiculos.hasMany(HistorialTecnico, {
    foreignKey: 'id_vehiculo',
    as: 'historialesvehiculo',
});

HistorialTecnico.belongsTo(Vehiculos, {
    foreignKey: 'id_vehiculo',
    as: 'vehiculo',
});

OrdenesTrabajo.hasMany(HistorialTecnico, {
    foreignKey: 'id_ot',
    as: 'historialestecnicos',
});
HistorialTecnico.belongsTo(OrdenesTrabajo, {
    foreignKey: 'id_ot',
    as: 'ordentrabajo',
});

