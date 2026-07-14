# Integración de WhatsApp Cloud API

SGTRA envía plantillas desde Express y recibe sus estados mediante un webhook. React nunca conoce el access token ni la clave secreta de Meta.

```text
React → Nginx → API SGTRA → graph.facebook.com
Meta  → HTTPS público → Nginx → /api/v1/webhooks/whatsapp
```

## 1. Configuración local

Copie `backend/.env.example` como `backend/.env` y complete localmente:

```dotenv
WHATSAPP_ENABLED=true
WHATSAPP_APP_ID=SU_APP_ID
WHATSAPP_APP_SECRET=SU_CLAVE_SECRETA
WHATSAPP_ACCESS_TOKEN=SU_TOKEN
WHATSAPP_PHONE_NUMBER_ID=SU_PHONE_NUMBER_ID
WHATSAPP_WABA_ID=SU_WABA_ID
WHATSAPP_BUSINESS_NUMBER=15556552000
WHATSAPP_TEST_RECIPIENT=18297559416
WHATSAPP_VERIFY_TOKEN=UN_VALOR_ALEATORIO_LARGO
WHATSAPP_GRAPH_VERSION=v23.0
WHATSAPP_TEMPLATE_NAME=hello_world
WHATSAPP_TEMPLATE_LANGUAGE=en_US
WHATSAPP_ALLOWED_TEMPLATES=hello_world:en_US
```

`WHATSAPP_VERIFY_TOKEN` lo define el equipo; no lo entrega Meta. Debe ser largo y distinto de la clave de la aplicación. `.env` está ignorado por Git y no debe compartirse.

Reinicie la API y el frontend para aplicar las variables:

```powershell
npm run dev
```

## 2. URL HTTPS para el webhook

Meta no puede acceder a `localhost`. Para una demostración puede publicar temporalmente Nginx:

```powershell
ngrok http 8080
```

o:

```powershell
cloudflared tunnel --url http://localhost:8080
```

En Meta configure:

```text
Callback URL: https://SU-DOMINIO-TEMPORAL/api/v1/webhooks/whatsapp
Verify token:  el mismo WHATSAPP_VERIFY_TOKEN del .env
Campo:         messages
```

El túnel apunta a Nginx (`8080`), no directamente a Express. Si cambia la URL temporal, también debe actualizarla en Meta.

## 3. Enlaces de administración

- [Aplicaciones de Meta](https://developers.facebook.com/apps/)
- [Depurador de tokens](https://developers.facebook.com/tools/debug/accesstoken/)
- [Usuarios del sistema](https://business.facebook.com/settings/system-users?business_id=3393081814192276)
- [Plantillas de WhatsApp](https://business.facebook.com/wa/manage/message-templates/?business_id=3393081814192276&waba_id=2245119546238685)
- [Números de teléfono](https://business.facebook.com/latest/whatsapp_manager/phone_numbers?business_id=3393081814192276&asset_id=2245119546238685)

Para una demostración estable conviene generar un token de usuario del sistema con `whatsapp_business_messaging`. Los tokens temporales vencen y deben reemplazarse sin cambiar el código.

## 4. Plantillas y consentimiento

`hello_world` se usa solo para comprobar conectividad con el número de prueba. Las plantillas `cbrt_*` pertenecen a otro proyecto y no deben mostrarse como comunicaciones SGTRA.

Antes de una presentación final, cree plantillas SGTRA en español y categoría `UTILITY`, por ejemplo:

- `sgtra_solicitud_cita_recibida`
- `sgtra_cita_confirmada`
- `sgtra_recordatorio_cita`
- `sgtra_cita_reprogramada`
- `sgtra_cita_cancelada`

La agenda solicita autorización opcional y no preseleccionada. Sin ese consentimiento, la API bloquea el envío asociado a una cita.

## 5. Recorrido de prueba

1. Agendar una cita y marcar el consentimiento de WhatsApp.
2. Iniciar sesión como administrador o recepcionista.
3. Abrir **Citas**, seleccionar el registro y enviar la prueba.
4. Confirmar que Meta devuelve un `wamid` y que la API registra el mensaje.
5. Enviar o leer el mensaje desde el teléfono aprobado.
6. Verificar que el webhook actualiza `ENVIADO`, `ENTREGADO` o `LEIDO`.

El entorno de prueba de Meta solo entrega mensajes a destinatarios previamente aprobados. Un `wamid` confirma aceptación por Meta, no entrega ni lectura; esos estados llegan después por webhook.

## 6. Seguridad

- Nunca escriba el token o la clave secreta en React, Git, capturas o logs.
- La API valida `X-Hub-Signature-256` con HMAC-SHA256 sobre los bytes originales.
- El destino de salida está fijado a `graph.facebook.com` y tiene timeout.
- Los nombres de plantilla se validan contra una lista permitida.
- Rote cualquier token o clave que haya sido compartido accidentalmente.
