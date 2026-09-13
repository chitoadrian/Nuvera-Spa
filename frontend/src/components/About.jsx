import { spaImages } from '../assets/images.js'
import Icon from './Icon.jsx'

const features = [
  'Profesionales especializados',
  'Atención personalizada',
  'Ambiente de relajación',
]

export default function About() {
  return (
    <section id="nosotros" className="section about-section">
      <div className="about container">
        <div className="about__visual">
          <div className="about__frame">
            <img src={spaImages.nosotros} alt="Recepción moderna y luminosa de un spa elegante" loading="lazy" />
          </div>
          <div className="about__badge" aria-hidden="true">
            <Icon name="leaf" size={25} />
            <span>Calma<br />cotidiana</span>
          </div>
          <span className="about__line" aria-hidden="true" />
        </div>

        <div className="about__content">
          <span className="eyebrow">Sobre Nuvéra</span>
          <h2>Un espacio pensado para ti</h2>
          <p className="about__lead">Nuvéra Spa es un centro de bienestar en Guayaquil creado para hacer del descanso una parte esencial de tu rutina.</p>
          <p>Combinamos cuidado personal, atención cercana y tratamientos seleccionados para que cada visita se sienta única, serena y completamente tuya.</p>
          <ul className="feature-list">
            {features.map((feature) => (
              <li key={feature}><span><Icon name="check" size={16} /></span>{feature}</li>
            ))}
          </ul>
          <a className="text-button" href="#reservas">Conoce tu próximo ritual <Icon name="arrow" size={17} /></a>
        </div>
      </div>
    </section>
  )
}

