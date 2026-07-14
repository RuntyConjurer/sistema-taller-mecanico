const express = require('express');

const router = express.Router();

module.exports = (servicioController) => {

    router.get('/', servicioController.obtenerTodos.bind(servicioController));

    router.get('/:id', servicioController.obtenerPorId.bind(servicioController));

    router.post('/', servicioController.crear.bind(servicioController));

    router.put('/:id', servicioController.actualizar.bind(servicioController));

    router.delete('/:id', servicioController.eliminar.bind(servicioController));

    return router;
};