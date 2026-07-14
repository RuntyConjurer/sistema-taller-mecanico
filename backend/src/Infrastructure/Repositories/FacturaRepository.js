const Facturas = require('../Facturas');

class FacturaRepository {
    async obtenerTodos(){
        return await Facturas.findAll();
    }

    async obtenerPorId(id){
        return await Facturas.findByPk(id);
    }
    async actualizar(id, data){
        const factura = Facturas.findByPk(id);

        if(!factura) return null;
        
        await factura.update(data);

        return factura;
    }

    async eliminar(id){
        const factura = Facturas.findByPk(id);

        if(!factura) return false;

        await factura.destroy();

        return true;
    }
    
    async obtenerPorOrdenTrabajo(idOT) {
    return await Facturas.findOne({
        where: {
            id_ot: idOT
        }
    });
}

}

module.exports = FacturaRepository;