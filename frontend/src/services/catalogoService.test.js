import { describe, expect, it } from 'vitest'
import {
  listarServicios,
  listarSucursales,
  obtenerServicio,
  obtenerSucursal,
} from './catalogoService'

// El sitio público busca por slug (/sucursal/norte) y el panel por id numérico.
// Antes eran dos listas distintas apuntando al mismo endpoint; ahora es una sola.
describe('catálogo de servicios y sucursales', () => {
  it('encuentra una sucursal tanto por slug como por id', async () => {
    const porSlug = await obtenerSucursal('norte')
    const porId = await obtenerSucursal(2)

    expect(porSlug).not.toBeNull()
    expect(porSlug.id).toBe(porId.id)
    expect(porSlug.nombre).toBe('Sucursal Norte')
  })

  it('encuentra un servicio tanto por slug como por id', async () => {
    const porSlug = await obtenerServicio('recarga')
    const porId = await obtenerServicio(2)

    expect(porSlug.id).toBe(porId.id)
    expect(porSlug.nombre).toBe('Carga de gas refrigerante')
  })

  it('devuelve null cuando el servicio o la sucursal no existen', async () => {
    // Antes devolvía el primero de la lista, que era peor que no devolver nada.
    expect(await obtenerServicio('no-existe')).toBeNull()
    expect(await obtenerSucursal('no-existe')).toBeNull()
  })

  it('usa los tipos de la base de datos: el precio es numérico', async () => {
    const servicios = await listarServicios()
    for (const servicio of servicios) {
      expect(typeof servicio.precioBase).toBe('number')
      expect(typeof servicio.slug).toBe('string')
    }
  })

  it('las sucursales coinciden con el seed de la base de datos', async () => {
    const sucursales = await listarSucursales()
    expect(sucursales.map((item) => item.nombre)).toEqual(['Sucursal Central', 'Sucursal Norte'])
  })
})
