const Usuarios = require('../Usuarios');

class UsuarioRepository {
    async obtenerTodos() {
        return await Usuarios.findAll();
    }

    async obtenerPorId(id) {
        return await Usuarios.findByPk(id);
    }

    // Estandarizado para usar 'email'
    async obtenerPorCorreo(email) {
        return await Usuarios.findOne({ 
            where: { email: email } 
        });
    }

    // Este es el mismo que obtenerPorCorreo, 
    // lo mantenemos para que tu UseCase no rompa
    async buscarPorEmail(email) {
        return await Usuarios.findOne({ 
            where: { email: email } 
        });
    }

    async crear(data) {
        return await Usuarios.create(data);
    }

    async actualizar(id, data) {
        const usuario = await Usuarios.findByPk(id);
        if (!usuario) return null;

        await usuario.update(data);
        return usuario;
    }

    async eliminar(id) {
        const usuario = await Usuarios.findByPk(id);
        if (!usuario) return false;

        await usuario.destroy();
        return true;
    }
}

module.exports = UsuarioRepository;