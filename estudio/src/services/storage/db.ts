import { LocalStorageDriver } from './driver'
import { Repository } from './repository'
import type {
  ActividadProbada,
  DimensionSnapshot,
  EntradaMetacognicion,
  EventoAgenda,
  Ficha,
  MapaConceptual,
  OpenAnswer,
  QuestionnaireResponse,
  SesionEstudio,
  TextoGuia,
} from '@/types'

// ------------------------------------------------------------
// Punto único de acceso a datos (LocalStorage; app de un solo usuario
// local, sin cuentas — todo lo que haya acá es "lo de esta persona").
// ------------------------------------------------------------

const driver = new LocalStorageDriver()

export const db = {
  responses: new Repository<QuestionnaireResponse>(driver, 'questionnaire_responses'),
  openAnswers: new Repository<OpenAnswer>(driver, 'open_answers'),
  snapshots: new Repository<DimensionSnapshot>(driver, 'dimension_snapshots'),
  actividades: new Repository<ActividadProbada>(driver, 'actividades_probadas'),
  sesionesEstudio: new Repository<SesionEstudio>(driver, 'sesiones_estudio'),
  mapas: new Repository<MapaConceptual>(driver, 'mapas_conceptuales'),
  fichas: new Repository<Ficha>(driver, 'fichas'),
  diario: new Repository<EntradaMetacognicion>(driver, 'diario_metacognicion'),
  agenda: new Repository<EventoAgenda>(driver, 'agenda_eventos'),
  planificadorPrincipiante: new Repository<EventoAgenda>(driver, 'planificador_principiante'),
  planificadorSecundaria: new Repository<EventoAgenda>(driver, 'planificador_secundaria'),
  planificadorSuperior: new Repository<EventoAgenda>(driver, 'planificador_superior'),
  textosGuia: new Repository<TextoGuia>(driver, 'textos_guia'),
  clearAll: () => driver.clearAll(),
}

/** Borra todos los datos cargados (no hay "demo" a la que volver: es un dispositivo de una sola persona). */
export async function resetAllData(): Promise<void> {
  await db.clearAll()
}
