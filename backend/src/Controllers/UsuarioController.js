class UsuarioController {
    constructor(usuarioUseCase) {
        this.usuarioUseCase = usuarioUseCase;

        // Enlazamos (bind) cada método al contexto de la clase
        this.login = this.login.bind(this);
        this.obtenerTodos = this.obtenerTodos.bind(this);
        this.crear = this.crear.bind(this);
        this.actualizar = this.actualizar.bind(this);
        this.eliminar = this.eliminar.bind(this);
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const resultado = await this.usuarioUseCase.login(
                email,
                password
            );

            res.status(200).json(resultado);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    async obtenerTodos(req, res) {
        try {
            const usuarios = await this.usuarioUseCase.obtenerTodos();
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async crear(req, res) {
        try {
            const usuario = await this.usuarioUseCase.crear(req.body);
            res.status(201).json(usuario);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const usuario = await this.usuarioUseCase.actualizar(
                req.params.id,
                req.body
            );

            res.status(200).json(usuario);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            await this.usuarioUseCase.eliminar(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = UsuarioController;