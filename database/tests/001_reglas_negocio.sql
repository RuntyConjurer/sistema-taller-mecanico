\set ON_ERROR_STOP on

BEGIN;

DO $$
DECLARE
    v_vehiculo BIGINT;
    v_sucursal BIGINT;
    v_tecnico BIGINT;
    v_cajero BIGINT;
    v_material BIGINT;
    v_ot BIGINT;
    v_factura BIGINT;
    v_p0001 BOOLEAN := FALSE;
    v_p0002 BOOLEAN := FALSE;
    v_p0004 BOOLEAN := FALSE;
BEGIN
    SELECT id_vehiculo INTO v_vehiculo FROM vehiculos ORDER BY id_vehiculo LIMIT 1;
    SELECT id_sucursal INTO v_sucursal FROM sucursales ORDER BY id_sucursal LIMIT 1;
    SELECT id_usuario INTO v_tecnico FROM usuarios WHERE email = 'tecnico@sgtra.demo';
    SELECT id_usuario INTO v_cajero FROM usuarios WHERE email = 'caja@sgtra.demo';
    SELECT id_material INTO v_material FROM materiales WHERE categoria = 'REFRIGERANTE' LIMIT 1;

    BEGIN
        INSERT INTO ordenes_trabajo (id_vehiculo, id_usuario, id_sucursal, estado)
        VALUES (v_vehiculo, v_tecnico, v_sucursal, 'CERRADA');
    EXCEPTION WHEN SQLSTATE 'P0001' THEN
        v_p0001 := TRUE;
    END;

    IF NOT v_p0001 THEN
        RAISE EXCEPTION 'Fallo: cerrar una OT sin diagnóstico no produjo P0001.';
    END IF;

    INSERT INTO ordenes_trabajo (id_vehiculo, id_usuario, id_sucursal, estado)
    VALUES (v_vehiculo, v_tecnico, v_sucursal, 'ABIERTA')
    RETURNING id_ot INTO v_ot;

    INSERT INTO diagnosticos (
        id_ot, presion_baja, presion_alta, temperatura, falla_detectada, creado_por
    )
    VALUES (v_ot, 25, 150, 18, 'Diagnóstico de prueba', v_tecnico);

    BEGIN
        UPDATE ordenes_trabajo SET estado = 'CERRADA' WHERE id_ot = v_ot;
    EXCEPTION WHEN SQLSTATE 'P0002' THEN
        v_p0002 := TRUE;
    END;

    IF NOT v_p0002 THEN
        RAISE EXCEPTION 'Fallo: cerrar una OT sin factura pagada no produjo P0002.';
    END IF;

    BEGIN
        INSERT INTO orden_trabajo_materiales (
            id_ot, id_material, cantidad, precio_unitario, registrado_por
        )
        VALUES (v_ot, v_material, 999999, 1, v_tecnico);
    EXCEPTION WHEN SQLSTATE 'P0004' THEN
        v_p0004 := TRUE;
    END;

    IF NOT v_p0004 THEN
        RAISE EXCEPTION 'Fallo: consumir más que el stock no produjo P0004.';
    END IF;

    INSERT INTO facturas (
        numero_factura, subtotal, impuesto, total, estado, creado_por
    )
    VALUES (
        'TEST-' || txid_current(), 100, 18, 118, 'PAGADA', v_cajero
    )
    RETURNING id_factura INTO v_factura;

    INSERT INTO factura_ordenes_trabajo (id_factura, id_ot)
    VALUES (v_factura, v_ot);

    UPDATE ordenes_trabajo SET estado = 'CERRADA' WHERE id_ot = v_ot;

    IF NOT EXISTS (
        SELECT 1
        FROM ordenes_trabajo
        WHERE id_ot = v_ot
          AND estado = 'CERRADA'
          AND fecha_cierre IS NOT NULL
    ) THEN
        RAISE EXCEPTION 'Fallo: el cierre válido no asignó fecha_cierre.';
    END IF;

    RAISE NOTICE 'Reglas P0001, P0002, P0004 y cierre válido verificadas.';
END $$;

ROLLBACK;
