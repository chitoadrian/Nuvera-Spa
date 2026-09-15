import { ALLOWED_SERVICES, ALLOWED_STATUSES } from '../config/services.js'

const editableFields = [
  'nombre_cliente',
  'telefono',
  'correo_cliente',
  'servicio',
  'fecha_cita',
  'hora_cita',
  'estado',
]

function isRealDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
  )
}

function validateField(field, value) {
  if (value === undefined || value === null || value === '') return 'Este campo es obligatorio.'
  if (typeof value !== 'string') return 'Debe ser un texto válido.'

  if (!value.trim()) return 'Este campo es obligatorio.'

  if (field === 'nombre_cliente' && value.trim().length < 3) {
    return 'El nombre debe tener al menos 3 caracteres.'
  }

  if (field === 'telefono' && !/^\d{10}$/.test(value.trim())) {
    return 'El teléfono debe contener exactamente 10 dígitos.'
  }

  if (field === 'correo_cliente' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return 'Ingresa un correo electrónico válido.'
  }

  if (field === 'servicio' && !ALLOWED_SERVICES.includes(value.trim())) {
    return 'Selecciona un servicio válido.'
  }

  if (field === 'fecha_cita' && !isRealDate(value.trim())) {
    return 'La fecha debe tener un formato válido (AAAA-MM-DD).'
  }

  if (field === 'hora_cita' && !/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(value.trim())) {
    return 'La hora debe tener un formato válido (HH:MM).'
  }

  if (field === 'estado' && !ALLOWED_STATUSES.includes(value.trim())) {
    return 'El estado debe ser Pendiente, Confirmada o Cancelada.'
  }

  return null
}

function cleanFieldValue(field, value) {
  const cleaned = value.trim()
  if (field === 'correo_cliente') return cleaned.toLowerCase()
  return field === 'hora_cita' ? cleaned.slice(0, 5) : cleaned
}

export function validateNewAppointment(input = {}) {
  const requiredFields = ['nombre_cliente', 'telefono', 'correo_cliente', 'servicio', 'fecha_cita', 'hora_cita']
  const errors = {}
  const data = {}

  requiredFields.forEach((field) => {
    const error = validateField(field, input[field])
    if (error) errors[field] = error
    else data[field] = cleanFieldValue(field, input[field])
  })

  return { data, errors, isValid: Object.keys(errors).length === 0 }
}

export function validateAppointmentUpdate(input = {}) {
  const data = {}
  const errors = {}
  const providedFields = editableFields.filter((field) => (
    Object.prototype.hasOwnProperty.call(input, field)
  ))

  if (providedFields.length === 0) {
    return {
      data,
      errors: { body: 'Incluye al menos un campo permitido para actualizar.' },
      isValid: false,
    }
  }

  providedFields.forEach((field) => {
    const error = validateField(field, input[field])
    if (error) errors[field] = error
    else data[field] = cleanFieldValue(field, input[field])
  })

  return { data, errors, isValid: Object.keys(errors).length === 0 }
}

export function parseAppointmentId(rawId) {
  if (!/^\d+$/.test(rawId)) return null

  const id = Number(rawId)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}
