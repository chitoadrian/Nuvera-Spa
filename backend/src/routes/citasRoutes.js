import { Router } from 'express'
import {
  actualizarCita,
  crearCita,
  eliminarCita,
  listarCitas,
} from '../controllers/citasController.js'

const citasRouter = Router()

citasRouter.get('/', listarCitas)
citasRouter.post('/', crearCita)
citasRouter.put('/:id', actualizarCita)
citasRouter.patch('/:id', actualizarCita)
citasRouter.delete('/:id', eliminarCita)

export default citasRouter
