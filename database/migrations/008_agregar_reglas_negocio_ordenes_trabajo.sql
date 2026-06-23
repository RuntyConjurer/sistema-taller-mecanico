-- =============================================================================
-- Migración: 008_agregar_reglas_negocio_ordenes_trabajo.sql
-- Descripción: Implementa las reglas de negocio para el cierre de órdenes
--              de trabajo mediante una función PL/pgSQL y un trigger BEFORE
--              UPDATE sobre la tabla ordenes_trabajo.
--
-- Reglas de negocio implementadas:
--   RN-01: No se puede cerrar una OT sin diagnóstico asociado.
--   RN-02: No se puede cerrar una OT sin factura en estado PAGADA.
--   RN-03: (Implícita en RN-02) No se puede entregar un vehículo con
--           pagos pendientes.
--
-- Autor: Sebastián Ventura - Módulo de Base de Datos
-- Fecha: 2026-06-23
-- Motor: PostgreSQL
-- Dependencias: 003_crear_citas_ordenes_diagnosticos.sql
--               Migración de facturas (Persona 2 del equipo)
-- =============================================================================


-- =============================================================================
-- FUNCIÓN: validar_cierre_orden_trabajo()
-- Descripción: Función de trigger que se ejecuta antes de actualizar el campo
--              estado en la tabla ordenes_trabajo. Si el nuevo estado es
--              CERRADA, valida que existan diagnóstico y factura pagada.
--              Si alguna validación falla, lanza un error y cancela la
--              actualización.
-- Retorno: TRIGGER (NEW row si las validaciones pasan)
-- =============================================================================

CREATE OR REPLACE FUNCTION validar_cierre_orden_trabajo()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_tiene_diagnostico BOOLEAN;
    v_tiene_factura_pagada BOOLEAN;
BEGIN
    -- Solo aplica cuando el nuevo estado es CERRADA
    IF NEW.estado = 'CERRADA' THEN

        -- ----------------------------------------------------------------
        -- RN-01: Verificar que exista diagnóstico asociado a la OT
        -- ----------------------------------------------------------------
        SELECT EXISTS (
            SELECT 1
            FROM diagnosticos
            WHERE id_ot = NEW.id_ot
        ) INTO v_tiene_diagnostico;

        IF NOT v_tiene_diagnostico THEN
            RAISE EXCEPTION
                'No se puede cerrar la orden de trabajo % sin un diagnóstico registrado. '
                'Registre el diagnóstico antes de cerrar la OT.',
                NEW.id_ot
                USING ERRCODE = 'P0001';
        END IF;

        -- ----------------------------------------------------------------
        -- RN-02: Verificar que exista factura en estado PAGADA para la OT
        -- ----------------------------------------------------------------
        SELECT EXISTS (
            SELECT 1
            FROM facturas
            WHERE id_ot = NEW.id_ot
              AND estado = 'PAGADA'
        ) INTO v_tiene_factura_pagada;

        IF NOT v_tiene_factura_pagada THEN
            RAISE EXCEPTION
                'No se puede cerrar la orden de trabajo % sin una factura en estado PAGADA. '
                'Verifique que el pago haya sido registrado antes de cerrar la OT.',
                NEW.id_ot
                USING ERRCODE = 'P0002';
        END IF;

    END IF;

    -- Si las validaciones pasan (o el nuevo estado no es CERRADA), permite
    -- continuar con la actualización
    RETURN NEW;
END;
$$;

-- Comentario de función
COMMENT ON FUNCTION validar_cierre_orden_trabajo() IS
    'Trigger de validación para el cierre de órdenes de trabajo. '
    'RN-01: Requiere diagnóstico registrado. '
    'RN-02: Requiere factura en estado PAGADA. '
    'Se ejecuta automáticamente antes de actualizar el campo estado.';


-- =============================================================================
-- TRIGGER: trg_validar_cierre_orden_trabajo
-- Descripción: Se dispara antes de cada UPDATE sobre el campo estado de la
--              tabla ordenes_trabajo. Llama a la función de validación para
--              garantizar el cumplimiento de las reglas de negocio de cierre.
-- =============================================================================

CREATE OR REPLACE TRIGGER trg_validar_cierre_orden_trabajo
    BEFORE UPDATE OF estado
    ON ordenes_trabajo
    FOR EACH ROW
    EXECUTE FUNCTION validar_cierre_orden_trabajo();

-- Comentario de trigger
COMMENT ON TRIGGER trg_validar_cierre_orden_trabajo ON ordenes_trabajo IS
    'Dispara validar_cierre_orden_trabajo() antes de actualizar el estado de una OT. '
    'Garantiza que no se cierre una OT sin diagnóstico ni factura pagada.';
