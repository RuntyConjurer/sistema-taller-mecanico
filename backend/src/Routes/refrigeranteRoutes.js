const express = require('express');

const router = express.Router();

module.exports = (refrigeranteController) => {

    router.get('/', refrigeranteController.obtenerTodos.bind(refrigeranteController));

    router.get('/:id', refrigeranteController.obtenerPorId.bind(refrigeranteController));

    router.post('/', refrigeranteController.crear.bind(refrigeranteController));

    router.put('/:id', refrigeranteController.actualizar.bind(refrigeranteController));

    router.delete('/:id', refrigeranteController.eliminar.bind(refrigeranteController));

    return router;
};