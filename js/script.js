/* ═══════════════════════════════════════════════════════════════
   PSICOPE CON IRE — Interacciones
   Vanilla JS · sin dependencias
   ─────────────────────────────────────────────────────────────
   1. Menú móvil accesible
   2. Header con sombra al hacer scroll
   3. Animaciones de aparición (IntersectionObserver)
   4. Enlace activo según sección visible
   5. Año dinámico en el footer
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  /* ── 1. Menú móvil ──────────────────────────────────────── */
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    menu.classList.remove('is-open');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
      menu.classList.toggle('is-open', !open);
    });

    // Cerrar al elegir un destino
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    // Cerrar al pasar a escritorio
    window.matchMedia('(min-width: 1024px)').addEventListener('change', closeMenu);
  }

  /* ── 2. Header al hacer scroll ──────────────────────────── */
  const header = document.getElementById('header');
  let ticking = false;

  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* ── 3. Animaciones de aparición ────────────────────────── */
  const revealables = document.querySelectorAll('.reveal');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ── 4. Enlace activo según sección ─────────────────────── */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const linkFor = {};
    navLinks.forEach(function (link) {
      linkFor[link.getAttribute('href').slice(1)] = link;
    });

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        const link = linkFor[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ── 5. Año dinámico ────────────────────────────────────── */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
