/* ==================================================================
   a11y.js — Butang & panel Kebolehcapaian (Accessibility)
   ------------------------------------------------------------------
   Butang terapung bucu KIRI-BAWAH. Panel penuh (gaya kekal):
     Saiz Teks (besar/kecil), Jarak Teks (tambah/kurang),
     Songsang Warna, Nada Kelabu, Garis Bawah Pautan, Kursor Besar,
     Panduan Bacaan, Teks ke Suara (TTS), Suara ke Teks (STT), set semula.
   - Tetapan visual disimpan dalam localStorage `ejejak_a11y` & dipasang
     semula bila halaman dimuat. TTS/STT tidak disimpan (tindakan sesi).
   - IIFE, suntik DOM + <style> sendiri, no-op-safe. Demo/simulasi mockup.
   ================================================================== */
(function () {
  'use strict';

  if (window.__ejejakA11yLoaded) return;
  window.__ejejakA11yLoaded = true;

  var KEY = 'ejejak_a11y';

  function readPrefs() {
    try { var v = JSON.parse(localStorage.getItem(KEY)); return (v && typeof v === 'object') ? v : {}; }
    catch (e) { return {}; }
  }
  function writePrefs(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }

  var SCALE_MIN = 90, SCALE_MAX = 160, SCALE_STEP = 10, SCALE_BASE = 100;
  var SPACE_MIN = 0, SPACE_MAX = 4;

  var DEFAULTS = { fontScale: 100, spacing: 0, invert: false, grey: false, underline: false, bigcursor: false, guide: false };

  var prefs = (function () {
    var p = readPrefs();
    return {
      fontScale: clampScale(typeof p.fontScale === 'number' ? p.fontScale : 100),
      spacing: clampSpace(typeof p.spacing === 'number' ? p.spacing : 0),
      invert: !!p.invert, grey: !!p.grey, underline: !!p.underline,
      bigcursor: !!p.bigcursor, guide: !!p.guide
    };
  })();

  // Keadaan sesi (tidak disimpan) — mikrofon/pembaca skrin.
  var ttsOn = false, sttOn = false, recog = null, guideEl = null;

  function clampScale(n) { n = Math.round(n / SCALE_STEP) * SCALE_STEP; return Math.max(SCALE_MIN, Math.min(SCALE_MAX, n)); }
  function clampSpace(n) { n = Math.round(n); return Math.max(SPACE_MIN, Math.min(SPACE_MAX, n)); }

  // Kursor besar (SVG data-URI, dibina di sini supaya lolos lekapan CSS).
  var BIG_CURSOR = (function () {
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 32 32'>" +
              "<path d='M6 3 L6 27 L12.5 21 L16.5 30 L20.5 28.2 L16.5 19.5 L26 19.5 Z' fill='black' stroke='white' stroke-width='2' stroke-linejoin='round'/></svg>";
    return "data:image/svg+xml," + encodeURIComponent(svg);
  })();

  // ---- <style> ------------------------------------------------------
  function injectStyle() {
    if (document.getElementById('a11y-style')) return;
    var css = [
      /* Butang terapung */
      '.a11y-fab{position:fixed;left:20px;bottom:20px;z-index:1200;width:54px;height:54px;',
      'border-radius:50%;border:2px solid #fff;background:var(--brand,#F51818);color:#fff;',
      'display:grid;place-items:center;cursor:pointer;box-shadow:var(--shadow-lg,0 18px 48px rgba(11,79,108,.2));',
      'transition:transform .18s ease;padding:0;}',
      '.a11y-fab:hover{transform:translateY(-3px) scale(1.04);}',
      '.a11y-fab:focus-visible{outline:3px solid var(--accent,#F4C400);outline-offset:2px;}',
      '.a11y-fab svg{width:28px;height:28px;}',

      /* Panel */
      '.a11y-panel{position:fixed;left:20px;bottom:84px;z-index:1201;width:264px;max-width:calc(100vw - 40px);',
      'max-height:calc(100vh - 110px);overflow-y:auto;background:#fff;color:var(--ink,#16303A);',
      'border:1px solid var(--line,#E1E9EB);border-radius:var(--radius,14px);',
      'box-shadow:var(--shadow-lg,0 18px 48px rgba(11,79,108,.2));padding:12px 14px;',
      'font-family:var(--font-body,system-ui);font-size:var(--fs-sm,.9rem);display:none;}',
      '.a11y-panel[data-open="1"]{display:block;animation:a11yUp .18s ease;}',
      '@keyframes a11yUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}',
      '.a11y-panel h3{margin:0 0 2px;font-size:var(--fs-md,1.15rem);color:var(--brand-dark,#D81217);font-family:var(--font-head,system-ui);}',
      '.a11y-panel .a11y-sub{margin:0 0 8px;color:var(--muted,#5B7178);font-size:var(--fs-xs,.78rem);}',

      /* Baris (toggle & tindakan) — gaya sama */
      '.a11y-toggle{display:flex;align-items:center;gap:10px;width:100%;margin-bottom:5px;',
      'padding:7px 10px;border-radius:var(--radius-sm,9px);border:1px solid var(--line,#E1E9EB);',
      'background:var(--surface-2,#FBFDFD);color:var(--ink,#16303A);cursor:pointer;font:inherit;text-align:left;}',
      '.a11y-toggle:hover{border-color:var(--brand,#F51818);}',
      '.a11y-ico{flex:0 0 auto;width:22px;height:22px;display:grid;place-items:center;color:var(--brand,#F51818);}',
      '.a11y-ico svg{width:20px;height:20px;}',
      '.a11y-txt{flex:1;min-width:0;}',
      '.a11y-sw{flex:0 0 auto;width:40px;height:22px;border-radius:999px;background:var(--line,#CBD5D8);position:relative;transition:background .16s ease;}',
      '.a11y-sw::after{content:"";position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:left .16s ease;}',
      '.a11y-toggle[aria-pressed="true"]{border-color:var(--brand,#F51818);background:var(--brand-soft,#FBE9EA);}',
      '.a11y-toggle[aria-pressed="true"] .a11y-sw{background:var(--brand,#F51818);}',
      '.a11y-toggle[aria-pressed="true"] .a11y-sw::after{left:20px;}',
      '.a11y-val{flex:0 0 auto;font-weight:700;color:var(--brand-dark,#D81217);font-size:var(--fs-xs,.78rem);min-width:42px;text-align:right;}',

      '.a11y-reset{width:100%;margin-top:4px;padding:9px 12px;border-radius:var(--radius-sm,9px);',
      'border:1px solid var(--line,#E1E9EB);background:#fff;color:var(--muted,#5B7178);cursor:pointer;font:inherit;font-weight:600;}',
      '.a11y-reset:hover{border-color:var(--danger,#D0553F);color:var(--danger,#D0553F);}',
      '.a11y-note{margin:10px 0 0;font-size:var(--fs-xs,.78rem);color:var(--muted,#5B7178);text-align:center;}',

      /* ===== Kesan pada dokumen ===== */
      /* Jarak teks */
      'html.a11y-spacing body{letter-spacing:var(--a11y-ls) !important;word-spacing:var(--a11y-ws) !important;line-height:var(--a11y-lh) !important;}',
      'html.a11y-spacing .a11y-panel,html.a11y-spacing .a11y-fab{letter-spacing:normal !important;word-spacing:normal !important;}',

      /* Songsang warna — songsang semula media & widget supaya kekal betul */
      'html.a11y-invert img,html.a11y-invert video,html.a11y-invert iframe,html.a11y-invert .slide__bg,',
      'html.a11y-invert .a11y-fab,html.a11y-invert .a11y-panel{filter:invert(1) hue-rotate(180deg);}',

      /* Garis bawah pautan */
      'html.a11y-underline a:not(.a11y-fab):not(.btn){text-decoration:underline !important;text-underline-offset:2px;}',

      /* Kursor besar */
      'html.a11y-bigcursor,html.a11y-bigcursor *{cursor:url("' + BIG_CURSOR + '") 3 2,auto !important;}',

      /* Panduan bacaan */
      '.a11y-guide{position:fixed;left:0;right:0;height:44px;pointer-events:none;z-index:1190;display:none;',
      'background:rgba(22,48,58,.12);border-top:2px solid rgba(213,18,23,.85);border-bottom:2px solid rgba(213,18,23,.85);}'
    ].join('');

    var st = document.createElement('style');
    st.id = 'a11y-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  // Ikon FAB (person-in-circle)
  var ICON_FAB =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="4.2" r="1.6" fill="currentColor" stroke="none"></circle>' +
    '<path d="M4 7.5c2.6 1 5.3 1.5 8 1.5s5.4-.5 8-1.5"></path><path d="M12 8.8V14"></path><path d="M9 20l3-6 3 6"></path></svg>';

  // Ikon baris (ringkas, stroke)
  var S = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  var IC = {
    inc: '<svg viewBox="0 0 24 24" ' + S + '><path d="M6 15l6-6 6 6"/></svg>',
    dec: '<svg viewBox="0 0 24 24" ' + S + '><path d="M6 9l6 6 6-6"/></svg>',
    sinc: '<svg viewBox="0 0 24 24" ' + S + '><path d="M9 6l6 6-6 6"/><path d="M4 4v16"/></svg>',
    sdec: '<svg viewBox="0 0 24 24" ' + S + '><path d="M15 6l-6 6 6 6"/><path d="M20 4v16"/></svg>',
    invert: '<svg viewBox="0 0 24 24" ' + S + '><circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor" stroke="none"/></svg>',
    grey: '<svg viewBox="0 0 24 24" ' + S + '><path d="M12 3s7 7.6 7 12a7 7 0 0 1-14 0c0-4.4 7-12 7-12z"/></svg>',
    underline: '<svg viewBox="0 0 24 24" ' + S + '><path d="M6 4v6a6 6 0 0 0 12 0V4"/><path d="M5 20h14"/></svg>',
    cursor: '<svg viewBox="0 0 24 24" ' + S + '><path d="M4 3l7 17 2.2-6.8L20 11 4 3z"/></svg>',
    guide: '<svg viewBox="0 0 24 24" ' + S + '><path d="M3 8h18"/><path d="M3 16h18"/><path d="M8 12h8"/></svg>',
    tts: '<svg viewBox="0 0 24 24" ' + S + '><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8a5 5 0 0 1 0 8"/></svg>',
    stt: '<svg viewBox="0 0 24 24" ' + S + '><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>'
  };

  function toggleRow(act, label, ico) {
    return '<button type="button" class="a11y-toggle" data-act="' + act + '" aria-pressed="false">' +
      '<span class="a11y-ico">' + ico + '</span><span class="a11y-txt">' + label + '</span>' +
      '<span class="a11y-sw" aria-hidden="true"></span></button>';
  }
  function actRow(act, label, ico, role) {
    return '<button type="button" class="a11y-toggle" data-act="' + act + '">' +
      '<span class="a11y-ico">' + ico + '</span><span class="a11y-txt">' + label + '</span>' +
      '<span class="a11y-val" data-role="' + role + '"></span></button>';
  }

  // ---- Bina DOM -----------------------------------------------------
  var els = {};
  function buildWidget() {
    if (document.querySelector('.a11y-fab')) return;

    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'a11y-fab';
    fab.setAttribute('aria-label', 'Tetapan kebolehcapaian');
    fab.setAttribute('aria-haspopup', 'true');
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('title', 'Kebolehcapaian');
    fab.innerHTML = ICON_FAB;

    var panel = document.createElement('div');
    panel.className = 'a11y-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Tetapan kebolehcapaian');
    panel.setAttribute('data-open', '0');
    panel.innerHTML =
      '<h3>Kebolehcapaian</h3>' +
      '<p class="a11y-sub">Sesuaikan paparan mengikut keperluan anda.</p>' +
      actRow('font-inc', 'Besarkan Saiz Teks', IC.inc, 'font-val') +
      actRow('font-dec', 'Kecilkan Saiz Teks', IC.dec, 'font-val') +
      actRow('space-inc', 'Tambah Jarak Teks', IC.sinc, 'space-val') +
      actRow('space-dec', 'Kurangkan Jarak Teks', IC.sdec, 'space-val') +
      toggleRow('invert', 'Songsang Warna', IC.invert) +
      toggleRow('grey', 'Nada Kelabu', IC.grey) +
      toggleRow('underline', 'Garis Bawah Pautan', IC.underline) +
      toggleRow('bigcursor', 'Kursor Besar', IC.cursor) +
      toggleRow('guide', 'Panduan Bacaan', IC.guide) +
      toggleRow('tts', 'Teks ke Suara', IC.tts) +
      toggleRow('stt', 'Suara ke Teks', IC.stt) +
      '<button type="button" class="a11y-reset" data-act="reset">Set semula tetapan</button>' +
      '<p class="a11y-note">Tetapan visual disimpan pada peranti ini (demo). Teks/Suara memerlukan pelayar yang menyokong.</p>';

    document.body.appendChild(fab);
    document.body.appendChild(panel);
    els.fab = fab; els.panel = panel;

    fab.addEventListener('click', function (e) { e.stopPropagation(); togglePanel(); });
    document.addEventListener('click', function (e) {
      if (panel.getAttribute('data-open') !== '1') return;
      if (panel.contains(e.target) || fab.contains(e.target)) return;
      closePanel();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.getAttribute('data-open') === '1') closePanel();
    });
    panel.addEventListener('click', function (e) {
      var t = e.target.closest('[data-act]');
      if (t) handleAction(t.getAttribute('data-act'));
    });
  }

  function togglePanel() { els.panel.getAttribute('data-open') === '1' ? closePanel() : openPanel(); }
  function openPanel() { els.panel.setAttribute('data-open', '1'); els.fab.setAttribute('aria-expanded', 'true'); }
  function closePanel() { els.panel.setAttribute('data-open', '0'); els.fab.setAttribute('aria-expanded', 'false'); }

  // ---- Tindakan -----------------------------------------------------
  function handleAction(act) {
    switch (act) {
      case 'font-inc':  prefs.fontScale = clampScale(prefs.fontScale + SCALE_STEP); break;
      case 'font-dec':  prefs.fontScale = clampScale(prefs.fontScale - SCALE_STEP); break;
      case 'space-inc': prefs.spacing = clampSpace(prefs.spacing + 1); break;
      case 'space-dec': prefs.spacing = clampSpace(prefs.spacing - 1); break;
      case 'invert':    prefs.invert = !prefs.invert; break;
      case 'grey':      prefs.grey = !prefs.grey; break;
      case 'underline': prefs.underline = !prefs.underline; break;
      case 'bigcursor': prefs.bigcursor = !prefs.bigcursor; break;
      case 'guide':     prefs.guide = !prefs.guide; break;
      case 'tts':       setTTS(!ttsOn); break;   // sesi sahaja
      case 'stt':       setSTT(!sttOn); break;   // sesi sahaja
      case 'reset':
        prefs = { fontScale: 100, spacing: 0, invert: false, grey: false, underline: false, bigcursor: false, guide: false };
        setTTS(false); setSTT(false);
        break;
      default: return;
    }
    if (act !== 'tts' && act !== 'stt') writePrefs(prefs);
    apply();
    syncUI();
  }

  // ---- Pakai pada dokumen -------------------------------------------
  function apply() {
    var root = document.documentElement;
    root.style.fontSize = (prefs.fontScale === SCALE_BASE) ? '' : (prefs.fontScale + '%');

    root.classList.toggle('a11y-spacing', prefs.spacing > 0);
    root.style.setProperty('--a11y-ls', (prefs.spacing * 0.04) + 'em');
    root.style.setProperty('--a11y-ws', (prefs.spacing * 0.09) + 'em');
    root.style.setProperty('--a11y-lh', String(1.5 + prefs.spacing * 0.18));

    var f = [];
    if (prefs.invert) f.push('invert(1) hue-rotate(180deg)');
    if (prefs.grey) f.push('grayscale(1)');
    root.style.filter = f.join(' ');
    root.classList.toggle('a11y-invert', prefs.invert);

    root.classList.toggle('a11y-underline', prefs.underline);
    root.classList.toggle('a11y-bigcursor', prefs.bigcursor);
    applyGuide(prefs.guide);
  }

  // ---- Panduan bacaan -----------------------------------------------
  function moveGuide(e) { if (guideEl) guideEl.style.top = (e.clientY - 22) + 'px'; }
  function applyGuide(on) {
    if (on) {
      if (!guideEl) { guideEl = document.createElement('div'); guideEl.className = 'a11y-guide'; guideEl.setAttribute('aria-hidden', 'true'); document.body.appendChild(guideEl); }
      guideEl.style.display = 'block';
      document.addEventListener('mousemove', moveGuide);
    } else {
      document.removeEventListener('mousemove', moveGuide);
      if (guideEl) guideEl.style.display = 'none';
    }
  }

  // ---- Teks ke Suara -------------------------------------------------
  function ttsClick(e) {
    if (e.target.closest('.a11y-fab') || e.target.closest('.a11y-panel')) return;
    if (!window.speechSynthesis) return;
    var el = e.target.closest('p,h1,h2,h3,h4,h5,li,a,button,label,td,th,strong,span,div');
    var text = (el && (el.innerText || el.textContent) || '').trim();
    if (!text) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text.slice(0, 400));
    u.lang = 'ms-MY';
    speechSynthesis.speak(u);
  }
  function setTTS(on) {
    if (on && !window.speechSynthesis) { alert('Maaf, pelayar anda tidak menyokong Teks ke Suara.'); return; }
    ttsOn = !!on;
    if (ttsOn) document.addEventListener('click', ttsClick, true);
    else { document.removeEventListener('click', ttsClick, true); if (window.speechSynthesis) speechSynthesis.cancel(); }
  }

  // ---- Suara ke Teks -------------------------------------------------
  function setSTT(on) {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (on) {
      if (!SR) { alert('Maaf, pelayar anda tidak menyokong Suara ke Teks.'); sttOn = false; syncUI(); return; }
      try {
        recog = new SR();
        recog.lang = 'ms-MY'; recog.interimResults = false; recog.continuous = true;
        recog.onresult = function (ev) {
          var t = '';
          for (var i = ev.resultIndex; i < ev.results.length; i++) t += ev.results[i][0].transcript;
          t = t.trim();
          var a = document.activeElement;
          if (t && a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA')) {
            a.value += (a.value ? ' ' : '') + t;
          }
        };
        recog.onerror = function () {};
        recog.onend = function () { if (sttOn && recog) { try { recog.start(); } catch (e) {} } };
        recog.start();
        sttOn = true;
      } catch (e) { sttOn = false; }
    } else {
      sttOn = false;
      if (recog) { try { recog.stop(); } catch (e) {} recog = null; }
    }
  }

  // ---- Segerak UI ---------------------------------------------------
  function syncUI() {
    if (!els.panel) return;
    els.panel.querySelectorAll('[data-role="font-val"]').forEach(function (n) { n.textContent = prefs.fontScale + '%'; });
    els.panel.querySelectorAll('[data-role="space-val"]').forEach(function (n) { n.textContent = 'Tahap ' + prefs.spacing; });
    setToggle('invert', prefs.invert);
    setToggle('grey', prefs.grey);
    setToggle('underline', prefs.underline);
    setToggle('bigcursor', prefs.bigcursor);
    setToggle('guide', prefs.guide);
    setToggle('tts', ttsOn);
    setToggle('stt', sttOn);
  }
  function setToggle(act, on) {
    var btn = els.panel.querySelector('[data-act="' + act + '"]');
    if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  // ---- Init ---------------------------------------------------------
  function init() {
    if (!document.body) return;
    injectStyle();
    buildWidget();
    apply();
    syncUI();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
