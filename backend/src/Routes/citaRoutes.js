const express = require('express');

const router = express.Router();

module.exports = (citaController) => {

    router.get('/', citaController.obtenerTodos.bind(citaController));

    router.get('/:id', citaController.obtenerPorId.bind(citaController));

    router.post('/', citaController.crear.bind(citaController));

    router.put('/:id', citaController.actualizar.bind(citaController));

    router.delete('/:id', citaController.eliminar.bind(citaController));

    return router;
};