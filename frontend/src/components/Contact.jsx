import Icon from './Icon.jsx'

export default function Contact() {
  return (
    <section id="contacto" className="contact-section">
      <div className="contact container">
        <div className="contact__heading">
          <span className="eyebrow eyebrow--light">Visítanos</span>
          <h2>Nuvéra Spa – Guayaquil</h2>
          <p>Cuando necesites una pausa, estaremos aquí para recibirte.</p>
        </div>

        <div className="contact__details">
          <article>
            <Icon name="map" size={24} />
            <div><span>Ubicación</span><strong>Guayaquil, Ecuador</strong></div>
          </article>
          <article>
            <Icon name="clock" size={24} />
            <div><span>Horario</span><strong>Lun – Sáb · 09:00 – 19:00</strong><small>Dom · 10:00 – 16:00</small></div>
          </article>
          <article>
            <Icon name="phone" size={24} />
            <div><span>Teléfono</span><a href="tel:+593990000000">099 000 0000</a></div>
          </article>
        </div>
      </div>
    </section>
  )
}

