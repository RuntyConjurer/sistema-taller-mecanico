-- =============================================================================
-- Migración: 004_crear_servicios_orden_trabajo_servicios.sql
-- Descripción: Crea las tablas del catálogo de servicios y su relación N:M
--              con las órdenes de trabajo (servicios aplicados por OT).
-- Autor: Sebastián Ventura - Módulo de Base de Datos
-- Fecha: 2026-06-23
-- Motor: PostgreSQL
-- Normalización: 3FN
-- Dependencias: 003_crear_citas_ordenes_diagnosticos.sql
-- =============================================================================


-- =============================================================================
-- TABLA: servicios
-- Descripción: Catálogo de servicios ofrecidos por el taller. Cada servicio
--              tiene un precio base que puede ajustarse al aplicarlo en una
--              orden de trabajo.
-- =============================================================================

CREATE TABLE servicios (
    id_servicio  BIGSERIAL       NOT NULL,
    nombre       VARCHAR(150)    NOT NULL,
    descripcion  TEXT,
    precio_base  NUMERIC(12, 2)  NOT NULL DEFAULT 0,
    activo       BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- Llave primaria
    CONSTRAINT pk_servicios
        PRIMARY KEY (id_servicio),

    -- Unicidad del nombre del servicio
    CONSTRAINT uq_servicios_nombre
        UNIQUE (nombre),

    -- El precio base no puede ser negativo
    CONSTRAINT ck_servicios_precio_base
        CHECK (precio_base >= 0)
);

-- Comentario de tabla
COMMENT ON TABLE servicios IS
    'Catálogo de servicios ofrecidos por el taller (recargas, reparaciones, mantenimientos, etc.).';

-- Comentarios de columnas
COMMENT ON COLUMN servicios.id_servicio IS 'Identificador único autoincremental del servicio.';
COMMENT ON COLUMN servicios.nombre      IS 'Nombre del servicio. Único en el catálogo.';
COMMENT ON COLUMN servicios.descripcion IS 'Descripción detallada del servicio ofrecido.';
COMMENT ON COLUMN servicios.precio_base IS 'Precio base referencial del servicio. No puede ser negativo.';
COMMENT ON COLUMN servicios.activo      IS 'Indica si el servicio está disponible para asignarse. Por defecto TRUE.';
COMMENT ON COLUMN servicios.creado_en   IS 'Fecha y hora de creación del registro (con zona horaria).';


-- =============================================================================
-- TABLA: orden_trabajo_servicios
-- Descripción: Tabla intermedia que resuelve la relación N:M entre
--              ordenes_trabajo y servicios. Registra los servicios aplicados
--              en cada orden de trabajo con su cantidad, precio unitario
--              acordado y subtotal calculado automáticamente.
-- Dependencias: ordenes_trabajo, servicios
-- =============================================================================

CREATE TABLE orden_trabajo_servicios (
    id_ot_servicio  BIGSERIAL       NOT NULL,
    id_ot           BIGINT          NOT NULL,
    id_servicio     BIGINT          NOT NULL,
    cantidad        NUMERIC(8, 2)   NOT NULL DEFAULT 1,
    precio_unitario NUMERIC(12, 2)  NOT NULL,
    subtotal        NUMERIC(14, 2)  GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    creado_en       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- Llave primaria
    CONSTRAINT pk_orden_trabajo_servicios
        PRIMARY KEY (id_ot_servicio),

    -- Llave foránea hacia ordenes_trabajo
    -- CASCADE: si se elimina la OT, se eliminan sus servicios asociados
    CONSTRAINT fk_ots_orden_trabajo
        FOREIGN KEY (id_ot)
        REFERENCES ordenes_trabajo (id_ot)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    -- Llave foránea hacia servicios
    CONSTRAINT fk_ots_servicio
        FOREIGN KEY (id_servicio)
        REFERENCES servicios (id_servicio)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- La cantidad debe ser mayor que cero
    CONSTRAINT ck_ots_cantidad
        CHECK (cantidad > 0),

    -- El precio unitario no puede ser negativo
    CONSTRAINT ck_ots_precio_unitario
        CHECK (precio_unitario >= 0)
);

-- Comentario de tabla
COMMENT ON TABLE orden_trabajo_servicios IS
    'Servicios aplicados en cada orden de trabajo. Resuelve la relación N:M entre ordenes_trabajo y servicios.';

-- Comentarios de columnas
COMMENT ON COLUMN orden_trabajo_servicios.id_ot_servicio  IS 'Identificador único autoincremental del registro de servicio por OT.';
COMMENT ON COLUMN orden_trabajo_servicios.id_ot           IS 'Orden de trabajo a la que pertenece el servicio aplicado.';
COMMENT ON COLUMN orden_trabajo_servicios.id_servicio     IS 'Servicio del catálogo que se aplica en la OT.';
COMMENT ON COLUMN orden_trabajo_servicios.cantidad        IS 'Cantidad del servicio aplicado. Debe ser mayor que cero.';
COMMENT ON COLUMN orden_trabajo_servicios.precio_unitario IS 'Precio unitario acordado al momento de aplicar el servicio. Puede diferir del precio_base del catálogo.';
COMMENT ON COLUMN orden_trabajo_servicios.subtotal        IS 'Subtotal calculado automáticamente: cantidad * precio_unitario. Columna generada (STORED).';
COMMENT ON COLUMN orden_trabajo_servicios.creado_en       IS 'Fecha y hora en que se agregó el servicio a la OT (con zona horaria).';
