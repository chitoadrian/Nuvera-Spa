import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import citasRouter from './routes/citasRoutes.js'
import healthRouter from './routes/healthRoutes.js'

const app = express()
const port = Number(process.env.PORT) || 3000
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

app.use(
  cors({
    origin: frontendOrigin,
  }),
)
app.use(express.json())

app.use('/api', healthRouter)
app.use('/api/citas', citasRouter)

app.use((_request, response) => {
  response.status(404).json({
    ok: false,
    message: 'Ruta no encontrada',
  })
})

app.use((error, _request, response, _next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return response.status(400).json({
      ok: false,
      message: 'El cuerpo de la petición debe contener JSON válido.',
    })
  }

  console.error('Error interno no controlado en la API')
  response.status(500).json({
    ok: false,
    message: 'Error interno del servidor',
  })
})

app.listen(port, () => {
  console.log(`API de Nuvéra Spa disponible en http://localhost:${port}`)
})

export default app
