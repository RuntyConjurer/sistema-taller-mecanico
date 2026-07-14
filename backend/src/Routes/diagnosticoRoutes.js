const express = require('express');

const router = express.Router();

module.exports = (diagnosticoController) => {

    router.get('/', diagnosticoController.obtenerTodos.bind(diagnosticoController));

    router.get('/:id', diagnosticoController.obtenerPorId.bind(diagnosticoController));

    router.post('/', diagnosticoController.crear.bind(diagnosticoController));

    router.put('/:id', diagnosticoController.actualizar.bind(diagnosticoController));

    router.delete('/:id', diagnosticoController.eliminar.bind(diagnosticoController));

    return router;
};