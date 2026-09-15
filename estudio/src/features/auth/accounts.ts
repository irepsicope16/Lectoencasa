import { db } from '@/services/storage/db'
import { isCloudEnabled } from '@/services/cloud/config'
import type { Student } from '@/types'

// Sin 0/O/1/l/I: se dicta por teléfono o WhatsApp y esos caracteres se confunden.
const PASSWORD_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'

function generatePassword(length = 8): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, (b) => PASSWORD_CHARS[b % PASSWORD_CHARS.length]).join('')
}

/**
 * Garantiza que el estudiante tenga su cuenta de acceso al portal (rol
 * "estudiante"). Se invoca al crear la ficha. Acceso cerrado: la cuenta la
 * genera la profesional, nunca un autoregistro público — coherente con la
 * decisión de producto del 13/09/2026.
 *
 * Devuelve las credenciales si se creó una cuenta nueva, o null si ya
 * existía o el estudiante no tiene contacto con forma de email.
 */
export async function ensureStudentAccount(student: Student): Promise<{ email: string; password: string } | null> {
  const email = student.contacto.trim().toLowerCase()
  if (!email.includes('@')) return null

  // Modo nube: registro real en Supabase Auth con un cliente aislado (no
  // pisa la sesión de la profesional). El trigger crea el perfil.
  if (isCloudEnabled()) {
    const { getIsolatedClient } = await import('@/services/cloud/client')
    const sb = await getIsolatedClient()
    const password = generatePassword()
    const { error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'estudiante',
          nombre: student.nombre,
          apellido: student.apellido,
          studentId: student.id,
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
    if (existing.role === 'estudiante' && !existing.studentId) {
      await db.users.update(existing.id, { studentId: student.id })
    }
    return null
  }

  const password = generatePassword()
  await db.users.create({
    role: 'estudiante',
    nombre: student.nombre,
    apellido: student.apellido,
    email,
    password,
    studentId: student.id,
  })
  return { email, password }
}
