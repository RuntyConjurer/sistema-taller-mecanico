-- Integra el consentimiento del cliente y la trazabilidad de WhatsApp Cloud API.

ALTER TABLE clientes
    ADD COLUMN whatsapp_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN whatsapp_opt_in_en TIMESTAMPTZ,
    ADD COLUMN whatsapp_opt_in_fuente VARCHAR(40);

ALTER TABLE clientes
    ADD CONSTRAINT ck_clientes_whatsapp_consentimiento
    CHECK (
        (whatsapp_opt_in = FALSE AND whatsapp_opt_in_en IS NULL)
        OR (whatsapp_opt_in = TRUE AND whatsapp_opt_in_en IS NOT NULL)
    );

CREATE TABLE whatsapp_mensajes (
    id_whatsapp_mensaje BIGSERIAL NOT NULL,
    id_cliente          BIGINT,
    id_cita             BIGINT,
    id_usuario          BIGINT,
    wamid               VARCHAR(255),
    telefono_destino    VARCHAR(20) NOT NULL,
    direccion           VARCHAR(10) NOT NULL,
    tipo                VARCHAR(30) NOT NULL,
    plantilla           VARCHAR(150),
    idioma              VARCHAR(15),
    contenido           TEXT,
    estado              VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    error_codigo        VARCHAR(80),
    error_mensaje       TEXT,
    fecha_evento        TIMESTAMPTZ,
    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_whatsapp_mensajes
        PRIMARY KEY (id_whatsapp_mensaje),
    CONSTRAINT uq_whatsapp_mensajes_wamid
        UNIQUE (wamid),
    CONSTRAINT fk_whatsapp_mensajes_cliente
        FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_whatsapp_mensajes_cita
        FOREIGN KEY (id_cita) REFERENCES citas (id_cita)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_whatsapp_mensajes_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT ck_whatsapp_mensajes_direccion
        CHECK (direccion IN ('ENTRANTE', 'SALIENTE')),
    CONSTRAINT ck_whatsapp_mensajes_estado
        CHECK (estado IN ('PENDIENTE', 'ENVIANDO', 'ENVIADO', 'ENTREGADO', 'LEIDO', 'FALLIDO', 'RECIBIDO'))
);

CREATE INDEX idx_whatsapp_mensajes_cliente
    ON whatsapp_mensajes (id_cliente, creado_en DESC);

CREATE INDEX idx_whatsapp_mensajes_cita
    ON whatsapp_mensajes (id_cita, creado_en DESC);

CREATE INDEX idx_whatsapp_mensajes_estado
    ON whatsapp_mensajes (estado, actualizado_en DESC);

COMMENT ON TABLE whatsapp_mensajes IS
    'Trazabilidad de mensajes y estados recibidos desde WhatsApp Cloud API.';
COMMENT ON COLUMN clientes.whatsapp_opt_in IS
    'Consentimiento vigente del cliente para recibir notificaciones por WhatsApp.';
