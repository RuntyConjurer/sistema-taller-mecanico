const express = require('express');

const router = express.Router();

module.exports = (clienteController) => {

    router.get('/', clienteController.obtenerTodos.bind(clienteController));

    router.get('/:id', clienteController.obtenerPorId.bind(clienteController));

    router.post('/', clienteController.crear.bind(clienteController));

    router.put('/:id', clienteController.actualizar.bind(clienteController));

    router.delete('/:id', clienteController.eliminar.bind(clienteController));

    return router;
};