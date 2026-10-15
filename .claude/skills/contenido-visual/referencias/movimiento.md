# Movimiento en videos

## Cómo funciona el render

`render.mjs` pausa **todas** las animaciones de la página y, para cada
fotograma, fija `currentTime` de cada una en el instante `t`. Por eso:

- Usá **CSS `@keyframes`** (o la Web Animations API, `el.animate(...)`).
  Todo lo que dependa de `animation-delay` se coordina solo.
- Si necesitás lógica en JS (contadores, texto que se escribe, partículas),
  definí `window.alMomento = (t) => { … }` — el render la llama en cada
  fotograma con `t` en segundos. Debe ser una función pura del tiempo.
- No uses `transition`, `setTimeout`, `setInterval` ni `requestAnimationFrame`
  para animar: el render no los controla.
- Videos y GIF embebidos no se sincronizan: usá imágenes fijas.

## Organización por escenas

En la plantilla, cada `.escena` tiene `--inicio` y `--fin` (segundos). Las
clases `.entra-*` usan `animation-delay: calc(var(--inicio) * 1s + var(--d, 0s))`.
Para escalonar varios elementos dentro de una escena, dales `--d: .15s`, `.3s`…

## Criterios (marca "minimalismo cálido")

- Movimientos suaves y cortos: 400–700 ms, curva `cubic-bezier(.22,.8,.3,1)`.
- Desplazamientos chicos (20–40 px), opacidad + leve escala (0.96→1). Nada de
  rebotes exagerados, giros ni zooms bruscos.
- Un solo foco en movimiento a la vez; el resto quieto.
- Para "respirar": formas de fondo que flotan muy lento (8–12 s por ciclo).
- Las salidas son más rápidas que las entradas (≈ 60 %).
- La última escena (CTA) se queda quieta al menos 1,5 s.
