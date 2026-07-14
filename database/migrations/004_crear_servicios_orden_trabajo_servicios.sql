-- =============================================================================
-- Migración: 004_crear_servicios_orden_trabajo_servicios.sql
-- Descripción: Crea las tablas del catálogo de servicios y su relación N:M
--              con las órdenes de trabajo (servicios aplicados por OT).
-- Motor: PostgreSQL
-- Normalización: 3FN
-- Dependencias: 003_crear_citas_ordenes_diagnosticos.sql
-- =============================================================================

-- =============================================================================
-- TABLA: servicios
-- =============================================================================

CREATE TABLE servicios (
    id_servicio         BIGSERIAL       NOT NULL,
    nombre              VARCHAR(150)    NOT NULL,
    descripcion         TEXT,
    precio_base         NUMERIC(12, 2)  NOT NULL DEFAULT 0,
    porcentaje_impuesto NUMERIC(5, 2)   NOT NULL DEFAULT 18.00,
    activo              BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_servicios PRIMARY KEY (id_servicio),
    CONSTRAINT uq_servicios_nombre UNIQUE (nombre),
    CONSTRAINT ck_servicios_precio_base CHECK (precio_base >= 0),
    CONSTRAINT ck_servicios_porcentaje_impuesto CHECK (porcentaje_impuesto >= 0)
);

COMMENT ON TABLE servicios IS 'Catálogo de servicios ofrecidos por el taller (recargas, reparaciones, etc.).';
COMMENT ON COLUMN servicios.porcentaje_impuesto IS 'Tasa de impuesto por defecto (ej. 18.00 para ITBIS). Sirve como plantilla.';


-- =============================================================================
-- TABLA: orden_trabajo_servicios
-- =============================================================================

CREATE TABLE orden_trabajo_servicios (
    id_ot_servicio  BIGSERIAL       NOT NULL,
    id_ot           BIGINT          NOT NULL,
    id_servicio     BIGINT          NOT NULL,
    cantidad        NUMERIC(8, 2)   NOT NULL DEFAULT 1,
    precio_unitario NUMERIC(12, 2)  NOT NULL,
    subtotal        NUMERIC(14, 2)  GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    creado_en       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_orden_trabajo_servicios PRIMARY KEY (id_ot_servicio),
    CONSTRAINT fk_ots_orden_trabajo FOREIGN KEY (id_ot) REFERENCES ordenes_trabajo (id_ot) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_ots_servicio FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT ck_ots_cantidad CHECK (cantidad > 0),
    CONSTRAINT ck_ots_precio_unitario CHECK (precio_unitario >= 0)
);

COMMENT ON TABLE orden_trabajo_servicios IS 'Servicios aplicados en cada orden de trabajo. Resuelve la relación N:M.';