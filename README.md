# Psicope con Ire — Sitio web oficial

Sitio de marca personal de **Irene**, Licenciada en Psicopedagogía y docente durante más de 20 años.

**URL:** https://irepsicope16.github.io/Lectoencasa/

## Estructura del proyecto

```
├── index.html            → Página principal (Home, Sobre mí, Método, Kit, Recursos, Testimonios, Contacto)
├── css/styles.css        → Todos los estilos (mobile-first, sin frameworks)
├── js/script.js          → Interacciones (menú, animaciones de scroll, sin dependencias)
├── blog/index.html       → Blog (estructura lista, artículos "próximamente")
├── academia/index.html   → Academia (estructura lista, en construcción)
├── app/index.html        → App Lecto en Casa (la aplicación original, intacta)
├── assets/img/           → Imágenes (foto de Irene, favicon, placeholders, imagen para redes)
├── robots.txt            → SEO
├── sitemap.xml           → SEO
├── 404.html              → Página de error
└── _archivo/             → Copias de seguridad de archivos anteriores
```

## Cómo actualizar el contenido

### Cambiar la foto principal
Reemplazá `assets/img/irene.jpg` (retrato vertical, ideal 1200×1800 px aprox.).

### Agregar la foto del aula (sección "Sobre mí")
Subí `assets/img/irene-aula.jpg`. Mientras no exista, se muestra un placeholder elegante.

### Publicar un testimonio real
En `index.html`, buscá la sección `TESTIMONIOS` y reemplazá el texto del
`blockquote` y el nombre en cada tarjeta. Nunca publicar testimonios sin
permiso de la familia.

### Publicar un artículo del blog
1. Creá la página del artículo (por ejemplo `blog/mi-articulo.html`).
2. En `blog/index.html`, envolvé la tarjeta correspondiente en un enlace
   `<a href="mi-articulo.html">` y cambiá "Próximamente" por la fecha.
3. Agregá la URL nueva a `sitemap.xml`.

### Enlaces importantes
- **Formulario del kit:** https://forms.gle/hwFJ96Pm3m5fMPy97 (integrado en la sección Kit)
- **WhatsApp:** https://wa.me/5492216185376 (con mensaje precargado)
- **Instagram:** el footer enlaza a `instagram.com/psicopeconire` — verificar que sea el usuario correcto.

## Tecnología
HTML5 + CSS3 + JavaScript vanilla. Sin frameworks, sin build. Se publica
directo con GitHub Pages.
