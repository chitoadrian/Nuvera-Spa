import { useState } from 'react'
import Icon from './Icon.jsx'
import SectionHeading from './SectionHeading.jsx'

function formatDate(value) {
  if (!value) return '—'
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

function formatPrice(value) {
  return `$${Number(value).toFixed(0)}`
}

function StatusBadge({ status }) {
  return <span className={`status-badge status-badge--${status.toLowerCase()}`}>{status}</span>
}

export default function ReservationsManager({
  appointments,
  status,
  error,
  activeAction,
  message,
  onRetry,
  onStatusChange,
  onDelete,
  onDismissMessage,
}) {
  const [appointmentToDelete, setAppointmentToDelete] = useState(null)

  async function confirmDelete() {
    const deleted = await onDelete(appointmentToDelete.id)
    if (deleted) setAppointmentToDelete(null)
  }

  return (
    <section id="gestion-reservas" className="section reservations-section">
      <div className="container">
        <SectionHeading
          eyebrow="Agenda Nuvéra"
          title="Gestión de reservas"
          description="Consulta y administra el estado de las citas desde un mismo lugar."
        />

        {message && (
          <div className={`manager-message manager-message--${message.type}`} role="status">
            <span>{message.text}</span>
            <button type="button" onClick={onDismissMessage} aria-label="Cerrar mensaje"><Icon name="x" size={17} /></button>
          </div>
        )}

        {status === 'loading' && (
          <div className="reservations-state" role="status">
            <span className="loading-spinner" aria-hidden="true" />
            Cargando reservas…
          </div>
        )}

        {status === 'error' && (
          <div className="reservations-state reservations-state--error" role="alert">
            <p>{error}</p>
            <button className="button button--outline" type="button" onClick={onRetry}>Intentar nuevamente</button>
          </div>
        )}

        {status === 'success' && appointments.length === 0 && (
          <div className="reservations-state reservations-state--empty">
            <span><Icon name="calendar" size={25} /></span>
            <h3>Aún no hay reservas</h3>
            <p>Las nuevas citas aparecerán aquí automáticamente.</p>
          </div>
        )}

        {status === 'success' && appointments.length > 0 && (
          <div className="reservations-table-wrap">
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Teléfono</th>
                  <th>Servicio</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Cabina</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => {
                  const isWorking = activeAction.id === appointment.id
                  return (
                    <tr key={appointment.id}>
                      <td data-label="Cliente"><strong>{appointment.nombre_cliente}</strong></td>
                      <td data-label="Teléfono"><a className="reservation-phone" href={`tel:${appointment.telefono}`}>{appointment.telefono}</a></td>
                      <td data-label="Servicio">{appointment.servicio}</td>
                      <td data-label="Fecha">{formatDate(appointment.fecha_cita)}</td>
                      <td data-label="Hora">{appointment.hora_cita?.slice(0, 5)}</td>
                      <td data-label="Precio" className="reservation-price">{formatPrice(appointment.precio_estimado)}</td>
                      <td data-label="Estado"><StatusBadge status={appointment.estado} /></td>
                      <td data-label="Cabina">{appointment.cabina || '—'}</td>
                      <td data-label="Acciones">
                        <div className="reservation-actions">
                          <button
                            className="action-button action-button--confirm"
                            type="button"
                            disabled={isWorking || appointment.estado === 'Confirmada'}
                            onClick={() => onStatusChange(appointment.id, 'Confirmada')}
                          >
                            {isWorking && activeAction.type === 'confirming' ? 'Confirmando…' : 'Confirmar'}
                          </button>
                          <button
                            className="action-button action-button--cancel"
                            type="button"
                            disabled={isWorking || appointment.estado === 'Cancelada'}
                            onClick={() => onStatusChange(appointment.id, 'Cancelada')}
                          >
                            {isWorking && activeAction.type === 'canceling' ? 'Cancelando…' : 'Cancelar'}
                          </button>
                          <button
                            className="action-button action-button--delete"
                            type="button"
                            disabled={isWorking}
                            onClick={() => setAppointmentToDelete(appointment)}
                          >
                            {isWorking && activeAction.type === 'deleting' ? 'Eliminando…' : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {appointmentToDelete && (
        <div className="confirmation-backdrop" role="presentation" onMouseDown={() => setAppointmentToDelete(null)}>
          <div
            className="confirmation-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <span className="confirmation-dialog__icon"><Icon name="calendar" size={25} /></span>
            <h3 id="delete-title">¿Eliminar esta reserva?</h3>
            <p>La cita de <strong>{appointmentToDelete.nombre_cliente}</strong> se eliminará de forma permanente.</p>
            <div className="confirmation-dialog__actions">
              <button className="button button--outline" type="button" disabled={activeAction.type === 'deleting'} onClick={() => setAppointmentToDelete(null)}>Conservar</button>
              <button className="button button--danger" type="button" disabled={activeAction.type === 'deleting'} onClick={confirmDelete}>
                {activeAction.type === 'deleting' ? 'Eliminando…' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
