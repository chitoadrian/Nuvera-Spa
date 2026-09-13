const API_URL = import.meta.env.VITE_API_URL || '/api'

export async function getApiHealth(signal) {
  const response = await fetch(`${API_URL}/health`, { signal })

  if (!response.ok) {
    throw new Error('La API no respondió correctamente')
  }

  return response.json()
}

