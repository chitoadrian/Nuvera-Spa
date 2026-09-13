import { spaImages } from '../assets/images.js'

export const services = [
  {
    id: 'masaje-relajante',
    name: 'Masaje relajante',
    description: 'Movimientos suaves que liberan tensión y devuelven calma al cuerpo.',
    duration: '60 min',
    price: 35,
    image: spaImages.masaje,
    alt: 'Persona recibiendo un masaje relajante en una cabina luminosa',
  },
  {
    id: 'limpieza-facial',
    name: 'Limpieza facial',
    description: 'Un ritual de limpieza e hidratación adaptado a las necesidades de tu piel.',
    duration: '50 min',
    price: 30,
    image: spaImages.facial,
    alt: 'Especialista realizando una limpieza facial profesional',
  },
  {
    id: 'hidroterapia',
    name: 'Hidroterapia',
    description: 'Bienestar a través del agua para relajar músculos y renovar la energía.',
    duration: '45 min',
    price: 40,
    image: spaImages.hidroterapia,
    alt: 'Piscina interior preparada para una sesión de hidroterapia',
  },
  {
    id: 'chocolaterapia',
    name: 'Chocolaterapia',
    description: 'Una experiencia sensorial con cacao que nutre la piel y relaja los sentidos.',
    duration: '70 min',
    price: 45,
    image: spaImages.chocolate,
    alt: 'Granos de cacao utilizados en un tratamiento de chocolaterapia',
  },
]

export const servicePrices = Object.fromEntries(
  services.map((service) => [service.name, service.price]),
)

