-- =============================================================================
-- Migración: 009_crear_triggers_inventario.sql
-- Descripción: Crea funciones y triggers para control de stock concurrente y
--              descargo automático de inventario unificado.
-- Motor: PostgreSQL
-- Dependencias: 003_crear_citas_ordenes_diagnosticos.sql
--               005_crear_tablas_inventario.sql
-- =============================================================================

-- =============================================================================
-- FUNCIÓN: fn_validar_stock_inventario()
-- =============================================================================
CREATE OR REPLACE FUNCTION fn_validar_stock_inventario()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
DECLARE
    v_stock_actual NUMERIC(12,2);
BEGIN
    -- Bloqueo pesimista concurrente sobre el artículo solicitando salida
    SELECT stock_actual
    INTO v_stock_actual
    FROM materiales
    WHERE id_material = NEW.id_material
    FOR UPDATE;

    IF v_stock_actual IS NULL THEN
        RAISE EXCEPTION 'El artículo de inventario con ID % no existe.', NEW.id_material
            USING ERRCODE = 'P0003';
    END IF;

    IF v_stock_actual < NEW.cantidad THEN
        RAISE EXCEPTION 'Stock insuficiente para el artículo ID %. Disponible: %, solicitado: %',
            NEW.id_material, v_stock_actual, NEW.cantidad
            USING ERRCODE = 'P0004';
    END IF;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION fn_validar_stock_inventario() IS
    'Verifica disponibilidad de stock antes de asociar un material a una OT. Previene condiciones de carrera con FOR UPDATE.';


-- =============================================================================
-- FUNCIÓN: fn_descontar_inventario_y_registrar_movimiento()
-- =============================================================================
CREATE OR REPLACE FUNCTION fn_descontar_inventario_y_registrar_movimiento()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
DECLARE
    v_costo_unitario NUMERIC(12,2);
BEGIN
    -- 1. Descontar stock
    UPDATE materiales
    SET stock_actual = stock_actual - NEW.cantidad
    WHERE id_material = NEW.id_material;

    -- 2. Obtener costo histórico para asentar contabilidad del movimiento
    SELECT costo_unitario
    INTO v_costo_unitario
    FROM materiales
    WHERE id_material = NEW.id_material;

    -- 3. Registrar kardex de salida
    INSERT INTO inventario_movimientos (
        id_material,
        tipo_movimiento,
        cantidad,
        costo_unitario,
        motivo,
        id_usuario,
        fecha_movimiento
    )
    VALUES (
        NEW.id_material,
        'SALIDA',
        NEW.cantidad,
        v_costo_unitario,
        'Consumo por orden de trabajo ID ' || NEW.id_ot,
        NEW.registrado_por,
        NOW()
    );

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION fn_descontar_inventario_y_registrar_movimiento() IS
    'Genera el descargo físico de stock y asienta la salida en el historial de movimientos de inventario.';


-- =============================================================================
-- TRIGGERS
-- =============================================================================

CREATE TRIGGER trg_validar_stock_inventario
    BEFORE INSERT ON orden_trabajo_materiales
    FOR EACH ROW
    EXECUTE FUNCTION fn_validar_stock_inventario();

CREATE TRIGGER trg_descontar_inventario_y_registrar_movimiento
    AFTER INSERT ON orden_trabajo_materiales
    FOR EACH ROW
    EXECUTE FUNCTION fn_descontar_inventario_y_registrar_movimiento();