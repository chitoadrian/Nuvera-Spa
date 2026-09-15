import { useEffect, useState } from 'react'
import AdminPortal from './components/AdminPortal.jsx'
import About from './components/About.jsx'
import Benefits from './components/Benefits.jsx'
import BookingForm from './components/BookingForm.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Gallery from './components/Gallery.jsx'
import Hero from './components/Hero.jsx'
import Navbar from './components/Navbar.jsx'
import Services from './components/Services.jsx'
import { getApiHealth } from './services/api.js'

export default function App() {
  const [selectedService, setSelectedService] = useState('')
  const [apiStatus, setApiStatus] = useState('loading')
  const [isAdminView, setIsAdminView] = useState(() => window.location.hash === '#administracion')

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

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#administracion')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  function reserveService(serviceName) {
    setSelectedService(serviceName)
    document.querySelector('#reservas')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <a className="skip-link" href="#contenido-principal">Saltar al contenido</a>
      <Navbar isAdminView={isAdminView} />
      <main id="contenido-principal">
        {isAdminView ? (
          <AdminPortal />
        ) : (
          <>
            <Hero />
            <Services onReserve={reserveService} />
            <About />
            <Benefits />
            <BookingForm preselectedService={selectedService} />
            <Gallery />
            <Contact />
          </>
        )}
      </main>
      <Footer apiStatus={apiStatus} isAdminView={isAdminView} />
    </>
  )
}
