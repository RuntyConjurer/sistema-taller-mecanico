-- =============================================================================
-- Migración: 010_crear_indices.sql
-- Descripción: Crea índices B-tree para optimizar las consultas más frecuentes,
--              búsquedas de llaves foráneas y filtrados en los reportes.
-- Motor: PostgreSQL
-- Nota: Los índices para llaves primarias (PK) y campos con restricción UNIQUE
--       (como email, identificación, chasis, placa, numero_factura) se omiten 
--       aquí porque PostgreSQL los crea automáticamente de forma implícita.
-- =============================================================================

-- =============================================================================
-- CLIENTES
-- =============================================================================
CREATE INDEX idx_clientes_nombre 
    ON clientes (nombre);

-- =============================================================================
-- VEHICULOS
-- =============================================================================
CREATE INDEX idx_vehiculos_id_cliente 
    ON vehiculos (id_cliente);

CREATE INDEX idx_vehiculos_marca_modelo 
    ON vehiculos (marca, modelo);

-- =============================================================================
-- ORDENES DE TRABAJO
-- =============================================================================
CREATE INDEX idx_ordenes_trabajo_id_vehiculo 
    ON ordenes_trabajo (id_vehiculo);

CREATE INDEX idx_ordenes_trabajo_estado 
    ON ordenes_trabajo (estado);

CREATE INDEX idx_ordenes_trabajo_fecha_apertura 
    ON ordenes_trabajo (fecha_apertura);

CREATE INDEX idx_ordenes_trabajo_id_sucursal 
    ON ordenes_trabajo (id_sucursal);

-- =============================================================================
-- INVENTARIO (Nuevos índices tras la unificación)
-- =============================================================================
CREATE INDEX idx_materiales_categoria 
    ON materiales (categoria);

CREATE INDEX idx_inv_mov_id_material 
    ON inventario_movimientos (id_material);

CREATE INDEX idx_ot_mat_id_ot 
    ON orden_trabajo_materiales (id_ot);

CREATE INDEX idx_ot_mat_id_material 
    ON orden_trabajo_materiales (id_material);

-- =============================================================================
-- FACTURACIÓN Y PAGOS (Nuevos índices para tablas puente y detalles)
-- =============================================================================
CREATE INDEX idx_facturas_estado 
    ON facturas (estado);

CREATE INDEX idx_facturas_fecha 
    ON facturas (fecha);

CREATE INDEX idx_fot_id_factura 
    ON factura_ordenes_trabajo (id_factura);
-- Nota: 'id_ot' en factura_ordenes_trabajo ya tiene índice implícito por el constraint UNIQUE.

CREATE INDEX idx_fd_id_factura 
    ON factura_detalles (id_factura);

CREATE INDEX idx_fd_id_ot 
    ON factura_detalles (id_ot);

CREATE INDEX idx_pf_id_pago 
    ON pago_facturas (id_pago);

CREATE INDEX idx_pf_id_factura 
    ON pago_facturas (id_factura);

-- =============================================================================
-- FECHAS / REPORTES / OTROS
-- =============================================================================
CREATE INDEX idx_citas_fecha_cita 
    ON citas (fecha_cita);

CREATE INDEX idx_citas_estado 
    ON citas (estado);

CREATE INDEX idx_pagos_fecha_pago 
    ON pagos (fecha_pago);

CREATE INDEX idx_historial_tecnico_fecha_registro 
    ON historial_tecnico (fecha_registro);