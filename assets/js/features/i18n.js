/* =====================================================================
 * i18n.js — Penukar Bahasa BM ⇄ EN (mockup, curated dictionary)
 * ---------------------------------------------------------------------
 * - IIFE, runs immediately (injected at end of DOMContentLoaded by main.js).
 * - No-op on admin page (body[data-page="admin"]).
 * - Injects a compact language toggle button into the top-bar
 *   (.topbar__social / .topbar__meta / .topbar), fallback: float top-right.
 * - Persists the choice in localStorage key `ejejak_lang` ('ms' | 'en').
 * - Translates ONLY a curated set of common strings: nav labels, hero CTAs,
 *   common buttons, and homepage section headings. Clinical / other text
 *   stays in Bahasa Melayu on purpose.
 * - Two passes:
 *     (a) elements carrying data-i18n="slug" (exact-string map by slug)
 *     (b) a safe exact-text replace over a curated BM→EN map, restricted to
 *         leaf elements inside nav / footer / section-head / .btn.
 * - Must NEVER throw if elements are missing.
 * ===================================================================== */
(function () {
  'use strict';

  try {
    // ---- Guard: skip admin page entirely --------------------------------
    var page = (document.body && document.body.getAttribute('data-page')) || '';
    if (page === 'admin') return;

    var LS_KEY = 'ejejak_lang';

    /* ------------------------------------------------------------------
     * Curated BM → EN dictionary (exact, trimmed leaf text).
     * Keep this list SMALL and safe — nav, CTAs, headings, common buttons.
     * ------------------------------------------------------------------ */
    var BM_TO_EN = {
      // Nav labels
      'Beranda': 'Home',
      'Tentang Kami': 'About Us',
      'Saringan': 'Screening',
      'Mula Saringan': 'Start Screening',
      '5 Domain Perkembangan': '5 Developmental Domains',
      'Cara Guna': 'How to Use',
      'Pusat Pendidikan': 'Education Centre',
      'Artikel Perkembangan': 'Development Articles',
      'Tips Keibubapaan': 'Parenting Tips',
      'Aktiviti di Rumah': 'Home Activities',
      'Soalan Lazim (FAQ)': 'FAQ',
      'Dashboard': 'Dashboard',

      // Header / auth CTAs
      'Daftar Percuma': 'Register Free',
      'Log Masuk': 'Log In',
      'Log Keluar': 'Log Out',
      'Log Masuk Doktor': 'Doctor Login',
      'Profil Saya': 'My Profile',
      'Hubungi Kami': 'Contact Us',

      // Footer quick links
      'Pautan Pantas': 'Quick Links',
      'Pendidikan': 'Education',
      'Panel Doktor / Pentadbir': 'Doctor / Admin Panel',
      '5 Domain': '5 Domains',
      'Artikel': 'Articles',
      'Tips': 'Tips',
      'Aktiviti': 'Activities',
      'Soalan Lazim': 'FAQ',

      // Homepage eyebrows / section headings
      'Saringan Perkembangan · Percuma': 'Developmental Screening · Free',
      'Intervensi Awal': 'Early Intervention',
      'Tentang e-Jejak Anak': 'About e-Jejak Anak',
      'Nadi Sistem': 'Core of the System',
      'Lima domain perkembangan kanak-kanak': 'Five child development domains',
      'Cara Guna': 'How It Works',
      'Empat langkah mudah': 'Four easy steps',
      'Rakan Komuniti': 'Community Partners',
      'Lihat Rakan NGO': 'View NGO Partners'
    };

    /* Reverse map (EN → BM) so we can restore when switching back to BM. */
    var EN_TO_BM = {};
    Object.keys(BM_TO_EN).forEach(function (bm) {
      EN_TO_BM[BM_TO_EN[bm]] = bm;
    });

    /* ------------------------------------------------------------------
     * data-i18n dictionary (keyed by slug). Elements that opt in via
     * data-i18n="slug" get translated from here. Optional hook — safe if
     * no element uses it.
     * ------------------------------------------------------------------ */
    var DICT = {
      ms: {
        'nav.home': 'Beranda',
        'nav.about': 'Tentang Kami',
        'nav.screening': 'Saringan',
        'nav.education': 'Pusat Pendidikan',
        'nav.dashboard': 'Dashboard',
        'cta.register': 'Daftar Percuma',
        'cta.login': 'Log Masuk',
        'cta.startScreening': 'Mula Saringan',
        'cta.contact': 'Hubungi Kami'
      },
      en: {
        'nav.home': 'Home',
        'nav.about': 'About Us',
        'nav.screening': 'Screening',
        'nav.education': 'Education Centre',
        'nav.dashboard': 'Dashboard',
        'cta.register': 'Register Free',
        'cta.login': 'Log In',
        'cta.startScreening': 'Start Screening',
        'cta.contact': 'Contact Us'
      }
    };

    /* ------------------------------------------------------------------
     * Scope: only translate leaf text inside these containers, so we never
     * touch clinical / body copy. Whitelisted selectors.
     * ------------------------------------------------------------------ */
    var SCOPE_SEL = [
      '.nav',
      '.topbar',
      '.footer',
      '.section-head',
      '.btn'
    ];

    /* Collect candidate leaf elements (no element children => pure text). */
    function collectLeaves() {
      var out = [];
      var seen = [];
      SCOPE_SEL.forEach(function (sel) {
        var roots;
        try { roots = document.querySelectorAll(sel); }
        catch (e) { return; }
        Array.prototype.forEach.call(roots, function (root) {
          // Include the root itself if it is a leaf (e.g. a .btn with only text)
          var pool = root.querySelectorAll('*');
          var all = [root];
          Array.prototype.push.apply(all, Array.prototype.slice.call(pool));
          all.forEach(function (el) {
            if (seen.indexOf(el) !== -1) return;
            // Leaf = no element children (text/inline-svg only counts as not-leaf if it has element kids)
            if (el.children && el.children.length === 0) {
              seen.push(el);
              out.push(el);
            }
          });
        });
      });
      return out;
    }

    /* Translate one leaf element's text using the given map, storing the
     * original once so we can restore. Only touches EXACT matches. */
    function translateLeaf(el, map) {
      // The visible text (trim to compare, keep surrounding whitespace intact).
      var raw = el.textContent;
      if (raw == null) return;
      var trimmed = raw.trim();
      if (!trimmed) return;
      if (!Object.prototype.hasOwnProperty.call(map, trimmed)) return;
      // Preserve leading/trailing whitespace around the trimmed core.
      var lead = raw.slice(0, raw.indexOf(trimmed));
      var tail = raw.slice(raw.indexOf(trimmed) + trimmed.length);
      el.textContent = lead + map[trimmed] + tail;
    }

    /* Apply a language across the page. */
    function applyLang(lang) {
      var toEN = (lang === 'en');
      var map = toEN ? BM_TO_EN : EN_TO_BM;

      // Pass (a): data-i18n slugs
      try {
        var slugged = document.querySelectorAll('[data-i18n]');
        var table = DICT[toEN ? 'en' : 'ms'] || {};
        Array.prototype.forEach.call(slugged, function (el) {
          var slug = el.getAttribute('data-i18n');
          if (slug && Object.prototype.hasOwnProperty.call(table, slug)) {
            el.textContent = table[slug];
          }
        });
      } catch (e) { /* ignore */ }

      // Pass (b): curated exact-text replace over whitelisted leaves
      try {
        var leaves = collectLeaves();
        leaves.forEach(function (el) { translateLeaf(el, map); });
      } catch (e) { /* ignore */ }

      // Update <html lang="..">
      try { document.documentElement.setAttribute('lang', toEN ? 'en' : 'ms'); }
      catch (e) { /* ignore */ }

      // Reflect state on the toggle button
      var btn = document.getElementById('i18n-toggle');
      if (btn) {
        btn.setAttribute('data-lang', lang);
        btn.setAttribute('aria-label',
          toEN ? 'Switch language (currently English)' : 'Tukar bahasa (sekarang Bahasa Melayu)');
        var lbl = btn.querySelector('.i18n-label');
        // Show the language you'd switch TO, as a compact code.
        if (lbl) lbl.textContent = toEN ? 'BM' : 'EN';
      }
    }

    function getLang() {
      try {
        var v = localStorage.getItem(LS_KEY);
        return (v === 'en' || v === 'ms') ? v : 'ms';
      } catch (e) { return 'ms'; }
    }
    function setLang(lang) {
      try { localStorage.setItem(LS_KEY, lang); } catch (e) { /* ignore */ }
    }

    /* ------------------------------------------------------------------
     * Inject the toggle button + minimal styles.
     * ------------------------------------------------------------------ */
    function injectStyles() {
      if (document.getElementById('i18n-style')) return;
      var css =
        '#i18n-toggle{display:inline-flex;align-items:center;gap:6px;' +
        'font-family:var(--font-head,inherit);font-weight:600;font-size:var(--fs-sm,0.9rem);' +
        'line-height:1;padding:5px 10px;border-radius:var(--radius-sm,9px);' +
        'border:1px solid rgba(255,255,255,.4);background:rgba(255,255,255,.12);' +
        'color:inherit;cursor:pointer;transition:background .15s,border-color .15s;}' +
        '#i18n-toggle:hover{background:rgba(255,255,255,.24);border-color:rgba(255,255,255,.8);}' +
        '#i18n-toggle .i18n-globe{width:15px;height:15px;flex:0 0 auto;}' +
        '#i18n-toggle .i18n-label{letter-spacing:.03em;}' +
        /* Floating fallback variant */
        '#i18n-toggle.i18n-float{position:fixed;top:12px;right:12px;z-index:1200;' +
        'background:var(--brand,#F51818);color:#fff;border-color:var(--brand-deep,#B00D11);' +
        'box-shadow:0 4px 14px rgba(0,0,0,.18);}' +
        '#i18n-toggle.i18n-float:hover{background:var(--brand-deep,#B00D11);}';
      var s = document.createElement('style');
      s.id = 'i18n-style';
      s.textContent = css;
      (document.head || document.documentElement).appendChild(s);
    }

    var GLOBE_SVG =
      '<svg class="i18n-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/>' +
      '<path d="M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></svg>';

    function buildButton(floating) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'i18n-toggle';
      if (floating) btn.className = 'i18n-float';
      btn.title = 'Bahasa Melayu / English (demo)';
      btn.innerHTML = GLOBE_SVG + '<span class="i18n-label">EN</span>';
      btn.addEventListener('click', function () {
        var next = getLang() === 'en' ? 'ms' : 'en';
        // Restore to BM baseline first if we are on EN, so re-applying is clean.
        // (Our maps are symmetric via EN_TO_BM, so a direct apply is safe.)
        setLang(next);
        applyLang(next);
      });
      return btn;
    }

    function mountButton() {
      // Preferred homes, in order.
      var social = document.querySelector('.topbar__social');
      if (social && social.parentNode) {
        var b1 = buildButton(false);
        social.parentNode.insertBefore(b1, social);
        return true;
      }
      var meta = document.querySelector('.topbar__meta');
      if (meta) {
        meta.appendChild(buildButton(false));
        return true;
      }
      var cta = document.querySelector('.nav__cta');
      if (cta) {
        cta.insertBefore(buildButton(false), cta.firstChild);
        return true;
      }
      var topbarInner = document.querySelector('.topbar .container');
      if (topbarInner) {
        topbarInner.appendChild(buildButton(false));
        return true;
      }
      // Fallback: float top-right.
      (document.body || document.documentElement).appendChild(buildButton(true));
      return true;
    }

    /* ------------------------------------------------------------------
     * Boot. The header chrome is mounted by main.js before this module is
     * injected, so elements should exist — but we guard regardless.
     * ------------------------------------------------------------------ */
    function boot() {
      injectStyles();
      if (!document.getElementById('i18n-toggle')) {
        try { mountButton(); } catch (e) { /* ignore */ }
      }
      applyLang(getLang());
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  } catch (err) {
    // Never let i18n break the page.
    if (window && window.console) console.warn('i18n.js:', err);
  }
})();
