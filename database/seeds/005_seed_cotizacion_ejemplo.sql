-- Cotización aprobada lista para demostrar la conversión a OT.
DO $$
DECLARE
    v_id_cotizacion BIGINT;
    v_id_cliente BIGINT;
    v_id_vehiculo BIGINT;
    v_id_sucursal BIGINT;
    v_id_usuario BIGINT;
    v_id_servicio BIGINT;
    v_id_material BIGINT;
BEGIN
    SELECT id_cliente INTO v_id_cliente
    FROM clientes WHERE identificacion = '101123456';

    SELECT id_vehiculo INTO v_id_vehiculo
    FROM vehiculos WHERE placa = 'L000001';

    SELECT id_sucursal INTO v_id_sucursal
    FROM sucursales WHERE nombre = 'Sucursal Central';

    SELECT id_usuario INTO v_id_usuario
    FROM usuarios WHERE email = 'recepcion@sgtra.demo';

    SELECT id_servicio INTO v_id_servicio
    FROM servicios WHERE nombre = 'Detección de Fugas';

    SELECT id_material INTO v_id_material
    FROM materiales WHERE nombre = 'Tinte Detector de Fugas UV';

    INSERT INTO cotizaciones (
        numero,
        id_cliente,
        id_vehiculo,
        id_sucursal,
        creado_por,
        estado,
        vigencia,
        subtotal,
        impuesto,
        total,
        observaciones
    )
    VALUES (
        'COT-SDQ-001',
        v_id_cliente,
        v_id_vehiculo,
        v_id_sucursal,
        v_id_usuario,
        'APROBADA',
        CURRENT_DATE + 15,
        3500.00,
        630.00,
        4130.00,
        'Cotización académica para demostrar el origen de una OT.'
    )
    RETURNING id_cotizacion INTO v_id_cotizacion;

    INSERT INTO cotizacion_detalles (
        id_cotizacion,
        tipo_item,
        id_servicio,
        descripcion,
        cantidad,
        precio_unitario,
        porcentaje_impuesto,
        monto_impuesto
    )
    VALUES (
        v_id_cotizacion,
        'SERVICIO',
        v_id_servicio,
        'Detección de fugas',
        1,
        3200.00,
        18.00,
        576.00
    );

    INSERT INTO cotizacion_detalles (
        id_cotizacion,
        tipo_item,
        id_material,
        descripcion,
        cantidad,
        precio_unitario,
        porcentaje_impuesto,
        monto_impuesto
    )
    VALUES (
        v_id_cotizacion,
        'CONSUMIBLE',
        v_id_material,
        'Tinte detector de fugas UV',
        1,
        300.00,
        18.00,
        54.00
    );
END $$;
