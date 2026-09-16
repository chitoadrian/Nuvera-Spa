import { useEffect, useMemo, useState } from 'react'
import { createCita } from '../services/citasApi.js'
import { servicePrices, services } from '../services/servicesData.js'
import Icon from './Icon.jsx'
import SectionHeading from './SectionHeading.jsx'

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  service: '',
  date: '',
  time: '',
}

function getToday() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Ingresa tu nombre y apellido.'
  else if (form.name.trim().split(/\s+/).length < 2) errors.name = 'Incluye al menos un nombre y un apellido.'

  if (!form.phone) errors.phone = 'Ingresa tu número de teléfono.'
  else if (!/^0\d{9}$/.test(form.phone)) errors.phone = 'Usa 10 dígitos y comienza con 0.'

  if (!form.email.trim()) errors.email = 'Ingresa tu correo electrónico.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Ingresa un correo electrónico válido.'

  if (!form.service) errors.service = 'Selecciona un servicio.'
  if (!form.date) errors.date = 'Selecciona una fecha.'
  else if (form.date < getToday()) errors.date = 'Selecciona una fecha desde hoy en adelante.'
  if (!form.time) errors.time = 'Selecciona una hora.'
  return errors
}

export default function BookingForm({ preselectedService, onCreated, standalone = false }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [message, setMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const estimatedPrice = useMemo(() => servicePrices[form.service] || 0, [form.service])

  useEffect(() => {
    if (!preselectedService) return
    setForm((current) => ({ ...current, service: preselectedService }))
    setErrors((current) => ({ ...current, service: undefined }))
  }, [preselectedService])

  useEffect(() => {
    if (!message) return undefined
    const timeoutId = window.setTimeout(() => setMessage(null), 6000)
    return () => window.clearTimeout(timeoutId)
  }, [message])

  function updateField(event) {
    const { name, value } = event.target
    const nextValue = name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value
    const nextForm = { ...form, [name]: nextValue }
    setForm(nextForm)
    setMessage(null)
    if (touched[name]) setErrors(validate(nextForm))
  }

  function markTouched(event) {
    const { name: field, value } = event.target
    const nextValue = field === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value
    const nextForm = { ...form, [field]: nextValue }
    setForm(nextForm)
    setTouched((current) => ({ ...current, [field]: true }))
    setErrors(validate(nextForm))
  }

  async function submitBooking(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const submittedEmail = String(formData.get('email') || '').trim()
    const submittedForm = {
      ...form,
      email: submittedEmail || form.email,
    }
    const validationErrors = validate(submittedForm)
    setForm(submittedForm)
    setErrors(validationErrors)
    setTouched({ name: true, phone: true, email: true, service: true, date: true, time: true })

    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await createCita({
        nombre_cliente: submittedForm.name.trim(),
        telefono: submittedForm.phone,
        correo_cliente: submittedForm.email.trim().toLowerCase(),
        servicio: submittedForm.service,
        fecha_cita: submittedForm.date,
        hora_cita: submittedForm.time,
      })

      onCreated?.(response.data)
      setMessage({ type: 'success', text: 'Tu cita ha sido reservada correctamente.' })
      setForm(emptyForm)
      setTouched({})
      setErrors({})
    } catch (error) {
      let text = 'No pudimos procesar tu reserva. Intenta nuevamente.'
      if (error.status === 409) text = 'El horario seleccionado ya está ocupado. Elige otra hora.'
      else if (error.status === 400 && error.message) text = error.message
      setMessage({ type: 'error', text })
    } finally {
      setIsSubmitting(false)
    }
  }

  function fieldClass(field) {
    return touched[field] && errors[field] ? 'form-field form-field--error' : 'form-field'
  }

  return (
    <section id="reservar" className={`section booking-section ${standalone ? 'booking-section--standalone' : ''}`}>
      <div className="booking-glow" aria-hidden="true" />
      <div className="container">
        <SectionHeading
          eyebrow="Tu pausa empieza aquí"
          title="Reserva tu momento de bienestar"
          description="Elige tu experiencia y envía tu solicitud de reserva de forma rápida y segura."
        />

        <div className="booking-card">
          <div className="booking-card__intro">
            <span className="booking-card__icon"><Icon name="leaf" size={28} /></span>
            <p>Agenda en línea</p>
            <h3>Un momento solo para ti</h3>
            <p className="booking-card__copy">Completa tus datos, revisa el valor estimado y reserva tu espacio de bienestar.</p>
            <div className="booking-card__hours">
              <Icon name="clock" size={20} />
              <span><strong>Atención todos los días</strong>Horarios sujetos a disponibilidad</span>
            </div>
          </div>

          <form className="booking-form" onSubmit={submitBooking} noValidate>
            <div className="form-grid">
              <label className={fieldClass('name')}>
                <span>Nombre y apellido</span>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Ej. Ana Andrade"
                  value={form.name}
                  onChange={updateField}
                  onBlur={markTouched}
                  aria-invalid={Boolean(touched.name && errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {touched.name && errors.name && <small id="name-error">{errors.name}</small>}
              </label>

              <label className={fieldClass('phone')}>
                <span>Teléfono</span>
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="099 000 0000"
                  value={form.phone}
                  onChange={updateField}
                  onBlur={markTouched}
                  aria-invalid={Boolean(touched.phone && errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {touched.phone && errors.phone && <small id="phone-error">{errors.phone}</small>}
              </label>

              <label className={`${fieldClass('email')} form-field--wide`}>
                <span>Correo electrónico</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@correo.com"
                  value={form.email}
                  onChange={updateField}
                  onInput={updateField}
                  onBlur={markTouched}
                  aria-invalid={Boolean(touched.email && errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  required
                />
                {touched.email && errors.email && <small id="email-error">{errors.email}</small>}
              </label>

              <label className={`${fieldClass('service')} form-field--wide`}>
                <span>Servicio</span>
                <select
                  name="service"
                  value={form.service}
                  onChange={updateField}
                  onBlur={markTouched}
                  aria-invalid={Boolean(touched.service && errors.service)}
                  aria-describedby={errors.service ? 'service-error' : undefined}
                >
                  <option value="">Selecciona una experiencia</option>
                  {services.map((service) => <option key={service.id} value={service.name}>{service.name}</option>)}
                </select>
                {touched.service && errors.service && <small id="service-error">{errors.service}</small>}
              </label>

              <label className={fieldClass('date')}>
                <span>Fecha</span>
                <input
                  name="date"
                  type="date"
                  min={getToday()}
                  value={form.date}
                  onChange={updateField}
                  onBlur={markTouched}
                  aria-invalid={Boolean(touched.date && errors.date)}
                  aria-describedby={errors.date ? 'date-error' : undefined}
                />
                {touched.date && errors.date && <small id="date-error">{errors.date}</small>}
              </label>

              <label className={fieldClass('time')}>
                <span>Hora</span>
                <select
                  name="time"
                  value={form.time}
                  onChange={updateField}
                  onBlur={markTouched}
                  aria-invalid={Boolean(touched.time && errors.time)}
                  aria-describedby={errors.time ? 'time-error' : undefined}
                >
                  <option value="">Selecciona una hora</option>
                  {['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:00'].map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {touched.time && errors.time && <small id="time-error">{errors.time}</small>}
              </label>
            </div>

            <div className={`price-summary ${estimatedPrice ? 'price-summary--active' : ''}`} aria-live="polite">
              <div><span>Precio estimado</span><small>{form.service || 'Selecciona un tratamiento'}</small></div>
              <strong>{estimatedPrice ? `$${estimatedPrice}` : '—'}</strong>
            </div>

            <button className="button button--primary button--full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando reserva…' : 'Confirmar reserva'}
              {!isSubmitting && <Icon name="arrow" size={18} />}
            </button>

            {message && (
              <div
                className={`form-message form-message--${message.type}`}
                role={message.type === 'error' ? 'alert' : 'status'}
              >
                <span><Icon name={message.type === 'success' ? 'check' : 'x'} size={18} /></span>
                {message.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
