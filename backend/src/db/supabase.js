import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

let supabaseClient

export class SupabaseConfigurationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'SupabaseConfigurationError'
  }
}

export function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL?.trim()
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY?.trim()

  if (!supabaseUrl || !supabaseSecretKey) {
    const missingVariables = [
      !supabaseUrl && 'SUPABASE_URL',
      !supabaseSecretKey && 'SUPABASE_SECRET_KEY',
    ].filter(Boolean)

    throw new SupabaseConfigurationError(
      `Configuración de Supabase incompleta: falta ${missingVariables.join(' y ')}.`,
    )
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  }

  return supabaseClient
}
