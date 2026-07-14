import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import {
  aniosVehiculo,
  coloresVehiculo,
  marcasVehiculo,
  modelosPorMarca,
  OPCION_OTRA,
} from '@/constants/catalogoVehiculos'
import {
  normalizarVehiculo,
  validarVehiculo,
} from '@/lib/validacionesVehiculo'

const valoresIniciales = {
  idCliente: '',
  chasis: '',
  placa: '',
  marca: '',
  marcaPersonalizada: '',
  modelo: '',
  modeloPersonalizado: '',
  color: '',
  colorPersonalizado: '',
  anio: '',
  tipoRefrigerante: '',
  activo: true,
}

function FieldError({ id, message }) {
  if (!message) return null

  return (
    <p id={id} className="text-xs font-medium text-destructive">
      {message}
    </p>
  )
}

function VehiculoForm({
  clientes = [],
  vehiculos = [],
  onSubmit,
  onCancel,
  isSaving = false,
}) {
  const [valores, setValores] = useState(valoresIniciales)
  const [errores, setErrores] = useState({})

  const modelosDisponibles =
    valores.marca && valores.marca !== OPCION_OTRA
      ? modelosPorMarca[valores.marca] ?? []
      : []

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    const nuevoValor = type === 'checkbox' ? checked : value

    setValores((valoresActuales) => {
      const nuevosValores = {
        ...valoresActuales,
        [name]: nuevoValor,
      }

      if (name === 'marca') {
        nuevosValores.modelo =
          value === OPCION_OTRA ? OPCION_OTRA : ''
        nuevosValores.marcaPersonalizada = ''
        nuevosValores.modeloPersonalizado = ''
      }

      if (name === 'modelo' && value !== OPCION_OTRA) {
        nuevosValores.modeloPersonalizado = ''
      }

      if (name === 'color' && value !== OPCION_OTRA) {
        nuevosValores.colorPersonalizado = ''
      }

      return nuevosValores
    })

    const campoError =
      {
        marcaPersonalizada: 'marca',
        modeloPersonalizado: 'modelo',
        colorPersonalizado: 'color',
      }[name] ?? name

    setErrores((erroresActuales) => {
      const nuevosErrores = {
        ...erroresActuales,
        [campoError]: '',
      }

      if (name === 'marca') {
        nuevosErrores.modelo = ''
      }

      return nuevosErrores
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const valoresResueltos = {
      ...valores,
      marca:
        valores.marca === OPCION_OTRA
          ? valores.marcaPersonalizada
          : valores.marca,
      modelo:
        valores.modelo === OPCION_OTRA
          ? valores.modeloPersonalizado
          : valores.modelo,
      color:
        valores.color === OPCION_OTRA
          ? valores.colorPersonalizado
          : valores.color,
    }

    const vehiculoNormalizado = normalizarVehiculo(valoresResueltos)

    const nuevosErrores = validarVehiculo(
      vehiculoNormalizado,
      vehiculos,
    )

    const clienteSeleccionado = clientes.find(
      (cliente) => cliente.id === vehiculoNormalizado.idCliente,
    )

    if (
      vehiculoNormalizado.idCliente > 0 &&
      !clienteSeleccionado
    ) {
      nuevosErrores.idCliente =
        'El propietario seleccionado no es válido.'
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    await onSubmit({
      ...vehiculoNormalizado,
      propietario: clienteSeleccionado.nombre,
    })
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <Label htmlFor="idCliente">Propietario</Label>

        <Select
          id="idCliente"
          name="idCliente"
          value={valores.idCliente}
          onChange={handleChange}
          aria-invalid={Boolean(errores.idCliente)}
          aria-describedby={
            errores.idCliente ? 'error-idCliente' : undefined
          }
          required
        >
          <option value="">Selecciona un cliente</option>

          {clientes
            .filter((cliente) => cliente.activo)
            .map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre}
              </option>
            ))}
        </Select>

        <FieldError
          id="error-idCliente"
          message={errores.idCliente}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="chasis">Número de chasis</Label>

        <Input
          id="chasis"
          name="chasis"
          value={valores.chasis}
          onChange={handleChange}
          placeholder="Ej. JTDBT923503012345"
          maxLength={50}
          aria-invalid={Boolean(errores.chasis)}
          aria-describedby={
            errores.chasis ? 'error-chasis' : undefined
          }
          required
        />

        <FieldError
          id="error-chasis"
          message={errores.chasis}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="placa">Placa</Label>

        <Input
          id="placa"
          name="placa"
          value={valores.placa}
          onChange={handleChange}
          placeholder="Ej. A123456"
          maxLength={20}
          aria-invalid={Boolean(errores.placa)}
          aria-describedby={
            errores.placa ? 'error-placa' : undefined
          }
        />

        <FieldError
          id="error-placa"
          message={errores.placa}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="marca">Marca</Label>

          <Select
            id="marca"
            name="marca"
            value={valores.marca}
            onChange={handleChange}
            aria-invalid={Boolean(errores.marca)}
            aria-describedby={
              errores.marca ? 'error-marca' : undefined
            }
            required
          >
            <option value="">Selecciona una marca</option>

            {marcasVehiculo.map((marca) => (
              <option key={marca} value={marca}>
                {marca}
              </option>
            ))}

            <option value={OPCION_OTRA}>Otra marca</option>
          </Select>

          {valores.marca === OPCION_OTRA ? (
            <Input
              id="marcaPersonalizada"
              name="marcaPersonalizada"
              value={valores.marcaPersonalizada}
              onChange={handleChange}
              placeholder="Escribe la marca"
              maxLength={80}
              aria-invalid={Boolean(errores.marca)}
            />
          ) : null}

          <FieldError
            id="error-marca"
            message={errores.marca}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="modelo">Modelo</Label>

          {valores.marca === OPCION_OTRA ? (
            <Input
              id="modeloPersonalizado"
              name="modeloPersonalizado"
              value={valores.modeloPersonalizado}
              onChange={handleChange}
              placeholder="Escribe el modelo"
              maxLength={80}
              aria-invalid={Boolean(errores.modelo)}
              aria-describedby={
                errores.modelo ? 'error-modelo' : undefined
              }
            />
          ) : (
            <Select
              id="modelo"
              name="modelo"
              value={valores.modelo}
              onChange={handleChange}
              disabled={!valores.marca}
              aria-invalid={Boolean(errores.modelo)}
              aria-describedby={
                errores.modelo ? 'error-modelo' : undefined
              }
              required
            >
              <option value="">
                {valores.marca
                  ? 'Selecciona un modelo'
                  : 'Selecciona primero una marca'}
              </option>

              {modelosDisponibles.map((modelo) => (
                <option key={modelo} value={modelo}>
                  {modelo}
                </option>
              ))}

              {valores.marca ? (
                <option value={OPCION_OTRA}>Otro modelo</option>
              ) : null}
            </Select>
          )}

          {valores.marca !== OPCION_OTRA &&
          valores.modelo === OPCION_OTRA ? (
            <Input
              id="modeloPersonalizado"
              name="modeloPersonalizado"
              value={valores.modeloPersonalizado}
              onChange={handleChange}
              placeholder="Escribe el modelo"
              maxLength={80}
              aria-invalid={Boolean(errores.modelo)}
            />
          ) : null}

          <FieldError
            id="error-modelo"
            message={errores.modelo}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="anio">Año</Label>

          <Select
            id="anio"
            name="anio"
            value={valores.anio}
            onChange={handleChange}
            aria-invalid={Boolean(errores.anio)}
            aria-describedby={
              errores.anio ? 'error-anio' : undefined
            }
          >
            <option value="">No especificado</option>

            {aniosVehiculo.map((anio) => (
              <option key={anio} value={anio}>
                {anio}
              </option>
            ))}
          </Select>

          <FieldError
            id="error-anio"
            message={errores.anio}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>

          <Select
            id="color"
            name="color"
            value={valores.color}
            onChange={handleChange}
          >
            <option value="">No especificado</option>

            {coloresVehiculo.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}

            <option value={OPCION_OTRA}>Otro color</option>
          </Select>

          {valores.color === OPCION_OTRA ? (
            <Input
              id="colorPersonalizado"
              name="colorPersonalizado"
              value={valores.colorPersonalizado}
              onChange={handleChange}
              placeholder="Escribe el color"
              maxLength={50}
            />
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipoRefrigerante">
          Tipo de refrigerante
        </Label>

        <Select
          id="tipoRefrigerante"
          name="tipoRefrigerante"
          value={valores.tipoRefrigerante}
          onChange={handleChange}
        >
          <option value="">No especificado</option>
          <option value="R-12">R-12</option>
          <option value="R-134a">R-134a</option>
          <option value="R-1234yf">R-1234yf</option>
        </Select>
      </div>

      <label className="flex items-center gap-3 text-sm font-medium">
        <input
          type="checkbox"
          name="activo"
          checked={valores.activo}
          onChange={handleChange}
          className="h-4 w-4 rounded border-border"
        />

        Vehículo activo
      </label>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancelar
        </Button>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Registrando...' : 'Registrar vehículo'}
        </Button>
      </div>
    </form>
  )
}

export default VehiculoForm