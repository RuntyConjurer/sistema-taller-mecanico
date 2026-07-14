const OrdenesTrabajo = require('../OrdenesTrabajo');

class OrdenTrabajoRepository {
    async obtenerTodos() {
        return await OrdenesTrabajo.findAll();
    }

    async crear(data) {
        return await OrdenesTrabajo.create(data);
    }

    async obtenerPorId(id) {
        return await OrdenesTrabajo.findByPk(id);
    }

    async actualizar(id, data) {
        const orden = await OrdenesTrabajo.findByPk(id);

        if (!orden) return null;

        await orden.update(data);

        return orden;
    }

    async eliminar(id) {
        const orden = await OrdenesTrabajo.findByPk(id);

        if (!orden) return null;

        await orden.destroy();

        return true;
    }
}

module.exports = OrdenTrabajoRepository;