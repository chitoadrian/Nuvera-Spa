import { DEFAULT_ROOM, SERVICE_PRICES } from '../config/services.js'
import { getSupabaseClient, SupabaseConfigurationError } from '../db/supabase.js'
import { sendAppointmentStatusEmail, sendNewAppointmentEmail } from '../services/emailService.js'
import {
  parseAppointmentId,
  validateAppointmentUpdate,
  validateNewAppointment,
} from '../validators/citasValidation.js'

const APPOINTMENT_COLUMNS = [
  'id',
  'nombre_cliente',
  'telefono',
  'correo_cliente',
  'servicio',
  'fecha_cita',
  'hora_cita',
  'precio_estimado',
  'estado',
  'cabina',
  'created_at',
  'updated_at',
].join(',')

function firstValidationMessage(errors) {
  return Object.values(errors)[0]
}

function sendDatabaseError(response, error, action) {
  if (error?.code === '23505') {
    return response.status(409).json({
      ok: false,
      message: 'El horario seleccionado ya está ocupado.',
    })
  }

  if (error instanceof SupabaseConfigurationError) {
    return response.status(500).json({
      ok: false,
      message: 'El servicio de reservas no está configurado en el servidor.',
    })
  }

  console.error(`No se pudo ${action} la cita`, error?.code || 'ERROR_DESCONOCIDO')
  return response.status(500).json({
    ok: false,
    message: `No se pudo ${action} la cita. Intenta nuevamente.`,
  })
}

async function notifySafely(sendNotification, context) {
  try {
    const result = await sendNotification()
    if (result.skipped) console.info(`Notificación de correo omitida: ${context}`)
    return result
  } catch (error) {
    const providerDetails = error.name === 'EmailProviderError'
      ? `EMAIL_PROVIDER_ERROR provider=${error.provider} status=${error.status} code=${error.providerCode} message=${error.providerMessage}`
      : 'EMAIL_PROVIDER_ERROR provider=unknown status=unknown code=INTERNAL_ERROR'
    console.error(`No se pudo enviar la notificación de correo: ${context}`, providerDetails)
    return { delivered: false, skipped: false }
  }
}

export async function listarCitas(_request, response) {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('citas')
      .select(APPOINTMENT_COLUMNS)
      .order('fecha_cita', { ascending: true })
      .order('hora_cita', { ascending: true })

    if (error) return sendDatabaseError(response, error, 'consultar')

    return response.status(200).json({ ok: true, data })
  } catch (error) {
    return sendDatabaseError(response, error, 'consultar')
  }
}

export async function crearCita(request, response) {
  const validation = validateNewAppointment(request.body)

  if (!validation.isValid) {
    return response.status(400).json({
      ok: false,
      message: firstValidationMessage(validation.errors),
      errors: validation.errors,
    })
  }

  const appointment = {
    ...validation.data,
    precio_estimado: SERVICE_PRICES[validation.data.servicio],
    estado: 'Pendiente',
    cabina: DEFAULT_ROOM,
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('citas')
      .insert(appointment)
      .select(APPOINTMENT_COLUMNS)
      .single()

    if (error) return sendDatabaseError(response, error, 'crear')

    const emailNotification = await notifySafely(
      () => sendNewAppointmentEmail(data),
      'nueva reserva',
    )

    return response.status(201).json({ ok: true, data, emailNotification })
  } catch (error) {
    return sendDatabaseError(response, error, 'crear')
  }
}

export async function actualizarCita(request, response) {
  const id = parseAppointmentId(request.params.id)
  if (!id) {
    return response.status(400).json({ ok: false, message: 'El identificador de la cita no es válido.' })
  }

  const validation = validateAppointmentUpdate(request.body)
  if (!validation.isValid) {
    return response.status(400).json({
      ok: false,
      message: firstValidationMessage(validation.errors),
      errors: validation.errors,
    })
  }

  const changes = { ...validation.data }
  if (changes.servicio) changes.precio_estimado = SERVICE_PRICES[changes.servicio]

  try {
    const supabase = getSupabaseClient()
    let previousStatus

    if (changes.estado) {
      const { data: currentAppointment, error: lookupError } = await supabase
        .from('citas')
        .select('estado')
        .eq('id', id)
        .maybeSingle()

      if (lookupError) return sendDatabaseError(response, lookupError, 'consultar')
      if (!currentAppointment) return response.status(404).json({ ok: false, message: 'Cita no encontrada.' })
      previousStatus = currentAppointment.estado
    }

    const { data, error } = await supabase
      .from('citas')
      .update(changes)
      .eq('id', id)
      .select(APPOINTMENT_COLUMNS)
      .maybeSingle()

    if (error) return sendDatabaseError(response, error, 'actualizar')
    if (!data) return response.status(404).json({ ok: false, message: 'Cita no encontrada.' })

    let emailNotification = { delivered: false, skipped: true }
    const shouldNotifyStatus = (
      changes.estado
      && changes.estado !== previousStatus
      && ['Confirmada', 'Cancelada'].includes(changes.estado)
    )

    if (shouldNotifyStatus) {
      emailNotification = await notifySafely(
        () => sendAppointmentStatusEmail(data),
        `estado ${changes.estado.toLowerCase()}`,
      )
    }

    return response.status(200).json({ ok: true, data, emailNotification })
  } catch (error) {
    return sendDatabaseError(response, error, 'actualizar')
  }
}

export async function eliminarCita(request, response) {
  const id = parseAppointmentId(request.params.id)
  if (!id) {
    return response.status(400).json({ ok: false, message: 'El identificador de la cita no es válido.' })
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('citas')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle()

    if (error) return sendDatabaseError(response, error, 'eliminar')
    if (!data) return response.status(404).json({ ok: false, message: 'Cita no encontrada.' })

    return response.status(200).json({
      ok: true,
      message: 'Cita eliminada correctamente',
    })
  } catch (error) {
    return sendDatabaseError(response, error, 'eliminar')
  }
}
