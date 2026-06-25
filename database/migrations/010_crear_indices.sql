-- =========================================================
-- Índices para mejorar búsquedas frecuentes
-- =========================================================

-- =========================================================
-- CLIENTES
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_clientes_identificacion
    ON clientes (identificacion);

CREATE INDEX IF NOT EXISTS idx_clientes_nombre
    ON clientes (nombre);

CREATE INDEX IF NOT EXISTS idx_clientes_email
    ON clientes (email);

-- =========================================================
-- VEHICULOS
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_vehiculos_id_cliente
    ON vehiculos (id_cliente);

CREATE INDEX IF NOT EXISTS idx_vehiculos_placa
    ON vehiculos (placa);

CREATE INDEX IF NOT EXISTS idx_vehiculos_chasis
    ON vehiculos (chasis);

CREATE INDEX IF NOT EXISTS idx_vehiculos_marca_modelo
    ON vehiculos (marca, modelo);

-- =========================================================
-- ORDENES DE TRABAJO
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_ordenes_trabajo_id_vehiculo
    ON ordenes_trabajo (id_vehiculo);

CREATE INDEX IF NOT EXISTS idx_ordenes_trabajo_estado
    ON ordenes_trabajo (estado);

CREATE INDEX IF NOT EXISTS idx_ordenes_trabajo_fecha_apertura
    ON ordenes_trabajo (fecha_apertura);

CREATE INDEX IF NOT EXISTS idx_ordenes_trabajo_id_sucursal
    ON ordenes_trabajo (id_sucursal);

-- =========================================================
-- FACTURAS
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_facturas_numero_factura
    ON facturas (numero_factura);

CREATE INDEX IF NOT EXISTS idx_facturas_id_ot
    ON facturas (id_ot);

CREATE INDEX IF NOT EXISTS idx_facturas_estado
    ON facturas (estado);

CREATE INDEX IF NOT EXISTS idx_facturas_fecha
    ON facturas (fecha);

-- =========================================================
-- FECHAS / REPORTES
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_citas_fecha_cita
    ON citas (fecha_cita);

CREATE INDEX IF NOT EXISTS idx_citas_estado
    ON citas (estado);

CREATE INDEX IF NOT EXISTS idx_pagos_fecha_pago
    ON pagos (fecha_pago);

CREATE INDEX IF NOT EXISTS idx_historial_tecnico_fecha_registro
    ON historial_tecnico (fecha_registro);