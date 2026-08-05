/* =====================================================================
   e-JEJAK ANAK — MODUL: Urus Setia / Kehadiran  (attendance.js)
   ---------------------------------------------------------------------
   IIFE modul yang dimuatkan oleh loader main.js pada body[data-page="admin"].
   Konsep aliran kerja:
     1) PENTADBIR menyediakan senarai jangkaan kehadiran LEBIH AWAL
        (pilih program → tambah nama/telefon/daerah) ke `ejejak_attendance`.
     2) URUS SETIA pada HARI PELANCARAN hanya menekan butang ✓ untuk
        menanda kehadiran (checkedIn + cap masa). Mereka tidak perlu
        menaip semula senarai.
   Guard: no-op jika #attendance-list tiada (mis. bukan halaman admin).
   Bergantung pada helper global main.js: read/write, ICONS.
   Rekod: ejejak_attendance = [{id,programId,name,phone,district,
                                 checkedIn:false, checkedAt:null}]
   Program: ejejak_programs = [{id,title,date,location,desc,districts}]
   ===================================================================== */
(function () {
  'use strict';

  var listHost = document.getElementById('attendance-list');
  if (!listHost) return; // Bukan halaman/panel yang betul — no-op selamat.

  // --- Sumber data (guna helper main.js jika ada; jika tidak, sandaran) ---
  function rd(key, fb) {
    if (typeof window.read === 'function') return window.read(key, fb);
    try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fb : v; }
    catch (e) { return fb; }
  }
  function wr(key, v) {
    if (typeof window.write === 'function') return window.write(key, v);
    localStorage.setItem(key, JSON.stringify(v));
  }

  var ICON = (typeof window.ICONS === 'object' && window.ICONS) ? window.ICONS : {};
  var I_CHECK = ICON.check || '✓';
  var I_PLUS  = ICON.plus  || '+';
  var I_TRASH = ICON.trash || '✕';
  var I_CLOCK = ICON.clock || '';
  var I_INFO  = ICON.info  || '';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function getAtt()  { return rd('ejejak_attendance', []); }
  function saveAtt(v){ wr('ejejak_attendance', v); }
  function getProgs(){ return rd('ejejak_programs', []); }

  function nowStamp() {
    try {
      return new Date().toLocaleString('ms-MY', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (e) { return new Date().toISOString(); }
  }
  function uid() { return 'AT' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  // --- Elemen kontrak (dibina oleh pemilik admin.html) ---
  var progSel   = document.getElementById('att-program');
  var addForm   = document.getElementById('att-add-form');
  var nameInput = document.getElementById('att-name');
  var phoneInput= document.getElementById('att-phone');
  var distInput = document.getElementById('att-district');
  var countHost = document.getElementById('att-count');

  var DISTRICTS = ['Kota Bharu','Pasir Mas','Tumpat','Pasir Puteh','Bachok','Machang','Tanah Merah','Kuala Krai','Gua Musang','Jeli'];

  // Isi dropdown daerah pada borang tambah jika masih kosong (elemen milik admin.html;
  // hanya menokok <option> jika belum diisi supaya tidak melanggar hak milik markup).
  if (distInput && distInput.tagName === 'SELECT' && distInput.options.length <= 1) {
    var dhtml = '<option value="">Daerah…</option>';
    DISTRICTS.forEach(function (d) { dhtml += '<option value="' + esc(d) + '">' + esc(d) + '</option>'; });
    distInput.innerHTML = dhtml;
  }

  // --- Pemilih program ---
  function fillProgramPicker() {
    if (!progSel) return;
    var progs = getProgs();
    var prev = progSel.value;
    if (!progs.length) {
      progSel.innerHTML = '<option value="">— Tiada program lagi —</option>';
      progSel.value = '';
      return;
    }
    progSel.innerHTML = progs.map(function (p) {
      var meta = [p.date, p.location].filter(Boolean).join(' · ');
      return '<option value="' + esc(p.id) + '">' + esc(p.title || 'Program') +
             (meta ? ' (' + esc(meta) + ')' : '') + '</option>';
    }).join('');
    // Kekalkan pilihan sebelum ini jika masih wujud.
    if (prev && progs.some(function (p) { return p.id === prev; })) progSel.value = prev;
  }

  function currentProgramId() { return progSel ? progSel.value : ''; }
  function currentProgram() {
    var id = currentProgramId();
    return getProgs().filter(function (p) { return p.id === id; })[0] || null;
  }

  // --- Render jadual semak kehadiran ---
  function render() {
    var pid = currentProgramId();
    var progs = getProgs();

    if (!progs.length) {
      listHost.innerHTML =
        '<div class="notice notice--warn">' + I_INFO +
        '<span>Belum ada program. Sila cipta program di tab <strong>“Program &amp; E-mel Blast”</strong> dahulu, kemudian kembali ke sini untuk menyediakan senarai jangkaan kehadiran.</span></div>';
      if (countHost) countHost.textContent = '';
      return;
    }

    var rows = getAtt().filter(function (a) { return a.programId === pid; });
    var hadir = rows.filter(function (a) { return a.checkedIn; }).length;
    var jumlah = rows.length;

    if (countHost) {
      countHost.innerHTML = jumlah
        ? '<span class="chip chip--ok">Hadir: ' + hadir + '</span> ' +
          '<span class="chip">Belum: ' + (jumlah - hadir) + '</span> ' +
          '<span class="chip chip--accent">Jumlah: ' + jumlah + '</span>'
        : '<span class="chip">Jumlah: 0</span>';
    }

    if (!jumlah) {
      listHost.innerHTML =
        '<div class="notice">' + I_INFO +
        '<span><strong>Pentadbir isi senarai lebih awal;</strong> urus setia hanya tanda kehadiran pada hari pelancaran. ' +
        'Gunakan borang di atas untuk menambah jangkaan kehadiran bagi program ini.</span></div>';
      return;
    }

    var body = rows.map(function (a, i) {
      var rowCls = a.checkedIn ? 'row-ok' : '';
      var btn = a.checkedIn
        ? '<button class="btn btn--ghost" data-undo="' + esc(a.id) + '" title="Batal tanda kehadiran" style="padding:.35em .7em">' + I_CHECK + ' Hadir</button>'
        : '<button class="btn" data-checkin="' + esc(a.id) + '" title="Tanda hadir" style="padding:.35em .7em">' + I_CHECK + ' Tanda Hadir</button>';
      var when = a.checkedIn && a.checkedAt
        ? '<span class="muted" style="white-space:nowrap; font-size:var(--fs-xs)">' + I_CLOCK + ' ' + esc(a.checkedAt) + '</span>'
        : '<span class="muted">—</span>';
      var statusChip = a.checkedIn
        ? '<span class="chip chip--ok">Hadir</span>'
        : '<span class="chip chip--warn">Belum</span>';
      return '<tr class="' + rowCls + '">' +
        '<td class="tnum muted">' + (i + 1) + '</td>' +
        '<td><strong>' + esc(a.name) + '</strong></td>' +
        '<td style="white-space:nowrap">' + esc(a.phone || '-') + '</td>' +
        '<td>' + esc(a.district || '-') + '</td>' +
        '<td>' + statusChip + '</td>' +
        '<td>' + when + '</td>' +
        '<td class="col-action"><div class="flex gap-2" style="justify-content:flex-end; flex-wrap:wrap">' +
          btn +
          '<button class="btn btn--ghost" data-del="' + esc(a.id) + '" title="Buang dari senarai" style="padding:.35em .55em">' + I_TRASH + '</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');

    listHost.innerHTML =
      '<div class="table-wrap"><table class="data"><thead><tr>' +
        '<th style="width:2.5em">#</th>' +
        '<th>Nama</th>' +
        '<th>Telefon</th>' +
        '<th>Daerah</th>' +
        '<th>Status</th>' +
        '<th>Masa Daftar Masuk</th>' +
        '<th style="text-align:right">Tindakan</th>' +
      '</tr></thead><tbody>' + body + '</tbody></table></div>';
  }

  // --- Tindakan (didelegasikan) ---
  listHost.addEventListener('click', function (e) {
    var t = e.target.closest('[data-checkin],[data-undo],[data-del]');
    if (!t) return;
    var all = getAtt();

    if (t.hasAttribute('data-checkin')) {
      var idIn = t.getAttribute('data-checkin');
      all.forEach(function (a) {
        if (a.id === idIn) { a.checkedIn = true; a.checkedAt = nowStamp(); }
      });
      saveAtt(all); render(); return;
    }
    if (t.hasAttribute('data-undo')) {
      var idU = t.getAttribute('data-undo');
      var rec = all.filter(function (a) { return a.id === idU; })[0];
      if (rec && !confirm('Batalkan tanda kehadiran untuk "' + rec.name + '"?')) return;
      all.forEach(function (a) {
        if (a.id === idU) { a.checkedIn = false; a.checkedAt = null; }
      });
      saveAtt(all); render(); return;
    }
    if (t.hasAttribute('data-del')) {
      var idD = t.getAttribute('data-del');
      var r = all.filter(function (a) { return a.id === idD; })[0];
      if (r && !confirm('Buang "' + r.name + '" daripada senarai kehadiran?')) return;
      saveAtt(all.filter(function (a) { return a.id !== idD; }));
      render(); return;
    }
  });

  // --- Borang tambah jangkaan kehadiran (pentadbir, lebih awal) ---
  if (addForm) {
    addForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var pid = currentProgramId();
      if (!pid) { alert('Sila pilih program dahulu sebelum menambah senarai kehadiran.'); return; }
      var name = nameInput ? nameInput.value.trim() : '';
      var phone = phoneInput ? phoneInput.value.trim() : '';
      var dist = distInput ? distInput.value.trim() : '';
      if (!name) { alert('Sila masukkan nama.'); if (nameInput) nameInput.focus(); return; }

      var all = getAtt();
      // Elak pendua nama+telefon dalam program yang sama.
      var dup = all.some(function (a) {
        return a.programId === pid && a.name.toLowerCase() === name.toLowerCase() &&
               (a.phone || '') === phone;
      });
      if (dup && !confirm('"' + name + '" nampaknya sudah ada dalam senarai program ini. Tambah juga?')) return;

      all.push({
        id: uid(), programId: pid, name: name, phone: phone, district: dist,
        checkedIn: false, checkedAt: null
      });
      saveAtt(all);
      addForm.reset();
      if (distInput && distInput.tagName === 'SELECT') distInput.value = '';
      if (nameInput) nameInput.focus();
      render();
    });
  }

  // --- Kemas kini bila program ditukar ---
  if (progSel) {
    progSel.addEventListener('change', render);
  }

  // --- Segar semula pemilih program bila tab dipapar (program mungkin dicipta
  //     oleh modul programs-blast selepas modul ini dimuatkan). ---
  document.addEventListener('click', function (e) {
    var tab = e.target.closest('[data-tab]');
    if (tab && (tab.getAttribute('data-tab') === 'urussetia' || tab.dataset.tab === 'urussetia')) {
      fillProgramPicker(); render();
    }
  });

  // --- Mula ---
  fillProgramPicker();
  render();

  // Dedah untuk penyegaran manual oleh modul lain jika perlu.
  window.refreshAttendance = function () { fillProgramPicker(); render(); };
})();
