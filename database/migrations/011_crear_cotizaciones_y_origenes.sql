-- Extiende el flujo comercial sin alterar las tablas históricas del proyecto.

ALTER TABLE citas
    ADD COLUMN id_servicio BIGINT,
    ADD CONSTRAINT fk_citas_servicio
        FOREIGN KEY (id_servicio)
        REFERENCES servicios (id_servicio)
        ON UPDATE CASCADE
        ON DELETE SET NULL;

CREATE TABLE cotizaciones (
    id_cotizacion BIGSERIAL NOT NULL,
    numero VARCHAR(30) NOT NULL,
    id_cliente BIGINT NOT NULL,
    id_vehiculo BIGINT NOT NULL,
    id_sucursal BIGINT NOT NULL,
    creado_por BIGINT,
    estado VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
    vigencia DATE NOT NULL,
    subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,
    impuesto NUMERIC(14,2) NOT NULL DEFAULT 0,
    descuento NUMERIC(14,2) NOT NULL DEFAULT 0,
    total NUMERIC(14,2) NOT NULL DEFAULT 0,
    observaciones TEXT,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_cotizaciones PRIMARY KEY (id_cotizacion),
    CONSTRAINT uq_cotizaciones_numero UNIQUE (numero),
    CONSTRAINT fk_cotizaciones_cliente FOREIGN KEY (id_cliente)
        REFERENCES clientes (id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_cotizaciones_vehiculo FOREIGN KEY (id_vehiculo)
        REFERENCES vehiculos (id_vehiculo) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_cotizaciones_sucursal FOREIGN KEY (id_sucursal)
        REFERENCES sucursales (id_sucursal) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_cotizaciones_usuario FOREIGN KEY (creado_por)
        REFERENCES usuarios (id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT ck_cotizaciones_estado CHECK (
        estado IN ('BORRADOR', 'ENVIADA', 'APROBADA', 'RECHAZADA', 'VENCIDA')
    ),
    CONSTRAINT ck_cotizaciones_montos CHECK (
        subtotal >= 0 AND impuesto >= 0 AND descuento >= 0 AND total >= 0
    ),
    CONSTRAINT ck_cotizaciones_total CHECK (total = subtotal + impuesto - descuento)
);

CREATE TABLE cotizacion_detalles (
    id_cotizacion_detalle BIGSERIAL NOT NULL,
    id_cotizacion BIGINT NOT NULL,
    tipo_item VARCHAR(20) NOT NULL,
    id_servicio BIGINT,
    id_material BIGINT,
    descripcion VARCHAR(150) NOT NULL,
    cantidad NUMERIC(12,2) NOT NULL,
    precio_unitario NUMERIC(12,2) NOT NULL,
    subtotal NUMERIC(14,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    porcentaje_impuesto NUMERIC(5,2) NOT NULL DEFAULT 18,
    monto_impuesto NUMERIC(14,2) NOT NULL DEFAULT 0,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_cotizacion_detalles PRIMARY KEY (id_cotizacion_detalle),
    CONSTRAINT fk_cd_cotizacion FOREIGN KEY (id_cotizacion)
        REFERENCES cotizaciones (id_cotizacion) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_cd_servicio FOREIGN KEY (id_servicio)
        REFERENCES servicios (id_servicio) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_cd_material FOREIGN KEY (id_material)
        REFERENCES materiales (id_material) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT ck_cd_tipo_item CHECK (
        tipo_item IN ('SERVICIO', 'MATERIAL', 'REFRIGERANTE', 'CONSUMIBLE')
    ),
    CONSTRAINT ck_cd_cantidad CHECK (cantidad > 0),
    CONSTRAINT ck_cd_precio CHECK (precio_unitario >= 0),
    CONSTRAINT ck_cd_impuesto CHECK (porcentaje_impuesto >= 0 AND monto_impuesto >= 0),
    CONSTRAINT ck_cd_referencia CHECK (
        (tipo_item = 'SERVICIO' AND id_servicio IS NOT NULL AND id_material IS NULL)
        OR
        (tipo_item IN ('MATERIAL', 'REFRIGERANTE', 'CONSUMIBLE')
            AND id_material IS NOT NULL AND id_servicio IS NULL)
    )
);

ALTER TABLE ordenes_trabajo
    ADD COLUMN id_cotizacion BIGINT,
    ADD CONSTRAINT fk_ot_cotizacion
        FOREIGN KEY (id_cotizacion)
        REFERENCES cotizaciones (id_cotizacion)
        ON UPDATE CASCADE
        ON DELETE SET NULL;

-- Una cita o cotización solo puede originar una OT.
CREATE UNIQUE INDEX uq_ot_cita_origen
    ON ordenes_trabajo (id_cita)
    WHERE id_cita IS NOT NULL;

CREATE UNIQUE INDEX uq_ot_cotizacion_origen
    ON ordenes_trabajo (id_cotizacion)
    WHERE id_cotizacion IS NOT NULL;

CREATE INDEX idx_citas_id_servicio ON citas (id_servicio);
CREATE INDEX idx_cotizaciones_cliente ON cotizaciones (id_cliente);
CREATE INDEX idx_cotizaciones_vehiculo ON cotizaciones (id_vehiculo);
CREATE INDEX idx_cotizaciones_sucursal_estado ON cotizaciones (id_sucursal, estado);
CREATE INDEX idx_cotizacion_detalles_cotizacion ON cotizacion_detalles (id_cotizacion);

COMMENT ON TABLE cotizaciones IS
    'Propuestas comerciales previas a una orden de trabajo.';
COMMENT ON TABLE cotizacion_detalles IS
    'Servicios y materiales cotizados con precios históricos.';
COMMENT ON COLUMN citas.id_servicio IS
    'Servicio solicitado por el cliente; puede ser nulo si solo describió un síntoma.';
COMMENT ON COLUMN ordenes_trabajo.id_cotizacion IS
    'Cotización aprobada que originó la orden; una cotización solo genera una OT.';
