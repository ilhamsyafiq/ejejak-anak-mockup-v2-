/* ============================================================
   programs-blast.js  —  Modul PENTADBIR (admin.html)
   Tab "Program & E-mel Blast".
   - CRUD program dalam localStorage `ejejak_programs`
   - Simulasi e-mel blast jemputan kepada ibu bapa mengikut daerah,
     dilog ke `ejejak_blasts`.
   MOCK: tiada e-mel sebenar dihantar (simulasi sahaja).

   IIFE — dijalankan serta-merta selepas disuntik oleh module loader
   main.js. Semua fungsi GUARD pada kewujudan #program-list, jadi
   selamat dimuatkan pada mana-mana halaman (no-op jika elemen tiada).

   Bergantung pada pembantu global dari main.js: read/write, getUsers,
   fmtDate, ICONS.  Semua rujukan dilindungi dengan fallback.
   ============================================================ */
(function () {
  'use strict';

  // ---- Guard: hanya jalan bila markup tab-program hadir --------------
  var listEl = document.getElementById('program-list');
  if (!listEl) return;                 // bukan halaman admin / tab tiada
  if (listEl.dataset.pbInit === '1') return; // elak double-init
  listEl.dataset.pbInit = '1';

  // ---- Pembantu tempatan (guna global jika ada, fallback jika tidak) --
  var LS_PROGRAMS = 'ejejak_programs';
  var LS_BLASTS = 'ejejak_blasts';

  function lsRead(key, fb) {
    if (typeof window.read === 'function') return window.read(key, fb);
    try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fb : v; }
    catch (e) { return fb; }
  }
  function lsWrite(key, v) {
    if (typeof window.write === 'function') return window.write(key, v);
    localStorage.setItem(key, JSON.stringify(v));
  }
  function users() {
    if (typeof window.getUsers === 'function') return window.getUsers() || [];
    return lsRead('ejejak_users', []);
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function uid(prefix) {
    return (prefix || 'PG') + '-' + Date.now().toString(36) + '-' +
      Math.random().toString(36).slice(2, 6);
  }
  // Tarikh & masa penuh (log blast) — guna fmtDate global jika ada.
  function stamp(iso) {
    if (typeof window.fmtDate === 'function') return window.fmtDate(iso);
    try { return new Date(iso).toLocaleString('ms-MY'); } catch (e) { return iso; }
  }
  // Tarikh sahaja (kad program).
  function dateOnly(iso) {
    if (!iso) return 'Tiada tarikh';
    try {
      return new Date(iso + 'T00:00:00').toLocaleDateString('ms-MY',
        { day: '2-digit', month: 'long', year: 'numeric' });
    } catch (e) { return iso; }
  }
  var ico = (window.ICONS || {});

  // ---- Kelantan (rujukan; label sasaran program) ---------------------
  var DISTRICTS = ['Kota Bharu', 'Pasir Mas', 'Tumpat', 'Pasir Puteh', 'Bachok',
    'Machang', 'Tanah Merah', 'Kuala Krai', 'Gua Musang', 'Jeli'];

  /* --------------------------------------------------------------
     Pengiraan penerima: ibu bapa saringan (accountType 'screening'
     atau lama tanpa accountType) yang mempunyai daerah sepadan.
     Akaun 'knowledge' (e-pembelajaran) tiada daerah → tidak dikira.
     'semua' = semua ibu bapa saringan yang ada daerah.
     -------------------------------------------------------------- */
  function eligibleRecipients(districtFilter) {
    return users().filter(function (u) {
      if (!u) return false;
      var role = u.role || 'parent';
      if (role !== 'parent') return false;                 // staf tidak dijemput
      var acct = u.accountType || 'screening';
      if (acct === 'knowledge') return false;              // e-learning: tiada anak
      var d = u.district || '';
      if (!d) return false;                                // tanpa daerah, tak boleh sasar
      if (!districtFilter || districtFilter === 'semua') return true;
      return d === districtFilter;
    });
  }

  // Padankan senarai daerah program → teks ringkas untuk kad.
  function districtsLabel(ds) {
    if (!ds || ds === 'semua' || (Array.isArray(ds) && ds.length === 0)) {
      return 'Semua daerah';
    }
    if (Array.isArray(ds)) return ds.join(', ');
    return String(ds);
  }

  /* ==============================================================
     BAHAGIAN 1 — SENARAI + CRUD PROGRAM
     ============================================================== */
  function getPrograms() { return lsRead(LS_PROGRAMS, []); }
  function savePrograms(v) { lsWrite(LS_PROGRAMS, v); }

  function programCardHTML(p) {
    var recForAll = eligibleRecipients('semua').length; // anggaran keseluruhan
    return '' +
      '<div class="card" data-pid="' + esc(p.id) + '" style="padding:var(--sp-4)">' +
        '<div class="flex gap-2 wrap" style="justify-content:space-between; align-items:flex-start">' +
          '<div style="min-width:0">' +
            '<strong style="font-family:var(--font-head); font-size:var(--fs-md); display:block">' + esc(p.title) + '</strong>' +
            '<div class="muted prog-meta" style="font-size:var(--fs-sm); margin-top:4px; display:flex; gap:var(--sp-3); flex-wrap:wrap">' +
              '<span>' + (ico.clock || '') + ' ' + esc(dateOnly(p.date)) + '</span>' +
              '<span>' + (ico.pin || '') + ' ' + esc(p.location || 'Lokasi belum ditetapkan') + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="flex gap-1" style="flex-shrink:0">' +
            '<button class="btn btn--ghost" data-edit="' + esc(p.id) + '" title="Sunting" style="padding:.35em .6em">' + (ico.edit || 'Sunting') + '</button>' +
            '<button class="btn btn--ghost" data-del="' + esc(p.id) + '" title="Padam" style="padding:.35em .6em">' + (ico.trash || 'Padam') + '</button>' +
          '</div>' +
        '</div>' +
        (p.desc ? '<p class="muted" style="font-size:var(--fs-sm); margin:var(--sp-2) 0 0">' + esc(p.desc) + '</p>' : '') +
        '<div class="flex gap-1 wrap" style="margin-top:var(--sp-3)">' +
          '<span class="chip">' + esc(districtsLabel(p.districts)) + '</span>' +
          '<span class="chip" title="Anggaran ibu bapa saringan yang boleh dijemput">~' + recForAll + ' penerima berpotensi</span>' +
        '</div>' +
      '</div>';
  }

  function renderPrograms() {
    var progs = getPrograms();
    if (!progs.length) {
      listEl.innerHTML =
        '<div class="notice" style="grid-column:1/-1">' +
          (ico.info || '') +
          '<div><strong>Belum ada program.</strong><br>' +
          '<span class="muted">Cipta program pertama menggunakan borang di sebelah.</span></div>' +
        '</div>';
      return;
    }
    // Terkini di atas (susun ikut tarikh menurun, fallback susunan simpan).
    var sorted = progs.slice().sort(function (a, b) {
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
    listEl.innerHTML = sorted.map(programCardHTML).join('');
  }

  // ---- Borang cipta / sunting program --------------------------------
  var form = document.getElementById('program-form');
  var elTitle = document.getElementById('pg-title');
  var elDate = document.getElementById('pg-date');
  var elLoc = document.getElementById('pg-location');
  var elDesc = document.getElementById('pg-desc');
  var elDistricts = document.getElementById('pg-districts');
  var editingId = null;

  function selectedDistricts() {
    if (!elDistricts) return 'semua';
    var opts = Array.prototype.filter.call(elDistricts.options, function (o) { return o.selected; });
    var vals = opts.map(function (o) { return o.value; });
    // Kosong = semua daerah (ikut hint pada label borang).
    return vals.length ? vals : 'semua';
  }

  function resetForm() {
    editingId = null;
    if (form) form.reset();
    if (elDistricts) {
      Array.prototype.forEach.call(elDistricts.options, function (o) { o.selected = false; });
    }
    var submitBtn = form ? form.querySelector('[type="submit"]') : null;
    if (submitBtn) {
      submitBtn.innerHTML = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg> Simpan Program';
    }
  }

  function loadForEdit(id) {
    var p = getPrograms().filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    editingId = id;
    if (elTitle) elTitle.value = p.title || '';
    if (elDate) elDate.value = p.date || '';
    if (elLoc) elLoc.value = p.location || '';
    if (elDesc) elDesc.value = p.desc || '';
    if (elDistricts) {
      var set = Array.isArray(p.districts) ? p.districts : [];
      Array.prototype.forEach.call(elDistricts.options, function (o) {
        o.selected = set.indexOf(o.value) !== -1;
      });
    }
    var submitBtn = form ? form.querySelector('[type="submit"]') : null;
    if (submitBtn) {
      submitBtn.innerHTML = (ico.check || '') + ' Kemas Kini Program';
    }
    if (form && form.scrollIntoView) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var title = elTitle ? elTitle.value.trim() : '';
      if (!title) { if (elTitle) elTitle.focus(); return; }
      var payload = {
        title: title,
        date: elDate ? elDate.value : '',
        location: elLoc ? elLoc.value.trim() : '',
        desc: elDesc ? elDesc.value.trim() : '',
        districts: selectedDistricts()
      };
      var progs = getPrograms();
      if (editingId) {
        progs = progs.map(function (p) {
          return p.id === editingId ? Object.assign({}, p, payload) : p;
        });
      } else {
        payload.id = uid('PG');
        payload.createdAt = new Date().toISOString();
        progs.push(payload);
      }
      savePrograms(progs);
      resetForm();
      renderPrograms();
      refreshBlastCount();
    });
  }

  // Delegasi butang sunting / padam pada senarai.
  listEl.addEventListener('click', function (e) {
    var editBtn = e.target.closest ? e.target.closest('[data-edit]') : null;
    var delBtn = e.target.closest ? e.target.closest('[data-del]') : null;
    if (editBtn) { loadForEdit(editBtn.getAttribute('data-edit')); return; }
    if (delBtn) {
      var id = delBtn.getAttribute('data-del');
      var p = getPrograms().filter(function (x) { return x.id === id; })[0];
      if (window.confirm('Padam program "' + (p ? p.title : '') + '"?')) {
        savePrograms(getPrograms().filter(function (x) { return x.id !== id; }));
        if (editingId === id) resetForm();
        renderPrograms();
      }
    }
  });

  /* ==============================================================
     BAHAGIAN 2 — E-MEL BLAST (SIMULASI)
     ============================================================== */
  var blastRoot = document.getElementById('blast-root');
  var blastDistrict = document.getElementById('blast-district');
  var blastCount = document.getElementById('blast-count');
  var blastSend = document.getElementById('blast-send');
  var blastLog = document.getElementById('blast-log');

  function currentBlastDistrict() {
    return blastDistrict ? blastDistrict.value : 'semua';
  }

  function refreshBlastCount() {
    if (!blastCount) return;
    var n = eligibleRecipients(currentBlastDistrict()).length;
    blastCount.textContent = n;
    if (blastSend) {
      blastSend.disabled = n === 0;
      blastSend.style.opacity = n === 0 ? '.55' : '';
      blastSend.style.cursor = n === 0 ? 'not-allowed' : '';
    }
  }

  if (blastDistrict) {
    blastDistrict.addEventListener('change', refreshBlastCount);
  }

  function getBlasts() { return lsRead(LS_BLASTS, []); }
  function saveBlasts(v) { lsWrite(LS_BLASTS, v); }

  // Pilih program terkini sebagai subjek jemputan (jika ada).
  function subjectForBlast(district) {
    var progs = getPrograms().slice().sort(function (a, b) {
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
    var scope = district === 'semua' ? 'Semua Daerah' : district;
    if (progs.length) {
      return 'Jemputan: ' + progs[0].title + ' (' + scope + ')';
    }
    return 'Jemputan Program e-Jejak Anak (' + scope + ')';
  }

  function blastLogEntryHTML(b) {
    return '' +
      '<div class="notice" style="align-items:flex-start; margin-top:var(--sp-2)">' +
        (ico.check || ico.mail || '') +
        '<div style="min-width:0">' +
          '<strong>' + esc(b.subject) + '</strong><br>' +
          '<span class="muted" style="font-size:var(--fs-sm)">' +
            esc(b.count) + ' penerima · ' +
            'Daerah: ' + esc(b.audience === 'semua' ? 'Semua Daerah' : b.audience) + ' · ' +
            esc(stamp(b.at)) +
          '</span>' +
          '<div class="muted" style="font-size:var(--fs-xs); margin-top:4px; font-style:italic">' +
            'Simulasi — tiada e-mel sebenar dihantar.' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderBlastLog() {
    if (!blastLog) return;
    var logs = getBlasts().slice().sort(function (a, b) {
      return String(b.at || '').localeCompare(String(a.at || ''));
    });
    if (!logs.length) {
      blastLog.innerHTML =
        '<p class="muted" style="font-size:var(--fs-sm); margin-top:var(--sp-3)">' +
        'Belum ada penghantaran. Pilih daerah dan tekan "Hantar Blast (Simulasi)".</p>';
      return;
    }
    var header = '<h4 style="margin:var(--sp-4) 0 0">Log Penghantaran ' +
      '<span class="chip" style="margin-left:6px">' + logs.length + '</span></h4>';
    blastLog.innerHTML = header + logs.map(blastLogEntryHTML).join('');
  }

  if (blastSend) {
    blastSend.addEventListener('click', function () {
      var district = currentBlastDistrict();
      var recips = eligibleRecipients(district);
      if (!recips.length) return;      // guard: tiada penerima

      var subject = subjectForBlast(district);
      var progs = getPrograms().slice().sort(function (a, b) {
        return String(b.date || '').localeCompare(String(a.date || ''));
      });
      var entry = {
        id: uid('BL'),
        programId: progs.length ? progs[0].id : null,
        at: new Date().toISOString(),
        audience: district,
        count: recips.length,
        subject: subject
      };
      var logs = getBlasts();
      logs.push(entry);
      saveBlasts(logs);

      // Maklum balas simulasi ringkas pada butang.
      var original = blastSend.innerHTML;
      blastSend.disabled = true;
      blastSend.innerHTML = (ico.check || '') + ' Dihantar (simulasi) ke ' + recips.length + ' penerima';
      setTimeout(function () {
        blastSend.innerHTML = original;
        refreshBlastCount();
      }, 1800);

      renderBlastLog();
    });
  }

  /* ==============================================================
     INIT
     ============================================================== */
  renderPrograms();
  renderBlastLog();
  refreshBlastCount();
})();
