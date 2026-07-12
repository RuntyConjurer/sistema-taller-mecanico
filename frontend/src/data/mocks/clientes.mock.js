// Refleja la tabla `clientes`. El SRS pide TipoCliente y TipoIdentificacion en el
// modelo de datos, y la base de datos los tiene como CHECK constraints:
//   tipo_cliente        PERSONA | EMPRESA
//   tipo_identificacion CEDULA | RNC | PASAPORTE
// Por eso "Grupo Nova SRL" es EMPRESA con RNC y los demás son PERSONA con cédula.
//
// `activo` es booleano, igual que la columna (no el texto "Activo").
// `vehiculos` y `ordenes` no son columnas: son conteos que calculará el backend.
export const clientes = [
  {
    id: 1,
    tipoCliente: 'PERSONA',
    tipoIdentificacion: 'CEDULA',
    identificacion: '001-1234567-8',
    nombre: 'María López',
    telefono: '809-555-1001',
    direccion: 'C/ El Sol 12, Santo Domingo',
    email: 'maria.lopez@email.com',
    activo: true,
    vehiculos: 2,
    ordenes: 5,
  },
  {
    id: 2,
    tipoCliente: 'EMPRESA',
    tipoIdentificacion: 'RNC',
    identificacion: '131-45678-9',
    nombre: 'Grupo Nova SRL',
    telefono: '809-555-2200',
    direccion: 'Av. Winston Churchill 88, Piantini',
    email: 'flota@gruponova.com',
    activo: true,
    vehiculos: 8,
    ordenes: 12,
  },
  {
    id: 3,
    tipoCliente: 'PERSONA',
    tipoIdentificacion: 'CEDULA',
    identificacion: '402-9876543-2',
    nombre: 'Carlos Pérez',
    telefono: '829-555-3344',
    direccion: 'C/ Duarte 45, Los Alcarrizos',
    email: 'carlos.perez@email.com',
    activo: true,
    vehiculos: 1,
    ordenes: 3,
  },
]

// Refleja la tabla `vehiculos`. Todo vehículo lleva `idCliente` porque la columna
// id_cliente es NOT NULL: es la regla del SRS de que un vehículo siempre pertenece a
// un cliente registrado. `propietario` es el nombre ya resuelto por el backend (JOIN),
// para que la interfaz no tenga que buscarlo.
export const vehiculos = [
  {
    id: 1,
    idCliente: 1,
    propietario: 'María López',
    chasis: 'JTDBT923503012345',
    placa: 'A123456',
    marca: 'Toyota',
    modelo: 'Corolla',
    color: 'Gris',
    anio: 2019,
    tipoRefrigerante: 'R-134a',
    activo: true,
  },
  {
    id: 2,
    idCliente: 2,
    propietario: 'Grupo Nova SRL',
    chasis: 'KM8J3CA12NU123456',
    placa: 'B987654',
    marca: 'Hyundai',
    modelo: 'Tucson',
    color: 'Blanco',
    anio: 2021,
    tipoRefrigerante: 'R-1234yf',
    activo: true,
  },
  {
    id: 3,
    idCliente: 3,
    propietario: 'Carlos Pérez',
    chasis: 'KNAPM81ABM7123456',
    placa: 'C456789',
    marca: 'Kia',
    modelo: 'Sportage',
    color: 'Negro',
    anio: 2020,
    tipoRefrigerante: 'R-134a',
    activo: true,
  },
]
