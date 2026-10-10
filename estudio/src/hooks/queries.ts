import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { db } from '@/services/storage/db'
import { proximaCajaYFecha } from '@/lib/leitner'
import type {
  ActividadCatalogo,
  ActividadProbada,
  DimensionSnapshot,
  EntradaMetacognicion,
  Ficha,
  MapaConceptual,
  SesionEstudio,
} from '@/types'

// ---------- Autoperfil ----------

export function useResponses() {
  return useQuery({
    queryKey: ['responses'],
    queryFn: () => db.responses.list(),
  })
}

export function useSaveResponse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { versionId: string; itemId: string; valor: 0 | 1 | 2 | 3 | null; existingId?: string }) => {
      const { existingId, ...data } = input
      if (existingId) return db.responses.update(existingId, { ...data, fecha: new Date().toISOString() })
      return db.responses.create({ ...data, fecha: new Date().toISOString() })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['responses'] }),
  })
}

export function useOpenAnswers() {
  return useQuery({
    queryKey: ['openAnswers'],
    queryFn: () => db.openAnswers.list(),
  })
}

export function useSaveOpenAnswer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { preguntaId: string; texto: string; existingId?: string }) => {
      const { existingId, ...data } = input
      if (existingId) return db.openAnswers.update(existingId, data)
      return db.openAnswers.create(data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['openAnswers'] }),
  })
}

export function useSnapshots() {
  return useQuery({
    queryKey: ['snapshots'],
    queryFn: async () => {
      const rows = await db.snapshots.list()
      return rows.sort((a, b) => a.dimension.localeCompare(b.dimension))
    },
  })
}

export function useSaveSnapshot() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: Omit<DimensionSnapshot, 'id' | 'createdAt' | 'updatedAt'> & { existingId?: string }) => {
      const { existingId, ...data } = input
      if (existingId) return db.snapshots.update(existingId, data)
      return db.snapshots.create(data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['snapshots'] }),
  })
}

// ---------- Actividades probadas ----------

export function useActividadesProbadas() {
  return useQuery({
    queryKey: ['actividades'],
    queryFn: async () => {
      const rows = await db.actividades.list()
      return rows.sort((a, b) => b.fechaInicio.localeCompare(a.fechaInicio))
    },
  })
}

export function useProbarActividad() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (actividad: ActividadCatalogo) =>
      db.actividades.create({
        actividadId: actividad.id,
        rutaId: actividad.rutaId,
        nivel: actividad.nivel,
        titulo: actividad.titulo,
        descripcion: actividad.descripcion,
        estado: 'en_curso',
        fechaInicio: new Date().toISOString(),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['actividades'] }),
  })
}

export function useActualizarActividad() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...patch }: { id: string } & Partial<ActividadProbada>) => db.actividades.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['actividades'] }),
  })
}

export function useEliminarActividadProbada() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => db.actividades.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['actividades'] }),
  })
}

// ---------- Cronómetro ----------

export function useSesionesEstudio() {
  return useQuery({
    queryKey: ['sesionesEstudio'],
    queryFn: async () => {
      const rows = await db.sesionesEstudio.list()
      return rows.sort((a, b) => b.fecha.localeCompare(a.fecha))
    },
  })
}

export function useRegistrarSesionEstudio() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<SesionEstudio, 'id' | 'createdAt' | 'updatedAt'>) => db.sesionesEstudio.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sesionesEstudio'] }),
  })
}

// ---------- Mapas conceptuales ----------

export function useMapas() {
  return useQuery({
    queryKey: ['mapas'],
    queryFn: async () => {
      const rows = await db.mapas.list()
      return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    },
  })
}

export function useMapa(id?: string) {
  return useQuery({
    queryKey: ['mapa', id],
    queryFn: () => db.mapas.get(id!),
    enabled: !!id,
  })
}

export function useCrearMapa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (titulo: string) => db.mapas.create({ titulo, nodos: [], conexiones: [] }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mapas'] }),
  })
}

export function useGuardarMapa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<MapaConceptual> }) => db.mapas.update(id, patch),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['mapas'] })
      qc.invalidateQueries({ queryKey: ['mapa', vars.id] })
    },
  })
}

export function useEliminarMapa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => db.mapas.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mapas'] }),
  })
}

// ---------- Fichas de repaso ----------

export function useFichas() {
  return useQuery({
    queryKey: ['fichas'],
    queryFn: () => db.fichas.list(),
  })
}

export function useCrearFicha() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { tema: string; pregunta: string; respuesta: string }) =>
      db.fichas.create({ ...data, vecesRepasada: 0, caja: 1, proximoRepaso: new Date().toISOString() }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fichas'] }),
  })
}

/** Registra la respuesta de un repaso y reprograma la ficha (caja de Leitner). */
export function useResponderFicha() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, caja, vecesRepasada, laSupo }: { id: string; caja: Ficha['caja']; vecesRepasada: number; laSupo: boolean }) => {
      const { caja: siguienteCaja, proximoRepaso } = proximaCajaYFecha(caja, laSupo)
      return db.fichas.update(id, {
        caja: siguienteCaja,
        proximoRepaso,
        vecesRepasada: vecesRepasada + 1,
        ultimoRepaso: new Date().toISOString(),
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fichas'] }),
  })
}

export function useEliminarFicha() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => db.fichas.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fichas'] }),
  })
}

// ---------- Diario de metacognición ----------

export function useDiario() {
  return useQuery({
    queryKey: ['diario'],
    queryFn: async () => {
      const rows = await db.diario.list()
      return rows.sort((a, b) => b.fecha.localeCompare(a.fecha))
    },
  })
}

export function useCrearEntradaDiario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<EntradaMetacognicion, 'id' | 'fecha' | 'createdAt' | 'updatedAt'>) =>
      db.diario.create({ ...data, fecha: new Date().toISOString() }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diario'] }),
  })
}

export function useEliminarEntradaDiario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => db.diario.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diario'] }),
  })
}
