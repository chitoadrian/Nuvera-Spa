import { createClient } from '@supabase/supabase-js'

let supabaseClient

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
    supabaseClient = createClient(supabaseUrl, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }

  return supabaseClient
}
