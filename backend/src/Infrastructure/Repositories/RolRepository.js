const Roles = require('../Roles');

class RolRepository {
    async obtenerTodos() {
        return await Roles.findAll();
    }

    async crear(data) {
        return await Roles.create(data);
    }

    async obtenerPorId(id) {
        return await Roles.findByPk(id);
    }

    async actualizar(id, data) {
        const rol = await Roles.findByPk(id);

        if (!rol) return null;

        await rol.update(data);

        return rol;
    }

    async eliminar(id) {
        const rol = await Roles.findByPk(id);

        if (!rol) return null;

        await rol.destroy();

        return true;
    }
}

module.exports = RolRepository;