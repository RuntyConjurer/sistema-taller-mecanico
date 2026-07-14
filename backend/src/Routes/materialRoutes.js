const express = require('express');

const router = express.Router();

module.exports = (materialController) => {

    router.get('/', materialController.obtenerTodos.bind(materialController));

    router.get('/:id', materialController.obtenerPorId.bind(materialController));

    router.post('/', materialController.crear.bind(materialController));

    router.put('/:id', materialController.actualizar.bind(materialController));

    router.delete('/:id', materialController.eliminar.bind(materialController));

    return router;
};