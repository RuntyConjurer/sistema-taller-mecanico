const Materiales = require('../Materiales');

class MaterialRepository {
    async obtenerTodos() {
        return await Materiales.findAll();
    }

    async crear(data) {
        return await Materiales.create(data);
    }

    async obtenerPorId(id) {
        return await Materiales.findByPk(id);
    }

    async actualizar(id, data) {
        const material = await Materiales.findByPk(id);

        if (!material) return null;

        await material.update(data);

        return material;
    }

    async eliminar(id) {
        const material = await Materiales.findByPk(id);

        if (!material) return null;

        await material.destroy();

        return true;
    }
}

module.exports = MaterialRepository;