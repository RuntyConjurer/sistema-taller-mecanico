const Diagnosticos = require('../Diagnosticos');

class DiagnosticoRepository {
    async obtenerTodos() {
        return await Diagnosticos.findAll();
    }

    async obtenerPorId(id) {
        return await Diagnosticos.findByPk(id);
    }

    async crear(data) {
        return await Diagnosticos.create(data);
    }

    async actualizar(id, data) {
        const diagnostico = await Diagnosticos.findByPk(id);

        if (!diagnostico) return null;

        await diagnostico.update(data);

        return diagnostico;
    }

    async eliminar(id) {
        const diagnostico = await Diagnosticos.findByPk(id);

        if (!diagnostico) return null;

        await diagnostico.destroy();

        return true;
    }
    async obtenerPorOrdenTrabajo(idOT) {
    return await Diagnosticos.findOne({
        where: {
            id_ot: idOT
        }
    });
}

}

module.exports = DiagnosticoRepository;