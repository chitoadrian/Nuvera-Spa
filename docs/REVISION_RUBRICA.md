# Revisión de la rúbrica de `Practica Diseño Web.pdf`

Revisión realizada contra las cuatro páginas del PDF original. “Implementado” describe el código disponible; “probado” se limita a comprobaciones realmente ejecutadas. La base indicada por el usuario está en Supabase/PostgreSQL administrado, aunque el PDF denomina “local” al criterio 2.

| # | Criterio y puntos | Estado verificable | Evidencia y prueba |
|---|---|---|---|
| 1 | Backend Node.js (0,80) | Implementado y probado | Express modular, `cors`, `express.json()`, entorno, 404 y error general. El servidor inició en puerto 3000 y `/api/health` respondió 200. |
| 2 | Conexión a base (0,80) | Implementado y probado | `db/supabase.js` valida entorno y reutiliza un cliente. GET, INSERT, UPDATE y DELETE funcionaron contra Supabase/PostgreSQL. Supabase es administrado y remoto, aunque el PDF denomina “local” al criterio. |
| 3 | CRUD REST (1,20) | Implementado y probado | GET 200, POST 201, PUT 200, PATCH 200 y DELETE 200 se probaron contra `public.citas`; DELETE repetido devolvió 404. |
| 4 | Validaciones y respuestas (0,80) | Implementado y probado | Se probaron 200, 201, 400, 404 y 409. Un duplicado produjo `23505` en PostgreSQL y 409 en Express. Cancelar permitió reutilizar el horario. |
| 5 | Arquitectura React (1,00) | Implementado y compilado | Formulario, lista/tabla responsive, tarjetas de servicios, cabecera y secciones reutilizables. Vite compiló 45 módulos correctamente. |
| 6 | Estados y efectos (1,00) | Implementado y compilado | `useState` gestiona formulario, citas, loading, errores, mensajes y acciones. `useEffect` carga citas, comprueba salud y limpia peticiones/listeners/temporizadores. |
| 7 | Consumo API (1,00) | Implementado y probado | Desde React se creó, confirmó, canceló y eliminó una cita real. Formulario, mensajes, badges y listado cambiaron sin recargar. El loading está implementado; la respuesta fue demasiado rápida para capturarlo visualmente. |
| 8 | Diseño y UX (0,80) | Implementado; escritorio probado | Identidad Nuvéra, paleta relajante, imágenes locales, formulario validado y tabla transformable en tarjetas. Se revisó la vista de escritorio, sin overflow horizontal, con 12 imágenes cargadas. Las reglas responsive a 390 px se inspeccionaron en CSS; esta ejecución no pudo capturar ese ancho exacto. |
| 9 | Sustentación oral (1,30) | Material preparado; depende del estudiante | `GUIA_SUSTENTACION.md` explica flujo extremo a extremo y bloques reales. El desempeño oral no puede probarse automáticamente. |
| 10 | Prueba escrita (1,30) | Material preparado; no evaluable aquí | La guía cubre React, Node, HTTP, persistencia, seguridad y solución de duplicados. La calificación depende del examen presencial. |

## Modelo y reglas contrastados

- El recurso incluye los campos mínimos del PDF: id, cliente, teléfono, servicio, fecha, hora, precio y estado.
- El teléfono se valida como 10 dígitos en React y Express.
- Ningún campo obligatorio puede viajar vacío.
- El precio se calcula en Express a partir del servicio.
- PostgreSQL impide horarios activos duplicados por fecha, hora y cabina; Express convierte `23505` en 409.
- La UI presenta mensajes de éxito/error y estados de carga.
- Las mutaciones actualizan el estado React sin recargar toda la página.

## Pruebas ejecutadas hasta ahora

- `npm run build` en frontend: correcto, 45 módulos transformados.
- Comprobación de sintaxis de servidor, controlador y validador: correcta.
- Instalación resuelta: `@supabase/supabase-js@2.116.0`, sin vulnerabilidades reportadas por npm.
- `GET /api/health`: 200 y JSON exacto.
- `POST /api/citas` sin nombre: 400.
- `POST /api/citas` con teléfono incorrecto: 400.
- `PATCH /api/citas/no-valido`: 400.
- Ruta desconocida: 404.
- GET y POST válidos con configuración incompleta: 500 seguro, sin revelar secretos.
- `GET /api/citas`: 200 contra Supabase.
- `POST /api/citas`: 201, estado Pendiente, Cabina 1 y precio calculado $35 aun enviando un precio manipulado.
- `POST /api/citas` duplicado: PostgreSQL `23505` y respuesta Express 409 con el mensaje requerido.
- `PATCH` a Confirmada: 200; `PATCH` a Cancelada: 200.
- Reutilización del mismo horario cancelado: segundo POST 201.
- `PUT` de servicio: 200 y precio recalculado de $35 a $40.
- `DELETE`: 200; segundo DELETE del mismo ID: 404.
- Flujo React real: creación, limpieza, alta inmediata en la tabla, confirmación, cancelación, confirmación visual de borrado y eliminación sin recarga.
- Verificación posterior por API de cada estado y de la eliminación final.
- Revisión en navegador de la landing, formulario y nueva sección: sin errores de consola.
- Medición de escritorio: ancho de documento igual al ancho útil, sin scroll horizontal.
- Recursos visuales: 12 de 12 imágenes completas y con ancho natural válido.
- Seguridad del frontend: cero referencias a Supabase/Secret Key y ningún marcador secreto visible.
- Seguridad exacta: la clave real tuvo cero coincidencias en frontend, bundle, README, documentación y archivos de ejemplo.
- Limpieza: cero filas restantes con `nombre_cliente = "Prueba Automatizada Nuvéra"`.

