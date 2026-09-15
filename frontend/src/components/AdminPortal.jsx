import { useEffect, useState } from 'react'
import { deleteCita, getCitas, updateCita } from '../services/citasApi.js'
import { getSupabaseBrowserClient } from '../services/supabaseAuth.js'
import AdminLogin from './AdminLogin.jsx'
import Icon from './Icon.jsx'
import ReservationsManager from './ReservationsManager.jsx'

function sortAppointments(appointments) {
  return [...appointments].sort((first, second) => {
    const firstDateTime = `${first.fecha_cita} ${first.hora_cita}`
    const secondDateTime = `${second.fecha_cita} ${second.hora_cita}`
    return firstDateTime.localeCompare(secondDateTime)
  })
}

function AdminDashboard({ session, onLogout }) {
  const [appointments, setAppointments] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [activeAction, setActiveAction] = useState({ id: null, type: '' })
  const [message, setMessage] = useState(null)

  async function loadAppointments(signal) {
    setStatus('loading')
    setError('')

    try {
      const response = await getCitas(session.access_token, signal)
      setAppointments(sortAppointments(response.data))
      setStatus('success')
    } catch (requestError) {
      if (requestError.name === 'AbortError') return
      const text = requestError.status === 403
        ? 'Esta cuenta está autenticada, pero no tiene permisos de administración.'
        : requestError.status === 401
          ? 'La sesión no es válida o ha expirado. Cierra sesión e ingresa nuevamente.'
          : 'No pudimos cargar las reservas en este momento.'
      setError(text)
      setStatus('error')
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    loadAppointments(controller.signal)
    return () => controller.abort()
  }, [session.access_token])

  async function changeAppointmentStatus(id, estado) {
    setActiveAction({ id, type: estado === 'Confirmada' ? 'confirming' : 'canceling' })
    setMessage(null)

    try {
      const response = await updateCita(id, { estado }, session.access_token)
      setAppointments((current) => sortAppointments(
        current.map((appointment) => (appointment.id === id ? response.data : appointment)),
      ))
      setMessage({
        type: 'success',
        text: estado === 'Confirmada' ? 'Reserva confirmada correctamente.' : 'Reserva cancelada correctamente.',
      })
      return true
    } catch (requestError) {
      const text = requestError.status === 409
        ? 'El horario seleccionado ya está ocupado.'
        : requestError.status === 401 || requestError.status === 403
          ? 'Tu sesión no permite realizar esta acción.'
          : 'No pudimos actualizar la reserva. Intenta nuevamente.'
      setMessage({ type: 'error', text })
      return false
    } finally {
      setActiveAction({ id: null, type: '' })
    }
  }

  async function removeAppointment(id) {
    setActiveAction({ id, type: 'deleting' })
    setMessage(null)

    try {
      await deleteCita(id, session.access_token)
      setAppointments((current) => current.filter((appointment) => appointment.id !== id))
      setMessage({ type: 'success', text: 'Cita eliminada correctamente.' })
      return true
    } catch (requestError) {
      const text = requestError.status === 401 || requestError.status === 403
        ? 'Tu sesión no permite realizar esta acción.'
        : 'No pudimos eliminar la reserva. Intenta nuevamente.'
      setMessage({ type: 'error', text })
      return false
    } finally {
      setActiveAction({ id: null, type: '' })
    }
  }

  return (
    <>
      <div className="admin-toolbar container">
        <div>
          <span>Sesión administrativa</span>
          <strong>{session.user.email}</strong>
        </div>
        <button className="button button--outline" type="button" onClick={onLogout}>Cerrar sesión</button>
      </div>
      <ReservationsManager
        appointments={appointments}
        status={status}
        error={error}
        activeAction={activeAction}
        message={message}
        onRetry={() => loadAppointments()}
        onStatusChange={changeAppointmentStatus}
        onDelete={removeAppointment}
        onDismissMessage={() => setMessage(null)}
      />
    </>
  )
}

export default function AdminPortal() {
  const [session, setSession] = useState(null)
  const [status, setStatus] = useState('loading')
  const [configurationError, setConfigurationError] = useState('')

  useEffect(() => {
    let active = true
    let subscription

    try {
      const supabase = getSupabaseBrowserClient()
      supabase.auth.getSession().then(({ data, error }) => {
        if (!active) return
        if (error) setConfigurationError('No se pudo recuperar la sesión administrativa.')
        setSession(data.session)
        setStatus('ready')
      })

      const authListener = supabase.auth.onAuthStateChange((_event, nextSession) => {
        if (active) {
          setSession(nextSession)
          setStatus('ready')
        }
      })
      subscription = authListener.data.subscription
    } catch (error) {
      setConfigurationError(error.message)
      setStatus('ready')
    }

    return () => {
      active = false
      subscription?.unsubscribe()
    }
  }, [])

  async function login(email, password) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.session) {
      throw new Error('No se pudo iniciar sesión. Revisa el correo y la contraseña.')
    }

    setSession(data.session)
  }

  async function logout() {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    setSession(null)
  }

  if (status === 'loading') {
    return (
      <div className="admin-page admin-page--loading" aria-live="polite">
        <span className="loading-spinner" aria-hidden="true" />
        Recuperando sesión…
      </div>
    )
  }

  return (
    <div className="admin-page">
      <a className="admin-back-link" href="#inicio"><Icon name="arrow" size={18} /> Volver al sitio</a>
      {session
        ? <AdminDashboard session={session} onLogout={logout} />
        : <AdminLogin configurationError={configurationError} onLogin={login} />}
    </div>
  )
}
