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
    as: 'cliente',
});
Vehiculos.belongsTo(Clientes,{
    foreignKey: 'id_cliente',
    as: 'vehiculos',
});

const Citas = require('./Citas');
const Clientes = require('./Clientes');

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

Usuario.hasMany(OrdenesTrabajo, {
    foreignKey: 'id_usuario',
    as: 'Ordenes',
});

OrdenesTrabajo.belongsTo(Usuario, {
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

Servicios.hasMany(OrdenTrabajoServicio, {
    foreignKey: 'id_servicio',
    as: 'detalles',
});

OrdenTrabajoServicio.belongsTo(Servicio, {
    foreignKey: 'id_servicio',
    as: 'servicio',
});



