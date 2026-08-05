/* =====================================================================
   chatbot.js — Pembantu Maya e-Jejak Anak (bot demo, berasaskan peraturan)
   Butang sembang terapung di bawah-KANAN, halaman awam sahaja.
   Tidak muncul pada halaman admin (body[data-page="admin"]).
   IIFE, suntik DOM + <style> sendiri. Selamat jika elemen sasaran tiada.
   Tiada backend — semua jawapan adalah skrip tetap (rule-based).
   ===================================================================== */
(function () {
  'use strict';

  // --- Guard: jangan jalan pada halaman admin, atau jika sudah dipasang ---
  try {
    var page = (document.body && document.body.getAttribute('data-page')) || '';
    if (page === 'admin') return;
    if (document.getElementById('ejejak-chatbot')) return; // elak duplikasi
  } catch (e) { return; }

  var OPEN_KEY = 'ejejak_chat_open';

  // --- Ikon ringkas (selari dengan gaya ICONS.* main.js) ---------------
  var SVG = {
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-8.8 8.4 9 9 0 0 1-3.4-.6L3 21l1.7-5a8.2 8.2 0 0 1-.7-3.4A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/></svg>',
    bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V5M9 3h6"/><path d="M9.5 13h.01M14.5 13h.01"/></svg>',
    footprint: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 2C6.9 2 6 3.7 6 6c0 2 .8 3.6 2 4.3.9.5 1.9 0 2.2-1 .3-1 .4-2.4.3-3.8C10.4 3.5 9.9 2 8.5 2Zm-3 10.5c-1.3 0-2.3 1.1-2.3 2.6 0 1.2.5 2.3 1.4 3.4.7.9 2 .8 2.6-.2.5-.9.6-2 .5-3.2-.1-1.4-.8-2.6-2.2-2.6Zm10-10.5c1.6 0 2.5 1.7 2.5 4 0 2-.8 3.6-2 4.3-.9.5-1.9 0-2.2-1-.3-1-.4-2.4-.3-3.8C13.6 3.5 14.1 2 15.5 2Zm3 10.5c1.3 0 2.3 1.1 2.3 2.6 0 1.2-.5 2.3-1.4 3.4-.7.9-2 .8-2.6-.2-.5-.9-.6-2-.5-3.2.1-1.4.8-2.6 2.2-2.6Z"/></svg>'
  };

  // --- Pangkalan jawapan (rule-based) ----------------------------------
  // Setiap topik: teks jawapan (HTML terhad) + cadangan chip susulan.
  var TOPICS = {
    daftar: {
      chip: 'Cara daftar akaun',
      answer:
        'Untuk <b>daftar akaun</b>:<br>' +
        '1) Klik butang <b>“Daftar Percuma”</b> di penjuru atas kanan.<br>' +
        '2) Pilih jenis akaun — <b>Saringan Anak</b> (ada anak + soal selidik) atau <b>e-Pembelajaran sahaja</b>.<br>' +
        '3) Isi nama, e-mel, no. telefon &amp; kata laluan. Akaun saringan perlu isi maklumat keluarga &amp; daerah.<br>' +
        '4) Sahkan melalui <b>kod OTP</b> (dipaparkan sebagai kod demo).<br>' +
        'Selepas itu anda terus ke Dashboard (saringan) atau Pusat Pendidikan.',
      links: [{ label: 'Pergi ke Daftar', href: 'daftar.html' }],
      follow: ['saringan', 'epembelajaran']
    },
    saringan: {
      chip: 'Cara buat saringan',
      answer:
        'Untuk <b>buat saringan perkembangan</b>:<br>' +
        '1) Log masuk, kemudian tambah anak di <b>Dashboard</b> (nama, tarikh lahir, jantina).<br>' +
        '2) Buka halaman <b>Saringan</b> dan pilih anak.<br>' +
        '3) Pilih mod: <b>Perkembangan (5 domain)</b>, <b>M-CHAT (risiko autisme)</b> atau <b>Sensori</b>.<br>' +
        '4) Jawab soalan mengikut umur anak, kemudian klik <b>Hantar</b>.<br>' +
        'Keputusan &amp; cadangan langkah seterusnya akan dipaparkan serta-merta.',
      links: [{ label: 'Mula Saringan', href: 'saringan.html' }],
      follow: ['mchat', 'daftar']
    },
    mchat: {
      chip: 'Apa itu M-CHAT / risiko autisme?',
      answer:
        '<b>M-CHAT</b> (Modified Checklist for Autism in Toddlers) ialah senarai semak ringkas ' +
        'untuk mengesan <b>tanda awal risiko autisme</b> pada kanak-kanak kecil (kira-kira 16–30 bulan).<br>' +
        'Dalam sistem ini, mod M-CHAT memberi anggaran <b>peratus risiko</b> serta band ' +
        '<b>rendah / sederhana / tinggi</b>.<br>' +
        '<b>Penting:</b> ini hanyalah <b>saringan awal</b>, <u>bukan diagnosis</u>. Jika risiko sederhana/tinggi, ' +
        'sila rujuk klinik kesihatan atau pakar pediatrik untuk penilaian lanjut.',
      links: [{ label: 'Cuba mod M-CHAT', href: 'saringan.html' }],
      follow: ['saringan', 'hubungi']
    },
    epembelajaran: {
      chip: 'Akaun e-Pembelajaran sahaja',
      answer:
        'Akaun <b>e-Pembelajaran sahaja</b> sesuai untuk pendidik, penjaga atau sesiapa yang ingin ' +
        'akses bahan pembelajaran <b>tanpa</b> mendaftar anak atau membuat soal selidik saringan.<br>' +
        'Anda boleh membaca artikel perkembangan, tips keibubapaan, aktiviti di rumah dan menonton ' +
        'video pembelajaran di <b>Pusat Pendidikan</b>.<br>' +
        'Semasa daftar, cuma pilih pilihan <b>“Daftar untuk e-Pembelajaran sahaja (tanpa saringan anak)”</b>.',
      links: [{ label: 'Pusat Pendidikan', href: 'pendidikan.html' }, { label: 'Daftar', href: 'daftar.html' }],
      follow: ['daftar', 'saringan']
    },
    hubungi: {
      chip: 'Cara hubungi kami',
      answer:
        'Anda boleh <b>hubungi kami</b> melalui:<br>' +
        '☎️ Telefon: <b>04-653 0000</b> (Akses 24 jam · Percuma)<br>' +
        '✉️ E-mel: <b>bantuan@ejejakanak.my</b><br>' +
        '📍 Alamat: Tingkat 1, Kota Kenangan, PT 2499, Jalan Hospital, 15200 Kota Bharu, Kelantan.<br>' +
        'Untuk kecemasan perubatan, sila terus ke klinik kesihatan atau hospital terdekat.',
      links: [{ label: 'E-mel kami', href: 'mailto:bantuan@ejejakanak.my' }],
      follow: ['daftar', 'saringan']
    }
  };

  // Susunan chip utama pada mesej pembuka
  var MAIN_ORDER = ['daftar', 'saringan', 'mchat', 'epembelajaran', 'hubungi'];

  // Padanan kata kunci untuk taipan bebas (rule-based mudah)
  var KEYWORDS = [
    { key: 'mchat', words: ['m-chat', 'mchat', 'autis', 'autism', 'risiko'] },
    { key: 'daftar', words: ['daftar', 'akaun', 'register', 'sign up', 'otp'] },
    { key: 'saringan', words: ['saring', 'screening', 'ujian', 'soal selidik', 'domain', 'sensori'] },
    { key: 'epembelajaran', words: ['pembelajaran', 'e-learning', 'elearning', 'pendidikan', 'artikel', 'belajar', 'knowledge'] },
    { key: 'hubungi', words: ['hubungi', 'contact', 'telefon', 'e-mel', 'email', 'alamat', 'bantuan'] }
  ];

  // --- Suntik gaya (fallback jika widgets.css belum muat semua) --------
  function injectStyle() {
    if (document.getElementById('ejejak-chatbot-style')) return;
    var css =
      '#ejejak-chatbot{position:fixed;right:calc(env(safe-area-inset-right,0px) + 18px);bottom:calc(env(safe-area-inset-bottom,0px) + 18px);z-index:9998;font-family:var(--font-body,inherit)}' +
      '.ejcb-fab{width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;background:var(--brand,#F51818);color:#fff;box-shadow:var(--shadow-lg,0 18px 48px rgba(11,79,108,.24));display:flex;align-items:center;justify-content:center;transition:transform .18s ease,box-shadow .18s ease}' +
      '.ejcb-fab:hover{transform:translateY(-2px) scale(1.04)}' +
      '.ejcb-fab svg{width:28px;height:28px}' +
      '.ejcb-fab .ejcb-badge{position:absolute;top:-2px;right:-2px;background:#fff;color:var(--brand,#F51818);font-size:11px;font-weight:800;line-height:1;padding:3px 6px;border-radius:20px;box-shadow:0 2px 6px rgba(0,0,0,.2)}' +
      '.ejcb-panel{position:absolute;right:0;bottom:74px;width:340px;max-width:calc(100vw - 32px);height:min(70vh,520px);background:var(--surface,#fff);border:1px solid var(--line,#E1E9EB);border-radius:16px;box-shadow:var(--shadow-lg,0 18px 48px rgba(11,79,108,.24));display:flex;flex-direction:column;overflow:hidden;transform-origin:bottom right;animation:ejcb-pop .18s ease}' +
      '@keyframes ejcb-pop{from{opacity:0;transform:translateY(8px) scale(.96)}to{opacity:1;transform:none}}' +
      '.ejcb-head{background:var(--brand,#F51818);color:#fff;padding:12px 14px;display:flex;align-items:center;gap:10px}' +
      '.ejcb-head .ejcb-avatar{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;flex:0 0 auto}' +
      '.ejcb-head .ejcb-avatar svg{width:20px;height:20px}' +
      '.ejcb-head b{display:block;font-size:var(--fs-md,15px);line-height:1.2}' +
      '.ejcb-head small{display:block;font-size:11px;opacity:.85}' +
      '.ejcb-head .ejcb-x{margin-left:auto;background:transparent;border:none;color:#fff;cursor:pointer;padding:4px;border-radius:8px;display:flex}' +
      '.ejcb-head .ejcb-x:hover{background:rgba(255,255,255,.16)}' +
      '.ejcb-head .ejcb-x svg{width:18px;height:18px}' +
      '.ejcb-body{flex:1;overflow-y:auto;padding:14px;background:var(--bg,#F6F9FA);display:flex;flex-direction:column;gap:10px}' +
      '.ejcb-msg{max-width:88%;padding:9px 12px;border-radius:14px;font-size:var(--fs-sm,13.5px);line-height:1.5;word-wrap:break-word}' +
      '.ejcb-msg.bot{align-self:flex-start;background:var(--surface,#fff);color:var(--ink,#16303A);border:1px solid var(--line,#E1E9EB);border-bottom-left-radius:4px}' +
      '.ejcb-msg.user{align-self:flex-end;background:var(--brand,#F51818);color:#fff;border-bottom-right-radius:4px}' +
      '.ejcb-msg a{color:inherit;font-weight:700;text-decoration:underline}' +
      '.ejcb-msg .ejcb-actions{margin-top:8px;display:flex;flex-wrap:wrap;gap:6px}' +
      '.ejcb-linkbtn{display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:700;padding:5px 10px;border-radius:20px;background:var(--brand,#F51818);color:#fff;text-decoration:none;border:none;cursor:pointer}' +
      '.ejcb-linkbtn:hover{filter:brightness(.94)}' +
      '.ejcb-chips{padding:10px 12px;border-top:1px solid var(--line,#E1E9EB);background:var(--surface,#fff);display:flex;flex-wrap:wrap;gap:6px}' +
      '.ejcb-chip{font-size:12px;font-weight:600;padding:6px 11px;border-radius:20px;border:1px solid var(--brand,#F51818);color:var(--brand,#F51818);background:transparent;cursor:pointer;transition:background .15s,color .15s;line-height:1.2}' +
      '.ejcb-chip:hover{background:var(--brand,#F51818);color:#fff}' +
      '.ejcb-input{display:flex;gap:6px;padding:10px 12px;border-top:1px solid var(--line,#E1E9EB);background:var(--surface,#fff)}' +
      '.ejcb-input input{flex:1;border:1px solid var(--line,#E1E9EB);border-radius:22px;padding:9px 12px;font-size:var(--fs-sm,13.5px);color:var(--ink,#16303A);background:var(--bg,#F6F9FA)}' +
      '.ejcb-input input:focus{outline:none;border-color:var(--brand,#F51818)}' +
      '.ejcb-input button{flex:0 0 auto;width:40px;border:none;border-radius:50%;background:var(--brand,#F51818);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}' +
      '.ejcb-input button svg{width:18px;height:18px}' +
      '.ejcb-note{font-size:11px;color:var(--muted,#6b7f86);text-align:center;padding:0 12px 8px;background:var(--surface,#fff)}' +
      '@media (max-width:420px){.ejcb-panel{height:min(74vh,540px)}}';
    var st = document.createElement('style');
    st.id = 'ejejak-chatbot-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  // --- Bina DOM --------------------------------------------------------
  var root, panel, body, chipsBar, inputEl;

  function el(tag, cls, html) {
    var d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html != null) d.innerHTML = html;
    return d;
  }

  function build() {
    root = el('div');
    root.id = 'ejejak-chatbot';

    // Butang terapung
    var fab = el('button', 'ejcb-fab');
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Buka pembantu maya e-Jejak Anak');
    fab.innerHTML = SVG.chat + '<span class="ejcb-badge">Tanya</span>';
    fab.addEventListener('click', toggle);

    // Panel
    panel = el('div', 'ejcb-panel');
    panel.style.display = 'none';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Pembantu maya e-Jejak Anak');

    var head = el('div', 'ejcb-head');
    head.innerHTML =
      '<span class="ejcb-avatar">' + SVG.footprint + '</span>' +
      '<span><b>Pembantu e-Jejak</b><small>Sedia membantu · (bot demo)</small></span>';
    var xbtn = el('button', 'ejcb-x');
    xbtn.type = 'button';
    xbtn.setAttribute('aria-label', 'Tutup');
    xbtn.innerHTML = SVG.close;
    xbtn.addEventListener('click', close);
    head.appendChild(xbtn);

    body = el('div', 'ejcb-body');

    chipsBar = el('div', 'ejcb-chips');

    var note = el('div', 'ejcb-note',
      'Jawapan automatik berdasarkan soalan lazim (simulasi/bot demo).');

    var inputWrap = el('div', 'ejcb-input');
    inputEl = el('input');
    inputEl.type = 'text';
    inputEl.placeholder = 'Taip soalan anda...';
    inputEl.setAttribute('aria-label', 'Taip soalan anda');
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submitInput(); }
    });
    var sendBtn = el('button');
    sendBtn.type = 'button';
    sendBtn.setAttribute('aria-label', 'Hantar');
    sendBtn.innerHTML = SVG.send;
    sendBtn.addEventListener('click', submitInput);
    inputWrap.appendChild(inputEl);
    inputWrap.appendChild(sendBtn);

    panel.appendChild(head);
    panel.appendChild(body);
    panel.appendChild(chipsBar);
    panel.appendChild(note);
    panel.appendChild(inputWrap);

    root.appendChild(panel);
    root.appendChild(fab);
    document.body.appendChild(root);
  }

  // --- Mesej & interaksi ----------------------------------------------
  function addBot(html, links) {
    var m = el('div', 'ejcb-msg bot', html);
    if (links && links.length) {
      var acts = el('div', 'ejcb-actions');
      links.forEach(function (l) {
        var a = document.createElement('a');
        a.className = 'ejcb-linkbtn';
        a.href = l.href;
        a.textContent = l.label;
        acts.appendChild(a);
      });
      m.appendChild(acts);
    }
    body.appendChild(m);
    scrollDown();
  }

  function addUser(text) {
    var m = el('div', 'ejcb-msg user');
    m.textContent = text;
    body.appendChild(m);
    scrollDown();
  }

  function scrollDown() {
    // beri sedikit masa untuk render
    setTimeout(function () { body.scrollTop = body.scrollHeight; }, 20);
  }

  function renderChips(keys) {
    chipsBar.innerHTML = '';
    (keys || MAIN_ORDER).forEach(function (k) {
      var t = TOPICS[k];
      if (!t) return;
      var c = el('button', 'ejcb-chip');
      c.type = 'button';
      c.textContent = t.chip;
      c.addEventListener('click', function () { askTopic(k, true); });
      chipsBar.appendChild(c);
    });
  }

  function askTopic(key, echoUser) {
    var t = TOPICS[key];
    if (!t) { fallback(); return; }
    if (echoUser) addUser(t.chip);
    // simulasi "menaip" ringkas
    setTimeout(function () {
      addBot(t.answer, t.links);
      renderChips(t.follow && t.follow.length ? t.follow : MAIN_ORDER);
    }, 260);
  }

  function fallback() {
    setTimeout(function () {
      addBot(
        'Maaf, saya pembantu ringkas (bot demo) dan mungkin tidak faham sepenuhnya. ' +
        'Sila pilih salah satu topik di bawah, atau hubungi kami terus.',
        [{ label: 'Hubungi Kami', href: 'mailto:bantuan@ejejakanak.my' }]
      );
      renderChips(MAIN_ORDER);
    }, 200);
  }

  function matchKeyword(text) {
    var t = (text || '').toLowerCase();
    for (var i = 0; i < KEYWORDS.length; i++) {
      var entry = KEYWORDS[i];
      for (var j = 0; j < entry.words.length; j++) {
        if (t.indexOf(entry.words[j]) !== -1) return entry.key;
      }
    }
    return null;
  }

  function submitInput() {
    var text = (inputEl.value || '').trim();
    if (!text) return;
    inputEl.value = '';
    addUser(text);
    var key = matchKeyword(text);
    if (key) { askTopic(key, false); }
    else { fallback(); }
  }

  var greeted = false;
  function greet() {
    if (greeted) return;
    greeted = true;
    addBot(
      'Hai! Saya <b>Pembantu e-Jejak</b> 👋 Saya boleh bantu anda dengan soalan lazim tentang ' +
      'pendaftaran, saringan perkembangan, dan banyak lagi. Pilih topik di bawah atau taip soalan anda.'
    );
    renderChips(MAIN_ORDER);
  }

  // --- Buka / tutup ----------------------------------------------------
  function isOpen() { return panel && panel.style.display !== 'none'; }

  function open() {
    if (!panel) return;
    panel.style.display = 'flex';
    greet();
    try { sessionStorage.setItem(OPEN_KEY, '1'); } catch (e) {}
    setTimeout(function () { if (inputEl) inputEl.focus(); }, 120);
  }

  function close() {
    if (!panel) return;
    panel.style.display = 'none';
    try { sessionStorage.setItem(OPEN_KEY, '0'); } catch (e) {}
  }

  function toggle() { isOpen() ? close() : open(); }

  // --- Init ------------------------------------------------------------
  try {
    injectStyle();
    build();
    // Kekalkan keadaan buka merentas navigasi dalam sesi yang sama
    var wasOpen = false;
    try { wasOpen = sessionStorage.getItem(OPEN_KEY) === '1'; } catch (e) {}
    if (wasOpen) open();
  } catch (e) {
    // Gagal senyap — jangan patahkan halaman
    if (window && window.console) console.warn('[chatbot] init gagal:', e);
  }
})();
