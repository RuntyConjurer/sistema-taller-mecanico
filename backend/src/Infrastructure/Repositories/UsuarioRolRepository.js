const UsuarioRoles = require('../UsuarioRoles');

class UsuarioRolRepository {
    async obtenerTodos() {
        return await UsuarioRoles.findAll();
    }

    async crear(data) {
        return await UsuarioRoles.create(data);
    }

    async obtenerPorId(id) {
        return await UsuarioRoles.findByPk(id);
    }

    async actualizar(id, data) {
        const usuarioRol = await UsuarioRoles.findByPk(id);

        if (!usuarioRol) return null;

        await usuarioRol.update(data);

        return usuarioRol;
    }

    async eliminar(id) {
        const usuarioRol = await UsuarioRoles.findByPk(id);

        if (!usuarioRol) return null;

        await usuarioRol.destroy();

        return true;
    }
}

module.exports = UsuarioRolRepository;