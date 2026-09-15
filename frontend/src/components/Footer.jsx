import Icon from './Icon.jsx'
import nuveraLogo from '../assets/nuvera-logo.png'

const footerLinks = [
  ['Inicio', '#inicio'],
  ['Servicios', '#servicios'],
  ['Reservar cita', '#reservar'],
  ['Contacto', '#contacto'],
]

const socialLinks = [
  ['Instagram', 'instagram'],
  ['Facebook', 'facebook'],
  ['TikTok', 'tiktok'],
]

const apiLabels = {
  loading: 'Comprobando API',
  online: 'API disponible',
  offline: 'API local desconectada',
}

export default function Footer({ apiStatus }) {
  return (
    <footer className="footer">
      <div className="footer__main container">
        <a className="brand brand--footer brand--image" href="#inicio" aria-label="Nuvéra Spa, volver al inicio">
          <img className="brand__logo" src={nuveraLogo} alt="Nuvéra Spa" width="1024" height="559" />
        </a>
        <nav className="footer__nav" aria-label="Navegación del pie de página">
          {footerLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          <a className="footer__admin-link" href="#administracion">Administración</a>
        </nav>
        <div className="footer__social" aria-label="Redes sociales">
          {socialLinks.map(([label, icon]) => (
            <a key={label} href="#contacto" aria-label={label} title={label}><Icon name={icon} size={18} /></a>
          ))}
        </div>
      </div>
      <div className="footer__bottom container">
        <p>© 2026 Nuvéra Spa. Todos los derechos reservados.</p>
        <span className={`api-status api-status--${apiStatus}`} title="Estado del endpoint GET /api/health">
          <i aria-hidden="true" />{apiLabels[apiStatus]}
        </span>
      </div>
    </footer>
  )
}
