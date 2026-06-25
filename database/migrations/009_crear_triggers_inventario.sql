-- =============================================================================
-- Migración: 009_crear_triggers_inventario.sql
-- Descripción: Crea las funciones y triggers para validar disponibilidad de stock
--              y registrar automáticamente los movimientos de inventario al
--              consumir materiales en una orden de trabajo.
--
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
    IF NEW.id_material IS NOT NULL THEN
        SELECT stock_actual
        INTO v_stock_actual
        FROM materiales
        WHERE id_material = NEW.id_material
        FOR UPDATE;

        IF v_stock_actual IS NULL THEN
            RAISE EXCEPTION 'El material con ID % no existe', NEW.id_material
                USING ERRCODE = 'P0003';
        END IF;

        IF v_stock_actual < NEW.cantidad THEN
            RAISE EXCEPTION 'Stock insuficiente para el material ID %. Disponible: %, solicitado: %',
                NEW.id_material, v_stock_actual, NEW.cantidad
                USING ERRCODE = 'P0004';
        END IF;

    ELSIF NEW.id_refrigerante IS NOT NULL THEN
        SELECT stock_actual
        INTO v_stock_actual
        FROM refrigerantes
        WHERE id_refrigerante = NEW.id_refrigerante
        FOR UPDATE;

        IF v_stock_actual IS NULL THEN
            RAISE EXCEPTION 'El refrigerante con ID % no existe', NEW.id_refrigerante
                USING ERRCODE = 'P0003';
        END IF;

        IF v_stock_actual < NEW.cantidad THEN
            RAISE EXCEPTION 'Stock insuficiente para el refrigerante ID %. Disponible: %, solicitado: %',
                NEW.id_refrigerante, v_stock_actual, NEW.cantidad
                USING ERRCODE = 'P0004';
        END IF;

    ELSE
        RAISE EXCEPTION 'Debe especificar un material o un refrigerante'
            USING ERRCODE = 'P0005';
    END IF;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION fn_validar_stock_inventario() IS
    'Valida que exista stock suficiente de un material o refrigerante antes de insertarlo en una OT. Bloquea el registro concurrente con FOR UPDATE.';


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
    IF NEW.id_material IS NOT NULL THEN
        UPDATE materiales
        SET stock_actual = stock_actual - NEW.cantidad
        WHERE id_material = NEW.id_material;

        SELECT costo_unitario
        INTO v_costo_unitario
        FROM materiales
        WHERE id_material = NEW.id_material;

        INSERT INTO inventario_movimientos (
            id_material,
            id_refrigerante,
            tipo_movimiento,
            cantidad,
            costo_unitario,
            motivo,
            id_usuario,
            fecha_movimiento
        )
        VALUES (
            NEW.id_material,
            NULL,
            'SALIDA',
            NEW.cantidad,
            v_costo_unitario,
            'Consumo de material por orden de trabajo ID ' || NEW.id_ot,
            NEW.registrado_por,
            NOW()
        );

    ELSIF NEW.id_refrigerante IS NOT NULL THEN
        UPDATE refrigerantes
        SET stock_actual = stock_actual - NEW.cantidad
        WHERE id_refrigerante = NEW.id_refrigerante;

        SELECT costo_unitario
        INTO v_costo_unitario
        FROM refrigerantes
        WHERE id_refrigerante = NEW.id_refrigerante;

        INSERT INTO inventario_movimientos (
            id_material,
            id_refrigerante,
            tipo_movimiento,
            cantidad,
            costo_unitario,
            motivo,
            id_usuario,
            fecha_movimiento
        )
        VALUES (
            NULL,
            NEW.id_refrigerante,
            'SALIDA',
            NEW.cantidad,
            v_costo_unitario,
            'Consumo de refrigerante por orden de trabajo ID ' || NEW.id_ot,
            NEW.registrado_por,
            NOW()
        );
    END IF;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION fn_descontar_inventario_y_registrar_movimiento() IS
    'Descuenta el stock del inventario y registra automáticamente el movimiento de SALIDA, asociándolo al usuario que registró el consumo en la OT.';


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