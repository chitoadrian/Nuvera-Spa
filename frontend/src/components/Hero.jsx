import { spaImages } from '../assets/images.js'
import Icon from './Icon.jsx'

export default function Hero() {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <img
        className="hero__image"
        src={spaImages.hero}
        alt="Mujer disfrutando un baño de bienestar rodeada de flores"
        fetchPriority="high"
      />
      <div className="hero__overlay" />
      <div className="hero__botanical hero__botanical--one" aria-hidden="true"><Icon name="leaf" size={44} /></div>
      <div className="hero__botanical hero__botanical--two" aria-hidden="true"><Icon name="leaf" size={30} /></div>

      <div className="hero__content container">
        <div className="hero__copy">
          <span className="hero__eyebrow"><span /> Bienestar en Guayaquil</span>
          <h1 id="hero-title">Tu bienestar<br /><em>comienza aquí</em></h1>
          <p>Descubre un espacio creado para relajarte, renovarte y cuidar de ti en el corazón de Guayaquil.</p>
          <div className="hero__actions">
            <a className="button button--primary" href="#reservar">Reservar cita <Icon name="arrow" size={18} /></a>
            <a className="button button--ghost" href="#servicios">Ver servicios</a>
          </div>
        </div>

        <div className="hero__note" aria-label="Experiencia Nuvéra">
          <Icon name="sparkle" size={22} />
          <div>
            <span>Una pausa para ti</span>
            <strong>Rituales de cuidado personal</strong>
          </div>
        </div>
      </div>

      <a className="hero__scroll" href="#servicios" aria-label="Descubrir servicios">
        <span>Descubre</span>
        <i aria-hidden="true" />
      </a>
    </section>
  )
}
