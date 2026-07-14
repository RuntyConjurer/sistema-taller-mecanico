-- La base de datos es la autoridad final para cerrar una orden de trabajo.

DROP TRIGGER IF EXISTS trg_validar_cierre_orden_trabajo ON ordenes_trabajo;

CREATE OR REPLACE FUNCTION validar_cierre_orden_trabajo()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.estado = 'CERRADA' THEN
        IF NOT EXISTS (
            SELECT 1
            FROM diagnosticos d
            WHERE d.id_ot = NEW.id_ot
        ) THEN
            RAISE EXCEPTION
                'No se puede cerrar la orden de trabajo % sin un diagnóstico registrado.',
                NEW.id_ot
                USING ERRCODE = 'P0001';
        END IF;

        IF NOT EXISTS (
            SELECT 1
            FROM factura_ordenes_trabajo fot
            INNER JOIN facturas f ON f.id_factura = fot.id_factura
            WHERE fot.id_ot = NEW.id_ot
              AND f.estado = 'PAGADA'
        ) THEN
            RAISE EXCEPTION
                'No se puede cerrar la orden de trabajo % sin una factura pagada.',
                NEW.id_ot
                USING ERRCODE = 'P0002';
        END IF;

        NEW.fecha_cierre := COALESCE(NEW.fecha_cierre, NOW());
    ELSE
        NEW.fecha_cierre := NULL;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validar_cierre_orden_trabajo
    BEFORE INSERT OR UPDATE OF estado, fecha_cierre
    ON ordenes_trabajo
    FOR EACH ROW
    EXECUTE FUNCTION validar_cierre_orden_trabajo();

ALTER TABLE ordenes_trabajo
    ADD CONSTRAINT ck_ot_estado_fecha_cierre CHECK (
        (estado = 'CERRADA' AND fecha_cierre IS NOT NULL)
        OR
        (estado <> 'CERRADA' AND fecha_cierre IS NULL)
    );

COMMENT ON FUNCTION validar_cierre_orden_trabajo() IS
    'Exige diagnóstico y factura pagada al cerrar una OT, tanto en INSERT como en UPDATE.';
