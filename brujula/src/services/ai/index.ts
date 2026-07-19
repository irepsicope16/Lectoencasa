import type { AIDraft, AISettings } from '@/types'
import type { EngineInput } from '@/features/engine/compassEngine'
import { generateSnapshot } from '@/features/engine/compassEngine'
import { nombreCompleto } from '@/lib/utils'

// ============================================================
// Capa de IA.
// `AIProvider` es el contrato; hoy hay dos implementaciones:
//   · OpenAIProvider — llama a la API real con la clave guardada
//     por la profesional en Ajustes (persistida solo localmente).
//   · LocalAssistantProvider — asistente determinista basado en
//     plantillas + datos reales del proceso (sin red, sin clave).
// Toda salida es un BORRADOR editable: la IA nunca reemplaza el
// criterio profesional (la UI lo explicita siempre).
// ============================================================

export type AITask =
  | 'resumen_sesion'
  | 'proponer_preguntas'
  | 'borrador_informe'
  | 'integrar_resultados'
  | 'analizar_respuestas'
  | 'proponer_hipotesis'

export const AI_TASK_LABELS: Record<AITask, { titulo: string; descripcion: string }> = {
  resumen_sesion: { titulo: 'Resumir sesiones', descripcion: 'Síntesis de las últimas sesiones registradas.' },
  proponer_preguntas: { titulo: 'Proponer preguntas', descripcion: 'Preguntas sugeridas para la próxima sesión.' },
  borrador_informe: { titulo: 'Borrador de informe', descripcion: 'Primer borrador del informe profesional.' },
  integrar_resultados: { titulo: 'Integrar resultados', descripcion: 'Integración narrativa de toda la evidencia.' },
  analizar_respuestas: { titulo: 'Analizar respuestas', descripcion: 'Lectura de las actividades respondidas.' },
  proponer_hipotesis: { titulo: 'Proponer hipótesis', descripcion: 'Hipótesis clínicas para validar en sesión.' },
}

export interface AIProvider {
  readonly id: 'local' | 'openai'
  run(task: AITask, input: EngineInput): Promise<AIDraft>
}

// ---------- Ajustes ----------

const AI_SETTINGS_KEY = 'mb:ai-settings'

export function getAISettings(): AISettings {
  try {
    const raw = localStorage.getItem(AI_SETTINGS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* noop */
  }
  return { proveedor: 'local', modelo: 'gpt-4o-mini' }
}

export function saveAISettings(s: AISettings) {
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(s))
}

// ---------- Asistente local ----------

function contextoTextual(input: EngineInput): string {
  const c = input.consultant
  const snap = generateSnapshot(input)
  const sesiones = input.sessions
    .filter((s) => s.estado === 'realizada')
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
  const lineas: string[] = []
  lineas.push(`Consultante: ${nombreCompleto(c)} · ${c.curso} · Motivo: ${c.motivoConsulta}`)
  lineas.push('')
  for (const p of snap.perfil.filter((p) => p.destacados.length || p.evidencias.length)) {
    lineas.push(`${p.titulo}: ${p.sintesis}`)
  }
  if (sesiones.length) {
    lineas.push('')
    lineas.push('Últimas sesiones:')
    for (const s of sesiones.slice(0, 3)) lineas.push(`· ${s.titulo}: ${s.notas}`)
  }
  return lineas.join('\n')
}

class LocalAssistantProvider implements AIProvider {
  readonly id = 'local' as const

