-- =============================================================================
-- Migración: 006_crear_tablas_facturacion.sql
-- Descripción: Crea las tablas de facturación, detalles, pagos y su distribución.
-- Motor: PostgreSQL
-- Normalización: 3FN
-- Dependencias: 003_crear_citas_ordenes_diagnosticos.sql
-- =============================================================================

-- =============================================================================
-- TABLA: facturas
-- =============================================================================

CREATE TABLE facturas (
    id_factura      BIGSERIAL       NOT NULL,
    id_ot           BIGINT          NOT NULL,
    numero_factura  VARCHAR(30)     NOT NULL,
    fecha           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    subtotal        NUMERIC(14,2)   NOT NULL DEFAULT 0,
    impuesto        NUMERIC(14,2)   NOT NULL DEFAULT 0,
    descuento       NUMERIC(14,2)   NOT NULL DEFAULT 0,
    total           NUMERIC(14,2)   NOT NULL DEFAULT 0,
    estado          VARCHAR(20)     NOT NULL DEFAULT 'PENDIENTE',
    observaciones   TEXT,
    creado_por      BIGINT,
    creado_en       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_facturas PRIMARY KEY (id_factura),
    CONSTRAINT uq_facturas_ot UNIQUE (id_ot),
    CONSTRAINT uq_facturas_numero UNIQUE (numero_factura),
    CONSTRAINT fk_facturas_ot FOREIGN KEY (id_ot) REFERENCES ordenes_trabajo(id_ot) ON DELETE RESTRICT,
    CONSTRAINT fk_facturas_usuario FOREIGN KEY (creado_por) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    CONSTRAINT ck_facturas_subtotal CHECK (subtotal >= 0),
    CONSTRAINT ck_facturas_impuesto CHECK (impuesto >= 0),
    CONSTRAINT ck_facturas_descuento CHECK (descuento >= 0),
    CONSTRAINT ck_facturas_total CHECK (total >= 0),
    CONSTRAINT ck_facturas_estado CHECK (estado IN ('PENDIENTE', 'PAGADA', 'ANULADA'))
);

COMMENT ON TABLE facturas IS 'Encabezado de facturas vinculadas a órdenes de trabajo.';

-- =============================================================================
-- TABLA: factura_detalles
-- =============================================================================

CREATE TABLE factura_detalles (
    id_factura_detalle  BIGSERIAL      NOT NULL,
    id_factura          BIGINT         NOT NULL,
    tipo_item           VARCHAR(20)    NOT NULL,
    descripcion         VARCHAR(150)   NOT NULL,
    cantidad            NUMERIC(12,2)  NOT NULL,
    precio_unitario     NUMERIC(12,2)  NOT NULL,
    subtotal            NUMERIC(14,2)  GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    porcentaje_impuesto NUMERIC(5,2)   NOT NULL DEFAULT 0,
    monto_impuesto      NUMERIC(14,2)  NOT NULL DEFAULT 0,
    creado_en           TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_factura_detalles PRIMARY KEY (id_factura_detalle),
    CONSTRAINT fk_fd_factura FOREIGN KEY (id_factura) REFERENCES facturas(id_factura) ON DELETE CASCADE,
    CONSTRAINT ck_fd_tipo_item CHECK (tipo_item IN ('SERVICIO', 'MATERIAL', 'REFRIGERANTE')),
    CONSTRAINT ck_fd_cantidad CHECK (cantidad > 0),
    CONSTRAINT ck_fd_precio CHECK (precio_unitario >= 0),
    CONSTRAINT ck_fd_porcentaje_impuesto CHECK (porcentaje_impuesto >= 0),
    CONSTRAINT ck_fd_monto_impuesto CHECK (monto_impuesto >= 0)
);

COMMENT ON TABLE factura_detalles IS 'Ítems individuales desglosados dentro de una factura, con su registro histórico de impuestos.';

-- =============================================================================
-- TABLA: pagos
-- =============================================================================

CREATE TABLE pagos (
    id_pago      BIGSERIAL      NOT NULL,
    monto_total  NUMERIC(14,2)  NOT NULL,
    forma_pago   VARCHAR(30)    NOT NULL,
    referencia   VARCHAR(100),
    fecha_pago   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    recibido_por BIGINT,

    CONSTRAINT pk_pagos PRIMARY KEY (id_pago),
    CONSTRAINT fk_pagos_usuario FOREIGN KEY (recibido_por) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    CONSTRAINT ck_pagos_monto CHECK (monto_total > 0),
    CONSTRAINT ck_pagos_forma CHECK (forma_pago IN ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CREDITO'))
);

COMMENT ON TABLE pagos IS 'Transacciones de pago recibidas en el sistema. Un pago puede cubrir múltiples facturas.';

-- =============================================================================
-- TABLA: pago_facturas
-- =============================================================================

CREATE TABLE pago_facturas (
    id_pago_factura BIGSERIAL      NOT NULL,
    id_pago         BIGINT         NOT NULL,
    id_factura      BIGINT         NOT NULL,
    monto_aplicado  NUMERIC(14,2)  NOT NULL,
    creado_en       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_pago_facturas PRIMARY KEY (id_pago_factura),
    CONSTRAINT fk_pf_pago FOREIGN KEY (id_pago) REFERENCES pagos(id_pago) ON DELETE CASCADE,
    CONSTRAINT fk_pf_factura FOREIGN KEY (id_factura) REFERENCES facturas(id_factura) ON DELETE RESTRICT,
    CONSTRAINT ck_pf_monto_aplicado CHECK (monto_aplicado > 0)
);

COMMENT ON TABLE pago_facturas IS 'Distribución del dinero de un pago hacia facturas específicas. Relación N:M.';