# API Tareas con Clima Externo

Proyecto REST en Node.js y Express que integra una API externa de clima usando Axios.

## Endpoints principales

### Tareas

- GET /api/tareas
- GET /api/tareas/:id
- POST /api/tareas
- PUT /api/tareas/:id
- DELETE /api/tareas/:id

### Clima

- GET /api/clima/:ciudad
- GET /api/tareas/:id/clima/:ciudad

## Variables de entorno

Crear archivo .env con:

PORT=3000
OPENWEATHER_API_KEY=tu_api_key

## Códigos HTTP usados

- 200 OK: la petición fue correcta.
- 201 Created: se creó una tarea.
- 204 No Content: se eliminó correctamente.
- 400 Bad Request: los datos enviados son inválidos.
- 404 Not Found: no existe la tarea solicitada.
- 502 Bad Gateway: falló el servicio externo de clima.