  async run(task: AITask, input: EngineInput): Promise<AIDraft> {
    const snap = generateSnapshot(input)
    const c = input.consultant
    const nombre = c.nombre
    const sesiones = input.sessions
      .filter((s) => s.estado === 'realizada')
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
    const respondidas = input.activities.filter((a) => a.respuestas.length > 0)

    let contenido = ''
    switch (task) {
      case 'resumen_sesion': {
        contenido = sesiones.length
          ? [
              `Resumen de las últimas ${Math.min(3, sesiones.length)} sesiones de ${nombre}:`,
              '',
              ...sesiones.slice(0, 3).map((s) => `**${s.titulo}** (${s.fecha.slice(0, 10)})\n${s.notas}\nPróximos pasos: ${s.proximosPasos || '—'}`),
            ].join('\n\n')
          : 'Todavía no hay sesiones realizadas registradas para resumir.'
        break
      }
      case 'proponer_preguntas': {
        const enProgreso = input.progress.filter((p) => p.estado === 'en_progreso')
        const conMandatos = snap.perfil.find((p) => p.dimension === 'mandatos')
        contenido = [
          `Preguntas sugeridas para la próxima sesión con ${nombre}:`,
          '',
          '1. ¿Qué te quedó resonando de lo que trabajamos la última vez?',
          ...(conMandatos && conMandatos.evidencias.length
            ? ['2. Cuando imaginás contarle tu elección a tu familia, ¿qué reacción esperás? ¿Qué necesitarías escuchar?']
            : ['2. ¿Qué apareció esta semana que te haya dado curiosidad o entusiasmo?']),
          ...(enProgreso.length
            ? [`3. Sobre el módulo en curso: ¿qué fue lo más difícil de las últimas actividades y qué descubriste?`]
            : ['3. Si tuvieras que elegir hoy, ¿qué elegirías y qué te faltaría saber para confiar en esa elección?']),
          '4. ¿Qué haría falta explorar (personas, lugares, información) antes de la próxima decisión?',
          '',
          '_Preguntas generadas a partir del estado real del proceso; usar como disparadores, no como guion._',
        ].join('\n')
        break
      }
      case 'borrador_informe': {
        contenido = [
          `# Borrador de informe — ${nombreCompleto(c)}`,
          '',
          `**Motivo de consulta.** ${c.motivoConsulta}`,
          '',
          `**Síntesis del proceso.** ${snap.carta.rumbo}`,
          '',
          '**Dimensiones trabajadas.**',
          ...snap.perfil
            .filter((p) => p.intensidad !== 'incipiente')
            .map((p) => `- **${p.titulo}** (${p.intensidad}): ${p.sintesis}`),
          '',
          '**Sugerencias de la Carta de Navegación.**',
          ...snap.carta.sugerencias.map((s) => `- ${s.area}: ${s.motivos[0] ?? ''}`),
          '',
          '_Borrador generado automáticamente para edición profesional. Revisar, corregir y completar antes de compartir._',
        ].join('\n')
        break
      }
      case 'integrar_resultados': {
        contenido = contextoTextual(input)
        break
      }
      case 'analizar_respuestas': {
        contenido = respondidas.length
          ? [
              `Lectura de las ${respondidas.length} actividades respondidas por ${nombre}:`,
              '',
              ...respondidas.map((a) => {
                const textos = a.respuestas.map((r) => r.texto).join(' · ')
                return `**${a.titulo}** (${a.moduleId})\nRespondió: ${textos.slice(0, 220)}${textos.length > 220 ? '…' : ''}`
              }),
              '',
              'Temas recurrentes a validar en sesión: ' +
                [...new Set(snap.perfil.flatMap((p) => p.destacados))].slice(0, 6).join(', ') + '.',
            ].join('\n\n')
          : 'Aún no hay actividades respondidas para analizar.'
        break
      }
      case 'proponer_hipotesis': {
        const mand = snap.perfil.find((p) => p.dimension === 'mandatos')
        const hips: string[] = []
        if (mand?.evidencias.length)
          hips.push(
            'Parte de la indecisión podría responder a un conflicto de lealtad familiar más que a falta de intereses propios. Verificar cómo evoluciona tras la elaboración de mandatos.',
          )
        const firmes = snap.carta.sugerencias.filter((s) => s.nivel === 'brujula_firme')
        if (firmes.length)
          hips.push(
            `La convergencia de evidencia hacia ${firmes.map((f) => f.area.toLowerCase()).join(' y ')} sugiere un núcleo vocacional estable; correspondería contrastarlo con exploración real (entrevistas/visitas).`,
          )
        hips.push(
          'Explorar la relación entre lo que disfruta hacer sin que se lo pidan y las opciones que verbaliza: la distancia entre ambas suele señalar deseo no autorizado.',
        )
        contenido = [
          `Hipótesis de trabajo para ${nombre} (a validar clínicamente):`,
          '',
          ...hips.map((h, i) => `${i + 1}. ${h}`),
          '',
          '_Hipótesis generadas por cruce de evidencia. Ninguna reemplaza el juicio clínico._',
        ].join('\n')
        break
      }
    }

    return {
      titulo: AI_TASK_LABELS[task].titulo,
      contenido,
      proveedor: 'local',
      generadoEl: new Date().toISOString(),
    }
  }
}

// ---------- OpenAI ----------

class OpenAIProvider implements AIProvider {
  readonly id = 'openai' as const
  constructor(private settings: AISettings) {}

  async run(task: AITask, input: EngineInput): Promise<AIDraft> {
    const contexto = contextoTextual(input)
    const prompts: Record<AITask, string> = {
      resumen_sesion: 'Resumí las sesiones registradas en un texto clínico breve y claro.',
      proponer_preguntas: 'Proponé 6 preguntas potentes para la próxima sesión de orientación vocacional.',
      borrador_informe: 'Redactá un borrador de informe profesional de orientación vocacional (markdown).',
      integrar_resultados: 'Integrá toda la evidencia en una síntesis narrativa del proceso.',
      analizar_respuestas: 'Analizá las respuestas del consultante: temas recurrentes, contradicciones, emergentes.',
      proponer_hipotesis: 'Proponé 3 hipótesis clínicas prudentes a validar en sesión.',
    }
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.settings.apiKey}`,
      },
      body: JSON.stringify({
        model: this.settings.modelo || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Sos asistente de una Lic. en Psicopedagogía especializada en orientación vocacional (Método Brújula). Respondés en español rioplatense, tono profesional y cálido. Nunca reducís a la persona a un puntaje ni reemplazás el criterio clínico: todo lo que produzcas es un borrador para revisión profesional.',
          },
          { role: 'user', content: `${prompts[task]}\n\nContexto del proceso:\n${contexto}` },
        ],
        temperature: 0.4,
      }),
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`OpenAI respondió ${res.status}: ${body.slice(0, 200)}`)
    }
    const data = await res.json()
    const contenido: string = data.choices?.[0]?.message?.content ?? '(respuesta vacía)'
    return {
      titulo: AI_TASK_LABELS[task].titulo,
      contenido,
      proveedor: 'openai',
      generadoEl: new Date().toISOString(),
    }
  }
}

export function getAIProvider(): AIProvider {
  const settings = getAISettings()
  if (settings.proveedor === 'openai' && settings.apiKey) return new OpenAIProvider(settings)
  return new LocalAssistantProvider()
}
