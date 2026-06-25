-- =============================================================================
-- Migración: 005_crear_tablas_inventario.sql
-- Descripción: Crea las tablas de catálogo de inventario (materiales y refrigerantes), 
--              sus movimientos y la relación de consumo con las órdenes de trabajo.
-- Motor: PostgreSQL
-- Normalización: 3FN
-- Dependencias: 001_crear_usuarios_roles_sucursales.sql, 003_crear_citas_ordenes_diagnosticos.sql
-- =============================================================================


-- =============================================================================
-- TABLA: materiales
-- Descripción: Catálogo de repuestos y materiales físicos del taller.
-- =============================================================================

CREATE TABLE materiales (
    id_material    BIGSERIAL       NOT NULL,
    nombre         VARCHAR(100)    NOT NULL,
    descripcion    TEXT,
    unidad_medida  VARCHAR(30)     NOT NULL,
    stock_actual   NUMERIC(12,2)   NOT NULL DEFAULT 0,
    stock_minimo   NUMERIC(12,2)   NOT NULL DEFAULT 0,
    costo_unitario NUMERIC(12,2)   NOT NULL DEFAULT 0,
    precio_venta   NUMERIC(12,2)   NOT NULL DEFAULT 0,
    activo         BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_materiales 
        PRIMARY KEY (id_material),
        
    CONSTRAINT uq_materiales_nombre 
        UNIQUE (nombre),
        
    CONSTRAINT ck_materiales_stock_actual 
        CHECK (stock_actual >= 0),
        
    CONSTRAINT ck_materiales_stock_minimo 
        CHECK (stock_minimo >= 0),
        
    CONSTRAINT ck_materiales_costo_unitario 
        CHECK (costo_unitario >= 0),
        
    CONSTRAINT ck_materiales_precio_venta 
        CHECK (precio_venta >= 0)
);

COMMENT ON TABLE materiales IS 'Catálogo de piezas, repuestos y materiales consumibles.';
COMMENT ON COLUMN materiales.stock_actual IS 'Cantidad disponible en inventario. Nunca debe ser menor a 0.';


-- =============================================================================
-- TABLA: refrigerantes
-- Descripción: Catálogo específico para gases refrigerantes manejados por peso.
-- =============================================================================

CREATE TABLE refrigerantes (
    id_refrigerante BIGSERIAL       NOT NULL,
    nombre          VARCHAR(50)     NOT NULL,
    descripcion     TEXT,
    unidad_medida   VARCHAR(30)     NOT NULL DEFAULT 'GRAMOS',
    stock_actual    NUMERIC(12,2)   NOT NULL DEFAULT 0,
    stock_minimo    NUMERIC(12,2)   NOT NULL DEFAULT 0,
    costo_unitario  NUMERIC(12,2)   NOT NULL DEFAULT 0,
    precio_venta    NUMERIC(12,2)   NOT NULL DEFAULT 0,
    activo          BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_refrigerantes 
        PRIMARY KEY (id_refrigerante),
        
    CONSTRAINT uq_refrigerantes_nombre 
        UNIQUE (nombre),
        
    CONSTRAINT ck_refrigerantes_stock_actual 
        CHECK (stock_actual >= 0),
        
    CONSTRAINT ck_refrigerantes_stock_minimo 
        CHECK (stock_minimo >= 0),
        
    CONSTRAINT ck_refrigerantes_costo_unitario 
        CHECK (costo_unitario >= 0),
        
    CONSTRAINT ck_refrigerantes_precio_venta 
        CHECK (precio_venta >= 0)
);

COMMENT ON TABLE refrigerantes IS 'Catálogo de gases refrigerantes, típicamente medidos en gramos u onzas.';


-- =============================================================================
-- TABLA: inventario_movimientos
-- Descripción: Registro histórico de entradas, salidas y ajustes de inventario.
-- =============================================================================

