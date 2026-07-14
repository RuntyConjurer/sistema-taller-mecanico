const express = require('express');

const router = express.Router();

module.exports = (vehiculoController) => {

    router.get('/', vehiculoController.obtenerTodos.bind(vehiculoController));

    router.get('/:id', vehiculoController.obtenerPorId.bind(vehiculoController));

    router.post('/', vehiculoController.crear.bind(vehiculoController));

    router.put('/:id', vehiculoController.actualizar.bind(vehiculoController));

    router.delete('/:id', vehiculoController.eliminar.bind(vehiculoController));

    return router;
};