const Vehiculos = require('../Vehiculos');

class VehiculoRepository {
    async obtenerTodos(){
        return await Vehiculos.findAll();
    }
    async crear(data){
        return await Vehiculos.create(data);
    }
    async obtenerPorId(id){
        return await Vehiculos.findByPk(id);
    }
    async actualizar(id, data){
        const vehiculo = Vehiculos.findByPk(id);

        if(!vehiculo) return null;

        await vehiculo.update(data);

        return vehiculo;
    }
    async eliminar(id){
        const vehiculo = await Vehiculos.findByPk(id);

        if(!vehiculo) return false;

        await vehiculo.destroy();

        return true;
    }

}

module.exports = VehiculoRepository;