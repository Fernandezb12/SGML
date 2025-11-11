# SGML Backend

API en Node.js + Express para el Sistema de Gestión de Mantenimiento Locativo (SGML) de la Universidad Surcolombiana.

## Tecnologías

- Node.js 18+
- Express
- CORS, Morgan
- Persistencia simple en archivos JSON (fs)

## Estructura

```
backend/
├─ package.json
├─ server.js
└─ src/
   ├─ app.js
   ├─ controllers/
   ├─ routes/
   ├─ middleware/
   ├─ utils/
   └─ models/ (json de ejemplo)
```

## Instalación

1. Instala dependencias:

   ```bash
   npm install
   ```

   > Si la descarga desde npm falla por políticas de red, instala manualmente los paquetes `express`, `cors`, `morgan`, `uuid` y `nodemon`.

2. Ejecuta en modo desarrollo:

   ```bash
   npm run dev
   ```

3. Producción/local simple:

   ```bash
   npm start
   ```

El servidor escuchará por defecto en `http://localhost:3000`.

## Autenticación

- Header obligatorio: `x-auth-token`.
- Endpoint de login: `POST /api/auth/login` → responde con token y datos del usuario.
- Usuarios demo en `src/models/users.json`.

## Endpoints principales

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/auth/login` | POST | Autenticación por email/clave |
| `/api/auth/me` | GET | Perfil según token |
| `/api/catalogo` | GET | Catálogo completo (sedes, categorías, prioridades) |
| `/api/tickets` | GET/POST | Listado y creación de tickets |
| `/api/tickets/:id` | GET/PUT | Detalle y actualización general |
| `/api/tickets/:id/asignacion` | POST | Asignar operario y programador |
| `/api/tickets/:id/estado` | POST | Cambiar estado (respeta flujo y checklist) |
| `/api/tickets/:id/checklist` | POST | Agregar paso al checklist |
| `/api/tickets/:id/evidencias` | POST | Registrar evidencia |
| `/api/tickets/:id/insumos` | POST | Registrar insumo usado |
| `/api/estados/kpis` | GET | KPIs de ciclo de vida |
| `/api/asignaciones` | GET | Resumen por operario |
| `/api/reportes/operativo` | GET | Tickets por estado |
| `/api/reportes/backlog` | GET | Tickets con retraso |

## Estados permitidos

Flujo: `nuevo → en validacion → asignado → en ejecucion → en espera → solucionado → cerrado` (con opción de `reabierto`). Las transiciones inválidas responden con `409`.

Para cerrar un ticket es obligatorio:
- Checklist con todos los pasos en `completado: true`.
- Al menos una evidencia cargada.

## Datos de ejemplo

- `src/models/tickets.json`: tickets preventivos y correctivos con checklist e insumos.
- `src/models/catalog.json`: sedes, categorías, planes preventivos.
- `src/models/users.json`: usuarios demo para cada rol (solicitante, oficina, programador, operario, coordinador preventivo).

## Tests manuales sugeridos (via curl o Thunder Client)

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"oficina@usco.edu.co","password":"Oficina123*"}'

# Listar tickets
curl http://localhost:3000/api/tickets \
  -H "x-auth-token: <TOKEN>"

# Cambiar estado
curl -X POST http://localhost:3000/api/tickets/TCK-20241111-001/estado \
  -H "Content-Type: application/json" \
  -H "x-auth-token: <TOKEN>" \
  -d '{"estado":"en ejecucion"}'
```

## Próximos pasos recomendados

- Sustituir persistencia en archivos por PostgreSQL o MongoDB.
- Integrar notificaciones (correo o push) en cambios de estado.
- Añadir pruebas unitarias con Jest o Vitest.
- Desplegar en contenedores (Docker) y usar un CDN para el frontend.
