import { Router } from 'express'
import {
  actualizarCita,
  crearCita,
  eliminarCita,
  listarCitas,
} from '../controllers/citasController.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'

const citasRouter = Router()

citasRouter.post('/', crearCita)
citasRouter.get('/', requireAuth, requireAdmin, listarCitas)
citasRouter.put('/:id', requireAuth, requireAdmin, actualizarCita)
citasRouter.patch('/:id', requireAuth, requireAdmin, actualizarCita)
citasRouter.delete('/:id', requireAuth, requireAdmin, eliminarCita)

export default citasRouter
