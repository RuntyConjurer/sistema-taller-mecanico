const Sucursales = require('./Sucursales');
const Usuarios = require('./Usuarios');

Sucursales.hasMany(Usuarios, {
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
Vehiculos.belongsTo(Clientes, {
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

OrdenesTrabajo.belongsTo(Vehiculos, {
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
OrdenesTrabajo.hasOne(Diagnosticos, {
    foreignKey: 'id_ot',
    as: 'diagnostico',
});

Diagnosticos.belongsTo(OrdenesTrabajo, {
    foreignKey: 'id_ot',
    as: 'orden',
});

// FK de auditoría: técnico que registró el diagnóstico
Usuarios.hasMany(Diagnosticos, {
    foreignKey: 'creado_por',
    as: 'diagnosticos_creados',
});

Diagnosticos.belongsTo(Usuarios, {
    foreignKey: 'creado_por',
    as: 'creador',
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

// =============================================================================
// INVENTARIO (catálogo unificado: materiales, repuestos y refrigerantes
// viven todos en la tabla `materiales`, distinguidos por `categoria`.
// Ya NO existe un modelo/tabla `Refrigerantes` separado ni `id_refrigerante`
// en `inventario_movimientos` / `orden_trabajo_materiales` — se eliminó
// por completo aquí para reflejar la migración 005.)
// =============================================================================
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

// FK de auditoría: quién registró el consumo del material en la OT
Usuarios.hasMany(OrdenTrabajoMateriales, {
    foreignKey: 'registrado_por',
    as: 'materiales_registrados',
});

OrdenTrabajoMateriales.belongsTo(Usuarios, {
    foreignKey: 'registrado_por',
    as: 'registrador',
});

// =============================================================================
// FACTURACIÓN
// `facturas` NO tiene columna id_ot: la relación con OrdenesTrabajo es N:M
// a través de la tabla puente `factura_ordenes_trabajo` (una OT solo puede
// estar en una factura, por el UNIQUE(id_ot), pero sigue siendo N:M en el
// modelo relacional / Sequelize).
// =============================================================================
const Facturas = require('./Facturas');
Usuarios.hasMany(Facturas, {
    foreignKey: 'creado_por',
    as: 'facturas_creadas',
});

Facturas.belongsTo(Usuarios, {
    foreignKey: 'creado_por',
    as: 'creador',
});

const FacturaOrdenesTrabajo = require('./FacturaOrdenesTrabajo');

Facturas.belongsToMany(OrdenesTrabajo, {
    through: FacturaOrdenesTrabajo,
    foreignKey: 'id_factura',
    otherKey: 'id_ot',
    as: 'ordenes',
});

OrdenesTrabajo.belongsToMany(Facturas, {
    through: FacturaOrdenesTrabajo,
    foreignKey: 'id_ot',
    otherKey: 'id_factura',
    as: 'facturas',
});

// Acceso directo a las filas de la tabla puente (útil para leer creado_en, etc.)
Facturas.hasMany(FacturaOrdenesTrabajo, {
    foreignKey: 'id_factura',
    as: 'factura_ordenes',
});

OrdenesTrabajo.hasOne(FacturaOrdenesTrabajo, {
    foreignKey: 'id_ot',
    as: 'factura_orden',
});

FacturaOrdenesTrabajo.belongsTo(Facturas, {
    foreignKey: 'id_factura',
    as: 'factura',
});

FacturaOrdenesTrabajo.belongsTo(OrdenesTrabajo, {
    foreignKey: 'id_ot',
    as: 'orden',
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

// id_ot en factura_detalles es opcional (ON DELETE SET NULL): permite saber
// a qué vehículo/OT pertenece cada línea dentro de una factura agrupada.
OrdenesTrabajo.hasMany(FacturaDetalles, {
    foreignKey: 'id_ot',
    as: 'detalles_factura',
});

FacturaDetalles.belongsTo(OrdenesTrabajo, {
    foreignKey: 'id_ot',
    as: 'orden',
});

// =============================================================================
// PAGOS
// N:M entre pagos y facturas a través de `pago_facturas` (monto_aplicado
// permite que un pago cubra varias facturas y que una factura reciba
// varios pagos parciales).
// =============================================================================
const Pagos = require('./Pagos');

Usuarios.hasMany(Pagos, {
    foreignKey: 'recibido_por',
    as: 'pagos',
});
Pagos.belongsTo(Usuarios, {
    foreignKey: 'recibido_por',
    as: 'usuariopago',
});

const PagoFacturas = require('./PagoFacturas');

Pagos.belongsToMany(Facturas, {
    through: PagoFacturas,
    foreignKey: 'id_pago',
    otherKey: 'id_factura',
    as: 'facturas',
});

Facturas.belongsToMany(Pagos, {
    through: PagoFacturas,
    foreignKey: 'id_factura',
    otherKey: 'id_pago',
    as: 'pagos',
});

Pagos.hasMany(PagoFacturas, {
    foreignKey: 'id_pago',
    as: 'pago_facturas',
});

Facturas.hasMany(PagoFacturas, {
    foreignKey: 'id_factura',
    as: 'pago_facturas',
});

PagoFacturas.belongsTo(Pagos, {
    foreignKey: 'id_pago',
    as: 'pago',
});

PagoFacturas.belongsTo(Facturas, {
    foreignKey: 'id_factura',
    as: 'factura',
});

// =============================================================================
// ROLES / USUARIO_ROLES
// =============================================================================
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

Roles.hasMany(UsuarioRoles, {
    foreignKey: 'id_rol',
    as: 'usuarioroles',
});

// =============================================================================
// HISTORIAL TÉCNICO
// =============================================================================
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

// FK de auditoría: técnico que registró el evento
Usuarios.hasMany(HistorialTecnico, {
    foreignKey: 'registrado_por',
    as: 'historiales_registrados',
});

HistorialTecnico.belongsTo(Usuarios, {
    foreignKey: 'registrado_por',
    as: 'registrador',
});