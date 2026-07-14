const Citas = require('../Citas');

class CitaRepository {
    async obtenerTodos() {
        return await Citas.findAll();
    }

    async obtenerPorId(id) {
        return await Citas.findByPk(id);
    }

    async crear(data) {
        return await Citas.create(data);
    }

    async actualizar(id, data) {
        const cita = await Citas.findByPk(id);

        if (!cita) return null;

        await cita.update(data);

        return cita;
    }

    async eliminar(id) {
        const cita = await Citas.findByPk(id);

        if (!cita) return null;

        await cita.destroy();

        return true;
    }
}

module.exports = CitaRepository;