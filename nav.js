/**
 * EEA Design System — Navigation / Theme Toggle  [DEPRECATED — legacy core system]
 * Version: 1.0.0  (deprecated 2026-08-25)
 *
 * DEPRECATED: the sole EEA design language is now editorial.css, aligned
 * with https://intelligence.entethalliance.org/. This file is frozen and
 * served only for already-adopted sites. See DESIGN.md.
 *
 * Handles:
 *   1. Theme persistence (dark/light) via localStorage + prefers-color-scheme
 *   2. Theme toggle button state
 *   3. Active nav link highlighting based on current URL
 *
 * No dependencies. Runs as an IIFE to avoid polluting global scope.
 * Safe to load in <head> or before </body>.
 */
(function () {
  var STORAGE_KEY = 'eea-theme';

  /* ── Theme helpers ─────────────────────────────────────── */
  function getTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    var btn = document.querySelector('.eea-unified-nav-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  /* Apply immediately (before first paint) to avoid flash */
  applyTheme(getTheme());

  /* ── Active link highlighting ──────────────────────────── */
  function markActiveLink() {
    var links = document.querySelectorAll('.eea-unified-nav-links a');
    if (!links.length) return;

    var path = window.location.pathname;

    links.forEach(function (a) {
      a.classList.remove('active');

      var href = a.getAttribute('href');
      if (!href) return;

      /* Exact match OR current path ends with the href */
      if (
        path === href ||
        (href !== '/' && path.endsWith(href))
      ) {
        a.classList.add('active');
      }
    });

    /* Fallback: if nothing matched, mark the first link */
    var hasActive = document.querySelector('.eea-unified-nav-links a.active');
    if (!hasActive && links.length) {
      links[0].classList.add('active');
    }
  }

  /* ── DOMContentLoaded: wire up toggle + active links ───── */
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.eea-unified-nav-toggle');
    if (btn) {
      btn.textContent = getTheme() === 'dark' ? '☀️' : '🌙';
      btn.addEventListener('click', function () {
        applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
      });
    }
    markActiveLink();
  });
})();
