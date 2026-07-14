const Servicios = require('../Servicios');

class ServicioRepository {
    async obtenerTodos() {
        return await Servicios.findAll();
    }

    async crear(data) {
        return await Servicios.create(data);
    }

    async obtenerPorId(id) {
        return await Servicios.findByPk(id);
    }

    async actualizar(id, data) {
        const servicio = await Servicios.findByPk(id);

        if (!servicio) return null;

        await servicio.update(data);

        return servicio;
    }

    async eliminar(id) {
        const servicio = await Servicios.findByPk(id);

        if (!servicio) return null;

        await servicio.destroy();

        return true;
    }
}

module.exports = ServicioRepository;