/* =====================================================================
 * mba-report.js — Direktori NGO / MBA + Laporan ANALISA (mockup)
 * ---------------------------------------------------------------------
 * - IIFE, runs immediately (injected at end of DOMContentLoaded by main.js
 *   on the admin page only).
 * - GUARDS on #mba-report-root. No-op safely on any other page.
 * - CRUD direktori NGO disimpan dalam localStorage key `ejejak_mba`
 *   melalui borang #mba-form (#mba-name/#mba-category/#mba-area/
 *   #mba-contact/#mba-desc/#mba-featured) dirender bawah #mba-admin.
 * - Seed 4 contoh NGO Kelantan jika `ejejak_mba` kosong.
 * - Laporan ANALISA dalam #mba-report-root: jumlah, bilangan featured,
 *   bar penglibatan mengikut kategori & kawasan. Guna window.drawBarChart /
 *   window.drawDonut jika ada; jika tidak, guna bar CSS .progress-bar.
 * - Guna semula gaya .card / .mini-stat / .dscore / .chip / .notice / .btn.
 * - Semua data mock (tiada backend) — nota "(demo/simulasi)" dipaparkan.
 * ===================================================================== */
(function () {
  'use strict';

  try {
    var reportRoot = document.getElementById('mba-report-root');
    if (!reportRoot) return; // guard: hanya halaman admin (tab NGO / MBA)

    var LS_KEY = 'ejejak_mba';

    /* ---- Helper localStorage (guna global jika ada, jika tidak fallback) --- */
    function readLS(key, fb) {
      if (typeof window.read === 'function') { try { return window.read(key, fb); } catch (e) {} }
      if (typeof read === 'function') { try { return read(key, fb); } catch (e) {} }
      try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fb : v; }
      catch (e) { return fb; }
    }
    function writeLS(key, v) {
      if (typeof window.write === 'function') { try { return window.write(key, v); } catch (e) {} }
      if (typeof write === 'function') { try { return write(key, v); } catch (e) {} }
      try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {}
    }

    /* ---- Ikon (guna set ICONS global jika ada) ------------------------- */
    var IC = (typeof ICONS !== 'undefined' && ICONS) ? ICONS :
             (window.ICONS || {});
    function ic(name) { return IC[name] || ''; }

    /* ---- Warna jenama (guna cssVar global jika ada) -------------------- */
    function brandColor(name, fb) {
      try {
        if (typeof cssVar === 'function') { var v = cssVar(name); if (v) return v; }
      } catch (e) {}
      try {
        var c = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        if (c) return c;
      } catch (e) {}
      return fb;
    }

    /* ---- Escape teks pengguna (elak suntikan HTML) --------------------- */
    function esc(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    /* ---- Senarai daerah Kelantan (untuk cadangan kawasan) -------------- */
    var DISTRICTS = ['Kota Bharu', 'Pasir Mas', 'Tumpat', 'Pasir Puteh', 'Bachok',
      'Machang', 'Tanah Merah', 'Kuala Krai', 'Gua Musang', 'Jeli'];

    /* ---- Kategori NGO (dropdown) -------------------------------------- */
    var CATEGORIES = [
      'Intervensi Awal',
      'Autisme & OKU',
      'Kebajikan Kanak-kanak',
      'Pendidikan & Literasi',
      'Kesihatan Keluarga',
      'Komuniti & Sukarelawan'
    ];

    /* ------------------------------------------------------------------
     * Seed 4 contoh NGO Kelantan jika stor kosong.
     * Struktur: {id,name,category,area,contact,desc,featured,slots,engaged}
     *  - slots   = bilangan kekosongan program / ruang kerjasama
     *  - engaged = metrik penglibatan (bilangan keluarga dilibatkan) — demo
     * ------------------------------------------------------------------ */
    function seedIfEmpty() {
      var cur = readLS(LS_KEY, null);
      if (Array.isArray(cur) && cur.length) return cur;
      var seed = [
        {
          id: 'MBA1', name: 'Pertubuhan Kebajikan Anak Istimewa Kelantan (PKAIK)',
          category: 'Autisme & OKU', area: 'Kota Bharu',
          contact: '09-741 2200 / pkaik@demo.my',
          desc: 'Sokongan keluarga anak autisme & OKU: terapi carakerja, kelas kemahiran sosial dan bimbingan ibu bapa.',
          featured: true, slots: 12, engaged: 148
        },
        {
          id: 'MBA2', name: 'Kelab Intervensi Awal Darul Naim',
          category: 'Intervensi Awal', area: 'Pasir Mas',
          contact: '09-790 5511 / intervensi.dn@demo.my',
          desc: 'Program stimulasi perkembangan 0–6 tahun, saringan komuniti dan rujukan ke klinik kesihatan.',
          featured: true, slots: 8, engaged: 96
        },
        {
          id: 'MBA3', name: 'Yayasan Literasi Ceria Tumpat',
          category: 'Pendidikan & Literasi', area: 'Tumpat',
          contact: '09-725 3040 / literasiceria@demo.my',
          desc: 'Taman bacaan komuniti & bengkel keibubapaan galak membaca untuk kanak-kanak prasekolah.',
          featured: false, slots: 20, engaged: 54
        },
        {
          id: 'MBA4', name: 'Sukarelawan Sihat Keluarga Gua Musang',
          category: 'Kesihatan Keluarga', area: 'Gua Musang',
          contact: '09-912 1188 / sihatkeluarga.gm@demo.my',
          desc: 'Klinik bergerak pedalaman, pemantauan tumbesaran dan pemakanan ibu & anak di kawasan luar bandar.',
          featured: false, slots: 6, engaged: 37
        }
      ];
      writeLS(LS_KEY, seed);
      return seed;
    }

    function getMba() {
      var v = readLS(LS_KEY, []);
      return Array.isArray(v) ? v : [];
    }
    function setMba(list) { writeLS(LS_KEY, list); }

    /* ------------------------------------------------------------------
     * Kira agregat mengikut satu medan (category / area).
     * Pulangkan tersusun menurun ikut penglibatan.
     * ------------------------------------------------------------------ */
    function aggregateBy(list, field) {
      var map = {};
      list.forEach(function (n) {
        var k = (n[field] || 'Lain-lain');
        if (!map[k]) map[k] = { key: k, count: 0, engaged: 0, slots: 0, featured: 0 };
        map[k].count += 1;
        map[k].engaged += Number(n.engaged) || 0;
        map[k].slots += Number(n.slots) || 0;
        if (n.featured) map[k].featured += 1;
      });
      return Object.keys(map).map(function (k) { return map[k]; })
        .sort(function (a, b) { return b.engaged - a.engaged; });
    }

    /* Palet warna untuk segmen carta. */
    var PALETTE = ['#12718A', '#7C6BB0', '#E0913C', '#D06B7A', '#4FA96A',
      '#2A9D8F', '#5B7FB5', '#C77DB0', '#B08A3C', '#6BA0B0'];

    /* ------------------------------------------------------------------
     * Render bar penglibatan. Cuba canvas (drawBarChart) dahulu; jika
     * helper tiada, fallback ke bar CSS .progress-bar / .dscore.
     * ------------------------------------------------------------------ */
    function renderEngagementBlock(titleText, canvasId, rows) {
      var maxEng = rows.reduce(function (m, r) { return Math.max(m, r.engaged); }, 0);
      var hasCanvas = (typeof window.drawBarChart === 'function') ||
                      (typeof drawBarChart === 'function');

      var cssBars = rows.map(function (r, i) {
        var pct = maxEng ? Math.round(r.engaged / maxEng * 100) : 0;
        var col = PALETTE[i % PALETTE.length];
        return '<div class="dscore" style="--dc:' + col + '">' +
          '<div class="dscore__label"><span class="dot"></span>' + esc(r.key) +
          ' <span class="chip" style="padding:.05em .5em; font-size:.68rem">' + r.count + ' NGO</span></div>' +
          '<div class="progress-bar"><span style="width:' + pct + '%"></span></div>' +
          '<div class="dscore__pct tnum">' + r.engaged + '</div></div>';
      }).join('');

      var body;
      if (!rows.length) {
        body = '<div class="notice">' + ic('info') + '<span>Tiada data untuk paparan ini.</span></div>';
      } else if (hasCanvas) {
        // Canvas + legenda ringkas di bawah.
        body =
          '<canvas id="' + canvasId + '" style="width:100%; height:220px; display:block"></canvas>' +
          '<div class="flex gap-2 wrap" style="margin-top:8px">' +
            rows.map(function (r, i) {
              return '<span class="chip"><span class="dot" style="background:' +
                PALETTE[i % PALETTE.length] + '; display:inline-block; width:9px; height:9px; border-radius:50%; margin-right:5px"></span>' +
                esc(r.key) + ' · ' + r.engaged + '</span>';
            }).join('') +
          '</div>';
      } else {
        body = cssBars;
      }

      return '<div class="card">' +
        '<h4 style="font-family:var(--font-head); margin:0 0 var(--sp-2)">' + esc(titleText) + '</h4>' +
        body +
        '</div>';
    }

    /* ------------------------------------------------------------------
     * Render keseluruhan laporan ANALISA ke dalam #mba-report-root.
     * ------------------------------------------------------------------ */
    function renderReport() {
      var list = getMba();
      var total = list.length;
      var featured = list.filter(function (n) { return n.featured; }).length;
      var totalEngaged = list.reduce(function (a, n) { return a + (Number(n.engaged) || 0); }, 0);
      var totalSlots = list.reduce(function (a, n) { return a + (Number(n.slots) || 0); }, 0);
      var catCount = aggregateBy(list, 'category').length;
      var areaCount = aggregateBy(list, 'area').length;

      var byCat = aggregateBy(list, 'category');
      var byArea = aggregateBy(list, 'area');

      var stats = [
        ['Jumlah NGO', total, 'rakan berdaftar'],
        ['NGO Pilihan', featured, 'dipaparkan di laman utama'],
        ['Keluarga Dilibatkan', totalEngaged, 'jumlah penglibatan (demo)'],
        ['Ruang Kerjasama', totalSlots, 'kekosongan program'],
        ['Kategori', catCount, 'bidang perkhidmatan'],
        ['Kawasan Diliputi', areaCount, 'daerah Kelantan']
      ];

      reportRoot.innerHTML =
        '<div class="section-head" style="margin-bottom:var(--sp-3)">' +
          '<span class="eyebrow">Analisa Rakan Komuniti</span>' +
          '<h3 style="font-family:var(--font-head); margin:2px 0 0">Laporan NGO / MBA</h3>' +
          '<p class="muted" style="margin:4px 0 0; font-size:var(--fs-sm)">Ringkasan penglibatan rakan NGO mengikut kategori & kawasan. ' +
          '<em>(demo/simulasi — metrik penglibatan adalah data contoh)</em></p>' +
        '</div>' +

        // Kad mini-stat
        '<div class="grid" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:var(--sp-3); margin-bottom:var(--sp-4)" id="mba-stat-cards">' +
          stats.map(function (row) {
            return '<div class="card"><div class="mini-stat"><b class="tnum">' + row[1] + '</b><span>' + row[0] + '</span></div>' +
              '<p class="muted" style="font-size:var(--fs-xs); margin:4px 0 0">' + row[2] + '</p></div>';
          }).join('') +
        '</div>' +

        // Dua blok bar penglibatan
        '<div class="grid" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:var(--sp-3)">' +
          renderEngagementBlock('Penglibatan mengikut Kategori', 'mba-chart-cat', byCat) +
          renderEngagementBlock('Penglibatan mengikut Kawasan', 'mba-chart-area', byArea) +
        '</div>';

      // Lukis carta canvas jika helper ada (selepas DOM canvas wujud).
      var drawer = (typeof window.drawBarChart === 'function') ? window.drawBarChart :
                   (typeof drawBarChart === 'function' ? drawBarChart : null);
      if (drawer) {
        var brand = brandColor('--brand', '#12718A');
        var accent = brandColor('--dom-motor-halus', '#7C6BB0');
        var catCanvas = document.getElementById('mba-chart-cat');
        var areaCanvas = document.getElementById('mba-chart-area');
        try {
          if (catCanvas && byCat.length) {
            drawer(catCanvas, byCat.map(function (r) { return shortLabel(r.key); }),
              byCat.map(function (r) { return r.engaged; }), brand);
          }
          if (areaCanvas && byArea.length) {
            drawer(areaCanvas, byArea.map(function (r) { return shortLabel(r.key); }),
              byArea.map(function (r) { return r.engaged; }), accent);
          }
        } catch (e) { /* biar fallback visual kekal */ }
      }
    }

    /* Label pendek untuk paksi carta (elak teks panjang bertindih). */
    function shortLabel(s) {
      s = String(s || '');
      return s.length > 12 ? s.slice(0, 11) + '…' : s;
    }

    /* ------------------------------------------------------------------
     * Bina UI admin direktori (borang #mba-form + senarai) dalam #mba-admin.
     * Jika #mba-form / #mba-admin tiada dalam HTML, kita cipta sendiri.
     * ------------------------------------------------------------------ */
    var editId = null;

    function ensureAdminScaffold() {
      var admin = document.getElementById('mba-admin');
      if (!admin) return null;

      // Jika borang belum wujud dalam HTML, bina sendiri (kekal ikut kontrak id).
      if (!document.getElementById('mba-form')) {
        admin.innerHTML =
          '<div class="section-head" style="margin:var(--sp-4) 0 var(--sp-3)">' +
            '<span class="eyebrow">Direktori</span>' +
            '<h3 style="font-family:var(--font-head); margin:2px 0 0">Urus NGO / MBA</h3>' +
            '<p class="muted" style="margin:4px 0 0; font-size:var(--fs-sm)">Tambah, sunting atau padam rakan NGO. NGO bertanda <b>Pilihan</b> dipaparkan di laman awam <code>mba.html</code>.</p>' +
          '</div>' +
          '<div class="grid" style="display:grid; grid-template-columns:minmax(260px,340px) 1fr; gap:var(--sp-4); align-items:start">' +
            // Borang
            '<form id="mba-form" class="card" style="display:flex; flex-direction:column; gap:var(--sp-3)">' +
              '<strong id="mba-form-title" style="font-family:var(--font-head)">Tambah NGO</strong>' +
              '<label class="field"><span>Nama NGO</span>' +
                '<input id="mba-name" class="input" type="text" placeholder="cth. Pertubuhan Kebajikan…" required></label>' +
              '<label class="field"><span>Kategori</span>' +
                '<select id="mba-category" class="select" required>' +
                  '<option value="">— Pilih kategori —</option>' +
                  CATEGORIES.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('') +
                '</select></label>' +
              '<label class="field"><span>Kawasan (Daerah)</span>' +
                '<input id="mba-area" class="input" type="text" list="mba-area-list" placeholder="cth. Kota Bharu" required>' +
                '<datalist id="mba-area-list">' +
                  DISTRICTS.map(function (d) { return '<option value="' + esc(d) + '"></option>'; }).join('') +
                '</datalist></label>' +
              '<label class="field"><span>Hubungan</span>' +
                '<input id="mba-contact" class="input" type="text" placeholder="Telefon / e-mel"></label>' +
              '<label class="field"><span>Keterangan</span>' +
                '<textarea id="mba-desc" class="input" rows="3" placeholder="Perkhidmatan / program utama NGO ini"></textarea></label>' +
              '<label class="flex items-center gap-2" style="cursor:pointer">' +
                '<input id="mba-featured" type="checkbox"> <span>Jadikan NGO Pilihan (papar di laman utama)</span></label>' +
              '<div class="flex gap-2">' +
                '<button type="submit" class="btn">' + ic('plus') + '<span>Simpan</span></button>' +
                '<button type="button" id="mba-reset" class="btn btn--ghost">Set Semula</button>' +
              '</div>' +
              '<p class="muted" style="font-size:var(--fs-xs); margin:0">Metrik penglibatan dijana automatik untuk NGO baharu <em>(demo)</em>.</p>' +
            '</form>' +
            // Senarai
            '<div id="mba-list"></div>' +
          '</div>';
      } else if (!document.getElementById('mba-list')) {
        // Borang disediakan dalam HTML tetapi tiada bekas senarai — tambah satu.
        var listHost = document.createElement('div');
        listHost.id = 'mba-list';
        admin.appendChild(listHost);
      }
      return admin;
    }

    function renderList() {
      var listEl = document.getElementById('mba-list');
      if (!listEl) return;
      var list = getMba();
      if (!list.length) {
        listEl.innerHTML = '<div class="notice">' + ic('info') +
          '<span>Tiada NGO dalam direktori. Tambah menggunakan borang di sebelah.</span></div>';
        return;
      }
      listEl.innerHTML = list.map(function (n) {
        return '<div class="card flex items-center gap-3" style="justify-content:space-between; margin-bottom:var(--sp-3)">' +
          '<div style="min-width:0">' +
            '<span class="chip chip--accent">' + esc(n.category || 'Lain-lain') + '</span> ' +
            '<span class="chip">' + ic('pin') + ' ' + esc(n.area || '-') + '</span>' +
            (n.featured ? ' <span class="chip">' + ic('star') + ' Pilihan</span>' : '') +
            '<strong style="display:block; font-family:var(--font-head); margin-top:6px">' + esc(n.name) + '</strong>' +
            '<span class="muted" style="font-size:var(--fs-xs); display:block">' + esc((n.desc || '').slice(0, 110)) + ((n.desc || '').length > 110 ? '…' : '') + '</span>' +
            '<div class="flex gap-2 wrap" style="margin-top:6px">' +
              '<span class="chip" style="font-size:.68rem">' + (Number(n.engaged) || 0) + ' keluarga dilibatkan</span>' +
              '<span class="chip" style="font-size:.68rem">' + (Number(n.slots) || 0) + ' ruang</span>' +
              (n.contact ? '<span class="chip" style="font-size:.68rem">' + esc(n.contact) + '</span>' : '') +
            '</div>' +
          '</div>' +
          '<div class="flex gap-2" style="flex:none; align-items:center">' +
            '<button class="btn btn--ghost" data-mba-feat="' + esc(n.id) + '" style="padding:.35em .6em" title="' + (n.featured ? 'Nyahpilih' : 'Jadikan Pilihan') + '">' + ic('star') + '</button>' +
            '<button class="btn btn--ghost" data-mba-edit="' + esc(n.id) + '" style="padding:.35em .6em" title="Sunting">' + ic('edit') + '</button>' +
            '<button class="btn btn--ghost" data-mba-del="' + esc(n.id) + '" style="padding:.35em .6em" title="Padam">' + ic('trash') + '</button>' +
          '</div>' +
        '</div>';
      }).join('');

      listEl.querySelectorAll('[data-mba-feat]').forEach(function (b) {
        b.addEventListener('click', function () {
          var arr = getMba(); var n = arr.find(function (x) { return x.id === b.dataset.mbaFeat; });
          if (n) { n.featured = !n.featured; setMba(arr); refresh(); }
        });
      });
      listEl.querySelectorAll('[data-mba-edit]').forEach(function (b) {
        b.addEventListener('click', function () {
          var n = getMba().find(function (x) { return x.id === b.dataset.mbaEdit; });
          if (!n) return;
          editId = n.id;
          setVal('mba-name', n.name);
          setVal('mba-category', n.category);
          setVal('mba-area', n.area);
          setVal('mba-contact', n.contact);
          setVal('mba-desc', n.desc);
          var f = document.getElementById('mba-featured'); if (f) f.checked = !!n.featured;
          var t = document.getElementById('mba-form-title'); if (t) t.textContent = 'Sunting NGO';
          var form = document.getElementById('mba-form'); if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      });
      listEl.querySelectorAll('[data-mba-del]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (!window.confirm('Padam NGO ini dari direktori?')) return;
          setMba(getMba().filter(function (x) { return x.id !== b.dataset.mbaDel; }));
          if (editId === b.dataset.mbaDel) resetForm();
          refresh();
        });
      });
    }

    function setVal(id, v) { var el = document.getElementById(id); if (el) el.value = (v == null ? '' : v); }
    function getVal(id) {
      var el = document.getElementById(id);
      return el ? (el.value || '').trim() : '';
    }

    function resetForm() {
      editId = null;
      var form = document.getElementById('mba-form');
      if (form) form.reset();
      var t = document.getElementById('mba-form-title'); if (t) t.textContent = 'Tambah NGO';
    }

    function wireForm() {
      var form = document.getElementById('mba-form');
      if (!form || form.__mbaWired) return;
      form.__mbaWired = true;

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = getVal('mba-name');
        var category = getVal('mba-category');
        var area = getVal('mba-area');
        var contact = getVal('mba-contact');
        var desc = getVal('mba-desc');
        var featured = !!(document.getElementById('mba-featured') && document.getElementById('mba-featured').checked);

        if (!name || !category || !area) {
          window.alert('Sila lengkapkan Nama, Kategori dan Kawasan.');
          return;
        }

        var arr = getMba();
        if (editId) {
          var n = arr.find(function (x) { return x.id === editId; });
          if (n) {
            n.name = name; n.category = category; n.area = area;
            n.contact = contact; n.desc = desc; n.featured = featured;
          }
        } else {
          arr.unshift({
            id: 'MBA' + Date.now(),
            name: name, category: category, area: area,
            contact: contact, desc: desc, featured: featured,
            // Metrik demo dijana automatik untuk NGO baharu.
            slots: 4 + Math.floor(Math.random() * 16),
            engaged: 10 + Math.floor(Math.random() * 90)
          });
        }
        setMba(arr);
        resetForm();
        refresh();
      });

      var resetBtn = document.getElementById('mba-reset');
      if (resetBtn) resetBtn.addEventListener('click', resetForm);
    }

    /* Render semula laporan + senarai (dipanggil selepas sebarang perubahan). */
    function refresh() {
      renderReport();
      renderList();
    }

    /* ------------------------------------------------------------------
     * Boot.
     * ------------------------------------------------------------------ */
    function boot() {
      seedIfEmpty();
      ensureAdminScaffold();
      wireForm();
      refresh();

      // Lukis semula carta canvas apabila saiz tetingkap berubah (responsif).
      var rt;
      window.addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(renderReport, 200);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  } catch (err) {
    if (window && window.console) console.warn('mba-report.js:', err);
  }
})();
