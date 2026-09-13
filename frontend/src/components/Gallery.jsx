import { spaImages } from '../assets/images.js'
import SectionHeading from './SectionHeading.jsx'

const galleryItems = [
  { src: spaImages.masajeFacial, alt: 'Masaje facial en una cabina cálida', className: 'gallery-item--tall' },
  { src: spaImages.piedras, alt: 'Aceite esencial acompañado de piedras de spa', className: '' },
  { src: spaImages.aceites, alt: 'Aceites esenciales junto a toallas suaves', className: '' },
  { src: spaImages.hidroterapia, alt: 'Piscina interior de hidroterapia', className: 'gallery-item--wide' },
  { src: spaImages.aromaterapia, alt: 'Preparación profesional de aceites y mezclas de aromaterapia', className: '' },
  { src: spaImages.nosotros, alt: 'Instalaciones minimalistas de un spa contemporáneo', className: '' },
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
          {galleryItems.map((item, index) => (
            <figure className={`gallery-item ${item.className}`} key={`${item.alt}-${index}`}>
              <img src={item.src} alt={item.alt} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

