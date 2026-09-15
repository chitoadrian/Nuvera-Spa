import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import nuveraLogo from '../assets/nuvera-logo.png'

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar({ isStandaloneView }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', isOpen)
    return () => document.body.classList.remove('menu-open')
  }, [isOpen])

  return (
    <header className={`navbar ${isScrolled || isStandaloneView ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <a className="brand brand--image" href="#inicio" aria-label="Nuvéra Spa, ir al inicio" onClick={() => setIsOpen(false)}>
          <img className="brand__logo" src={nuveraLogo} alt="Nuvéra Spa" width="1024" height="559" />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
          aria-controls="main-navigation"
          onClick={() => setIsOpen((current) => !current)}
        >
          <Icon name={isOpen ? 'x' : 'menu'} size={26} />
        </button>

        <nav id="main-navigation" className={`navbar__nav ${isOpen ? 'navbar__nav--open' : ''}`} aria-label="Navegación principal">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
