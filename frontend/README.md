# Frontend SGTRA

Interfaz React/Vite conectada a la API Express de SGTRA.

## Configuración

Copie el ejemplo local:

```powershell
Copy-Item .env.example .env.local
```

La configuración integrada es:

```dotenv
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=
VITE_DEV_API_URL=http://localhost:3100
VITE_DEV_PORT=5180
```

Con la base vacía, las solicitudes usan `/api/*` y Vite las redirige a Express. El modo `mock` existe únicamente para trabajo aislado y no conserva cambios.

## Ejecución

Desde la raíz del repositorio se recomienda:

```powershell
npm run dev
```

Para iniciar solamente esta aplicación:

```powershell
npm ci
npm run dev
```

## Calidad

```powershell
npm run lint
npm test
npm run build
```

## Estructura

```text
src/
├── pages/public/       sitio del cliente
├── pages/admin/        módulos internos
├── pages/auth/         autenticación
├── routes/             navegación y sesión requerida
├── layouts/            estructuras pública, login y panel
├── components/         controles comunes y de dominio
├── hooks/              carga reutilizable de datos
├── services/           integración por dominio con la API
├── constants/          endpoints, estados, roles y marca
├── data/mocks/         datos exclusivos del modo mock
└── utils/              validación y formato
```

El frontend nunca consulta SQL. Cada pantalla llama a un service; el service llama a `/api/v1`; Express aplica permisos y PostgreSQL conserva los datos.
