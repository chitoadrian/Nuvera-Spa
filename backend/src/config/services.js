export const SERVICE_PRICES = Object.freeze({
  'Masaje relajante': 35,
  'Limpieza facial': 30,
  Hidroterapia: 40,
  Chocolaterapia: 45,
})

export const ALLOWED_SERVICES = Object.freeze(Object.keys(SERVICE_PRICES))
export const ALLOWED_STATUSES = Object.freeze(['Pendiente', 'Confirmada', 'Cancelada'])
export const DEFAULT_ROOM = 'Cabina 1'
