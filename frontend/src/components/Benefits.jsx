import Icon from './Icon.jsx'

const benefits = [
  { value: '+500', label: 'clientes satisfechos', icon: 'users' },
  { value: '4', label: 'tratamientos principales', icon: 'sparkle' },
  { value: '100%', label: 'atención personalizada', icon: 'smile' },
  { value: '7', label: 'días de atención', icon: 'calendar' },
]

export default function Benefits() {
  return (
    <section className="benefits-section" aria-label="La experiencia Nuvéra en cifras">
      <div className="benefits container">
        {benefits.map((benefit) => (
          <article className="benefit" key={benefit.label}>
            <span className="benefit__icon"><Icon name={benefit.icon} size={25} /></span>
            <div><strong>{benefit.value}</strong><span>{benefit.label}</span></div>
          </article>
        ))}
      </div>
    </section>
  )
}
