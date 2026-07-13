function limpiarTexto(valor) {
  return String(valor ?? '').trim()
}

export function normalizarVehiculo(valores) {
  return {
    idCliente: Number(valores.idCliente),
    chasis: limpiarTexto(valores.chasis).toUpperCase(),
    placa: limpiarTexto(valores.placa).toUpperCase(),
    marca: limpiarTexto(valores.marca),
    modelo: limpiarTexto(valores.modelo),
    color: limpiarTexto(valores.color),
    anio:
      valores.anio === '' || valores.anio === null
        ? null
        : Number(valores.anio),
    tipoRefrigerante: limpiarTexto(valores.tipoRefrigerante),
    activo: Boolean(valores.activo),
  }
}

export function validarVehiculo(vehiculo, vehiculosExistentes = []) {
  const errores = {}

  if (!Number.isInteger(vehiculo.idCliente) || vehiculo.idCliente <= 0) {
    errores.idCliente = 'Debes seleccionar el propietario del vehículo.'
  }

  if (!vehiculo.chasis) {
    errores.chasis = 'El número de chasis es obligatorio.'
  }

  if (!vehiculo.marca) {
    errores.marca = 'La marca es obligatoria.'
  }

  if (!vehiculo.modelo) {
    errores.modelo = 'El modelo es obligatorio.'
  }

  if (
    vehiculo.anio !== null &&
    (!Number.isInteger(vehiculo.anio) ||
      vehiculo.anio < 1980 ||
      vehiculo.anio > 2100)
  ) {
    errores.anio = 'El año debe estar entre 1980 y 2100.'
  }

  const chasisDuplicado = vehiculosExistentes.some(
    (item) =>
      limpiarTexto(item.chasis).toUpperCase() === vehiculo.chasis,
  )

  if (vehiculo.chasis && chasisDuplicado) {
    errores.chasis = 'Ya existe un vehículo registrado con este chasis.'
  }

  const placaDuplicada = vehiculosExistentes.some(
    (item) =>
      vehiculo.placa &&
      limpiarTexto(item.placa).toUpperCase() === vehiculo.placa,
  )

  if (placaDuplicada) {
    errores.placa = 'Ya existe un vehículo registrado con esta placa.'
  }

  return errores
}