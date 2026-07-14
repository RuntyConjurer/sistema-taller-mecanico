import { describe, expect, it } from 'vitest'
import { clientes, vehiculos } from './clientes.mock'
import { materiales } from './inventario.mock'
import { usuarios } from './usuarios.mock'
import { sucursales } from './sucursales.mock'

// Estas pruebas protegen el contrato con la base de datos. Si alguien vuelve a
// guardar el stock como texto ("2.5 kg") o inventa un código de estado que no existe
// en un CHECK constraint de PostgreSQL, la integración se rompería en silencio el día
// que se active VITE_DATA_SOURCE=api. Aquí falla antes, y con un mensaje claro.
describe('los mocks respetan el esquema de PostgreSQL', () => {
  it('materiales: el stock es numérico y la unidad va aparte', () => {
    for (const material of materiales) {
      expect(typeof material.stockActual).toBe('number')
      expect(typeof material.stockMinimo).toBe('number')
      expect(typeof material.unidadMedida).toBe('string')
      // CHECK (categoria IN ('REPUESTO', 'REFRIGERANTE', 'CONSUMIBLE'))
      expect(['REPUESTO', 'REFRIGERANTE', 'CONSUMIBLE']).toContain(material.categoria)
    }
  })

  it('clientes: tipo y tipo de identificación son códigos válidos, y activo es booleano', () => {
    for (const cliente of clientes) {
      // CHECK (tipo_cliente IN ('PERSONA', 'EMPRESA'))
      expect(['PERSONA', 'EMPRESA']).toContain(cliente.tipoCliente)
      // CHECK (tipo_identificacion IN ('CEDULA', 'RNC', 'PASAPORTE'))
      expect(['CEDULA', 'RNC', 'PASAPORTE']).toContain(cliente.tipoIdentificacion)
      expect(typeof cliente.activo).toBe('boolean')
    }
  })

  it('vehiculos: todos pertenecen a un cliente registrado (id_cliente NOT NULL)', () => {
    const idsDeClientes = clientes.map((cliente) => cliente.id)
    for (const vehiculo of vehiculos) {
      expect(vehiculo.idCliente).toBeDefined()
      expect(idsDeClientes).toContain(vehiculo.idCliente)
      // CHECK (anio BETWEEN 1980 AND 2100)
      expect(vehiculo.anio).toBeGreaterThanOrEqual(1980)
      expect(vehiculo.anio).toBeLessThanOrEqual(2100)
    }
  })

  it('usuarios: los roles son los de la tabla roles y cada uno tiene sucursal', () => {
    const rolesValidos = ['ADMINISTRADOR', 'TECNICO', 'CAJERO', 'RECEPCIONISTA']
    const idsDeSucursales = sucursales.map((sucursal) => sucursal.id)

    for (const usuario of usuarios) {
      expect(usuario.roles.length).toBeGreaterThan(0)
      for (const rol of usuario.roles) expect(rolesValidos).toContain(rol)
      expect(idsDeSucursales).toContain(usuario.idSucursal)
      // La contraseña nunca debe viajar al frontend.
      expect(usuario.password).toBeUndefined()
      expect(usuario.passwordHash).toBeUndefined()
    }
  })
})
