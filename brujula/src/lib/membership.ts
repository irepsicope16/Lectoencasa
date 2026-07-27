import type { User } from '@/types'

// Membresía anual manual (Fase "comercializar"): sin cobro automático — la
// profesional paga por fuera de la app y la fecha se renueva a mano desde
// Supabase (Table Editor → profiles → data.membershipExpiresAt).

export function oneYearFromNow(): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 1)
  return d.toISOString()
}

/** Sin fecha = sin restricción (cuentas viejas, dueña de la plataforma, modo local). */
export function isMembershipExpired(user: User | null): boolean {
  if (!user || user.role !== 'profesional' || !user.membershipExpiresAt) return false
  return new Date(user.membershipExpiresAt).getTime() < Date.now()
}
