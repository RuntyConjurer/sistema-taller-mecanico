-- =========================================================
-- 16. FACTURAS
-- =========================================================

CREATE TABLE facturas (
    id_factura BIGSERIAL PRIMARY KEY,

    id_ot BIGINT NOT NULL UNIQUE REFERENCES ordenes_trabajo(id_ot),

    numero_factura VARCHAR(30) NOT NULL UNIQUE,

    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0
        CHECK (subtotal >= 0),

    impuesto NUMERIC(12,2) NOT NULL DEFAULT 0
        CHECK (impuesto >= 0),

    descuento NUMERIC(12,2) NOT NULL DEFAULT 0
        CHECK (descuento >= 0),

    total NUMERIC(12,2) NOT NULL
        CHECK (total >= 0),

    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
        CHECK (estado IN ('PENDIENTE', 'PAGADA', 'ANULADA')),

    observaciones TEXT,

    creado_por BIGINT REFERENCES usuarios(id_usuario),
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 17. FACTURA_DETALLES
-- =========================================================

CREATE TABLE factura_detalles (
    id_factura_detalle BIGSERIAL PRIMARY KEY,

    id_factura BIGINT NOT NULL REFERENCES facturas(id_factura) ON DELETE CASCADE,

    tipo_item VARCHAR(20) NOT NULL
        CHECK (tipo_item IN ('SERVICIO', 'MATERIAL', 'REFRIGERANTE')),

    descripcion VARCHAR(150) NOT NULL,

    cantidad NUMERIC(12,2) NOT NULL
        CHECK (cantidad > 0),

    precio_unitario NUMERIC(12,2) NOT NULL
        CHECK (precio_unitario >= 0),

    subtotal NUMERIC(12,2) GENERATED ALWAYS AS 
        (cantidad * precio_unitario) STORED,

    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 18. PAGOS
-- =========================================================

CREATE TABLE pagos (
    id_pago BIGSERIAL PRIMARY KEY,

    id_factura BIGINT NOT NULL REFERENCES facturas(id_factura) ON DELETE CASCADE,

    monto NUMERIC(12,2) NOT NULL
        CHECK (monto > 0),

    forma_pago VARCHAR(30) NOT NULL
        CHECK (forma_pago IN ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CREDITO')),

    referencia VARCHAR(100),

    fecha_pago TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    recibido_por BIGINT REFERENCES usuarios(id_usuario)
);