import { createClient } from '@supabase/supabase-js'

let supabaseClient

function clearLegacySession(supabaseUrl) {
  if (typeof window === 'undefined') return

  try {
    const projectRef = new URL(supabaseUrl).hostname.split('.')[0]
    const storageKey = `sb-${projectRef}-auth-token`
    window.localStorage.removeItem(storageKey)
    window.sessionStorage.removeItem(storageKey)
  } catch {
    // A malformed URL is reported by Supabase when the client is created.
  }
}

export class SupabaseBrowserConfigurationError extends Error {
  constructor() {
    super('El acceso administrativo no está configurado en este entorno.')
    this.name = 'SupabaseBrowserConfigurationError'
  }
}

export function getSupabaseBrowserClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

  if (!supabaseUrl || !publishableKey) {
    throw new SupabaseBrowserConfigurationError()
  }

  if (!supabaseClient) {
    clearLegacySession(supabaseUrl)
    supabaseClient = createClient(supabaseUrl, publishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  }

  return supabaseClient
}
