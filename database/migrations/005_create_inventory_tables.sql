-- =========================================================
-- MATERIALES
-- =========================================================

CREATE TABLE materiales (
    id_material BIGSERIAL PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,

    unidad_medida VARCHAR(30) NOT NULL,

    stock_actual NUMERIC(12,2) NOT NULL DEFAULT 0
        CHECK (stock_actual >= 0),

    stock_minimo NUMERIC(12,2) NOT NULL DEFAULT 0
        CHECK (stock_minimo >= 0),

    costo_unitario NUMERIC(12,2) NOT NULL DEFAULT 0
        CHECK (costo_unitario >= 0),

    precio_venta NUMERIC(12,2) NOT NULL DEFAULT 0
        CHECK (precio_venta >= 0),

    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- REFRIGERANTES
-- =========================================================

CREATE TABLE refrigerantes (
    id_refrigerante BIGSERIAL PRIMARY KEY,

    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,

    unidad_medida VARCHAR(30) NOT NULL DEFAULT 'GRAMOS',

    stock_actual NUMERIC(12,2) NOT NULL DEFAULT 0
        CHECK (stock_actual >= 0),

    stock_minimo NUMERIC(12,2) NOT NULL DEFAULT 0
        CHECK (stock_minimo >= 0),

    costo_unitario NUMERIC(12,2) NOT NULL DEFAULT 0
        CHECK (costo_unitario >= 0),

    precio_venta NUMERIC(12,2) NOT NULL DEFAULT 0
        CHECK (precio_venta >= 0),

    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- INVENTARIO_MOVIMIENTOS
-- =========================================================

CREATE TABLE inventario_movimientos (
    id_movimiento BIGSERIAL PRIMARY KEY,

    id_material BIGINT REFERENCES materiales(id_material),
    id_refrigerante BIGINT REFERENCES refrigerantes(id_refrigerante),

    tipo_movimiento VARCHAR(20) NOT NULL
        CHECK (tipo_movimiento IN ('ENTRADA', 'SALIDA', 'AJUSTE')),

    cantidad NUMERIC(12,2) NOT NULL
        CHECK (cantidad > 0),

    costo_unitario NUMERIC(12,2)
        CHECK (costo_unitario >= 0),

    motivo TEXT,

    id_usuario BIGINT REFERENCES usuarios(id_usuario),
    fecha_movimiento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CHECK (
        (id_material IS NOT NULL AND id_refrigerante IS NULL)
        OR
        (id_material IS NULL AND id_refrigerante IS NOT NULL)
    )
);

-- =========================================================
-- ORDEN_TRABAJO_MATERIALES
-- =========================================================

CREATE TABLE orden_trabajo_materiales (
    id_ot_material BIGSERIAL PRIMARY KEY,

    id_ot BIGINT NOT NULL REFERENCES ordenes_trabajo(id_ot) ON DELETE CASCADE,

    id_material BIGINT REFERENCES materiales(id_material),
    id_refrigerante BIGINT REFERENCES refrigerantes(id_refrigerante),

    cantidad NUMERIC(12,2) NOT NULL
        CHECK (cantidad > 0),

    precio_unitario NUMERIC(12,2) NOT NULL
        CHECK (precio_unitario >= 0),

    subtotal NUMERIC(12,2) GENERATED ALWAYS AS 
        (cantidad * precio_unitario) STORED,

    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CHECK (
        (id_material IS NOT NULL AND id_refrigerante IS NULL)
        OR
        (id_material IS NULL AND id_refrigerante IS NOT NULL)
    )
);