const { Op, Sequelize } = require('sequelize');

const Facturas = require('../Facturas');
const OrdenesTrabajo = require('../OrdenesTrabajo');
const Clientes = require('../Clientes');
const Vehiculos = require('../Vehiculos');
const Materiales = require('../Materiales');


class ReporteRepository {


    // ==========================
    // REPORTE DE FACTURACIÓN
    // ==========================

    async reporteFacturacion(fechaInicio, fechaFin) {

        return await Facturas.findAll({

            where: {
                fecha: {
                    [Op.between]: [
                        fechaInicio,
                        fechaFin
                    ]
                }
            },

            attributes: [
                'id_factura',
                'numero_factura',
                'fecha',
                'subtotal',
                'impuesto',
                'descuento',
                'total',
                'estado'
            ],

            include: [
                {
                    model: OrdenesTrabajo,
                    as: 'orden',

                    include: [
                        {
                            model: Vehiculos,
                            as: 'vehiculo',

                            include: [
                                {
                                    model: Clientes,
                                    as: 'cliente'
                                }
                            ]
                        }
                    ]
                }
            ],

            order:[
                ['fecha','DESC']
            ]

        });
    }




    // ==========================
    // REPORTE DE ORDENES
    // ==========================

    async reporteOrdenesTrabajo(fechaInicio, fechaFin){

        return await OrdenesTrabajo.findAll({

            where:{
                fecha_apertura:{
                    [Op.between]:[
                        fechaInicio,
                        fechaFin
                    ]
                }
            },

            attributes:[
                'id_ot',
                'estado',
                'descripcion_problema',
                'fecha_apertura',
                'fecha_cierre'
            ],

            include:[
                {
                    model: Vehiculos,
                    as:'vehiculo',

                    include:[
                        {
                            model: Clientes,
                            as:'cliente'
                        }
                    ]
                }
            ],

            order:[
                ['fecha_apertura','DESC']
            ]

        });

    }




    // ==========================
    // REPORTE INVENTARIO
    // ==========================

    async reporteInventario(){

        return await Materiales.findAll({

            attributes:[
                'id_material',
                'nombre',
                'unidad_medida',
                'stock_actual',
                'stock_minimo',
                'costo_unitario',
                'precio_venta',
                'activo'
            ],

            where:{
                activo:true
            },

            order:[
                ['stock_actual','ASC']
            ]

        });

    }




    // ==========================
    // REPORTE STOCK BAJO
    // ==========================

    async reporteStockBajo(){

        return await Materiales.findAll({

            where:{

                stock_actual:{
                    [Op.lte]: Sequelize.col('stock_minimo')
                },

                activo:true
            },

            attributes:[
                'id_material',
                'nombre',
                'stock_actual',
                'stock_minimo'
            ]

        });

    }





    // ==========================
    // REPORTE CLIENTES
    // ==========================

    async reporteClientes(){

        return await Clientes.findAll({

            attributes:[
                'id_cliente',
                'nombre',
                'telefono',
                'email'
            ],

            include:[

                {
                    model:Vehiculos,
                    as:'vehiculos',

                    attributes:[
                        'id_vehiculo',
                        'marca',
                        'modelo',
                        'placa',
                        'anio'
                    ]
                }

            ],

            order:[
                ['nombre','ASC']
            ]

        });

    }


}


module.exports = ReporteRepository;