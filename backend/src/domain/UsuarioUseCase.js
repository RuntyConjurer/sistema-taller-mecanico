const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UsuarioUseCase {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async crear(data) {
        const existe = await this.usuarioRepository.buscarPorEmail(data.email);
        if (existe) throw new Error("El correo ya está registrado.");

        // 1. Hashear password y asignarla a 'password_hash'
        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        // 2. Crear objeto con los nombres exactos de la BD
        const usuarioData = {
            ...data,
            password_hash: hashedPassword
        };
        delete usuarioData.password; // Quitamos la plana

        return await this.usuarioRepository.crear(usuarioData);
    }

    async login(email, password) {
        const usuario = await this.usuarioRepository.obtenerPorCorreo(email);
        if (!usuario) throw new Error("Credenciales incorrectas.");

        // 3. Comparar contra 'password_hash'
        const valido = await bcrypt.compare(password, usuario.password_hash);
        if (!valido) throw new Error("Credenciales incorrectas.");

        const token = jwt.sign(
            { id: usuario.id_usuario, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        return { token, usuario };
    }
    
    // ... mantén tus otros métodos (obtenerTodos, etc.)
}
module.exports = UsuarioUseCase;