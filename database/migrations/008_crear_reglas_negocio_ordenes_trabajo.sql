-- =============================================================================
-- Migración: 008_crear_reglas_negocio_ordenes_trabajo.sql
-- Descripción: Implementa las reglas de negocio para el cierre de órdenes
--              de trabajo mediante una función PL/pgSQL y un trigger BEFORE
--              UPDATE.
-- Motor: PostgreSQL
-- Dependencias: 003_crear_citas_ordenes_diagnosticos.sql
--               006_crear_tablas_facturacion.sql
-- =============================================================================

CREATE OR REPLACE FUNCTION validar_cierre_orden_trabajo()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_tiene_diagnostico BOOLEAN;
    v_tiene_factura_pagada BOOLEAN;
BEGIN
    IF NEW.estado = 'CERRADA' THEN

        -- RN-01: Verificar diagnóstico
        SELECT EXISTS (
            SELECT 1
            FROM diagnosticos
            WHERE id_ot = NEW.id_ot
        ) INTO v_tiene_diagnostico;

        IF NOT v_tiene_diagnostico THEN
            RAISE EXCEPTION
                'No se puede cerrar la orden de trabajo % sin un diagnóstico registrado.', NEW.id_ot
                USING ERRCODE = 'P0001';
        END IF;

        -- RN-02: Verificar factura PAGADA (Actualizado para tabla puente)
        SELECT EXISTS (
            SELECT 1
            FROM facturas f
            INNER JOIN factura_ordenes_trabajo fot ON f.id_factura = fot.id_factura
            WHERE fot.id_ot = NEW.id_ot
              AND f.estado = 'PAGADA'
        ) INTO v_tiene_factura_pagada;

        IF NOT v_tiene_factura_pagada THEN
            RAISE EXCEPTION
                'No se puede cerrar la orden de trabajo % sin una factura en estado PAGADA.', NEW.id_ot
                USING ERRCODE = 'P0002';
        END IF;

    END IF;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION validar_cierre_orden_trabajo() IS
    'Trigger de validación para el cierre de órdenes de trabajo. Verifica diagnósticos y facturas agrupadas.';

CREATE OR REPLACE TRIGGER trg_validar_cierre_orden_trabajo
    BEFORE UPDATE OF estado
    ON ordenes_trabajo
    FOR EACH ROW
    EXECUTE FUNCTION validar_cierre_orden_trabajo();