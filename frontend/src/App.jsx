import { useEffect, useState } from 'react'
import AdminPortal from './components/AdminPortal.jsx'
import About from './components/About.jsx'
import Benefits from './components/Benefits.jsx'
import BookingPage from './components/BookingPage.jsx'
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
  const [currentView, setCurrentView] = useState(() => getViewFromHash())

  const isStandaloneView = currentView !== 'site'

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
      setCurrentView(getViewFromHash())
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  function reserveService(serviceName) {
    setSelectedService(serviceName)
    window.location.hash = '#reservar'
  }

  return (
    <>
      <a className="skip-link" href="#contenido-principal">Saltar al contenido</a>
      <Navbar isStandaloneView={isStandaloneView} />
      <main id="contenido-principal">
        {currentView === 'admin' ? (
          <AdminPortal />
        ) : currentView === 'booking' ? (
          <BookingPage preselectedService={selectedService} />
        ) : (
          <>
            <Hero />
            <Services onReserve={reserveService} />
            <About />
            <Benefits />
            <Gallery />
            <Contact />
          </>
        )}
      </main>
      <Footer apiStatus={apiStatus} />
    </>
  )
}

function getViewFromHash() {
  if (window.location.hash === '#administracion') return 'admin'
  if (window.location.hash === '#reservar') return 'booking'
  return 'site'
}
