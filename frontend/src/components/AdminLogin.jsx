import { useState } from 'react'
import Icon from './Icon.jsx'

export default function AdminLogin({ configurationError, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await onLogin(email.trim(), password)
      setPassword('')
    } catch (loginError) {
      setError(loginError.message || 'No se pudo iniciar sesión. Revisa tus credenciales.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="admin-login-card">
      <span className="admin-login-card__icon"><Icon name="users" size={28} /></span>
      <p className="eyebrow">Acceso privado</p>
      <h1>Administración</h1>
      <p className="admin-login-card__copy">Ingresa con la cuenta administrativa autorizada para gestionar la agenda.</p>

      <form className="admin-login-form" onSubmit={submit} noValidate>
        <label className="form-field">
          <span>Correo electrónico</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="form-field">
          <span>Contraseña</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {(configurationError || error) && (
          <div className="form-message form-message--error" role="alert">
            <span><Icon name="x" size={18} /></span>
            {configurationError || error}
          </div>
        )}

        <button
          className="button button--primary button--full"
          type="submit"
          disabled={isSubmitting || Boolean(configurationError) || !email.trim() || !password}
        >
          {isSubmitting ? 'Verificando…' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  )
}
