import { db } from '@/services/storage/db'
import { isCloudEnabled } from '@/services/cloud/config'
import type { Consultant } from '@/types'

/**
 * Garantiza que el consultante tenga su cuenta de acceso a la plataforma.
 * Se invoca al crear (o editar el email de) un consultante.
 * Devuelve las credenciales si se creó una cuenta nueva, o null si ya existía
 * o el consultante no tiene email. En Supabase esto será una invitación por
 * magic link; el contrato de este helper no cambia.
 */
export async function ensureConsultantAccount(
  consultant: Consultant,
): Promise<{ email: string; password: string } | null> {
  const email = consultant.email.trim().toLowerCase()
  if (!email) return null

  // Modo nube: registro real en Supabase Auth con un cliente aislado
  // (no pisa la sesión de la profesional). El trigger crea el perfil.
  if (isCloudEnabled()) {
    const { getIsolatedClient } = await import('@/services/cloud/client')
    const sb = await getIsolatedClient()
    const password = 'brujula'
    const { error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'consultante',
          nombre: consultant.nombre,
          apellido: consultant.apellido,
          consultantId: consultant.id,
        },
      },
    })
    if (error) {
      // cuenta ya existente u otro error: no bloquea la creación de la ficha
      return null
    }
    return { email, password }
  }

  const users = await db.users.list()
  const existing = users.find((u) => u.email.toLowerCase() === email)
  if (existing) {
    // enlaza la cuenta existente si estaba huérfana
    if (existing.role === 'consultante' && !existing.consultantId) {
      await db.users.update(existing.id, { consultantId: consultant.id })
    }
    return null
  }
  const password = 'brujula'
  await db.users.create({
    role: 'consultante',
    nombre: consultant.nombre,
    apellido: consultant.apellido,
    email,
    password,
    consultantId: consultant.id,
  })
  return { email, password }
}
