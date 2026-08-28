import type { User } from '@/types'

// Membresía anual manual (Fase "comercializar"): sin cobro automático — la
// profesional paga por fuera de la app y la fecha se renueva desde la
// pantalla /pro/profesionales (solo visible para la dueña de la plataforma).

/** Única cuenta con acceso administrativo (gestionar membresías de otras profesionales). */
export const OWNER_EMAIL = 'irenemorbidelli@gmail.com'

export function isOwner(user: User | null): boolean {
  return !!user && user.email.trim().toLowerCase() === OWNER_EMAIL
}

export function oneYearFromNow(): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 1)
  return d.toISOString()
}

/**
 * Autorregistro público (/registro): la cuenta se crea sin acceso activo —
 * queda "pendiente" hasta que la dueña de la plataforma confirme el pago y
 * la active desde /pro/profesionales. Evita que el link de registro, si
 * circula de más, le dé acceso gratis a cualquiera.
 */
export function pendingMembership(): string {
  return new Date().toISOString()
}

/** Sin fecha = sin restricción (cuentas viejas, dueña de la plataforma, modo local).
 * La dueña nunca queda bloqueada por membresía: es quien activa a las demás
 * desde /pro/profesionales, así que si su propia cuenta se recreara alguna
 * vez, el trigger de alta la dejaría en "pendiente" igual que a cualquiera
 * — sin esta excepción quedaría afuera de la única pantalla que le
 * permitiría reactivarse a sí misma. */
export function isMembershipExpired(user: User | null): boolean {
  if (!user || user.role !== 'profesional' || !user.membershipExpiresAt) return false
  if (isOwner(user)) return false
  return new Date(user.membershipExpiresAt).getTime() < Date.now()
}
