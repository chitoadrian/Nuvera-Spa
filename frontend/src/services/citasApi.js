const API_URL = import.meta.env.VITE_API_URL || '/api'

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(body.message || 'La API no respondió correctamente.', response.status, body.errors)
  }

  return body
}

export function getCitas(signal) {
  return apiRequest('/citas', { signal })
}

export function createCita(appointment) {
  return apiRequest('/citas', {
    method: 'POST',
    body: JSON.stringify(appointment),
  })
}

export function updateCita(id, changes) {
  return apiRequest(`/citas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  })
}

export function deleteCita(id) {
  return apiRequest(`/citas/${id}`, { method: 'DELETE' })
}
