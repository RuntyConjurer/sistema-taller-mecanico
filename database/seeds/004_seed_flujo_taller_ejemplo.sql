-- =============================================================================
-- Seed: 004_seed_flujo_taller_ejemplo.sql
-- Descripción: Simula un flujo de trabajo completo y exitoso para validar la
--              integridad relacional y disparar los triggers del sistema
--              (inventario y reglas de negocio de cierre).
-- Autor: Sebastián Ventura - Módulo de Base de Datos
-- Motor: PostgreSQL
-- =============================================================================

-- =============================================================================
-- 0. PRE-REQUISITO: POBLAR CATÁLOGO DE SERVICIOS
-- =============================================================================
INSERT INTO servicios (nombre, descripcion, precio_base, porcentaje_impuesto)
VALUES 
    ('Mantenimiento Preventivo A/C', 'Limpieza de evaporador, condensador y revisión de presiones', 2500.00, 18.00),
    ('Diagnóstico HVAC', 'Lecturas de presión, temperatura y prueba de fuga antes de reparar', 2500.00, 18.00),
    ('Carga de Gas Refrigerante', 'Vacío del sistema, carga precisa y comprobación final', 4500.00, 18.00),
    ('Detección de Fugas', 'Inyección de tinte UV y rastreo de microfugas', 3200.00, 18.00),
    ('Limpieza de Evaporador', 'Saneamiento de la cabina y recuperación del flujo de aire', 6800.00, 18.00),
    ('Reparación de Sistema HVAC', 'Corrección técnica de fugas y componentes averiados', 4000.00, 18.00);

-- =============================================================================
-- 1. SIMULACIÓN DEL FLUJO COMPLETO (BLOQUE TRANSACCIONAL)
-- =============================================================================
DO $$
DECLARE
    v_id_cliente BIGINT;
    v_id_vehiculo BIGINT;
    v_id_sucursal BIGINT;
    v_id_tecnico BIGINT;
    v_id_cajero BIGINT;
    v_id_servicio BIGINT;
    v_id_refrigerante BIGINT;
    
    -- Variables para almacenar los IDs generados dinámicamente
    v_id_cita BIGINT;
    v_id_ot BIGINT;
    v_id_factura BIGINT;
    v_id_pago BIGINT;
