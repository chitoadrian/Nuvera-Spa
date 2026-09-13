import { services } from '../services/servicesData.js'
import SectionHeading from './SectionHeading.jsx'
import ServiceCard from './ServiceCard.jsx'

export default function Services({ onReserve }) {
  return (
    <section id="servicios" className="section services-section">
      <div className="container">
        <SectionHeading
          eyebrow="Nuestros rituales"
          title="Experiencias para tu bienestar"
          description="Tratamientos elegidos para ayudarte a bajar el ritmo, recuperar energía y sentirte bien en tu propia piel."
        />
        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} onReserve={onReserve} />
          ))}
        </div>
      </div>
    </section>
  )
}

