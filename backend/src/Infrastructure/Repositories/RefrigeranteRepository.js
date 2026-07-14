const Refrigerantes = require('../Refrigerantes');

class RefrigeranteRepository {
    async obtenerTodos() {
        return await Refrigerantes.findAll();
    }

    async crear(data) {
        return await Refrigerantes.create(data);
    }

    async obtenerPorId(id) {
        return await Refrigerantes.findByPk(id);
    }

    async actualizar(id, data) {
        const refrigerante = await Refrigerantes.findByPk(id);

        if (!refrigerante) return null;

        await refrigerante.update(data);

        return refrigerante;
    }

    async eliminar(id) {
        const refrigerante = await Refrigerantes.findByPk(id);

        if (!refrigerante) return null;

        await refrigerante.destroy();

        return true;
    }
}

module.exports = RefrigeranteRepository;