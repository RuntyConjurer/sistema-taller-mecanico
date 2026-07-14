const HistorialTecnico = require('../HistorialTecnico');

class HistorialTecnicoRepository {
    async obtenerTodos() {
        return await HistorialTecnico.findAll();
    }

    async crear(data) {
        return await HistorialTecnico.create(data);
    }

    async obtenerPorId(id) {
        return await HistorialTecnico.findByPk(id);
    }

    async actualizar(id, data) {
        const historial = await HistorialTecnico.findByPk(id);

        if (!historial) return null;

        await historial.update(data);

        return historial;
    }

    async eliminar(id) {
        const historial = await HistorialTecnico.findByPk(id);

        if (!historial) return null;

        await historial.destroy();

        return true;
    }
}

module.exports = HistorialTecnicoRepository;