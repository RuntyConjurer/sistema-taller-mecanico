const OrdenTrabajoMateriales = require('../OrdenTrabajoMateriales');

class OrdenTrabajoMaterialRepository {
    async obtenerTodos() {
        return await OrdenTrabajoMateriales.findAll();
    }

    async crear(data) {
        return await OrdenTrabajoMateriales.create(data);
    }

    async obtenerPorId(id) {
        return await OrdenTrabajoMateriales.findByPk(id);
    }

    async actualizar(id, data) {
        const material = await OrdenTrabajoMateriales.findByPk(id);

        if (!material) return null;

        await material.update(data);

        return material;
    }

    async eliminar(id) {
        const material = await OrdenTrabajoMateriales.findByPk(id);

        if (!material) return null;

        await material.destroy();

        return true;
    }
}

module.exports = OrdenTrabajoMaterialRepository;