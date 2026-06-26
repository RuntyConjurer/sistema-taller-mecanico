-- =============================================================================
-- Migración: 005_crear_tablas_inventario.sql
-- Descripción: Crea el catálogo unificado de inventario (materiales, repuestos y 
--              refrigerantes), el registro de movimientos físicas y su consumo en OTs.
-- Motor: PostgreSQL
-- Normalización: 3FN
-- Dependencias: 001_crear_usuarios_roles_sucursales.sql, 003_crear_citas_ordenes_diagnosticos.sql
-- =============================================================================


-- =============================================================================
-- TABLA: materiales
-- Descripción: Catálogo centralizado de todos los artículos físicos del taller.
-- =============================================================================

CREATE TABLE materiales (
    id_material    BIGSERIAL       NOT NULL,
    nombre         VARCHAR(100)    NOT NULL,
    descripcion    TEXT,
    categoria      VARCHAR(30)     NOT NULL DEFAULT 'REPUESTO',
    unidad_medida  VARCHAR(30)     NOT NULL,
    stock_actual   NUMERIC(12,2)   NOT NULL DEFAULT 0,
    stock_minimo   NUMERIC(12,2)   NOT NULL DEFAULT 0,
    costo_unitario NUMERIC(12,2)   NOT NULL DEFAULT 0,
    precio_venta   NUMERIC(12,2)   NOT NULL DEFAULT 0,
    activo         BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_materiales PRIMARY KEY (id_material),
    CONSTRAINT uq_materiales_nombre UNIQUE (nombre),
    
    CONSTRAINT ck_materiales_categoria CHECK (categoria IN ('REPUESTO', 'REFRIGERANTE', 'CONSUMIBLE')),
    CONSTRAINT ck_materiales_stock_actual CHECK (stock_actual >= 0),
    CONSTRAINT ck_materiales_stock_minimo CHECK (stock_minimo >= 0),
    CONSTRAINT ck_materiales_costo_unitario CHECK (costo_unitario >= 0),
    CONSTRAINT ck_materiales_precio_venta CHECK (precio_venta >= 0)
);

COMMENT ON TABLE materiales IS 'Catálogo unificado de repuestos, gases refrigerantes e insumos del taller.';
COMMENT ON COLUMN materiales.categoria IS 'Clasificación del artículo (REPUESTO, REFRIGERANTE o CONSUMIBLE).';
COMMENT ON COLUMN materiales.stock_actual IS 'Cantidad disponible. Para refrigerantes se mide típicamente en gramos/onzas.';


-- =============================================================================
-- TABLA: inventario_movimientos
-- Descripción: Registro histórico de entradas, salidas y ajustes de inventario.
-- =============================================================================

CREATE TABLE inventario_movimientos (
    id_movimiento    BIGSERIAL       NOT NULL,
    id_material      BIGINT          NOT NULL,
    tipo_movimiento  VARCHAR(20)     NOT NULL,
    cantidad         NUMERIC(12,2)   NOT NULL,
    costo_unitario   NUMERIC(12,2),
    motivo           TEXT,
    id_usuario       BIGINT,
    fecha_movimiento TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_inventario_movimientos PRIMARY KEY (id_movimiento),
    CONSTRAINT fk_inv_mov_material FOREIGN KEY (id_material) REFERENCES materiales(id_material) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_inv_mov_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    
    CONSTRAINT ck_inv_mov_tipo CHECK (tipo_movimiento IN ('ENTRADA', 'SALIDA', 'AJUSTE')),
    CONSTRAINT ck_inv_mov_cantidad CHECK (cantidad > 0),
    CONSTRAINT ck_inv_mov_costo CHECK (costo_unitario IS NULL OR costo_unitario >= 0)
);

COMMENT ON TABLE inventario_movimientos IS 'Historial inmutable de auditoría para entradas y salidas de stock.';


-- =============================================================================
-- TABLA: orden_trabajo_materiales
-- Descripción: Registra los repuestos o insumos consumidos en una orden de trabajo.
-- =============================================================================

CREATE TABLE orden_trabajo_materiales (
    id_ot_material   BIGSERIAL       NOT NULL,
    id_ot            BIGINT          NOT NULL,
    id_material      BIGINT          NOT NULL,
    cantidad         NUMERIC(12,2)   NOT NULL,
    precio_unitario  NUMERIC(12,2)   NOT NULL,
    subtotal         NUMERIC(14,2)   GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    registrado_por   BIGINT,
    creado_en        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_ot_materiales PRIMARY KEY (id_ot_material),
    CONSTRAINT fk_ot_mat_ot FOREIGN KEY (id_ot) REFERENCES ordenes_trabajo(id_ot) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_ot_mat_material FOREIGN KEY (id_material) REFERENCES materiales(id_material) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_ot_mat_usuario FOREIGN KEY (registrado_por) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    
    CONSTRAINT ck_ot_mat_cantidad CHECK (cantidad > 0),
    CONSTRAINT ck_ot_mat_precio CHECK (precio_unitario >= 0)
);

COMMENT ON TABLE orden_trabajo_materiales IS 'Insumos y repuestos descargados directamente contra una orden de trabajo.';