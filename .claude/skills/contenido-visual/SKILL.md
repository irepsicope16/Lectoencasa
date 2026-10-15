---
name: contenido-visual
description: Crear contenido visual para redes y difusión de la Lic. Irene Morbidelli (@psicopeconire) — posts y carruseles de Instagram (PNG), reels, stories y videos cortos animados (MP4/GIF), y piezas interactivas (quiz, checklist, autoevaluación) para compartir por link. Usar siempre que Irene pida un post, carrusel, reel, video, story, placa, flyer, publicación, pieza para redes o algo "visual", "lindo", "atractivo" o "interactivo", aunque no nombre la skill. Incluye la marca (colores, tipografías, voz), plantillas HTML y un script que renderiza PNG y MP4.
---

# Contenido visual — Lic. Irene Morbidelli

Todo se diseña en **HTML + CSS** con la marca de Irene y se exporta con
`scripts/render.mjs` (Playwright + ffmpeg, ya instalados en el entorno):

| Pide…                                   | Formato de salida             | Plantilla                    |
|-----------------------------------------|-------------------------------|------------------------------|
| Post único, placa, frase                | PNG 1080×1350                 | `plantillas/post.html`       |
| Carrusel educativo                      | PNG 1080×1350 × N láminas     | `plantillas/carrusel.html`   |
| Reel, story animada, video corto        | MP4 1080×1920 (y GIF opcional)| `plantillas/reel.html`       |
| Quiz, checklist, test, juego, calculadora| Página HTML publicada (link) | `plantillas/interactivo.html`|
| "Lo quiero retocar yo"                  | PNG/MP4 + subir a Canva (conector Canva) | —                 |

Antes de diseñar, leé `referencias/marca.md` (siempre) y `referencias/formatos.md`
(medidas, zonas seguras, duración). Para piezas animadas leé también
`referencias/movimiento.md`.

## Flujo de trabajo

1. **Brief en una línea.** Objetivo (educar / conectar / llevar al Kit gratuito /
   difundir un producto), público (casi siempre mamás y papás), una sola idea
   central y un llamado a la acción. Si falta algo esencial, preguntá UNA vez;
   si no, decidí vos y aclaralo al entregar.
2. **Guion primero, diseño después.** Escribí el texto completo (titular, láminas
   o escenas, CTA y el *caption* para Instagram) antes de tocar CSS. Un buen
   contenido con diseño correcto le gana a un diseño hermoso sin idea.
3. **Copiá la plantilla** al scratchpad (nunca dentro del sitio web: todo lo que
   está en el repo se publica en GitHub Pages) y adaptala. No hace falta enlazar
   fuentes ni colores: el render inyecta `plantillas/marca.css` automáticamente.
4. **Renderizá:**
   ```bash
   node .claude/skills/contenido-visual/scripts/render.mjs <archivo.html> --salida <carpeta>
   ```
   - Sin `<meta name="duracion">` → un PNG por cada `.lienzo`.
   - Con `<meta name="duracion" content="12">` → MP4 (agregá `--gif` para GIF,
     `--audio pista.mp3` para música, `--fps 30` por defecto).
   - `--previa` en un video exporta además 4 fotogramas PNG clave para revisar.
5. **Revisá con ojos críticos** (leé los PNG o los fotogramas con Read). Pasá el
   checklist de abajo. Corregí y re-renderizá antes de mostrar.
6. **Entregá** con SendUserFile: los archivos + el caption listo para pegar
   (con 3–6 hashtags específicos, no genéricos) + una sugerencia de horario o de
   cómo combinarlo con otras piezas. Si es interactivo, publicalo como Artifact y
   pasá el link.

## Checklist antes de entregar

- [ ] Se entiende la idea en 2 segundos, en el celular, sin leer todo.
- [ ] Máximo ~25 palabras por lámina/escena (el titular, ≤ 8).
- [ ] Texto ≥ 40 px en lienzo de 1080 de ancho; nada importante fuera de la zona segura.
- [ ] Contraste suficiente (texto `--tinta-900` sobre claro, blanco sobre `--agua-700`/`--lila-900`).
- [ ] Un solo acento de color por lámina; mucho aire.
- [ ] La voz es la de Irene: cálida, en *vos*, sin culpa, sin diagnóstico, sin promesas.
- [ ] CTA concreto (Kit gratuito, "guardalo", "mandáselo a…", link en bio).
- [ ] Firma discreta: `@psicopeconire` o "Lic. Irene Morbidelli".
- [ ] Ortografía y tildes revisadas (¿?, ¡!, rayas —).
- [ ] En video: los primeros 1,5 s ya enganchan; cada texto queda en pantalla el tiempo de leerlo 2 veces.

## Interactivos

Para quiz, checklists, autoevaluaciones o mini-juegos: partí de
`plantillas/interactivo.html` (no usa el render; ya enlaza las fuentes de
Google). Publicalo con la herramienta Artifact siguiendo su skill de diseño, o,
si Irene lo quiere en el sitio, como página nueva del repo. Reglas propias:

- Nunca devolver un "diagnóstico". Los resultados orientan ("vale la pena
  consultar", "esto es esperable a esta edad") y siempre invitan a hablar con Irene.
- Funciona con una mano en el celular: botones grandes, una pregunta por pantalla.
- Termina con un CTA (Kit gratuito o WhatsApp) y la opción de compartir.

## Qué NO hacer

- Estética genérica de Canva: degradés chillones, emojis como decoración,
  más de dos tipografías, stock de "familia feliz".
- Fotos de niños o testimonios reales sin permiso explícito de la familia.
- Prometer resultados ("en 15 días lee"), etiquetar ("tu hijo es disléxico").
- Animaciones con `setTimeout`, `setInterval` o `requestAnimationFrame` sueltos:
  el render no las controla y salen cortadas (ver `referencias/movimiento.md`).
