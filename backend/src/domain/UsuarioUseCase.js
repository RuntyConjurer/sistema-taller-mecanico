const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UsuarioUseCase {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async obtenerTodos() {
        return await this.usuarioRepository.obtenerTodos();
    }

    async obtenerPorId(id) {
        const usuario = await this.usuarioRepository.obtenerPorId(id);

        if (!usuario) {
            throw new Error("Usuario no encontrado.");
        }

        return usuario;
    }

    async crear(data) {
        // Se usa data.email para coincidir con la base de datos
        const existe = await this.usuarioRepository.buscarPorEmail(data.email);

        if (existe) {
            throw new Error("El correo ya está registrado.");
        }

        // Hashing de la contraseña antes de guardar
        data.password = await bcrypt.hash(data.password, 10);

        return await this.usuarioRepository.crear(data);
    }

    async actualizar(id, data) {
        const usuario = await this.usuarioRepository.obtenerPorId(id);

        if (!usuario) {
            throw new Error("Usuario no encontrado.");
        }

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        return await this.usuarioRepository.actualizar(id, data);
    }

    async eliminar(id) {
        const usuario = await this.usuarioRepository.obtenerPorId(id);

        if (!usuario) {
            throw new Error("Usuario no encontrado.");
        }

        return await this.usuarioRepository.eliminar(id);
    }

    async login(email, password) {
        // Buscamos por email
        const usuario = await this.usuarioRepository.obtenerPorCorreo(email);

        if (!usuario) {
            throw new Error("Credenciales incorrectas.");
        }

        // Comparamos el password con el hash guardado
        const valido = await bcrypt.compare(password, usuario.password);

        if (!valido) {
            throw new Error("Credenciales incorrectas.");
        }

        // Generamos el token
        const token = jwt.sign(
            {
                id: usuario.id_usuario, // Asegúrate de que este campo exista en tu tabla
                email: usuario.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        return {
            token,
            usuario
        };
    }
}

module.exports = UsuarioUseCase;