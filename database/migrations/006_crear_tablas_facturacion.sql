-- =============================================================================
-- Migración: 006_crear_tablas_facturacion.sql
-- Descripción: Crea las tablas de facturación, detalles y pagos del sistema.
-- Motor: PostgreSQL
-- Normalización: 3FN
-- Dependencias: 003_crear_citas_ordenes_diagnosticos.sql
-- =============================================================================

-- =============================================================================
-- TABLA: facturas
-- Descripción: Encabezado de la factura asociada a una orden de trabajo.
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
-- Descripción: Desglose de ítems (servicios, materiales, refrigerantes) en la factura.
-- =============================================================================

CREATE TABLE factura_detalles (
    id_factura_detalle BIGSERIAL      NOT NULL,
    id_factura         BIGINT         NOT NULL,
    tipo_item          VARCHAR(20)    NOT NULL,
    descripcion        VARCHAR(150)   NOT NULL,
    cantidad           NUMERIC(12,2)  NOT NULL,
    precio_unitario    NUMERIC(12,2)  NOT NULL,
    subtotal           NUMERIC(14,2)  GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    creado_en          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_factura_detalles PRIMARY KEY (id_factura_detalle),
    CONSTRAINT fk_fd_factura FOREIGN KEY (id_factura) REFERENCES facturas(id_factura) ON DELETE CASCADE,
    
    CONSTRAINT ck_fd_tipo_item CHECK (tipo_item IN ('SERVICIO', 'MATERIAL', 'REFRIGERANTE')),
    CONSTRAINT ck_fd_cantidad CHECK (cantidad > 0),
    CONSTRAINT ck_fd_precio CHECK (precio_unitario >= 0)
);

COMMENT ON TABLE factura_detalles IS 'Ítems individuales desglosados dentro de una factura.';


-- =============================================================================
-- TABLA: pagos
-- Descripción: Registro de pagos recibidos para una factura.
-- =============================================================================

CREATE TABLE pagos (
    id_pago      BIGSERIAL      NOT NULL,
    id_factura   BIGINT         NOT NULL,
    monto        NUMERIC(14,2)  NOT NULL,
    forma_pago   VARCHAR(30)    NOT NULL,
    referencia   VARCHAR(100),
    fecha_pago   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    recibido_por BIGINT,

    CONSTRAINT pk_pagos PRIMARY KEY (id_pago),
    CONSTRAINT fk_pagos_factura FOREIGN KEY (id_factura) REFERENCES facturas(id_factura) ON DELETE CASCADE,
    CONSTRAINT fk_pagos_usuario FOREIGN KEY (recibido_por) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    
    CONSTRAINT ck_pagos_monto CHECK (monto > 0),
    CONSTRAINT ck_pagos_forma CHECK (forma_pago IN ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CREDITO'))
);

COMMENT ON TABLE pagos IS 'Histórico de pagos registrados contra facturas.';