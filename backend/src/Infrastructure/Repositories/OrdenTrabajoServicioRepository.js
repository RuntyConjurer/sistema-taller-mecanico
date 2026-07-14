const OrdenTrabajoServicios = require('../OrdenTrabajoServicios');

class OrdenTrabajoServicioRepository {
    async obtenerTodos() {
        return await OrdenTrabajoServicios.findAll();
    }

    async crear(data) {
        return await OrdenTrabajoServicios.create(data);
    }

    async obtenerPorId(id) {
        return await OrdenTrabajoServicios.findByPk(id);
    }

    async actualizar(id, data) {
        const servicio = await OrdenTrabajoServicios.findByPk(id);

        if (!servicio) return null;

        await servicio.update(data);

        return servicio;
    }

    async eliminar(id) {
        const servicio = await OrdenTrabajoServicios.findByPk(id);

        if (!servicio) return null;

        await servicio.destroy();

        return true;
    }
}

module.exports = OrdenTrabajoServicioRepository;