## Pendiente fuera de las pruebas automatizadas

La persistencia y el CRUD ya están probados. Sigue pendiente una captura visual exacta a 390 px de la nueva tabla/tarjetas porque la herramienta de navegador no expuso control de viewport. El desempeño de la sustentación oral y la prueba escrita dependen del estudiante y no pueden validarse automáticamente.

## Verificación tras el traslado — 13/09/2026

- Carpetas frontend, backend y docs, componentes, diez imágenes fuente, README y PDF presentes. No se reconstruyó el proyecto ni se modificó el PDF. No hay carpeta .git: no es posible comparar con el historial de la otra computadora. La regla .env existe en .gitignore, pero no se puede verificar el estado del índice Git anterior.
- backend/.env existe y la clave está definida; la URL coincide con el proyecto indicado. Cero coincidencias de la clave real fuera de backend/.env, incluyendo frontend y dist.
- node_modules y ambos lockfiles presentes. npm ls --depth=0 correcto en ambas carpetas; no fue necesario reinstalar ni cambiar versiones.
- Frontend :5173 y backend :3000 iniciados con npm run dev. El bloqueo inicial EACCES del entorno de ejecución causó un 500: se resolvió iniciando el backend con acceso de red, sin cambiar la aplicación. Una consulta posterior aislada devolvió 500; la repetición respondió 200. No se atribuye ese fallo transitorio a una causa no comprobada.
- API real: health 200, citas GET 200, POST válido 201, POST inválido 400, duplicado 409 con “El horario seleccionado ya está ocupado.” y código PostgreSQL 23505. PATCH Confirmada/Cancelada 200, reutilización del horario 201, PUT 200, DELETE 200 y DELETE repetido 404.
- React: Prueba Automatizada Nuvéra, 0990000000, Masaje relajante, 15/02/2038 17:00. ID 14 creado, confirmado, cancelado y eliminado desde la interfaz sin recargar. Cada estado y la eliminación fueron contrastados mediante GET de Express, cuyo controlador consulta Supabase. Se observaron mensajes y botones deshabilitados durante envío, confirmación, cancelación y eliminación.
- IDs 10 y 13 de la prueba API y 14 de React eliminados; GET final confirmó cero IDs de esta ejecución. El script temporal de esta revisión limpia exclusivamente sus propios IDs, sin borrar por coincidencia de nombre.
- Escritorio: ancho útil/documento 1265/1265. Viewport móvil configurado a 390 × 844: ancho útil/documento 375/375 por la barra vertical, sin scroll horizontal. Formulario y tarjeta de reserva revisados visualmente; menú abierto, enlace usado y cierre verificados.
- Se corrigió únicamente CSS responsive: el backdrop-filter de la cabecera desplazada limitaba el menú fijo a la altura de la barra. Al abrir el menú móvil se desactiva ese filtro y se conserva contraste blanco. Verificación visual posterior correcta.
- 12/12 imágenes de la página cargadas. Transiciones de menú y desplazamiento observadas. Consola capturada: cero errores o advertencias durante la prueba React.
- Build final correcto: 45 módulos. No se cambiaron tablas ni esquema.
- Límite de seguridad: arquitectura y proxy inspeccionados (React → /api → Express → Supabase); sin clave en el bundle. No se capturó el panel Network ni todos sus encabezados/cuerpos porque esta herramienta no lo expone. Esa comprobación completa sigue pendiente, al igual que una auditoría de políticas RLS. La API actual tampoco incorpora autenticación de administración: CORS no sustituye autorización.

Esta revisión sustituye el pendiente de viewport móvil indicado arriba. Las pruebas anteriores que no se repitieron conservan carácter histórico; sustentación y examen siguen dependiendo del estudiante.
