import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInYears, format, formatDistanceToNow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function edad(fechaNacimiento: string): number {
  try {
    return differenceInYears(new Date(), parseISO(fechaNacimiento))
  } catch {
    return 0
  }
}

export function fechaCorta(iso: string): string {
  try {
    return format(parseISO(iso), "d 'de' MMMM", { locale: es })
  } catch {
    return iso
  }
}

export function fechaLarga(iso: string): string {
  try {
    return format(parseISO(iso), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
  } catch {
    return iso
  }
}

export function fechaHora(iso: string): string {
  try {
    return format(parseISO(iso), "d MMM · HH:mm 'h'", { locale: es })
  } catch {
    return iso
  }
}

export function haceCuanto(iso: string): string {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: es })
  } catch {
    return iso
  }
}

export function iniciales(nombre: string, apellido?: string): string {
  return `${nombre.charAt(0)}${(apellido ?? '').charAt(0)}`.toUpperCase()
}

export function nombreCompleto(p: { nombre: string; apellido: string }): string {
  return `${p.nombre} ${p.apellido}`
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
