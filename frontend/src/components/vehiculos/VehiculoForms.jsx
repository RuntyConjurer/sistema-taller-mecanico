import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import {
  normalizarVehiculo,
  validarVehiculo,
} from '@/lib/validacionesVehiculo'

const valoresIniciales = {
  idCliente: '',
  chasis: '',
  placa: '',
  marca: '',
  modelo: '',
  color: '',
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

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setValores((valoresActuales) => ({
      ...valoresActuales,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setErrores((erroresActuales) => ({
      ...erroresActuales,
      [name]: '',
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const vehiculoNormalizado = normalizarVehiculo(valores)

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

          <Input
            id="marca"
            name="marca"
            value={valores.marca}
            onChange={handleChange}
            placeholder="Ej. Toyota"
            maxLength={80}
            aria-invalid={Boolean(errores.marca)}
            aria-describedby={
              errores.marca ? 'error-marca' : undefined
            }
            required
          />

          <FieldError
            id="error-marca"
            message={errores.marca}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="modelo">Modelo</Label>

          <Input
            id="modelo"
            name="modelo"
            value={valores.modelo}
            onChange={handleChange}
            placeholder="Ej. Corolla"
            maxLength={80}
            aria-invalid={Boolean(errores.modelo)}
            aria-describedby={
              errores.modelo ? 'error-modelo' : undefined
            }
            required
          />

          <FieldError
            id="error-modelo"
            message={errores.modelo}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="anio">Año</Label>

          <Input
            id="anio"
            name="anio"
            type="number"
            value={valores.anio}
            onChange={handleChange}
            min="1980"
            max="2100"
            placeholder="Ej. 2022"
            aria-invalid={Boolean(errores.anio)}
            aria-describedby={
              errores.anio ? 'error-anio' : undefined
            }
          />

          <FieldError
            id="error-anio"
            message={errores.anio}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>

          <Input
            id="color"
            name="color"
            value={valores.color}
            onChange={handleChange}
            placeholder="Ej. Gris"
            maxLength={50}
          />
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