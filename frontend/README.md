# Frontend SGTRA

Interfaz React/Vite para el Sistema de Gestión de Taller de Refrigeración Automotriz. Es una demostración académica: la interfaz representa los flujos del SRS, pero el backend local aún no publica sus endpoints funcionales.

## Ejecutar

```bash
npm install
npm run dev
```

Comandos de calidad:

```bash
npm run lint      # ESLint
npm run format    # Prettier: da formato a src/
npm run test      # Vitest
npm run build     # build de producción
```

## Modo de datos

El archivo `.env` puede contener:

```env
VITE_DATA_SOURCE=mock
VITE_API_BASE_URL=http://localhost:3000
```

`mock` es el valor predeterminado y no guarda datos fuera de la sesión actual. `api` hace que los servicios consulten `VITE_API_BASE_URL`; solo debe activarse cuando el backend implemente el contrato declarado en `src/constants/apiEndpoints.js`.

## Estructura

```text
src/
├─ pages/public/       sitio del cliente
├─ pages/admin/        módulos internos del taller
├─ pages/auth/         login
├─ routes/             rutas y RequireSession (guard del panel)
├─ layouts/            estructura de página (público, auth, panel)
├─ components/ui/      controles reutilizables
├─ components/common/  tabla, panel lateral, encabezados, estados de carga y error
├─ components/domain/  componentes de negocio (StatusBadge)
├─ hooks/              useAsyncData: el único patrón de carga de datos
├─ data/mocks/         datos de muestra con la forma de las tablas de PostgreSQL
├─ services/           puente mock/API por dominio + sesión
├─ constants/          estados de dominio, roles, rutas de la API, marca
└─ utils/              validación y formato
```

## Cómo se cargan los datos en una pantalla

Siempre igual, en todas: `useAsyncData` pide los datos a un service y devuelve el resultado
con su estado de carga y error. `reload()` los vuelve a pedir después de una acción que los
modifica (registrar un pago, cerrar una orden, consumir refrigerante).

```jsx
const { data: clientes, isLoading, error } = useAsyncData(() => listarClientes(), [])
```

## Recorrido de datos

```text
Pantalla React → service del dominio → mock local o API → backend → PostgreSQL
```

Las pantallas no consultan SQL ni conocen tablas ni URLs: solo llaman a un service.

Los mocks **tienen la misma forma que las tablas de la base de datos**. El stock es numérico
(`stockActual`) con la unidad aparte (`unidadMedida`), y los códigos de estado (`CONFIRMADA`,
`PAGADA`, `EN_DIAGNOSTICO`, `REORDEN_NECESARIA`) son los mismos de los `CHECK` de PostgreSQL.
El frontend solo los traduce a español; nunca inventa uno.

## Límites explícitos de la demo

- **El login no comprueba la contraseña**: solo elige un rol de demostración.
- `RequireSession` impide entrar al panel por URL sin iniciar sesión, pero es una protección de
  navegación, no de seguridad: corre en el navegador y se puede saltar. El backend debe rechazar
  toda petición sin sesión válida.
- Citas, pagos, diagnósticos y consumos viven en memoria: se pierden al recargar.
- El backend y la base de datos son los que imponen las reglas (stock, cierre de OT, permisos);
  el frontend solo orienta y previene los errores más comunes.
- **Cotizaciones** todavía no tiene tabla en la base de datos: la pantalla lo avisa y sus datos
  son de muestra. Las tablas ya se solicitaron al equipo de base de datos.
