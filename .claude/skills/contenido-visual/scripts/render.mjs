#!/usr/bin/env node
// Renderiza piezas HTML de la marca a PNG (una por .lienzo) o a MP4/GIF.
//
//   node render.mjs pieza.html [--salida dir] [--fps 30] [--gif] [--audio pista.mp3]
//                              [--previa] [--escala 1] [--modo png|video]
//
// Modo automático: si la página tiene <meta name="duracion" content="12"> se
// exporta video; si no, un PNG por cada elemento .lienzo.

import { spawn, execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
function cargarPlaywright() {
  try { return require('playwright'); } catch {}
  const global = execSync('npm root -g').toString().trim();
  return require(path.join(global, 'playwright'));
}

function leerArgs(argv) {
  const args = { fps: 30, escala: 1, gif: false, previa: false };
  const resto = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--gif' || a === '--previa') args[a.slice(2)] = true;
    else if (a.startsWith('--')) args[a.slice(2)] = argv[++i];
    else resto.push(a);
  }
  args.entrada = resto[0];
  args.fps = Number(args.fps);
  args.escala = Number(args.escala);
  return args;
}

const args = leerArgs(process.argv.slice(2));
if (!args.entrada) {
  console.error('Uso: node render.mjs pieza.html [--salida dir] [--fps 30] [--gif] [--audio pista.mp3] [--previa]');
  process.exit(1);
}

const aqui = path.dirname(fileURLToPath(import.meta.url));
const entrada = path.resolve(args.entrada);
const nombre = path.basename(entrada, path.extname(entrada));
const salida = path.resolve(args.salida ?? path.dirname(entrada));
fs.mkdirSync(salida, { recursive: true });

// Inyecta la marca y una <base> para que las rutas relativas sigan funcionando.
const fuentes = pathToFileURL(path.join(aqui, '..', 'assets', 'fuentes')).href;
const marca = fs.readFileSync(path.join(aqui, '..', 'plantillas', 'marca.css'), 'utf8').replaceAll('{{FUENTES}}', fuentes);
const base = pathToFileURL(path.dirname(entrada) + path.sep).href;
const html = fs.readFileSync(entrada, 'utf8')
  .replace(/<head[^>]*>/i, (m) => `${m}\n<base href="${base}">\n<style data-marca>${marca}</style>`);
const temporal = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'render-')), 'pieza.html');
fs.writeFileSync(temporal, html);

const { chromium } = cargarPlaywright();
const navegador = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const pagina = await navegador.newPage({ viewport: { width: 1920, height: 1920 }, deviceScaleFactor: args.escala });
pagina.on('pageerror', (e) => console.error('Error en la página:', e.message));
await pagina.goto(pathToFileURL(temporal).href, { waitUntil: 'load' });
await pagina.evaluate(() => document.fonts.ready);

const duracion = Number(await pagina.evaluate(() => document.querySelector('meta[name="duracion"]')?.content ?? 0));
const modo = args.modo ?? (duracion > 0 ? 'video' : 'png');
const escritos = [];

if (modo === 'png') {
  await pagina.evaluate(() => document.getAnimations().forEach((a) => { try { a.finish(); } catch { a.pause(); } }));
  const lienzos = await pagina.$$('.lienzo');
  if (!lienzos.length) throw new Error('No hay ningún elemento .lienzo en la página.');
  for (const [i, lienzo] of lienzos.entries()) {
    const archivo = path.join(salida, lienzos.length > 1 ? `${nombre}-${String(i + 1).padStart(2, '0')}.png` : `${nombre}.png`);
    await lienzo.screenshot({ path: archivo });
    escritos.push(archivo);
  }
} else {
  if (!duracion) throw new Error('Para video agregá <meta name="duracion" content="segundos">.');
  const caja = await pagina.evaluate(() => {
    const r = document.querySelector('.lienzo').getBoundingClientRect();
    return { width: Math.round(r.width), height: Math.round(r.height) };
  });
  await pagina.setViewportSize(caja);
  await pagina.evaluate(() => {
    document.body.style.background = 'none';
    const l = document.querySelector('.lienzo');
    l.style.margin = '0';
    window.scrollTo(0, 0);
    document.getAnimations().forEach((a) => a.pause());
  });

  const mp4 = path.join(salida, `${nombre}.mp4`);
  const ffArgs = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'png', '-framerate', String(args.fps), '-i', '-'];
  if (args.audio) ffArgs.push('-i', path.resolve(args.audio), '-af', `afade=t=out:st=${Math.max(0, duracion - 1)}:d=1`, '-c:a', 'aac', '-b:a', '160k', '-shortest');
  ffArgs.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4);
  const ffmpeg = spawn('ffmpeg', ffArgs, { stdio: ['pipe', 'inherit', 'inherit'] });
  const termino = new Promise((ok, mal) => ffmpeg.on('close', (c) => (c === 0 ? ok() : mal(new Error(`ffmpeg salió con código ${c}`)))));

  const total = Math.round(duracion * args.fps);
  const clave = new Set([0.05, 0.35, 0.65, 0.97].map((p) => Math.round(p * (total - 1))));
  for (let f = 0; f < total; f++) {
    const t = f / args.fps;
    await pagina.evaluate((t) => {
      for (const a of document.getAnimations()) { a.pause(); a.currentTime = t * 1000; }
      window.alMomento?.(t);
    }, t);
    const cuadro = await pagina.screenshot({ type: 'png', clip: { x: 0, y: 0, ...caja } });
    if (!ffmpeg.stdin.write(cuadro)) await new Promise((r) => ffmpeg.stdin.once('drain', r));
    if (args.previa && clave.has(f)) {
      const archivo = path.join(salida, `${nombre}-previa-${t.toFixed(1)}s.png`);
      fs.writeFileSync(archivo, cuadro);
      escritos.push(archivo);
    }
    if (f % args.fps === 0) process.stdout.write(`\r${Math.round((f / total) * 100)} %`);
  }
  ffmpeg.stdin.end();
  await termino;
  process.stdout.write('\r100 %\n');
  escritos.unshift(mp4);

  if (args.gif) {
    const gif = path.join(salida, `${nombre}.gif`);
    execSync(`ffmpeg -y -loglevel error -i "${mp4}" -vf "fps=15,scale=540:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a" "${gif}"`);
    escritos.push(gif);
  }
}

await navegador.close();
fs.rmSync(path.dirname(temporal), { recursive: true, force: true });
console.log(escritos.join('\n'));