BEGIN
    -- -------------------------------------------------------------------------
    -- FASE 1: Obtener referencias maestras (Sin usar IDs quemados/hardcodeados)
    -- -------------------------------------------------------------------------
    SELECT id_cliente INTO v_id_cliente FROM clientes WHERE identificacion = '001-1234567-8'; -- Juan Pérez
    SELECT id_vehiculo INTO v_id_vehiculo FROM vehiculos WHERE placa = 'A000001'; -- Toyota Corolla
    SELECT id_sucursal INTO v_id_sucursal FROM sucursales WHERE nombre = 'Sucursal Central';
    SELECT id_usuario INTO v_id_tecnico FROM usuarios WHERE email = 'tecnico@sgtra.demo';
    SELECT id_usuario INTO v_id_cajero FROM usuarios WHERE email = 'caja@sgtra.demo';
    SELECT id_servicio INTO v_id_servicio FROM servicios WHERE nombre = 'Mantenimiento Preventivo A/C';
    SELECT id_material INTO v_id_refrigerante FROM materiales WHERE nombre = 'Gas Refrigerante R-134a';

    -- -------------------------------------------------------------------------
    -- FASE 2: Recepción del Vehículo
    -- -------------------------------------------------------------------------
    -- 2.1 Cita
    INSERT INTO citas (id_cliente, id_vehiculo, id_sucursal, fecha_cita, estado, motivo)
    VALUES (v_id_cliente, v_id_vehiculo, v_id_sucursal, NOW() - INTERVAL '2 days', 'COMPLETADA', 'El aire enfría poco al mediodía')
    RETURNING id_cita INTO v_id_cita;

    -- 2.2 Apertura de Orden de Trabajo
    INSERT INTO ordenes_trabajo (id_vehiculo, id_usuario, id_sucursal, id_cita, estado, descripcion_problema)
    VALUES (v_id_vehiculo, v_id_tecnico, v_id_sucursal, v_id_cita, 'EN_REPARACION', 'Cliente reporta bajo rendimiento del A/C bajo sol.')
    RETURNING id_ot INTO v_id_ot;

    -- -------------------------------------------------------------------------
    -- FASE 3: Diagnóstico y Reparación
    -- -------------------------------------------------------------------------
    -- 3.1 Diagnóstico (Satisface la RN-01 de la OT)
    INSERT INTO diagnosticos (id_ot, presion_baja, presion_alta, temperatura, falla_detectada, creado_por)
    VALUES (v_id_ot, 25.0, 150.0, 18.5, 'Fuga menor en válvula de servicio y falta de refrigerante', v_id_tecnico);

    -- 3.2 Aplicar Servicios a la OT
    INSERT INTO orden_trabajo_servicios (id_ot, id_servicio, cantidad, precio_unitario)
    VALUES (v_id_ot, v_id_servicio, 1, 2500.00);

    -- 3.3 Consumir Materiales 
    -- ¡ESTO DISPARA EL TRIGGER fn_descontar_inventario_y_registrar_movimiento!
    INSERT INTO orden_trabajo_materiales (id_ot, id_material, cantidad, precio_unitario, registrado_por)
    VALUES (v_id_ot, v_id_refrigerante, 12, 45.00, v_id_tecnico); -- 12 onzas

    -- -------------------------------------------------------------------------
    -- FASE 4: Facturación y Pago
    -- -------------------------------------------------------------------------
    -- 4.1 Crear Factura (Subtotal: 2500 + (12*45) = 3040 | ITBIS 18% = 547.20 | Total = 3587.20)
    INSERT INTO facturas (numero_factura, subtotal, impuesto, total, estado, creado_por)
    VALUES ('FC-0001', 3040.00, 547.20, 3587.20, 'PENDIENTE', v_id_cajero)
    RETURNING id_factura INTO v_id_factura;

    -- 4.2 Ligar Factura con OT (Tabla Puente)
    INSERT INTO factura_ordenes_trabajo (id_factura, id_ot) 
    VALUES (v_id_factura, v_id_ot);

    -- 4.3 Detalles de la Factura
    INSERT INTO factura_detalles (id_factura, id_ot, tipo_item, descripcion, cantidad, precio_unitario, porcentaje_impuesto, monto_impuesto)
    VALUES 
        (v_id_factura, v_id_ot, 'SERVICIO', 'Mantenimiento Preventivo A/C', 1, 2500.00, 18.00, 450.00),
        (v_id_factura, v_id_ot, 'REFRIGERANTE', 'Gas Refrigerante R-134a (Onzas)', 12, 45.00, 18.00, 97.20);

    -- 4.4 Registrar Pago
    INSERT INTO pagos (monto_total, forma_pago, referencia, recibido_por)
    VALUES (3587.20, 'TARJETA', 'TX-998877', v_id_cajero)
    RETURNING id_pago INTO v_id_pago;

    -- 4.5 Aplicar el Pago a la Factura
    INSERT INTO pago_facturas (id_pago, id_factura, monto_aplicado)
    VALUES (v_id_pago, v_id_factura, 3587.20);

    -- -------------------------------------------------------------------------
    -- FASE 5: Cierre y Auditoría
    -- -------------------------------------------------------------------------
    -- 5.1 Cambiar estado de Factura
    UPDATE facturas SET estado = 'PAGADA' WHERE id_factura = v_id_factura;
    
    -- 5.2 Cambiar estado de la OT 
    -- ¡ESTO DISPARA EL TRIGGER trg_validar_cierre_orden_trabajo! Satisface RN-01 y RN-02.
    UPDATE ordenes_trabajo SET estado = 'CERRADA', fecha_cierre = NOW() WHERE id_ot = v_id_ot;

    -- 5.3 Registrar en Historial Técnico
    INSERT INTO historial_tecnico (id_vehiculo, id_ot, descripcion, recomendaciones, registrado_por)
    VALUES (v_id_vehiculo, v_id_ot, 'Se corrigió fuga en válvula de servicio y se recargaron 12oz de R-134a.', 'Revisar presiones nuevamente en 6 meses.', v_id_tecnico);

END $$;
