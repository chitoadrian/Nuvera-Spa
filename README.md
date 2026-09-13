# Nuvéra Spa

Plataforma Full-Stack de reservas para un spa en Guayaquil. Conserva una landing page premium y agrega persistencia real mediante una API REST.

## Arquitectura

```text
React + Vite  →  HTTP/fetch  →  Node.js + Express  →  Supabase/PostgreSQL
   :5173                            :3000
```

React nunca se conecta directamente a Supabase. El navegador solo conoce la URL de Express. La clave privada del proyecto existe únicamente en `backend/.env`, archivo ignorado por Git, y el servidor la utiliza para crear un solo cliente de Supabase.

La tabla `public.citas` ya existe en Supabase. Este proyecto no crea ni modifica su esquema.

## Configuración

Requisitos: Node.js 22 o posterior y un proyecto de Supabase con la tabla indicada por la práctica.

1. Instala las dependencias si todavía no existen:

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

2. En `backend/.env`, completa manualmente `SUPABASE_SECRET_KEY`. No copies ese valor al frontend, al README ni al control de versiones.

3. Ejecuta el backend:

   ```bash
   cd backend
   npm run dev
   ```

4. En otra terminal, ejecuta el frontend:

   ```bash
   cd frontend
   npm run dev
   ```

Frontend: `http://localhost:5173`  
API: `http://localhost:3000/api`

## Endpoints

| Método | Ruta | Acción | Respuesta exitosa |
|---|---|---|---|
| GET | `/api/health` | Comprueba que Express responde | 200 |
| GET | `/api/citas` | Lista por fecha y hora ascendentes | 200 |
| POST | `/api/citas` | Crea una cita pendiente | 201 |
| PUT/PATCH | `/api/citas/:id` | Actualiza datos o estado | 200 |
| DELETE | `/api/citas/:id` | Elimina físicamente una cita | 200 |

El backend valida nombre, teléfono ecuatoriano de 10 dígitos, servicio, fecha, hora y estado. También calcula `precio_estimado`; ignora cualquier precio enviado por el navegador. La cabina inicial es `Cabina 1` y una cita nueva comienza como `Pendiente`.

PostgreSQL protege los horarios activos con una restricción. Cuando devuelve el código `23505`, el controlador lo traduce a HTTP 409 con un mensaje de horario ocupado. Una cita `Cancelada` no bloquea nuevamente ese horario.

## Flujo en React

- `useState` conserva formulario, citas, cargas, errores, acciones y mensajes.
- `useEffect` carga las citas al montar `App` y cancela la petición si el componente se desmonta.
- `fetch` realiza las peticiones definidas en `frontend/src/services/citasApi.js`.
- `async/await` mantiene legible la secuencia de petición, respuesta y manejo de errores.
- Al crear, confirmar, cancelar o eliminar, `setAppointments` actualiza la pantalla sin recargar la página.

## Organización del backend

- `routes`: relaciona método y URL con una función.
- `controllers`: ejecuta cada caso de uso y construye la respuesta HTTP.
- `validators`: limpia y valida entradas antes de consultar la base.
- `config/services.js`: centraliza servicios, precios, estados y cabina.
- `db/supabase.js`: verifica el entorno y reutiliza un único cliente.

Los códigos usados son 200 (consulta o cambio correcto), 201 (creación), 400 (entrada inválida), 404 (recurso inexistente), 409 (horario duplicado) y 500 (fallo de configuración o servidor). Los errores 500 no exponen detalles privados.

## Comprobaciones

```bash
cd frontend
npm run build

cd ../backend
npm start
```

La revisión de pruebas y criterios evaluables se registra en `docs/REVISION_RUBRICA.md`. La explicación para la defensa está en `docs/GUIA_SUSTENTACION.md`.
