import { useEffect, useState } from 'react'
import About from './components/About.jsx'
import Benefits from './components/Benefits.jsx'
import BookingForm from './components/BookingForm.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Gallery from './components/Gallery.jsx'
import Hero from './components/Hero.jsx'
import Navbar from './components/Navbar.jsx'
import ReservationsManager from './components/ReservationsManager.jsx'
import Services from './components/Services.jsx'
import { getApiHealth } from './services/api.js'
import { deleteCita, getCitas, updateCita } from './services/citasApi.js'

function sortAppointments(appointments) {
  return [...appointments].sort((first, second) => {
    const firstDateTime = `${first.fecha_cita} ${first.hora_cita}`
    const secondDateTime = `${second.fecha_cita} ${second.hora_cita}`
    return firstDateTime.localeCompare(secondDateTime)
  })
}

export default function App() {
  const [selectedService, setSelectedService] = useState('')
  const [apiStatus, setApiStatus] = useState('loading')
  const [appointments, setAppointments] = useState([])
  const [appointmentsStatus, setAppointmentsStatus] = useState('loading')
  const [appointmentsError, setAppointmentsError] = useState('')
  const [activeAction, setActiveAction] = useState({ id: null, type: '' })
  const [managerMessage, setManagerMessage] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function checkApi() {
      try {
        await getApiHealth(controller.signal)
        setApiStatus('online')
      } catch (error) {
        if (error.name !== 'AbortError') setApiStatus('offline')
      }
    }

    checkApi()
    return () => controller.abort()
  }, [])

  async function loadAppointments(signal) {
    setAppointmentsStatus('loading')
    setAppointmentsError('')

    try {
      const response = await getCitas(signal)
      setAppointments(sortAppointments(response.data))
      setAppointmentsStatus('success')
    } catch (error) {
      if (error.name === 'AbortError') return
      setAppointmentsError('No pudimos cargar las reservas en este momento.')
      setAppointmentsStatus('error')
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    loadAppointments(controller.signal)
    return () => controller.abort()
  }, [])

  function reserveService(serviceName) {
    setSelectedService(serviceName)
    document.querySelector('#reservas')?.scrollIntoView({ behavior: 'smooth' })
  }

  function addAppointment(appointment) {
    setAppointments((current) => sortAppointments([...current, appointment]))
    setAppointmentsStatus('success')
    setManagerMessage({ type: 'success', text: 'La nueva reserva ya aparece en el listado.' })
  }

  async function changeAppointmentStatus(id, estado) {
    setActiveAction({ id, type: estado === 'Confirmada' ? 'confirming' : 'canceling' })
    setManagerMessage(null)

    try {
      const response = await updateCita(id, { estado })
      setAppointments((current) => sortAppointments(
        current.map((appointment) => (appointment.id === id ? response.data : appointment)),
      ))
      setManagerMessage({
        type: 'success',
        text: estado === 'Confirmada' ? 'Reserva confirmada correctamente.' : 'Reserva cancelada correctamente.',
      })
      return true
    } catch (error) {
      const message = error.status === 409
        ? 'El horario seleccionado ya está ocupado.'
        : 'No pudimos actualizar la reserva. Intenta nuevamente.'
      setManagerMessage({ type: 'error', text: message })
      return false
    } finally {
      setActiveAction({ id: null, type: '' })
    }
  }

  async function removeAppointment(id) {
    setActiveAction({ id, type: 'deleting' })
    setManagerMessage(null)

    try {
      await deleteCita(id)
      setAppointments((current) => current.filter((appointment) => appointment.id !== id))
      setManagerMessage({ type: 'success', text: 'Cita eliminada correctamente.' })
      return true
    } catch (_error) {
      setManagerMessage({ type: 'error', text: 'No pudimos eliminar la reserva. Intenta nuevamente.' })
      return false
    } finally {
      setActiveAction({ id: null, type: '' })
    }
  }

  return (
    <>
      <a className="skip-link" href="#contenido-principal">Saltar al contenido</a>
      <Navbar />
      <main id="contenido-principal">
        <Hero />
        <Services onReserve={reserveService} />
        <About />
        <Benefits />
        <BookingForm preselectedService={selectedService} onCreated={addAppointment} />
        <ReservationsManager
          appointments={appointments}
          status={appointmentsStatus}
          error={appointmentsError}
          activeAction={activeAction}
          message={managerMessage}
          onRetry={() => loadAppointments()}
          onStatusChange={changeAppointmentStatus}
          onDelete={removeAppointment}
          onDismissMessage={() => setManagerMessage(null)}
        />
        <Gallery />
        <Contact />
      </main>
      <Footer apiStatus={apiStatus} />
    </>
  )
}
