const express = require('express');

const router = express.Router();

module.exports = (usuarioController) => {

    router.post('/login', usuarioController.login.bind(usuarioController));

    router.get('/', usuarioController.obtenerTodos.bind(usuarioController));

    router.post('/', usuarioController.crear.bind(usuarioController));

    router.put('/:id', usuarioController.actualizar.bind(usuarioController));

    router.delete('/:id', usuarioController.eliminar.bind(usuarioController));

    return router;
};