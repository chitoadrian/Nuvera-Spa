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
  const { accessToken, ...fetchOptions } = options
  const response = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...fetchOptions.headers,
    },
  })

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(body.message || 'La API no respondió correctamente.', response.status, body.errors)
  }

  return body
}

export function getCitas(accessToken, signal) {
  return apiRequest('/citas', { accessToken, signal })
}

export function createCita(appointment) {
  return apiRequest('/citas', {
    method: 'POST',
    body: JSON.stringify(appointment),
  })
}

export function updateCita(id, changes, accessToken) {
  return apiRequest(`/citas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
    accessToken,
  })
}

export function deleteCita(id, accessToken) {
  return apiRequest(`/citas/${id}`, { method: 'DELETE', accessToken })
}
