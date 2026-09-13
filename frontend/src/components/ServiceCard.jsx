import Icon from './Icon.jsx'

export default function ServiceCard({ service, index, onReserve }) {
  return (
    <article className="service-card" style={{ '--card-delay': `${index * 90}ms` }}>
      <div className="service-card__image-wrap">
        <img src={service.image} alt={service.alt} loading="lazy" />
        <span className="service-card__number">0{index + 1}</span>
      </div>
      <div className="service-card__content">
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <div className="service-card__meta">
          <span><Icon name="clock" size={17} /> {service.duration}</span>
          <strong>${service.price}</strong>
        </div>
        <button className="text-button" type="button" onClick={() => onReserve(service.name)}>
          Reservar <Icon name="arrow" size={17} />
        </button>
      </div>
    </article>
  )
}

