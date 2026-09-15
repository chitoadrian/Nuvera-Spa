import { spaImages } from '../assets/images.js'
import SectionHeading from './SectionHeading.jsx'

const galleryItems = [
  { src: spaImages.masajeFacial, alt: 'Masaje facial en una cabina cálida', title: 'Cuidado facial', description: 'Maniobras suaves que invitan a relajar el rostro y recuperar luminosidad.' },
  { src: spaImages.piedras, alt: 'Aceite esencial acompañado de piedras de spa', title: 'Ritual mineral', description: 'Aceites y elementos naturales preparados para una pausa serena.' },
  { src: spaImages.aceites, alt: 'Selección de aceites esenciales junto a toallas suaves', title: 'Aromas esenciales', description: 'Esencias elegidas para acompañar cada experiencia de bienestar.' },
  { src: spaImages.hidroterapia, alt: 'Piscina interior de hidroterapia', title: 'Hidroterapia', description: 'El agua como espacio de descanso, alivio y renovación corporal.' },
  { src: spaImages.aromaterapia, alt: 'Preparación profesional de una mezcla aromática', title: 'Bienestar sensorial', description: 'Mezclas cuidadas que conectan aroma, tacto y tranquilidad.' },
  { src: spaImages.nosotros, alt: 'Instalaciones minimalistas de un spa contemporáneo', title: 'Espacios de calma', description: 'Ambientes cálidos y ordenados para desconectarte del ritmo diario.' },
]

export default function Gallery() {
  return (
    <section id="galeria" className="section gallery-section">
      <div className="container">
        <SectionHeading
          eyebrow="Atmósfera Nuvéra"
          title="Detalles que invitan a respirar"
          description="Texturas, aromas y espacios pensados para acompañar una experiencia de calma."
          align="left"
        />
        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <figure className="gallery-item" key={item.title}>
              <img src={item.src} alt={item.alt} loading="lazy" />
              <figcaption>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
