import BookingForm from './BookingForm.jsx'
import Icon from './Icon.jsx'

export default function BookingPage({ preselectedService }) {
  return (
    <div className="booking-page">
      <a className="page-back-link" href="#inicio">
        <Icon name="arrow" size={18} /> Volver al sitio
      </a>
      <BookingForm preselectedService={preselectedService} standalone />
    </div>
  )
}
