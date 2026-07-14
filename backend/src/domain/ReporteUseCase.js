class ReporteUseCase {


    constructor(reporteRepository){

        this.reporteRepository = reporteRepository;

    }



    async obtenerReporteFacturacion(fechaInicio, fechaFin){

        return await this.reporteRepository.reporteFacturacion(
            fechaInicio,
            fechaFin
        );

    }




    async obtenerReporteOrdenesTrabajo(fechaInicio, fechaFin){

        return await this.reporteRepository.reporteOrdenesTrabajo(
            fechaInicio,
            fechaFin
        );

    }





    async obtenerReporteInventario(){

        return await this.reporteRepository.reporteInventario();

    }





    async obtenerReporteStockBajo(){

        return await this.reporteRepository.reporteStockBajo();

    }





    async obtenerReporteClientes(){

        return await this.reporteRepository.reporteClientes();

    }


}


module.exports = ReporteUseCase;