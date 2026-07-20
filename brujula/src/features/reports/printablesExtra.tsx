// Láminas e infografías imprimibles adicionales del método.
// Helpers compartidos + un componente por lámina. Se registran en
// PrintableMaterialPage (PRINTABLES). Todo abre y se imprime: nada
// de materiales "fantasma".

function Caja({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl bg-[#f6f6f4] p-4 text-[12.5px] leading-relaxed text-neutral-600">{children}</div>
}

function Titulo({ children, color = '#0e7f79' }: { children: React.ReactNode; color?: string }) {
  return (
    <p className="mb-2 mt-5 text-[13px] font-bold" style={{ color }}>
      {children}
    </p>
  )
}

function Lineas({ n, gap = 'mt-6' }: { n: number; gap?: string }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className={`${gap} border-b border-neutral-300`} />
      ))}
    </>
  )
}

function Check({ texto }: { texto: string }) {
  return (
    <div className="flex items-start gap-2 py-1">
      <span className="mt-0.5 inline-block h-[13px] w-[13px] shrink-0 rounded-[3px] border-2 border-[#14a098]" />
      <span className="text-[12px] leading-snug">{texto}</span>
    </div>
  )
}

function Tabla({ cols, rows, anchoCol0 = 'w-[30%]' }: { cols: string[]; rows: number; anchoCol0?: string }) {
  return (
    <table className="mt-3 w-full border-collapse text-[11.5px]">
      <thead>
        <tr>
          {cols.map((c, i) => (
            <th
              key={c}
              className={`border border-neutral-300 bg-[#e3f4f2] px-2 py-1.5 text-left font-bold text-[#0e7f79] ${i === 0 ? anchoCol0 : ''}`}
            >
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }, (_, r) => (
          <tr key={r}>
            {cols.map((_, c) => (
              <td key={c} className="h-[34px] border border-neutral-300 px-2" />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ---------- 1 · Guía para familias ----------
function GuiaFamilias() {
  return (
    <>
      <Caja>
        Su hijo/a está haciendo un proceso de orientación vocacional. No es un test que “da un resultado”:
        es un recorrido de autoconocimiento y exploración. La familia es clave — y acompañar bien es más
        fácil de lo que parece.
      </Caja>
      <Titulo>✔ Lo que ayuda</Titulo>
      <Check texto="Preguntar por el proceso, no por el resultado: «¿qué descubriste de vos?» abre más que «¿ya sabés qué vas a estudiar?»." />
      <Check texto="Escuchar sin corregir: cuando cuenta un interés «raro», primero curiosidad, después opinión (o mejor, ninguna)." />
      <Check texto="Facilitar la exploración: acercar contactos, acompañar a una charla, financiar una visita." />
      <Check texto="Contar la propia historia con honestidad: cómo eligieron ustedes, qué volverían a hacer distinto." />
      <Check texto="Confiar en los tiempos: decidir bien lleva más tiempo que decidir rápido." />
      <Titulo color="#b3474f">✘ Lo que no ayuda</Titulo>
      <Check texto="Opinar sobre carreras «buenas» o «malas»: cada comentario pesa más de lo que parece." />
      <Check texto="Comparar con hermanos, primos o hijos de conocidos." />
      <Check texto="Presionar con la urgencia («ya tendrías que saberlo»)." />
      <Check texto="Decidir por él/ella «para ayudarlo»: la decisión prestada se devuelve, y caro." />
      <Titulo>Frases que abren conversación</Titulo>
      <Caja>
        «¿Qué fue lo más interesante que trabajaste esta semana?» · «¿Querés que conozcamos juntos esa
        facultad?» · «Yo a tu edad tampoco lo tenía claro.» · «Sea lo que sea que elijas, contás conmigo.»
      </Caja>
    </>
  )
}

// ---------- 2 · Infografía: el proceso ----------
function InfografiaMetodo() {
  const etapas = [
    ['1 · Conocerte', 'Tu historia y tu identidad: de dónde venís y quién sos hoy.', '#14a098'],
    ['2 · Valorarte', 'Tus valores, tus deseos y los mandatos que traés puestos.', '#8b87d4'],
    ['3 · Explorar', 'Fortalezas, intereses, aptitudes… y el mundo real del estudio y el trabajo.', '#14a098'],
    ['4 · Decidir', 'Primero el proyecto de vida; después, las carreras que te acercan a él.', '#8b87d4'],
    ['5 · Actuar', 'Plan concreto: pasos, fechas, requisitos y plan B.', '#14a098'],
  ]
  return (
    <>
      <div className="rounded-xl border-2 border-[#14a098] bg-[#e3f4f2] p-4 text-center">
        <p className="text-[15px] font-bold text-[#0e7f79]">La orientación vocacional NO es un test</p>
        <p className="mt-1 text-[12px] text-neutral-600">
          Ningún cuestionario puede decirte quién ser. Es un proceso de autoconocimiento y exploración,
          acompañado por una profesional, donde la decisión la construís VOS.
        </p>
      </div>
      <div className="mt-6 space-y-3">
        {etapas.map(([t, d, color]) => (
          <div key={t} className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
              style={{ background: color }}
            >
              {t.slice(0, 1)}
            </span>
            <div>
              <p className="text-[13px] font-bold">{t}</p>
              <p className="text-[12px] text-neutral-600">{d}</p>
            </div>
          </div>
        ))}
      </div>
      <Caja>
        A lo largo del camino vas a hacer actividades, tests, entrevistas y reflexiones. Todo eso alimenta
        tu <strong>Carta de Navegación</strong>: un mapa de áreas sugeridas donde cada sugerencia se explica
        con TU propia evidencia — nunca con un porcentaje.
      </Caja>
    </>
  )
}

// ---------- 3 · Ficha: Mis espejos ----------
function MisEspejos() {
  return (
    <>
      <Caja>
        Elegí tres personas de ámbitos distintos (familia, amistades, escuela) y pedile a cada una: «Decime
        tres palabras que me describan, y algo que creas que hago bien». Anotá sus respuestas acá.
      </Caja>
      {[1, 2, 3].map((n) => (
        <div key={n} className="mt-4 rounded-xl border-2 border-neutral-200 p-3">
          <p className="text-[12px] font-bold text-[#6f6ac1]">Espejo {n} — ¿Quién es? _______________ (vínculo: ____________)</p>
          <p className="mt-3 text-[11.5px] text-neutral-500">Sus tres palabras:</p>
          <Lineas n={1} gap="mt-4" />
          <p className="mt-3 text-[11.5px] text-neutral-500">Algo que dice que hago bien:</p>
          <Lineas n={1} gap="mt-4" />
        </div>
      ))}
      <Titulo>Para pensar después</Titulo>
      <p className="text-[12px] text-neutral-600">¿Qué se repitió? ¿Qué te sorprendió? ¿Qué coincide (o no) con cómo te ves vos?</p>
      <Lineas n={3} />
    </>
  )
}

// ---------- 4 · Listado de 40 valores ----------
function Valores40() {
  const valores = [
    'Libertad', 'Familia', 'Creatividad', 'Seguridad económica', 'Ayudar a otros', 'Conocimiento',
    'Justicia', 'Independencia', 'Reconocimiento', 'Naturaleza', 'Salud', 'Amistad', 'Aventura',
    'Orden', 'Espiritualidad', 'Belleza', 'Liderazgo', 'Solidaridad', 'Honestidad', 'Lealtad',
    'Tiempo libre', 'Estabilidad', 'Desafío', 'Armonía', 'Humor', 'Tradición', 'Innovación',
    'Prestigio', 'Autenticidad', 'Compromiso', 'Placer', 'Superación', 'Cooperación', 'Autonomía',
    'Respeto', 'Generosidad', 'Curiosidad', 'Coherencia', 'Pertenencia', 'Trascendencia',
  ]
  return (
    <>
      <Caja>
        Leé la lista completa sin apuro. Marcá TODOS los que te resuenen; después elegí los <strong>5
        fundamentales</strong> (rodealos con un círculo) y ordenalos del 1 al 5 en el recuadro final.
      </Caja>
      <div className="mt-4 grid grid-cols-4 gap-x-4">
        {valores.map((v) => (
          <Check key={v} texto={v} />
        ))}
      </div>
      <div className="mt-5 rounded-xl border-2 border-[#14a098] p-3">
        <p className="text-[12px] font-bold text-[#0e7f79]">Mis 5 valores fundamentales, en orden:</p>
        <p className="mt-4 text-[12px] text-neutral-500">1. ____________  2. ____________  3. ____________  4. ____________  5. ____________</p>
      </div>
    </>
  )
}

// ---------- 5 · Bitácora del deseo ----------
function BitacoraDeseo() {
  return (
    <>
      <Caja>
        Durante una semana, registrá cada día dos cosas: qué hiciste que disfrutaste de verdad (aunque sea
        chiquito) y qué tuviste ganas de hacer y no hiciste. El deseo deja huellas: acá las vas a ver.
      </Caja>
      <Tabla cols={['Día', 'Disfruté de verdad…', 'Tuve ganas y no lo hice…']} rows={7} anchoCol0="w-[12%]" />
      <Titulo>Al final de la semana</Titulo>
      <p className="text-[12px] text-neutral-600">¿Qué se repite? ¿Qué te dice esta semana sobre lo que te hace bien?</p>
      <Lineas n={2} />
    </>
  )
}

// ---------- 6 · Inventario de fortalezas ----------
function InventarioFortalezas() {
  const f: [string, string][] = [
    ['Creatividad', 'genero ideas y soluciones originales'],
    ['Curiosidad', 'me pregunto el porqué de las cosas'],
    ['Pensamiento crítico', 'analizo antes de creer o decidir'],
    ['Perseverancia', 'termino lo que empiezo, aun cuando cuesta'],
    ['Honestidad', 'digo la verdad y actúo en consecuencia'],
    ['Empatía', 'siento y entiendo lo que le pasa al otro'],
    ['Trabajo en equipo', 'sumo y hago sumar en grupo'],
    ['Liderazgo', 'organizo y motivo a otros'],
    ['Organización', 'planifico y ordeno bien mi tiempo y mis cosas'],
    ['Comunicación', 'me expreso claro y me hago entender'],
    ['Paciencia', 'puedo esperar y sostener procesos largos'],
    ['Humor', 'aligero climas y me río de mí'],
    ['Adaptabilidad', 'me acomodo rápido a los cambios'],
    ['Detallismo', 'veo lo que otros pasan por alto'],
    ['Iniciativa', 'arranco sin que me lo pidan'],
    ['Escucha', 'los demás se sienten escuchados conmigo'],
    ['Valentía', 'hago lo correcto aunque dé miedo'],
    ['Prudencia', 'mido riesgos antes de actuar'],
    ['Gratitud', 'registro y valoro lo bueno'],
    ['Autocontrol', 'manejo mis impulsos y emociones'],
  ]
  return (
    <>
      <Caja>
        Marcá las fortalezas que reconocés en vos. Después elegí las 5 más tuyas y, para cada una, pensá
        una escena real donde se haya notado (la vas a necesitar en la actividad del módulo).
      </Caja>
      <div className="mt-3 grid grid-cols-2 gap-x-6">
        {f.map(([nombre, def]) => (
          <Check key={nombre} texto={`${nombre} — ${def}`} />
        ))}
      </div>
      <Titulo>Mis 5 fortalezas y su escena</Titulo>
      <Lineas n={5} />
    </>
  )
}

// ---------- 7 · Registro semanal de intereses ----------
function RegistroIntereses() {
  return (
    <>
      <Caja>
        Durante una semana anotá, sin filtrar, todo lo que consumís y hacés por gusto: videos, series,
        lecturas, música, charlas, juegos, cuentas que seguís. Al final, buscá los temas que se repiten.
      </Caja>
      <Tabla cols={['Día', 'Vi / leí / escuché…', '¿De qué tema era?']} rows={7} anchoCol0="w-[12%]" />
      <Titulo>Los temas que más se repitieron</Titulo>
      <Lineas n={2} />
      <Titulo>¿Sobre qué podrías hablar una hora sin aburrirte?</Titulo>
      <Lineas n={1} />
    </>
  )
}

// ---------- 8 · Guía de aptitudes con ejemplos ----------
function GuiaAptitudes() {
  const a: [string, string][] = [
    ['Explicar con palabras', 'te piden que expliques vos porque «se entiende»; escribís con claridad'],
    ['Resolver problemas de lógica', 'acertijos, estrategia en juegos, encontrar la falla de un razonamiento'],
    ['Imaginar en 3D / dibujar', 'visualizás espacios y objetos; dibujás o hacés planos con naturalidad'],
    ['Trabajar con las manos', 'armás, reparás, fabricás; las herramientas te responden'],
    ['Entender a las personas', 'percibís estados de ánimo sin palabras; te buscan para hablar'],
    ['Organizar y planificar', 'eventos, horarios, viajes: si lo organizás vos, sale'],
    ['Trabajar con números', 'cálculos, tablas y estadísticas te resultan cómodos'],
    ['Crear cosas nuevas', 'se te ocurren ideas que a nadie más; inventás soluciones'],
    ['Convencer y negociar', 'lográs acuerdos; tus argumentos mueven decisiones'],
    ['Observar detalles', 'notás errores y sutilezas que otros no ven'],
  ]
  return (
    <>
      <Caja>
        Aptitud no es lo que te gusta: es lo que te sale con facilidad natural. Leé cada una con su ejemplo
        y marcá las que reconozcas. Ojo: lo fácil tuyo no es fácil para todos — por eso a veces ni lo registrás.
      </Caja>
      <div className="mt-3">
        {a.map(([nombre, ej]) => (
          <Check key={nombre} texto={`${nombre} — ${ej}.`} />
        ))}
      </div>
      <Titulo>¿Dónde NO coinciden tus gustos con tus facilidades? (ahí hay tema para la sesión)</Titulo>
      <Lineas n={3} />
    </>
  )
}

// ---------- 9 · Guía de entrevista a profesionales ----------
function GuiaEntrevista() {
  const preguntas = [
    '¿Cómo llegaste a esta profesión? ¿Fue tu primera opción?',
    '¿Cómo es un día normal de tu trabajo, de la mañana a la noche?',
    '¿Qué es lo que MÁS te gusta de lo que hacés?',
    '¿Y lo que menos? ¿Qué es lo más duro?',
    '¿Qué te hubiera gustado saber antes de empezar a estudiar?',
    '¿Cómo fue la carrera? ¿Qué materias fueron clave y cuáles un trámite?',
    '¿De qué trabajaste mientras estudiabas?',
    '¿Cómo conseguiste tu primer trabajo del rubro?',
    '¿Cómo es el mercado laboral hoy? ¿Y cómo te imaginás que será en 10 años?',
    '¿Qué habilidades usás todos los días que la facultad no te enseñó?',
    '¿Cuánto se gana al principio, aproximadamente? ¿Y con experiencia?',
    '¿Qué tipo de persona disfruta este trabajo? ¿A quién NO se lo recomendarías?',
    '¿Volverías a elegir lo mismo? ¿Por qué?',
    '¿Qué le dirías a alguien de mi edad que está considerando este camino?',
  ]
  return (
    <>
      <Caja>
        Antes: presentate, contá que estás en un proceso de orientación y pedí 30–40 minutos. Durante:
        grabá (con permiso) o tomá nota. Después: completá la actividad del módulo con lo que descubriste.
        No hace falta hacer todas las preguntas — elegí las que más te intriguen.
      </Caja>
      <div className="mt-3">
        {preguntas.map((p, i) => (
          <p key={i} className="border-b border-neutral-200 py-2 text-[12px]">
            <span className="mr-2 font-bold text-[#0e7f79]">{i + 1}.</span>
            {p}
          </p>
        ))}
      </div>
    </>
  )
}

// ---------- 10 · Checklist de visita a instituciones ----------
function ChecklistVisita() {
  return (
    <>
      <Caja>
        Vale para visitas presenciales, charlas abiertas o recorridas virtuales. Llevá esta lista y volvé
        con TODOS los casilleros marcados.
      </Caja>
      <Titulo>Antes de ir</Titulo>
      <Check texto="Averigüé qué carreras de mi interés se dictan acá" />
      <Check texto="Busqué el plan de estudios y lo hojeé" />
      <Check texto="Anoté 3 preguntas que quiero hacer sí o sí" />
      <Titulo>Durante la visita</Titulo>
      <Check texto="Pregunté duración real de la carrera (no la teórica)" />
      <Check texto="Pregunté horarios y modalidad (presencial/virtual/mixta)" />
      <Check texto="Pregunté costos: matrícula, cuotas, materiales" />
      <Check texto="Pregunté por becas y programas de apoyo" />
      <Check texto="Pregunté por prácticas profesionales y bolsa de trabajo" />
      <Check texto="Hablé con al menos UN estudiante actual" />
      <Check texto="Recorrí las aulas/laboratorios/biblioteca" />
      <Check texto="Me imaginé estudiando acá y registré qué sentí" />
      <Titulo>Al volver</Titulo>
      <Check texto="Anoté mis impresiones en la actividad del módulo (¡el mismo día, que se evapora!)" />
      <Titulo>Notas</Titulo>
      <Lineas n={3} />
    </>
  )
}

// ---------- 11 · Ficha comparativa de carreras ----------
function FichaCarreras() {
  return (
    <>
      <Caja>
        Completá una columna por cada carrera finalista. La última fila es la más importante: puntuá del 1
        al 10 cuánto te imaginás ahí — con lo que sabés HOY, después de investigar.
      </Caja>
      <Tabla
        cols={['', 'Carrera 1', 'Carrera 2', 'Carrera 3']}
        rows={0}
        anchoCol0="w-[24%]"
      />
      <table className="w-full border-collapse text-[11.5px]">
        <tbody>
          {[
            'Nombre de la carrera',
            'Institución y sede',
            'Duración real',
            'Materias que me entusiasman',
            'Materias que me asustan',
            'Título intermedio / prácticas',
            'Salida laboral concreta',
            'Costos y becas',
            'Me imagino ahí (1–10)',
          ].map((campo) => (
            <tr key={campo}>
              <td className="w-[24%] border border-neutral-300 bg-[#edecf9] px-2 py-2 font-semibold text-[#6f6ac1]">
                {campo}
              </td>
              <td className="h-[38px] border border-neutral-300" />
              <td className="h-[38px] border border-neutral-300" />
              <td className="h-[38px] border border-neutral-300" />
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

// ---------- 12 · Infografía: cómo leer un plan de estudios ----------
function InfografiaPlanEstudios() {
  const pasos: [string, string][] = [
    ['Buscá el plan OFICIAL', 'En el sitio de la institución (no en resúmenes de terceros). Guardalo.'],
    ['Mirá el primer año', 'Suele ser introductorio y compartido. No juzgues la carrera solo por él.'],
    ['Andá a los años superiores', 'Ahí está el corazón de la carrera: esas materias son tu futuro cotidiano.'],
    ['Marcá con dos colores', 'Verde: materias que te entusiasman. Rojo: las que te asustan o aburren.'],
    ['Contá la proporción', 'Muchas rojas en el corazón de la carrera es una señal a conversar en sesión.'],
    ['Mirá lo práctico', 'Prácticas profesionales, laboratorios, título intermedio, carga horaria semanal.'],
    ['Chequeá las correlativas', 'Te muestran el camino real: qué traba qué, y dónde suele hacerse cuello de botella.'],
  ]
  return (
    <>
      <Caja>
        El nombre de una carrera dice poco; su plan de estudios lo dice casi todo. Siete pasos para leerlo
        como una profesional:
      </Caja>
      <div className="mt-4 space-y-3">
        {pasos.map(([t, d], i) => (
          <div key={t} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8b87d4] text-[12px] font-bold text-white">
              {i + 1}
            </span>
            <div>
              <p className="text-[12.5px] font-bold">{t}</p>
              <p className="text-[11.5px] text-neutral-600">{d}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-xl border-2 border-[#14a098] bg-[#e3f4f2] p-3 text-[12px] text-neutral-700">
        <strong className="text-[#0e7f79]">Regla de oro:</strong> no se elige una carrera por el nombre ni
        por el rango de sueldos: se elige (también) por la vida cotidiana que te propone durante 4-6 años.
      </div>
    </>
  )
}

// ---------- 13 · Directorio de portales oficiales ----------
function DirectorioPortales() {
  const portales: [string, string, string][] = [
    ['Guía de Carreras (SIU)', 'guiadecarreras.siu.edu.ar', 'Buscador oficial de TODAS las carreras universitarias de Argentina, por área, título e institución.'],
    ['Ministerio de Educación', 'argentina.gob.ar/educacion', 'Información oficial de universidades, validez de títulos e instituciones reconocidas.'],
    ['Becas Progresar', 'argentina.gob.ar/educacion/progresar', 'Programa nacional de becas para estudiar (requisitos y fechas de inscripción).'],
    ['Sitio de cada universidad', '(uba.ar · unlp.edu.ar · utn.edu.ar · uncuyo.edu.ar …)', 'Siempre el plan de estudios y las fechas de inscripción se confirman en el sitio oficial de la institución.'],
  ]
  return (
    <>
      <Caja>
        Para investigar carreras usá SIEMPRE fuentes oficiales — los blogs y videos ayudan a inspirar, pero
        las fechas, planes y títulos se verifican acá:
      </Caja>
      <div className="mt-4 space-y-3">
        {portales.map(([nombre, url, desc]) => (
          <div key={nombre} className="rounded-xl border-2 border-neutral-200 p-3">
            <p className="text-[13px] font-bold">{nombre}</p>
            <p className="text-[12px] font-semibold text-[#0e7f79]">{url}</p>
            <p className="mt-0.5 text-[11.5px] text-neutral-600">{desc}</p>
          </div>
        ))}
      </div>
      <Caja>
        💡 Si estás fuera de Argentina, tu profesional te indica los portales oficiales de tu país. El
        criterio es el mismo: fuente oficial, plan de estudios completo y fechas confirmadas.
      </Caja>
    </>
  )
}

// ---------- 14 · Cronograma de pasos ----------
function CronogramaPasos() {
  return (
    <>
      <Caja>
        Tu decisión ya está tomada: ahora se convierte en plan. Completá cada paso con su fecha límite y lo
        que necesitás para cumplirlo. Pegalo donde lo veas todos los días.
      </Caja>
      <Tabla cols={['Paso', 'Fecha límite', 'Requisitos / documentación', '¿Hecho?']} rows={10} anchoCol0="w-[34%]" />
      <div className="mt-4 rounded-xl border-2 border-[#8b87d4] bg-[#edecf9] p-3">
        <p className="text-[12px] font-bold text-[#6f6ac1]">Mi plan B (si el plan A se demora o cambia):</p>
        <Lineas n={2} gap="mt-5" />
      </div>
    </>
  )
}

// ---------- 15 · Calendario de inscripciones ----------
function CalendarioInscripciones() {
  return (
    <>
      <Caja>
        Cada institución tiene SUS fechas — y las inscripciones se pierden por días. Completá esta tabla
        con la información oficial de cada lugar donde podrías estudiar, y revisala con tu profesional.
      </Caja>
      <Tabla
        cols={['Institución', 'Carrera', 'Inscripción desde / hasta', 'Requisitos', 'Contacto']}
        rows={8}
        anchoCol0="w-[20%]"
      />
      <Titulo>Fechas clave que NO puedo perder</Titulo>
      <Lineas n={3} />
    </>
  )
}

export const PRINTABLES_EXTRA: Record<string, { titulo: string; componente: () => React.ReactNode }> = {
  'guia-familias': { titulo: 'Guía para familias: cómo acompañar', componente: GuiaFamilias },
  'infografia-metodo': { titulo: 'El proceso de orientación, en un vistazo', componente: InfografiaMetodo },
  'mis-espejos': { titulo: 'Ficha: Mis espejos', componente: MisEspejos },
  '40-valores': { titulo: 'Listado de 40 valores', componente: Valores40 },
  'bitacora-deseo': { titulo: 'Bitácora del deseo (una semana)', componente: BitacoraDeseo },
  'inventario-fortalezas': { titulo: 'Inventario de fortalezas', componente: InventarioFortalezas },
  'registro-intereses': { titulo: 'Registro semanal de intereses', componente: RegistroIntereses },
  'guia-aptitudes': { titulo: 'Guía de aptitudes con ejemplos', componente: GuiaAptitudes },
  'guia-entrevista': { titulo: 'Guía de entrevista a profesionales', componente: GuiaEntrevista },
  'checklist-visita': { titulo: 'Checklist de visita a instituciones', componente: ChecklistVisita },
  'ficha-carreras': { titulo: 'Ficha comparativa de carreras', componente: FichaCarreras },
  'infografia-plan-estudios': { titulo: 'Cómo leer un plan de estudios', componente: InfografiaPlanEstudios },
  'directorio-portales': { titulo: 'Directorio de portales oficiales', componente: DirectorioPortales },
  'cronograma-pasos': { titulo: 'Cronograma de pasos con fechas y requisitos', componente: CronogramaPasos },
  'calendario-inscripciones': { titulo: 'Calendario de inscripciones', componente: CalendarioInscripciones },
}
