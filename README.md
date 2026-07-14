# SGTRA - Sistema de Gestión de Taller de Refrigeración Automotriz

Aplicación académica para administrar cliente, vehículo, cita, cotización, orden de trabajo, diagnóstico, materiales, factura, pago e historial técnico.

## Requisitos

- Node.js 20.19 o superior.
- PostgreSQL 16 en ejecución.
- npm 10 o superior.
- Nginx es opcional para presentar frontend y API en un solo puerto.

## Primera instalación

### 1. Crear usuario y base de datos

Ejecute desde pgAdmin o `psql` con un usuario administrador:

```sql
CREATE ROLE sgtra LOGIN PASSWORD 'sgtra_local_password';
CREATE DATABASE sgtra OWNER sgtra;
```

El puerto `5432` debe pertenecer a la instancia PostgreSQL que usará SGTRA. Si otra aplicación ocupa ese puerto, deténgala o configure PostgreSQL en otro puerto y actualice `DATABASE_URL`.

### 2. Preparar variables locales

En PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env.local
```

La conexión principal queda así:

```dotenv
DATABASE_URL=postgres://sgtra:sgtra_local_password@localhost:5432/sgtra
```

Si durante la creación eligió otra contraseña, servidor o puerto, cámbielos solamente en `backend/.env`. Estos archivos locales están ignorados por Git.

### 3. Instalar e inicializar

Desde la raíz del repositorio:

```powershell
npm run setup
```

`setup` instala frontend y backend, luego aplica migraciones, vistas y datos iniciales sobre una base vacía. Nunca elimina una base previamente inicializada.

## Iniciar el proyecto

```powershell
npm run dev
```

Este comando inicia ambos procesos:

- Frontend React/Vite: [http://localhost:5180](http://localhost:5180)
- Backend Express: [http://localhost:3100/api/v1/ready](http://localhost:3100/api/v1/ready)

Vite envía automáticamente `/api/*` al backend en el puerto `3100`. El origen de datos predeterminado es `api`; los registros se escriben en PostgreSQL.

## Nginx opcional

La plantilla [nginx/sgtra.local.conf](nginx/sgtra.local.conf) expone todo en [http://localhost:8080](http://localhost:8080):

```text
Navegador :8080
├── /api/* → Express :3100 → PostgreSQL
└── /*      → Vite :5180
```

Copie esa configuración en el directorio de sitios de Nginx y recargue el servicio después de iniciar `npm run dev`.

## Cuentas de demostración

Todas usan la contraseña `password123`.

| Rol | Correo |
| --- | --- |
| Administrador | `admin@sgtra.demo` |
| Recepcionista | `recepcion@sgtra.demo` |
| Técnico | `tecnico@sgtra.demo` |
| Cajero | `caja@sgtra.demo` |

## Persistencia

El recorrido de datos es:

```text
React → service → /api/v1 → controller → use case → repository → Sequelize → PostgreSQL
```

Para comprobarlo:

1. Cree una cita desde `/agendar-cita`.
2. Consulte la cita desde el panel administrativo.
3. Detenga el proyecto con `Ctrl+C`.
4. Ejecute de nuevo `npm run dev`.
5. La cita debe continuar disponible porque vive en PostgreSQL, no en memoria.

El modo sin persistencia solo se activa deliberadamente con:

```dotenv
VITE_DATA_SOURCE=mock
```

No use ese valor durante la presentación integrada.

## Arquitectura del backend

```text
Route → Controller → UseCase → Repository → Sequelize → PostgreSQL
```

```text
backend/src/
├── routes/          rutas, autenticación y permisos
├── controllers/     entrada y respuesta HTTP
├── domain/          validaciones y reglas de aplicación
├── repositories/    consultas y transacciones
├── infrastructure/  conexión y modelos Sequelize
└── di/              composición de dependencias
```

Los módulos principales son agenda/cotizaciones, órdenes de trabajo, inventario, facturación, reportes, usuarios y WhatsApp.

## Comprobaciones

```powershell
npm run check
npm run smoke
```

`check` ejecuta sintaxis y pruebas del backend, lint, pruebas y build del frontend. `smoke` requiere Express y PostgreSQL activos y recorre:

```text
Agenda → Cita → OT → Diagnóstico → Consumo → Factura → Pago → Cierre → Historial
```

Las reglas SQL se pueden comprobar con:

```powershell
$env:PGPASSWORD='sgtra_local_password'
psql -h localhost -U sgtra -d sgtra -v ON_ERROR_STOP=1 -f database/tests/001_reglas_negocio.sql
```

GitHub Actions instala una instancia PostgreSQL limpia, inicia frontend y backend con npm, configura Nginx y repite el flujo integral en cada pull request.

## Documentación

- [Arquitectura y trazabilidad del SRS](docs/arquitectura-srs.md)
- [Contrato e integración](docs/integracion-backend.md)
- [Configuración de WhatsApp Cloud API](docs/integracion-whatsapp.md)
- [Guion de presentación](docs/presentacion-frontend.md)

WhatsApp permanece desactivado hasta configurar credenciales privadas en `backend/.env`. La facturación electrónica no forma parte de esta entrega.