CREATE TABLE inventario_movimientos (
    id_movimiento    BIGSERIAL       NOT NULL,
    id_material      BIGINT,
    id_refrigerante  BIGINT,
    tipo_movimiento  VARCHAR(20)     NOT NULL,
    cantidad         NUMERIC(12,2)   NOT NULL,
    costo_unitario   NUMERIC(12,2),
    motivo           TEXT,
    id_usuario       BIGINT,
    fecha_movimiento TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_inventario_movimientos 
        PRIMARY KEY (id_movimiento),
        
    CONSTRAINT fk_inv_mov_material 
        FOREIGN KEY (id_material) REFERENCES materiales(id_material) 
        ON UPDATE CASCADE ON DELETE RESTRICT,
        
    CONSTRAINT fk_inv_mov_refrigerante 
        FOREIGN KEY (id_refrigerante) REFERENCES refrigerantes(id_refrigerante) 
        ON UPDATE CASCADE ON DELETE RESTRICT,
        
    CONSTRAINT fk_inv_mov_usuario 
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) 
        ON UPDATE CASCADE ON DELETE RESTRICT,
        
    CONSTRAINT ck_inv_mov_tipo 
        CHECK (tipo_movimiento IN ('ENTRADA', 'SALIDA', 'AJUSTE')),
        
    CONSTRAINT ck_inv_mov_cantidad 
        CHECK (cantidad > 0),
        
    CONSTRAINT ck_inv_mov_costo 
        CHECK (costo_unitario IS NULL OR costo_unitario >= 0),
        
    -- Un movimiento pertenece a un material OR a un refrigerante, nunca a ambos ni a ninguno
    CONSTRAINT ck_inv_mov_exclusividad CHECK (
        (id_material IS NOT NULL AND id_refrigerante IS NULL) OR
        (id_material IS NULL AND id_refrigerante IS NOT NULL)
    )
);

COMMENT ON TABLE inventario_movimientos IS 'Historial inmutable de movimientos físicos de inventario para auditoría.';
COMMENT ON COLUMN inventario_movimientos.ck_inv_mov_exclusividad IS 'Garantiza que el movimiento asocie exactamente un tipo de ítem.';


-- =============================================================================
-- TABLA: orden_trabajo_materiales
-- Descripción: Registra los materiales o refrigerantes consumidos en una OT.
-- =============================================================================

CREATE TABLE orden_trabajo_materiales (
    id_ot_material   BIGSERIAL       NOT NULL,
    id_ot            BIGINT          NOT NULL,
    id_material      BIGINT,
    id_refrigerante  BIGINT,
    cantidad         NUMERIC(12,2)   NOT NULL,
    precio_unitario  NUMERIC(12,2)   NOT NULL,
    subtotal         NUMERIC(14,2)   GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    registrado_por   BIGINT,
    creado_en        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_ot_materiales 
        PRIMARY KEY (id_ot_material),
        
    CONSTRAINT fk_ot_mat_ot 
        FOREIGN KEY (id_ot) REFERENCES ordenes_trabajo(id_ot) 
        ON UPDATE CASCADE ON DELETE CASCADE,
        
    CONSTRAINT fk_ot_mat_material 
        FOREIGN KEY (id_material) REFERENCES materiales(id_material) 
        ON UPDATE CASCADE ON DELETE RESTRICT,
        
    CONSTRAINT fk_ot_mat_refrigerante 
        FOREIGN KEY (id_refrigerante) REFERENCES refrigerantes(id_refrigerante) 
        ON UPDATE CASCADE ON DELETE RESTRICT,
        
    CONSTRAINT fk_ot_mat_usuario 
        FOREIGN KEY (registrado_por) REFERENCES usuarios(id_usuario) 
        ON UPDATE CASCADE ON DELETE RESTRICT,
        
    CONSTRAINT ck_ot_mat_cantidad 
        CHECK (cantidad > 0),
        
    CONSTRAINT ck_ot_mat_precio 
        CHECK (precio_unitario >= 0),
        
    CONSTRAINT ck_ot_mat_exclusividad CHECK (
        (id_material IS NOT NULL AND id_refrigerante IS NULL) OR
        (id_material IS NULL AND id_refrigerante IS NOT NULL)
    )
);

COMMENT ON TABLE orden_trabajo_materiales IS 'Insumos aplicados a las órdenes de trabajo.';
COMMENT ON COLUMN orden_trabajo_materiales.registrado_por IS 'Usuario que añadió el insumo a la OT. Vital para auditoría en el trigger de inventario.';