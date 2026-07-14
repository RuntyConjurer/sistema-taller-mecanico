function first(source, ...keys) {
  for (const key of keys) {
    if (source?.[key] !== undefined && source[key] !== null) return source[key]
  }
  return undefined
}

function asNumber(value, fallback = 0) {
  if (value === undefined || value === null || value === '') return fallback
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function fullVehicle(vehicle) {
  if (!vehicle) return undefined
  const name = [first(vehicle, 'marca'), first(vehicle, 'modelo')].filter(Boolean).join(' ')
  const placa = first(vehicle, 'placa')
  return [name, placa].filter(Boolean).join(' · ')
}

function fullName(entity) {
  return first(entity, 'nombre', 'nombreCompleto', 'razonSocial')
}

export function mapClient(item = {}) {
  return {
    ...item,
    id: asNumber(first(item, 'id', 'idCliente', 'id_cliente')),
    tipoCliente: first(item, 'tipoCliente', 'tipo_cliente'),
    tipoIdentificacion: first(item, 'tipoIdentificacion', 'tipo_identificacion'),
    identificacion: first(item, 'identificacion'),
    nombre: fullName(item),
    telefono: first(item, 'telefono'),
    direccion: first(item, 'direccion'),
    email: first(item, 'email', 'correo'),
    whatsappOptIn: Boolean(first(item, 'whatsappOptIn', 'whatsapp_opt_in')),
    activo: first(item, 'activo') ?? true,
    vehiculos: asNumber(first(item, 'vehiculos', 'cantidadVehiculos', 'cantidad_vehiculos')),
    ordenes: asNumber(first(item, 'ordenes', 'cantidadOrdenes', 'cantidad_ordenes')),
  }
}

export function mapVehicle(item = {}) {
  const client = first(item, 'cliente', 'Cliente')
  return {
    ...item,
    id: asNumber(first(item, 'id', 'idVehiculo', 'id_vehiculo')),
    idCliente: asNumber(first(item, 'idCliente', 'clienteId', 'id_cliente') ?? client?.id),
    propietario: first(item, 'propietario') || fullName(client),
    chasis: first(item, 'chasis'),
    placa: first(item, 'placa'),
    marca: first(item, 'marca'),
    modelo: first(item, 'modelo'),
    color: first(item, 'color'),
    anio: asNumber(first(item, 'anio', 'año')),
    tipoRefrigerante: first(item, 'tipoRefrigerante', 'tipo_refrigerante'),
    activo: first(item, 'activo') ?? true,
  }
}

export function mapAppointment(item = {}) {
  const vehicle = first(item, 'vehiculo', 'Vehiculo')
  const client = first(item, 'cliente', 'Cliente') || first(vehicle, 'cliente', 'Cliente')
  return {
    ...item,
    id: asNumber(first(item, 'id', 'idCita', 'id_cita')),
    idSucursal: asNumber(first(item, 'idSucursal', 'sucursalId', 'id_sucursal')),
    fecha: first(item, 'fecha', 'fechaCita', 'fecha_cita'),
    cliente: typeof client === 'string' ? client : fullName(client),
    clienteId: asNumber(first(item, 'clienteId', 'idCliente', 'id_cliente') ?? client?.id),
    telefono: first(item, 'telefono') || first(client, 'telefono'),
    whatsappOptIn: Boolean(
      first(item, 'whatsappOptIn', 'whatsapp_opt_in') ??
      first(client, 'whatsappOptIn', 'whatsapp_opt_in'),
    ),
    vehiculo: typeof vehicle === 'string' ? vehicle : fullVehicle(vehicle),
    estado: first(item, 'estado'),
    motivo: first(item, 'motivo', 'problemaReportado', 'problema_reportado', 'observaciones'),
  }
}

export function mapWorkOrder(item = {}) {
  const vehicle = first(item, 'vehiculo', 'Vehiculo')
  const client = first(item, 'cliente', 'Cliente') || first(vehicle, 'cliente', 'Cliente')
  const technician = first(item, 'tecnico', 'Tecnico', 'usuario', 'Usuario')
  return {
    ...item,
    id: asNumber(first(item, 'id', 'idOt', 'id_ot')),
    idSucursal: asNumber(first(item, 'idSucursal', 'sucursalId', 'id_sucursal')),
    numero: first(item, 'numero', 'numeroOt', 'numero_ot') || `OT-${first(item, 'id', 'id_ot')}`,
    cliente: typeof client === 'string' ? client : fullName(client),
    vehiculo: typeof vehicle === 'string' ? vehicle : fullVehicle(vehicle),
    tecnico: typeof technician === 'string' ? technician : fullName(technician) || 'Sin asignar',
    estado: first(item, 'estado'),
    prioridad: first(item, 'prioridad') || 'Normal',
    recepcion: first(item, 'recepcion', 'fechaApertura', 'fecha_apertura'),
    sintomas: first(
      item,
      'sintomas',
      'descripcionProblema',
      'descripcion_problema',
      'problemaReportado',
      'problema_reportado',
      'observaciones',
    ),
    diagnosticoRegistrado: Boolean(
      first(item, 'diagnosticoRegistrado', 'diagnostico_registrado', 'diagnostico', 'Diagnostico'),
    ),
  }
}

export function mapService(item = {}) {
  return {
    ...item,
    id: asNumber(first(item, 'id', 'idServicio', 'id_servicio')),
    slug: first(item, 'slug') || String(first(item, 'id', 'id_servicio')),
    nombre: first(item, 'nombre'),
    descripcion: first(item, 'descripcion'),
    duracion: first(item, 'duracion', 'duracionEstimada', 'duracion_estimada'),
    precioBase: asNumber(first(item, 'precioBase', 'precio_base', 'precio')),
    activo: first(item, 'activo') ?? true,
  }
}

export function mapBranch(item = {}) {
  return {
    ...item,
    id: asNumber(first(item, 'id', 'idSucursal', 'id_sucursal')),
    slug: first(item, 'slug') || String(first(item, 'id', 'id_sucursal')),
    nombre: first(item, 'nombre'),
    direccion: first(item, 'direccion'),
    telefono: first(item, 'telefono'),
    email: first(item, 'email', 'correo'),
    activa: first(item, 'activa', 'activo') ?? true,
  }
}

export function mapMaterial(item = {}) {
  return {
    ...item,
    id: asNumber(first(item, 'id', 'idMaterial', 'id_material')),
    codigo: first(item, 'codigo'),
    nombre: first(item, 'nombre'),
    categoria: first(item, 'categoria'),
    unidadMedida: first(item, 'unidadMedida', 'unidad_medida'),
    stockActual: asNumber(first(item, 'stockActual', 'stock_actual')),
    stockMinimo: asNumber(first(item, 'stockMinimo', 'stock_minimo')),
    costoUnitario: asNumber(first(item, 'costoUnitario', 'costo_unitario')),
    precioVenta: asNumber(first(item, 'precioVenta', 'precio_venta')),
  }
}

export function mapInventoryMovement(item = {}) {
  const material = first(item, 'material', 'Material')
  return {
    ...item,
    id: asNumber(first(item, 'id', 'idMovimiento', 'id_movimiento')),
    fecha: first(item, 'fecha', 'fechaMovimiento', 'fecha_movimiento'),
    material: typeof material === 'string' ? material : first(material, 'nombre'),
    tipo: first(item, 'tipo', 'tipoMovimiento', 'tipo_movimiento'),
    cantidad: asNumber(first(item, 'cantidad')),
    unidadMedida: first(item, 'unidadMedida', 'unidad_medida') || first(material, 'unidadMedida', 'unidad_medida'),
    motivo: first(item, 'motivo', 'referencia'),
  }
}

export function mapInvoice(item = {}) {
  const order = first(item, 'orden', 'ordenTrabajo', 'OrdenTrabajo') || first(item, 'ordenes')?.[0]
  const vehicle = first(order, 'vehiculo', 'Vehiculo')
  const client =
    first(item, 'cliente', 'Cliente') ||
    first(order, 'cliente', 'Cliente') ||
    first(vehicle, 'cliente', 'Cliente')
  const payments = first(item, 'aplicacionesPago', 'pagos', 'PagoFacturas') || []
  const total = asNumber(first(item, 'total'))
  const paid = payments.reduce(
    (sum, payment) => sum + asNumber(first(payment, 'montoAplicado', 'monto_aplicado', 'monto')),
    0,
  )
  return {
    ...item,
    id: asNumber(first(item, 'id', 'idFactura', 'id_factura')),
    numero: first(item, 'numero', 'numeroFactura', 'numero_factura') || `FAC-${first(item, 'id', 'id_factura')}`,
    cliente: typeof client === 'string' ? client : fullName(client),
    total,
    balance: asNumber(
      first(item, 'balance', 'saldoPendiente', 'saldo_pendiente'),
      first(item, 'estado') === 'PAGADA' ? 0 : Math.max(total - paid, 0),
    ),
    estado: first(item, 'estado'),
    ordenId: asNumber(first(item, 'ordenId', 'ordenTrabajoId', 'idOt', 'id_ot') ?? first(order, 'id', 'idOt', 'id_ot')),
  }
}

export function mapQuote(item = {}) {
  const vehicle = first(item, 'vehiculo', 'Vehiculo')
  const client = first(item, 'cliente', 'Cliente') || first(vehicle, 'cliente', 'Cliente')
  const details = first(item, 'detalles', 'CotizacionDetalles', 'cotizacionDetalles') || []
  return {
    ...item,
    id: asNumber(first(item, 'id', 'idCotizacion', 'id_cotizacion')),
    numero: first(item, 'numero', 'numeroCotizacion', 'numero_cotizacion') || `COT-${first(item, 'id', 'id_cotizacion')}`,
    cliente: typeof client === 'string' ? client : fullName(client),
    vehiculo: typeof vehicle === 'string' ? vehicle : fullVehicle(vehicle),
    estado: first(item, 'estado'),
    vigencia: first(item, 'vigencia', 'vigenciaHasta', 'vigencia_hasta', 'fechaVencimiento', 'fecha_vencimiento'),
    subtotal: asNumber(first(item, 'subtotal')),
    impuesto: asNumber(first(item, 'impuesto', 'itbis')),
    total: asNumber(first(item, 'total')),
    detalles: details.map((detail) => {
      const material = first(detail, 'material', 'Material')
      const service = first(detail, 'servicio', 'Servicio')
      return {
        ...detail,
        id: asNumber(first(detail, 'id', 'idDetalle', 'id_detalle')),
        tipoItem:
          first(detail, 'tipoItem', 'tipo_item') ||
          (service ? 'SERVICIO' : material?.categoria === 'REFRIGERANTE' ? 'REFRIGERANTE' : 'MATERIAL'),
        descripcion: first(detail, 'descripcion') || first(service, 'nombre') || first(material, 'nombre'),
        cantidad: asNumber(first(detail, 'cantidad')),
        precioUnitario: asNumber(first(detail, 'precioUnitario', 'precio_unitario')),
      }
    }),
  }
}

export function mapUser(item = {}) {
  const roles = first(item, 'roles', 'Roles') || []
  return {
    ...item,
    id: asNumber(first(item, 'id', 'idUsuario', 'id_usuario')),
    nombre: fullName(item),
    email: first(item, 'email', 'correo'),
    telefono: first(item, 'telefono'),
    idSucursal: asNumber(first(item, 'idSucursal', 'sucursalId', 'id_sucursal')),
    roles: roles.map((role) => (typeof role === 'string' ? role : first(role, 'codigo', 'nombre'))),
    activo: first(item, 'activo') ?? true,
  }
}

export function mapHistory(item = {}) {
  const technician = first(item, 'tecnico', 'Tecnico', 'usuario', 'Usuario')
  return {
    ...item,
    id: asNumber(first(item, 'id', 'idHistorial', 'id_historial')),
    idVehiculo: asNumber(first(item, 'idVehiculo', 'id_vehiculo')),
    numeroOrden: first(item, 'numeroOrden', 'numero_orden', 'numeroOt', 'numero_ot'),
    fecha: first(item, 'fecha', 'fechaRegistro', 'fecha_registro'),
    descripcion: first(item, 'descripcion'),
    recomendaciones: first(item, 'recomendaciones'),
    tecnico: typeof technician === 'string' ? technician : fullName(technician),
    estado: first(item, 'estado') || 'CERRADA',
  }
}

export function mapList(value, mapper) {
  const list = Array.isArray(value) ? value : value?.items || value?.rows || []
  return list.map(mapper)
}
