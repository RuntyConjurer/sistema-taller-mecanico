-- =========================================================
-- Triggers para validación y descuento de inventario
-- =========================================================

-- 1) Validar que exista stock suficiente antes de insertar
CREATE OR REPLACE FUNCTION fn_validar_stock_inventario()
RETURNS TRIGGER AS $$
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
            RAISE EXCEPTION 'El material con ID % no existe', NEW.id_material;
        END IF;

        IF v_stock_actual < NEW.cantidad THEN
            RAISE EXCEPTION 'Stock insuficiente para el material ID %. Disponible: %, solicitado: %',
                NEW.id_material, v_stock_actual, NEW.cantidad;
        END IF;

    ELSIF NEW.id_refrigerante IS NOT NULL THEN
        SELECT stock_actual
        INTO v_stock_actual
        FROM refrigerantes
        WHERE id_refrigerante = NEW.id_refrigerante
        FOR UPDATE;

        IF v_stock_actual IS NULL THEN
            RAISE EXCEPTION 'El refrigerante con ID % no existe', NEW.id_refrigerante;
        END IF;

        IF v_stock_actual < NEW.cantidad THEN
            RAISE EXCEPTION 'Stock insuficiente para el refrigerante ID %. Disponible: %, solicitado: %',
                NEW.id_refrigerante, v_stock_actual, NEW.cantidad;
        END IF;

    ELSE
        RAISE EXCEPTION 'Debe especificar un material o un refrigerante';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- 2) Descontar inventario e insertar movimiento luego de la inserción
CREATE OR REPLACE FUNCTION fn_descontar_inventario_y_registrar_movimiento()
RETURNS TRIGGER AS $$
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
            NULL,
            CURRENT_TIMESTAMP
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
            NULL,
            CURRENT_TIMESTAMP
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- 3) Trigger de validación
DROP TRIGGER IF EXISTS trg_validar_stock_inventario ON orden_trabajo_materiales;

CREATE TRIGGER trg_validar_stock_inventario
BEFORE INSERT ON orden_trabajo_materiales
FOR EACH ROW
EXECUTE FUNCTION fn_validar_stock_inventario();


-- 4) Trigger de descuento y registro de movimiento
DROP TRIGGER IF EXISTS trg_descontar_inventario_y_registrar_movimiento ON orden_trabajo_materiales;

CREATE TRIGGER trg_descontar_inventario_y_registrar_movimiento
AFTER INSERT ON orden_trabajo_materiales
FOR EACH ROW
EXECUTE FUNCTION fn_descontar_inventario_y_registrar_movimiento();