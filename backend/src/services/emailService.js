import { randomUUID } from 'node:crypto'
import nodemailer from 'nodemailer'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const GMAIL_SMTP_HOST = 'smtp.gmail.com'
const GMAIL_SMTP_PORT = 465

export class EmailProviderError extends Error {
  constructor(provider, status, providerCode, providerMessage) {
    super('EMAIL_PROVIDER_ERROR')
    this.name = 'EmailProviderError'
    this.provider = provider
    this.status = status || 'unknown'
    this.providerCode = sanitizeProviderCode(providerCode)
    this.providerMessage = sanitizeProviderMessage(providerMessage)
  }
}

function sanitizeProviderCode(code) {
  if (typeof code !== 'string' || !/^[A-Z0-9_-]{1,60}$/i.test(code)) return 'unknown'
  return code
}

function sanitizeProviderMessage(message) {
  if (!message || typeof message !== 'string') return 'El proveedor rechazó el envío.'

  return message
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[correo oculto]')
    .replace(/\b(?:re|sb_secret)_[A-Za-z0-9_-]+\b/gi, '[credencial oculta]')
    .replace(/\b(?:pass(?:word)?|token|secret|authorization)\s*[=:]\s*\S+/gi, '$1=[credencial oculta]')
    .slice(0, 500)
}

function getEmailConfiguration() {
  const smtpUser = process.env.SMTP_USER?.trim()
  const smtpAppPassword = process.env.SMTP_APP_PASSWORD?.replace(/\s+/g, '')
  const from = process.env.EMAIL_FROM?.trim()
  const hasAnySmtpValue = Boolean(smtpUser || smtpAppPassword)

  if (smtpUser && smtpAppPassword && from) {
    return { provider: 'gmail-smtp', smtpUser, smtpAppPassword, from }
  }

  if (hasAnySmtpValue) {
    return { provider: 'gmail-smtp', invalid: true }
  }

  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (apiKey && from) return { provider: 'resend', apiKey, from }

  return null
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatDate(value) {
  if (!value) return ''
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

function appointmentDetails(appointment) {
  const details = [
    ['Nombre', appointment.nombre_cliente],
    ['Servicio', appointment.servicio],
    ['Fecha', formatDate(appointment.fecha_cita)],
    ['Hora', appointment.hora_cita?.slice(0, 5)],
    ['Precio estimado', `$${Number(appointment.precio_estimado).toFixed(0)}`],
    ['Estado', appointment.estado],
  ]

  return details.map(([label, value]) => (
    `<tr><td style="padding:6px 16px 6px 0;color:#66716c">${label}</td><td style="padding:6px 0;color:#173c34;font-weight:600">${escapeHtml(value)}</td></tr>`
  )).join('')
}

function emailLayout({ heading, introduction, appointment }) {
  return `<!doctype html>
  <html lang="es"><body style="margin:0;background:#f6f0e5;font-family:Arial,sans-serif;color:#1d2925">
    <div style="max-width:600px;margin:0 auto;padding:32px 20px">
      <div style="padding:32px;border-radius:18px;background:#ffffff;border:1px solid #e5ddd0">
        <p style="margin:0 0 10px;color:#bd9854;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Nuvéra Spa</p>
        <h1 style="margin:0 0 16px;color:#173c34;font-family:Georgia,serif;font-size:30px;font-weight:500">${escapeHtml(heading)}</h1>
        <p style="margin:0 0 22px;line-height:1.6;color:#66716c">${escapeHtml(introduction)}</p>
        <table role="presentation" style="width:100%;border-collapse:collapse">${appointmentDetails(appointment)}</table>
      </div>
    </div>
  </body></html>`
}

async function sendWithGmailSmtp(configuration, message) {
  const transporter = nodemailer.createTransport({
    host: GMAIL_SMTP_HOST,
    port: GMAIL_SMTP_PORT,
    secure: true,
    auth: {
      user: configuration.smtpUser,
      pass: configuration.smtpAppPassword,
    },
    logger: false,
    debug: false,
    disableFileAccess: true,
    disableUrlAccess: true,
  })

  try {
    await transporter.sendMail({
      from: configuration.from,
      to: message.to,
      subject: message.subject,
      html: message.html,
    })
  } catch (error) {
    throw new EmailProviderError(
      'gmail-smtp',
      error.responseCode,
      error.code || error.command,
      error.response || error.message,
    )
  }

  return { delivered: true, skipped: false, provider: 'gmail-smtp' }
}

async function sendWithResend(configuration, message) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${configuration.apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': message.idempotencyKey,
      'User-Agent': 'Nuvera-Spa/1.0',
    },
    body: JSON.stringify({
      from: configuration.from,
      to: [message.to],
      subject: message.subject,
      html: message.html,
    }),
  })

  if (!response.ok) {
    const providerError = await response.json().catch(() => ({}))
    throw new EmailProviderError(
      'resend',
      response.status,
      providerError.name,
      providerError.message,
    )
  }

  return { delivered: true, skipped: false, provider: 'resend' }
}

async function sendEmail(message) {
  const configuration = getEmailConfiguration()
  if (!configuration) return { delivered: false, skipped: true }

  if (configuration.invalid) {
    throw new EmailProviderError(
      'gmail-smtp',
      'configuration',
      'SMTP_CONFIGURATION',
      'Faltan variables SMTP requeridas.',
    )
  }

  if (configuration.provider === 'gmail-smtp') {
    return sendWithGmailSmtp(configuration, message)
  }

  return sendWithResend(configuration, message)
}

export function sendNewAppointmentEmail(appointment) {
  return sendEmail({
    to: appointment.correo_cliente,
    subject: 'Recibimos tu solicitud de reserva | Nuvéra Spa',
    html: emailLayout({
      heading: 'Solicitud de reserva recibida',
      introduction: 'Registramos tu solicitud. El estado inicial es Pendiente y te avisaremos cuando la cita sea confirmada.',
      appointment,
    }),
    idempotencyKey: `appointment-created/${appointment.id}`,
  })
}

export function sendAppointmentStatusEmail(appointment) {
  if (!appointment.correo_cliente) return Promise.resolve({ delivered: false, skipped: true })

  const isConfirmed = appointment.estado === 'Confirmada'
  const statusSlug = isConfirmed ? 'confirmed' : 'cancelled'
  return sendEmail({
    to: appointment.correo_cliente,
    subject: `${isConfirmed ? 'Cita confirmada' : 'Cita cancelada'} | Nuvéra Spa`,
    html: emailLayout({
      heading: isConfirmed ? 'Tu cita está confirmada' : 'Tu cita fue cancelada',
      introduction: isConfirmed
        ? 'Tu momento de bienestar ha sido confirmado. Te esperamos en la fecha y hora indicadas.'
        : 'Te informamos que esta cita fue cancelada. Puedes enviarnos una nueva solicitud cuando lo desees.',
      appointment,
    }),
    idempotencyKey: `appointment-${statusSlug}/${appointment.id}/${randomUUID()}`,
  })
}
