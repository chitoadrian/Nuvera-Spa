# Guía de sustentación: Nuvéra Spa

## 1. La idea general

Nuvéra Spa está dividido en tres capas:

```text
Frontend React  →  API Express  →  Supabase (PostgreSQL)
```

El **frontend** es lo que ve y usa el cliente: landing page, formulario y lista de reservas. El **backend** recibe peticiones, valida los datos, aplica reglas y responde. La **base de datos** conserva las citas incluso si se cierra el navegador.

## 2. ¿Qué es una API REST?

Es un conjunto de rutas HTTP para trabajar con recursos. En este proyecto el recurso es `citas`:

- `GET /api/citas`: pide la lista; no cambia datos.
- `POST /api/citas`: crea una cita y responde 201.
- `PATCH /api/citas/:id`: cambia parte de una cita, por ejemplo su estado.
- `PUT /api/citas/:id`: acepta el mismo controlador de actualización para cumplir la rúbrica.
- `DELETE /api/citas/:id`: elimina físicamente una cita.

La ruta identifica la operación y el controlador contiene la lógica. Por ejemplo, `citasRoutes.js` relaciona `POST /` con `crearCita`, y `citasController.js` valida, calcula el precio y usa Supabase.

## 3. Hooks de React

**`useState`** guarda información que puede cambiar. `BookingForm.jsx` guarda los cinco campos, errores, mensaje y estado de envío. `App.jsx` guarda el arreglo de citas, la carga inicial y la acción activa. Cuando se llama a `setAppointments`, React vuelve a renderizar únicamente lo necesario.

**`useEffect`** ejecuta una tarea relacionada con el ciclo de vida. Cuando `App` se monta, un efecto llama `getCitas()`. Su función de limpieza aborta la petición si la pantalla se desmonta. Otros efectos controlan el navbar, el menú móvil y el temporizador de mensajes.

Flujo de carga:

1. Se monta `App.jsx`.
2. `useEffect` llama `getCitas()`.
3. `fetch` consulta Express.
4. Express consulta Supabase.
5. El resultado vuelve como JSON.
6. `setAppointments` reemplaza el estado.
7. React muestra las filas o tarjetas sin recargar la página.

## 4. `fetch`, `async` y `await`

`fetch` envía una petición HTTP. Las funciones de `citasApi.js` centralizan URL, método, cuerpo JSON y errores.

Una función `async` puede esperar operaciones asíncronas. `await` pausa esa función, no toda la página, hasta recibir la respuesta. Un bloque `try/catch/finally` permite mostrar éxito, manejar un error y terminar el loading aunque falle la petición.

Ejemplo conceptual del formulario:

```js
try {
  const response = await createCita(datos)
  onCreated(response.data)
} catch (error) {
  // Muestra 400, 409 o un mensaje general.
} finally {
  setIsSubmitting(false)
}
```

## 5. ¿Qué hace Express?

Express crea el servidor HTTP. `cors()` configura el origen permitido para el navegador (no autentica usuarios), `express.json()` convierte el cuerpo JSON en `request.body`, las rutas delegan a controladores, el middleware 404 atiende URLs inexistentes y el middleware final evita exponer detalles internos en errores inesperados.

El backend escucha por defecto en el puerto 3000. `GET /api/health` demuestra que Express funciona aunque la base todavía no esté configurada.

## 6. Supabase y PostgreSQL

Supabase es la plataforma que expone herramientas para trabajar con la base. La base real es **PostgreSQL**, un motor relacional. La tabla existente `public.citas` guarda cliente, teléfono, servicio, fecha, hora, precio, estado y cabina.

`db/supabase.js` crea una sola instancia del cliente oficial. Lee la URL y la clave privada desde el entorno; no contiene valores secretos escritos en el código. Únicamente Express usa la clave del servidor. Las políticas RLS deben verificarse en Supabase; esta revisión del traslado no auditó dichas políticas.

## 7. Viaje completo de una cita

1. El usuario completa nombre, teléfono, servicio, fecha y hora.
2. React valida y deshabilita el botón mientras envía.
3. `createCita()` hace `POST /api/citas` con JSON.
4. Express limpia espacios y vuelve a validar todos los campos.
5. El backend busca el precio en `config/services.js`; no acepta un precio libre del navegador.
6. Agrega `Pendiente` y `Cabina 1`.
7. Supabase inserta la fila en PostgreSQL y devuelve la cita.
8. Express responde 201.
9. React agrega la cita al estado, limpia el formulario y actualiza la lista sin recargar.

Validar dos veces es intencional: React mejora la experiencia; Express protege la regla aunque alguien llame directamente a la API.

## 8. ¿Qué ocurre con un horario duplicado?

PostgreSQL tiene una restricción que impide dos citas activas en la misma fecha, hora y cabina. Si se intenta, devuelve el código `23505`. El controlador lo reconoce y responde **409 Conflict** con “El horario seleccionado ya está ocupado.” React traduce esa respuesta en un mensaje claro. Una cita con estado `Cancelada` no bloquea el horario.

## 9. Códigos HTTP usados

| Código | Significado en Nuvéra |
|---|---|
| 200 | Consulta, actualización o eliminación correcta |
| 201 | Nueva cita creada |
| 400 | Campos o identificador inválidos |
| 404 | Ruta o cita inexistente |
| 409 | Horario activo duplicado |
| 500 | Configuración faltante o fallo inesperado del servidor |

## 10. Seguridad de la clave

La clave privada puede saltarse RLS y por eso solo vive en `backend/.env`. Ese archivo está ignorado. React no importa el paquete de Supabase, no usa una variable privada y nunca recibe la clave. Si estuviera en una variable `VITE_*`, Vite la incorporaría al JavaScript público del navegador; por eso sería inseguro.

## 11. Preguntas rápidas

**¿Por qué el backend calcula el precio?** Para evitar que alguien modifique el precio desde el navegador.

**¿Cómo se actualiza sin recargar?** La API devuelve la fila actualizada y React reemplaza ese objeto dentro de `appointments` usando `map`; al eliminar usa `filter`.

**¿Por qué hay un loading?** Informa que existe una operación en curso y evita doble clic.

**¿Dónde se ordenan las citas?** Supabase las consulta por `fecha_cita` y `hora_cita` ascendentes; React conserva ese orden cuando agrega o reemplaza una fila.

**¿Qué debe poder explicar el estudiante?** El camino React → Express → PostgreSQL, cada método HTTP, la mutación inmutable del estado y por qué las validaciones críticas se repiten en el servidor.

