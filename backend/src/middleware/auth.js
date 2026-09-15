import { getSupabaseClient, SupabaseConfigurationError } from '../db/supabase.js'

function unauthorized(response, message = 'Debes iniciar sesión para acceder a este recurso.') {
  return response.status(401).json({ ok: false, message })
}

export async function requireAuth(request, response, next) {
  const authorization = request.get('authorization') || ''
  const match = authorization.match(/^Bearer\s+(.+)$/i)

  if (!match?.[1]?.trim()) return unauthorized(response)

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.getUser(match[1].trim())

    if (error || !data.user) {
      return unauthorized(response, 'La sesión no es válida o ha expirado.')
    }

    request.authUser = data.user
    return next()
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return response.status(500).json({
        ok: false,
        message: 'La autenticación administrativa no está configurada en el servidor.',
      })
    }

    console.error('No se pudo validar la sesión administrativa')
    return response.status(500).json({
      ok: false,
      message: 'No se pudo validar la sesión administrativa.',
    })
  }
}

export function requireAdmin(request, response, next) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()

  if (!adminEmail) {
    return response.status(500).json({
      ok: false,
      message: 'La cuenta administrativa no está configurada en el servidor.',
    })
  }

  const userEmail = request.authUser?.email?.trim().toLowerCase()
  if (!userEmail || userEmail !== adminEmail) {
    return response.status(403).json({
      ok: false,
      message: 'Tu cuenta no tiene permisos de administración.',
    })
  }

  return next()
}
