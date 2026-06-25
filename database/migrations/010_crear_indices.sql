-- =============================================================================
-- Migración: 010_crear_indices.sql
-- Descripción: Crea índices B-tree para optimizar las consultas más frecuentes,
--              búsquedas de llaves foráneas y filtrados en los reportes.
--
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
-- FACTURAS
-- =============================================================================
CREATE INDEX idx_facturas_estado 
    ON facturas (estado);

CREATE INDEX idx_facturas_fecha 
    ON facturas (fecha);

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