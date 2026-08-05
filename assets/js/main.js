/* =====================================================================
   e-JEJAK ANAK — Skrip Template
   ---------------------------------------------------------------------
   MODEL DATA (localStorage) — dikongsi antara ibu bapa & panel doktor:
     ejejak_users        : akaun ibu bapa berdaftar
     ejejak_children     : profil anak (milik user)
     ejejak_domains      : domain perkembangan + soalan (doktor boleh tambah)
     ejejak_submissions  : keputusan saringan yang dihantar ke doktor
   SESI (sessionStorage):
     ejejak_user  : ibu bapa yang log masuk
     ejejak_admin : doktor yang log masuk
   Semua data ibu bapa (akaun, anak, saringan) SELARI dengan yang dilihat
   doktor kerana ia dibaca dari stor yang sama.
   ===================================================================== */

/* ---------- 1. IKON SVG (guna semula) ------------------------------- */
const ICONS = {
  footprint: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 2C6.9 2 6 3.7 6 6c0 2 .8 3.6 2 4.3.9.5 1.9 0 2.2-1 .3-1 .4-2.4.3-3.8C10.4 3.5 9.9 2 8.5 2Zm-3 10.5c-1.3 0-2.3 1.1-2.3 2.6 0 1.2.5 2.3 1.4 3.4.7.9 2 .8 2.6-.2.5-.9.6-2 .5-3.2-.1-1.4-.8-2.6-2.2-2.6Zm10-10.5c1.6 0 2.5 1.7 2.5 4 0 2-.8 3.6-2 4.3-.9.5-1.9 0-2.2-1-.3-1-.4-2.4-.3-3.8C13.6 3.5 14.1 2 15.5 2Zm3 10.5c1.3 0 2.3 1.1 2.3 2.6 0 1.2-.5 2.3-1.4 3.4-.7.9-2 .8-2.6-.2-.5-.9-.6-2-.5-3.2.1-1.4.8-2.6 2.2-2.6Z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  motorKasar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="2"/><path d="m8 21 2.5-5 3-2-1-4 4 3 3 1"/><path d="M8.5 12 5 10l2-3 4 1 2 3"/></svg>',
  motorHalus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>',
  bahasa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/></svg>',
  sosial: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  kognitif: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a5 5 0 0 0-5 5c0 1.5-1 2-1.5 3a4 4 0 0 0 1 5.5V19a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-3.5a4 4 0 0 0 1-5.5c-.5-1-1.5-1.5-1.5-3a5 5 0 0 0-5-5Z"/><path d="M9 21v-3M15 21v-3"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z" fill="currentColor"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2Z"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  baby: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01M15 12h.01M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5S14.5 8 13 8"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"/></svg>',
  warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-3.5 1.4-3.5 3.6V11H8v3h2.5v7h3v-7H16l.5-3h-3V9.8c0-.6.3-.8 1-.8Z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
  yt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.5 12 5.5 12 5.5s-6 0-7.9.6A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.6 7.9.6 7.9.6s6 0 7.9-.6a3 3 0 0 0 2.1-2.1c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8ZM10 15V9l5.2 3-5.2 3Z"/></svg>',
  stethoscope: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v6a5 5 0 0 0 10 0V2"/><path d="M4 2H2M14 2h-2M9 15v2a5 5 0 0 0 10 0v-3"/><circle cx="20" cy="11" r="2"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.2-.7-2.7-1.1-4.4-3.9-4.5-4.1-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2.1.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.5.3.1.2.1.7-.1 1.3Z"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>',
};
/* Ikon yang dibenarkan untuk domain tambahan doktor */
const DOMAIN_ICONS = ['star', 'bulb', 'baby', 'shield', 'chart', 'help', 'book', 'play'];
const DOMAIN_COLORS = ['#12718A', '#7C6BB0', '#E0913C', '#D06B7A', '#4FA96A', '#2A9D8F', '#5B7FB5', '#C77DB0'];

/* ---------- 2. LAPISAN DATA (localStorage) ------------------------- */
function read(key, fb) { try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fb : v; } catch (e) { return fb; } }
function write(key, v) { localStorage.setItem(key, JSON.stringify(v)); }

/* Setiap soalan: { text, minM, maxM } — julat umur (bulan) soalan terpakai,
   membolehkan "Checklist mengikut umur" (Modul 3). */
const DEFAULT_DOMAINS = [
  { code: 'MOTOR_KASAR', name: 'Motor Kasar', icon: 'motorKasar', color: 'var(--dom-motor-kasar)', locked: true, questions: [
    { text: 'Adakah anak anda boleh mengangkat kepala semasa meniarap?', minM: 1, maxM: 6 },
    { text: 'Adakah anak anda boleh duduk tanpa sokongan?', minM: 6, maxM: 12 },
    { text: 'Adakah anak anda boleh berjalan sendiri tanpa bantuan?', minM: 12, maxM: 30 },
    { text: 'Adakah anak anda boleh naik tangga dengan berpaut?', minM: 18, maxM: 36 },
    { text: 'Adakah anak anda boleh menendang bola ke hadapan?', minM: 18, maxM: 48 },
    { text: 'Adakah anak anda boleh melompat dengan dua kaki serentak?', minM: 30, maxM: 72 },
    { text: 'Adakah anak anda boleh berdiri atas sebelah kaki seketika?', minM: 36, maxM: 72 },
  ]},
  { code: 'MOTOR_HALUS', name: 'Motor Halus', icon: 'motorHalus', color: 'var(--dom-motor-halus)', locked: true, questions: [
    { text: 'Adakah anak anda boleh menggenggam objek yang diberikan?', minM: 4, maxM: 12 },
    { text: 'Adakah anak anda boleh menyusun 2–3 blok?', minM: 12, maxM: 30 },
    { text: 'Adakah anak anda boleh memegang pensel dan mencoret?', minM: 12, maxM: 36 },
    { text: 'Adakah anak anda boleh melukis bulatan?', minM: 30, maxM: 72 },
    { text: 'Adakah anak anda boleh menggunting kertas dengan bantuan?', minM: 36, maxM: 72 },
  ]},
  { code: 'BAHASA', name: 'Bahasa', icon: 'bahasa', color: 'var(--dom-bahasa)', locked: true, questions: [
    { text: 'Adakah anak anda bertindak balas terhadap bunyi atau suara?', minM: 0, maxM: 9 },
    { text: 'Adakah anak anda membebel (babbling) seperti "ba-ba"?', minM: 6, maxM: 12 },
    { text: 'Adakah anak anda boleh menyebut sekurang-kurangnya 3 perkataan bermakna?', minM: 12, maxM: 24 },
    { text: 'Adakah anak anda memahami arahan mudah seperti "mari sini"?', minM: 12, maxM: 36 },
    { text: 'Adakah anak anda menunjuk objek apabila dinamakan?', minM: 12, maxM: 30 },
    { text: 'Adakah anak anda boleh bercakap ayat 2–3 perkataan?', minM: 24, maxM: 48 },
    { text: 'Adakah anak anda boleh menceritakan pengalaman ringkas?', minM: 36, maxM: 72 },
  ]},
  { code: 'SOSIAL', name: 'Sosial', icon: 'sosial', color: 'var(--dom-sosial)', locked: true, questions: [
    { text: 'Adakah anak anda tersenyum kepada orang yang dikenali?', minM: 1, maxM: 9 },
    { text: 'Adakah anak anda menunjukkan minat bermain dengan orang lain?', minM: 12, maxM: 48 },
    { text: 'Adakah anak anda melambai "bye-bye"?', minM: 9, maxM: 24 },
    { text: 'Adakah anak anda boleh bermain secara bergilir dengan rakan?', minM: 30, maxM: 72 },
  ]},
  { code: 'KOGNITIF', name: 'Kognitif', icon: 'kognitif', color: 'var(--dom-kognitif)', locked: true, questions: [
    { text: 'Adakah anak anda memerhati objek yang bergerak?', minM: 0, maxM: 6 },
    { text: 'Adakah anak anda boleh mencari objek yang disembunyikan?', minM: 9, maxM: 24 },
    { text: 'Adakah anak anda meniru perbuatan mudah seperti bertepuk tangan?', minM: 12, maxM: 30 },
    { text: 'Adakah anak anda boleh mengenal 2–3 warna?', minM: 30, maxM: 60 },
    { text: 'Adakah anak anda boleh mengira 1 hingga 5?', minM: 42, maxM: 72 },
  ]},
];

const getUsers = () => read('ejejak_users', []);
const saveUsers = (v) => write('ejejak_users', v);
const getChildren = () => read('ejejak_children', []);
const saveChildren = (v) => write('ejejak_children', v);
const childrenOf = (uid) => getChildren().filter(c => c.userId === uid);
const getSubmissions = () => read('ejejak_submissions', []);
const saveSubmissions = (v) => write('ejejak_submissions', v);
function getDomains() {
  let d = read('ejejak_domains', null);
  if (!d) { d = DEFAULT_DOMAINS; write('ejejak_domains', d); return d; }
  // Migrasi: soalan lama (string) → objek { text, minM, maxM }
  let changed = false;
  d.forEach(dom => {
    dom.questions = dom.questions.map(q => {
      if (typeof q === 'string') { changed = true; return { text: q, minM: 0, maxM: 72 }; }
      return q;
    });
  });
  if (changed) write('ejejak_domains', d);
  return d;
}
function saveDomains(d) { write('ejejak_domains', d); }
function bandLabel(q) { return (q.minM <= 0 && q.maxM >= 72) ? 'Semua umur' : `${q.minM}–${q.maxM} bln`; }
function ageBandOptions(sel) {
  const mk = (v, l) => `<option value="${v}"${sel === v ? ' selected' : ''}>${l}</option>`;
  let o = mk('0-72', 'Semua umur (0–72 bulan)');
  AGE_GROUPS.forEach(([lo, hi, label]) => { o += mk(`${lo}-${hi}`, label); });
  return o;
}

/* Artikel pendidikan (Modul 5) — diurus oleh Pentadbir (Modul 6) */
const DEFAULT_ARTICLES = [
  { id: 'A1', category: 'artikel', title: 'Milestone perkembangan 0–12 bulan', body: 'Panduan ringkas pencapaian yang biasa dicapai bayi pada tahun pertama merentasi lima domain perkembangan — motor kasar, motor halus, bahasa, sosial dan kognitif.', published: true },
  { id: 'A2', category: 'artikel', title: 'Kepentingan intervensi awal', body: 'Mengapa mengesan kelewatan perkembangan seawal mungkin memberi kesan besar kepada masa depan anak. Intervensi awal meningkatkan peluang tumbesaran optimum.', published: true },
  { id: 'A3', category: 'artikel', title: 'Memahami perkembangan sosial-emosi', body: 'Bagaimana kanak-kanak belajar berinteraksi, berkongsi dan mengurus emosi mereka dari peringkat bayi hingga prasekolah.', published: true },
  { id: 'A4', category: 'tips', title: '5 cara merangsang pertuturan anak', body: 'Aktiviti harian ringkas seperti bercerita, menyanyi dan menamakan objek untuk menggalakkan perkembangan bahasa si kecil.', published: true },
  { id: 'A5', category: 'tips', title: 'Menguruskan tantrum dengan tenang', body: 'Strategi berkesan untuk membantu anak mengawal emosi tanpa hukuman — kekal tenang, sahkan perasaan, dan alih perhatian.', published: true },
  { id: 'A6', category: 'tips', title: 'Rutin tidur sihat untuk si kecil', body: 'Membina tabiat tidur konsisten yang menyokong tumbesaran otak dan kesihatan anak.', published: true },
  { id: 'A7', category: 'aktiviti', title: 'Permainan motor halus di rumah', body: 'Idea permainan menggunakan barangan rumah seperti menyusun blok dan meronce manik untuk melatih koordinasi jari.', published: true },
  { id: 'A8', category: 'aktiviti', title: 'Permainan menggalakkan motor kasar', body: 'Aktiviti fizikal seronok seperti melompat, memanjat dan bermain bola untuk membina kekuatan otot besar.', published: true },
  { id: 'A9', category: 'aktiviti', title: 'Aktiviti membaca bersama', body: 'Cara menjadikan waktu membaca menyeronokkan dan interaktif untuk memupuk minat membaca sejak kecil.', published: true },
  { id: 'F1', category: 'faq', title: 'Adakah e-Jejak Anak memberikan diagnosis perubatan?', body: 'Tidak. Sistem ini menyediakan saringan awal sahaja untuk meningkatkan kesedaran ibu bapa. Ia bukan pengganti penilaian klinikal. Sila rujuk profesional kesihatan untuk diagnosis.', published: true },
  { id: 'F2', category: 'faq', title: 'Bagaimana umur anak dikira?', body: 'Umur dikira secara automatik dalam bulan daripada tarikh lahir hingga tarikh hari ini. Ibu bapa tidak perlu memasukkan umur secara manual.', published: true },
  { id: 'F3', category: 'faq', title: 'Bolehkah saya menyaring lebih daripada seorang anak?', body: 'Ya. Satu akaun ibu bapa boleh menyimpan seberapa banyak profil anak, dan setiap anak mempunyai sejarah saringan tersendiri.', published: true },
  { id: 'F4', category: 'faq', title: 'Adakah data saya selamat?', body: 'Ya. Data peribadi anda hanya boleh dilihat oleh akaun anda dan tidak dikongsi dengan pihak ketiga. Kata laluan disimpan dalam bentuk tersulit.', published: true },
  { id: 'F5', category: 'faq', title: 'Bolehkah keputusan saringan diubah selepas dihantar?', body: 'Tidak. Setiap sesi saringan adalah muktamad selepas dihantar. Anda boleh memulakan saringan baharu pada bila-bila masa untuk anak yang sama.', published: true },
];
function getArticles() { let a = read('ejejak_articles', null); if (!a) { a = DEFAULT_ARTICLES; write('ejejak_articles', a); } return a; }
function saveArticles(a) { write('ejejak_articles', a); }
const ARTICLE_CATS = { artikel: 'Artikel', tips: 'Tips Keibubapaan', aktiviti: 'Aktiviti di Rumah', faq: 'Soalan Lazim' };

/* Akaun staf — 4 peranan (AUTH-05, tidak boleh daftar sendiri):
   superadmin (Webimpian) → admin (MAIK/USM) → doctor (USM) → [parent]. */
const ORGS = ['USM', 'MAIK', 'Webimpian'];
const ROLE_LABEL = { superadmin: 'Superadmin', admin: 'Pentadbir', doctor: 'Doktor', parent: 'Ibu Bapa' };
// Peranan yang dibenarkan lihat setiap tab panel (juga ditanda dalam admin.html).
const TAB_ROLES = {
  'tab-saringan': ['doctor'],
  'tab-statistik': ['superadmin', 'admin', 'doctor'],
  'tab-soalan': ['doctor'],
  'tab-artikel': ['superadmin', 'admin'],
  'tab-pengguna': ['superadmin', 'admin'],
  'tab-laporan': ['superadmin', 'admin'],
  'tab-log': ['superadmin', 'admin'],
  'tab-akaun': ['superadmin', 'admin', 'doctor'],
};
const canManageAccounts = (role) => role === 'superadmin' || role === 'admin';
// Nota: `role` (kuasa) & `org` (USM/MAIK) adalah BEBAS — USM boleh ada pentadbir,
// MAIK boleh ada doktor. Set contoh sengaja bercampur untuk tunjuk perkara ini.
const DEFAULT_ADMINS = [
  { id: 'SA1', name: 'Webimpian (Superadmin)', email: 'superadmin@webimpian.com', phone: '-',           jawatan: 'Pembangun Sistem',   org: 'Webimpian', password: 'demo1234', role: 'superadmin' },
  { id: 'AD1', name: 'Pn. Salmah Ibrahim',     email: 'admin.maik@ejejakanak.my', phone: '09-765 4321', jawatan: 'Pentadbir Sistem',   org: 'MAIK',      password: 'demo1234', role: 'admin' },
  { id: 'AD2', name: 'En. Rosli Abdullah',     email: 'admin.usm@ejejakanak.my',  phone: '04-653 1000', jawatan: 'Penyelaras Program', org: 'USM',       password: 'demo1234', role: 'admin' },
  { id: 'DR1', name: 'Dr. Aminah Yusof',       email: 'doktor@ejejakanak.my',     phone: '04-912 3456', jawatan: 'Pegawai Perubatan',  org: 'USM',       password: 'demo1234', role: 'doctor' },
  { id: 'DR2', name: 'Dr. Zulkifli Hassan',    email: 'doktor.maik@ejejakanak.my',phone: '09-913 0000', jawatan: 'Pakar Pediatrik',    org: 'MAIK',      password: 'demo1234', role: 'doctor' },
];
function getAdmins() { let a = read('ejejak_admins', null); if (!a) { a = DEFAULT_ADMINS; write('ejejak_admins', a); } return a; }
function saveAdmins(a) { write('ejejak_admins', a); }

function currentUser()  { try { return JSON.parse(sessionStorage.getItem('ejejak_user')); }  catch (e) { return null; } }
function currentAdmin() { try { return JSON.parse(sessionStorage.getItem('ejejak_admin')); } catch (e) { return null; } }

/* Log audit (demo) — catat tindakan sensitif ke localStorage (append-only).
   Label tindakan mesra pengguna untuk paparan. */
const ACTION_LABEL = {
  'login': 'Log masuk', 'account.create': 'Cipta akaun', 'account.update': 'Kemas kini akaun', 'account.delete': 'Padam akaun',
  'account.impersonate': 'Log masuk sebagai ibu bapa', 'account.impersonate.end': 'Tamat penyamaran',
  'account.password': 'Tukar kata laluan sendiri',
  'user.update': 'Kemas kini pengguna', 'user.reset': 'Set semula kata laluan', 'user.delete': 'Padam pengguna',
  'parent.contact': 'Hubungi ibu bapa', 'report.export': 'Eksport laporan',
  'question.add': 'Tambah soalan', 'domain.create': 'Cipta domain',
  'article.create': 'Tambah artikel', 'article.delete': 'Padam artikel',
};
const getAudit = () => read('ejejak_audit', []);
function logAudit(action, detail) {
  const me = currentAdmin();
  const log = getAudit();
  log.unshift({
    id: 'L' + Date.now() + Math.floor(Math.random() * 1000),
    at: new Date().toISOString(),
    actorId: me?.id || '-', actorName: me?.name || 'Sistem',
    actorRole: me?.role || '-', actorOrg: me?.org || '-',
    action, detail: detail || '',
  });
  write('ejejak_audit', log.slice(0, 500)); // had saiz untuk mockup
}

/* ---------- 2b. IMPERSONASI (pentadbir log masuk sebagai ibu bapa) --
   Superadmin/pentadbir boleh "menyamar" sebagai ibu bapa untuk melihat
   dashboard & saringan mereka bagi tujuan sokongan. Sesi doktor
   (ejejak_admin) DIKEKALKAN supaya boleh kembali ke panel. Penanda
   ejejak_impersonate menyimpan siapa sedang menyamar sebagai siapa. */
function currentImpersonation() { try { return JSON.parse(sessionStorage.getItem('ejejak_impersonate')); } catch (e) { return null; } }

// Menyamar sebagai IBU BAPA — superadmin & pentadbir. Sesi doktor (ejejak_admin)
// dikekalkan; kita hanya tambah sesi ibu bapa (ejejak_user) supaya boleh kembali.
function startImpersonation(userId) {
  const admin = currentAdmin();
  if (!admin || !canManageAccounts(admin.role)) { alert('Hanya pentadbir boleh menyamar sebagai ibu bapa.'); return; }
  const u = getUsers().find(x => x.id === userId);
  if (!u) { alert('Akaun ibu bapa tidak dijumpai.'); return; }
  sessionStorage.setItem('ejejak_impersonate', JSON.stringify({ type: 'parent', adminId: admin.id, adminName: admin.name, targetId: u.id, targetName: u.name }));
  sessionStorage.setItem('ejejak_user', JSON.stringify({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: 'parent' }));
  logAudit('account.impersonate', `Menyamar sebagai ibu bapa: ${u.name} (${u.email})`);
  window.location.href = 'dashboard.html';
}

// Menyamar sebagai STAF (doktor atau pentadbir) untuk sokongan / nyahpepijat.
//   • Doktor    : superadmin (mana-mana) atau pentadbir (org sendiri sahaja).
//   • Pentadbir : superadmin sahaja.
//   • Superadmin & akaun sendiri tidak boleh disamar.
// Sesi asal disimpan (backupAdmin) supaya boleh dipulihkan; ejejak_admin ditukar.
function impersonateStaff(staffId) {
  const admin = currentAdmin();
  if (!admin || !canManageAccounts(admin.role)) { alert('Hanya pentadbir boleh menyamar sebagai staf.'); return; }
  const d = getAdmins().find(x => x.id === staffId);
  if (!d) { alert('Akaun staf tidak dijumpai.'); return; }
  if (d.id === admin.id) { alert('Anda tidak boleh menyamar sebagai diri sendiri.'); return; }
  if (d.role === 'superadmin') { alert('Akaun superadmin tidak boleh disamar.'); return; }
  if (d.role === 'admin' && admin.role !== 'superadmin') { alert('Hanya superadmin boleh menyamar sebagai pentadbir.'); return; }
  if (d.role === 'doctor' && admin.role !== 'superadmin' && d.org !== admin.org) { alert('Anda hanya boleh menyamar sebagai doktor dalam organisasi anda.'); return; }
  const label = ROLE_LABEL[d.role] || d.role;
  sessionStorage.setItem('ejejak_impersonate', JSON.stringify({ type: 'staff', adminId: admin.id, adminName: admin.name, backupAdmin: admin, targetId: d.id, targetName: d.name, targetRole: d.role }));
  logAudit('account.impersonate', `Menyamar sebagai ${label}: ${d.name} (${d.org})`); // dilog sebagai pelaku asal (sebelum tukar sesi)
  sessionStorage.setItem('ejejak_admin', JSON.stringify({ id: d.id, name: d.name, email: d.email, phone: d.phone, jawatan: d.jawatan, org: d.org, role: d.role }));
  window.location.href = 'admin.html';
}

function stopImpersonation() {
  const imp = currentImpersonation();
  sessionStorage.removeItem('ejejak_impersonate');
  if (imp && imp.backupAdmin) {
    sessionStorage.setItem('ejejak_admin', JSON.stringify(imp.backupAdmin)); // staf: pulih sesi asal
  } else if (imp) {
    sessionStorage.removeItem('ejejak_user'); // ibu bapa: buang sesi ibu bapa sahaja
  }
  if (imp) logAudit('account.impersonate.end', `Tamat penyamaran sebagai: ${imp.targetName}`); // dilog selepas sesi asal dipulih
  window.location.href = 'admin.html';
}

// Bar amaran "sedang menyamar" — dipaparkan pada semua halaman semasa penyamaran
// aktif, dengan butang untuk tamat & kembali ke sesi asal.
function renderImpersonationBanner() {
  const imp = currentImpersonation();
  if (!imp) return;
  const asWhat = imp.type === 'parent' ? 'ibu bapa' : (imp.targetRole ? (ROLE_LABEL[imp.targetRole] || 'staf').toLowerCase() : 'staf');
  const bar = document.createElement('div');
  bar.className = 'impersonate-bar';
  bar.innerHTML = `<div class="container impersonate-bar__inner">
    <span>${ICONS.eye} <strong>Mod Penyamaran</strong> — anda sedang melihat sebagai ${asWhat} <strong>${imp.targetName}</strong>.</span>
    <button class="btn" id="imp-return" type="button">${ICONS.logout} Tamat &amp; kembali sebagai ${imp.adminName}</button>
  </div>`;
  document.body.insertBefore(bar, document.body.firstChild);
  document.getElementById('imp-return')?.addEventListener('click', stopImpersonation);
}

/* ---------- 3. UMUR (auto dari tarikh lahir) ----------------------- */
const AGE_GROUPS = [
  [0, 3, '0–3 bulan'], [4, 6, '4–6 bulan'], [7, 12, '7–12 bulan'],
  [13, 18, '13–18 bulan'], [19, 24, '19–24 bulan'], [25, 36, '2–3 tahun'],
  [37, 60, '3–5 tahun'], [61, 72, '5–6 tahun'],
];
function ageInMonths(dobStr) {
  if (!dobStr) return null;
  const dob = new Date(dobStr), now = new Date();
  let m = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
  if (now.getDate() < dob.getDate()) m--;
  return Math.max(0, m);
}
function ageGroupLabel(m) { if (m == null) return '—'; const g = AGE_GROUPS.find(([lo, hi]) => m >= lo && m <= hi); return g ? g[2] : '> 6 tahun'; }
function ageText(m) { if (m == null) return '—'; if (m < 24) return m + ' bulan'; const y = Math.floor(m / 12), r = m % 12; return r ? `${y} tahun ${r} bulan` : `${y} tahun`; }
// Domain + soalan yang sepadan dengan umur (checklist mengikut umur)
function domainsForAge(age) {
  return getDomains()
    .map(d => ({ code: d.code, name: d.name, color: d.color, icon: d.icon, qs: (d.questions || []).filter(q => age >= q.minM && age <= q.maxM) }))
    .filter(d => d.qs.length > 0);
}

/* ---------- 4. SEED DATA CONTOH ------------------------------------ */
function sumDom(dom) { return Object.values(dom).reduce((a, d) => ({ ach: a.ach + d.achieved, tot: a.tot + d.total }), { ach: 0, tot: 0 }); }
function mkDom(mk, mh, b, s, k) {
  return {
    MOTOR_KASAR: { name: 'Motor Kasar', color: 'var(--dom-motor-kasar)', achieved: mk, total: 3 },
    MOTOR_HALUS: { name: 'Motor Halus', color: 'var(--dom-motor-halus)', achieved: mh, total: 2 },
    BAHASA:      { name: 'Bahasa',      color: 'var(--dom-bahasa)',      achieved: b,  total: 3 },
    SOSIAL:      { name: 'Sosial',      color: 'var(--dom-sosial)',      achieved: s,  total: 2 },
    KOGNITIF:    { name: 'Kognitif',    color: 'var(--dom-kognitif)',    achieved: k,  total: 2 },
  };
}
/* Program komuniti (dipapar kepada ibu bapa + diurus pentadbir) & video
   pembelajaran (dipapar di Pusat Pendidikan + diurus pentadbir). Skema sama
   seperti modul admin (ejejak_programs / ejejak_videos). */
const DEFAULT_PROGRAMS = [
  { id: 'PG1', title: 'Hari Saringan Perkembangan Percuma', date: '2026-09-06', location: 'Dewan MAIK, Kota Bharu', desc: 'Saringan awal percuma untuk kanak-kanak 0–6 tahun oleh pegawai USM & sukarelawan.', districts: ['Kota Bharu', 'Bachok'] },
  { id: 'PG2', title: 'Bengkel Keibubapaan & Autisme', date: '2026-09-20', location: 'USM Kampus Kesihatan, Kubang Kerian', desc: 'Bengkel untuk ibu bapa mengenali tanda awal autisme dan teknik sokongan di rumah.', districts: 'semua' },
  { id: 'PG3', title: 'Klinik Terapi Pertuturan Bergerak', date: '2026-10-04', location: 'Klinik Kesihatan Gua Musang', desc: 'Khidmat saringan & terapi pertuturan bergerak ke kawasan luar bandar Kelantan.', districts: ['Gua Musang', 'Kuala Krai', 'Jeli'] },
];
const DEFAULT_VIDEOS = [
  { id: 'V1', title: 'Perkembangan Bayi 0–12 Bulan', youtube: 'VIDEO_BAYI01', desc: 'Panduan tanda perkembangan normal bayi mengikut usia.' },
  { id: 'V2', title: 'Rangsang Pertuturan Anak', youtube: 'VIDEO_TUTUR02', desc: 'Cara mudah menggalakkan anak bercakap di rumah.' },
  { id: 'V3', title: 'Kenali Tanda Awal Autisme', youtube: 'VIDEO_AUTIS03', desc: 'Tanda amaran awal yang perlu ibu bapa perhatikan.' },
  { id: 'V4', title: 'Aktiviti Motor Kasar & Halus', youtube: 'VIDEO_MOTOR04', desc: 'Aktiviti membina kemahiran motor anak secara berperingkat.' },
  { id: 'V5', title: 'Sensory Play di Rumah', youtube: 'VIDEO_SENSORI05', desc: 'Idea permainan sensori untuk merangsang deria anak.' },
  { id: 'V6', title: 'Kemahiran Keibubapaan Positif', youtube: 'VIDEO_IBUBAPA06', desc: 'Tip mendidik anak dengan pendekatan penyayang.' },
];
const getPrograms = () => read('ejejak_programs', DEFAULT_PROGRAMS);
const savePrograms = (v) => write('ejejak_programs', v);
const getVideos = () => read('ejejak_videos', DEFAULT_VIDEOS);
const saveVideos = (v) => write('ejejak_videos', v);
const getAttendance = () => read('ejejak_attendance', []);
const saveAttendance = (v) => write('ejejak_attendance', v);
function programDistrictsLabel(ds) {
  if (!ds || ds === 'semua' || (Array.isArray(ds) && !ds.length)) return 'Semua daerah';
  return Array.isArray(ds) ? ds.join(', ') : String(ds);
}
function programDateText(d) {
  if (!d) return 'Tarikh akan diumumkan';
  try { return new Date(d + 'T00:00:00').toLocaleDateString('ms-MY', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }); }
  catch (e) { return d; }
}

function ensureSeed() {
  getDomains(); // seed domain jika perlu
  // Benih program & video (idempoten — tidak tertakluk kepada seed_v5).
  if (read('ejejak_programs', null) === null) write('ejejak_programs', DEFAULT_PROGRAMS);
  if (read('ejejak_videos', null) === null) write('ejejak_videos', DEFAULT_VIDEOS);
  // Benih akaun staf (versi) — push set 4-peranan bercampur USM/MAIK.
  if (read('ejejak_admins_seed', 0) < 2) { saveAdmins(DEFAULT_ADMINS); write('ejejak_admins_seed', 2); }
  // Benih log audit contoh (demo tab Log Aktiviti).
  if (read('ejejak_audit', null) === null) {
    write('ejejak_audit', [
      { id: 'LSEED5', at: '2026-07-26T15:10:00', actorId: 'AD1', actorName: 'Pn. Salmah Ibrahim', actorRole: 'admin',  actorOrg: 'MAIK', action: 'report.export',  detail: 'Muat turun CSV Laporan Pengguna' },
      { id: 'LSEED4', at: '2026-07-26T11:02:00', actorId: 'DR1', actorName: 'Dr. Aminah Yusof',    actorRole: 'doctor', actorOrg: 'USM',  action: 'parent.contact', detail: 'Tandakan dihubungi: Nurin Damia' },
      { id: 'LSEED3', at: '2026-07-25T16:45:00', actorId: 'AD2', actorName: 'En. Rosli Abdullah',  actorRole: 'admin',  actorOrg: 'USM',  action: 'account.create', detail: 'Cipta Doktor: Dr. Aminah Yusof (USM)' },
      { id: 'LSEED2', at: '2026-07-25T09:20:00', actorId: 'DR1', actorName: 'Dr. Aminah Yusof',    actorRole: 'doctor', actorOrg: 'USM',  action: 'question.add',   detail: 'Tambah soalan domain Bahasa' },
      { id: 'LSEED1', at: '2026-07-24T08:30:00', actorId: 'SA1', actorName: 'Webimpian (Superadmin)', actorRole: 'superadmin', actorOrg: 'Webimpian', action: 'login', detail: 'Log masuk panel' },
    ]);
  }
  if (read('ejejak_seed_v5', false)) return;

  if (getUsers().length === 0) {
    // Pengguna benih dengan medan baharu: accountType, verified, district, father, mother.
    saveUsers([
      { id: 'U1', name: 'Siti Nurhaliza', email: 'ibu@contoh.com',   phone: '0123456789', password: 'demo1234', role: 'parent',
        accountType: 'screening', verified: true, district: 'Kota Bharu',
        father: { name: 'Rahman bin Ali',    ic: '800101-03-5511', phone: '0198887766', job: 'Kerani Kerajaan',  income: '2800' },
        mother: { name: 'Siti Nurhaliza',    ic: '830505-03-6622', phone: '0123456789', job: 'Suri rumah',       income: '0' } },
      { id: 'U2', name: 'Farah Aziz',     email: 'farah@contoh.com', phone: '0176543210', password: 'demo1234', role: 'parent',
        accountType: 'screening', verified: true, district: 'Pasir Mas',
        father: { name: 'Aziz bin Hassan',   ic: '820202-03-5533', phone: '0175551122', job: 'Peniaga',          income: '3500' },
        mother: { name: 'Farah binti Kamal',  ic: '850707-03-6644', phone: '0176543210', job: 'Guru',             income: '4200' } },
      { id: 'U3', name: 'Amirul Hakim',   email: 'amir@contoh.com',  phone: '0112223344', password: 'demo1234', role: 'parent',
        accountType: 'screening', verified: true, district: 'Tumpat',
        father: { name: 'Amirul Hakim',       ic: '810303-03-5544', phone: '0112223344', job: 'Pemandu',          income: '2200' },
        mother: { name: 'Noraini binti Yaakob', ic: '840808-03-6655', phone: '0119998877', job: 'Suri rumah',      income: '0' } },
      // Akaun e-Pembelajaran sahaja (tanpa anak / tanpa saringan).
      { id: 'U4', name: 'Cikgu Hafiz',    email: 'hafiz.elearn@contoh.com', phone: '0139991234', password: 'demo1234', role: 'parent',
        accountType: 'knowledge', verified: true, district: '' },
      { id: 'U5', name: 'Puan Rohana',    email: 'rohana.elearn@contoh.com', phone: '0148887777', password: 'demo1234', role: 'parent',
        accountType: 'knowledge', verified: true, district: '' },
    ]);
    saveChildren([
      { id: 'C1', userId: 'U1', name: 'Aisyah binti Rahman', dob: '2025-01-15', gender: 'perempuan', tempatLahir: 'Hospital USM, Kubang Kerian' },
      { id: 'C2', userId: 'U1', name: 'Haziq bin Rahman',    dob: '2022-12-20', gender: 'lelaki',    tempatLahir: 'Hospital Raja Perempuan Zainab II, Kota Bharu' },
      { id: 'C3', userId: 'U2', name: 'Nurin Damia',         dob: '2025-09-05', gender: 'perempuan', tempatLahir: 'Hospital Pasir Mas' },
      { id: 'C4', userId: 'U3', name: 'Danish Iman',         dob: '2023-12-01', gender: 'lelaki',    tempatLahir: 'Klinik Kesihatan Tumpat' },
    ]);
  } else {
    // Data pengguna sedia ada (mungkin benih lama atau pengguna sebenar) —
    // backfill medan baharu tanpa memadam apa-apa data sedia ada.
    const users = getUsers();
    const backfill = {
      U1: { district: 'Kota Bharu',
        father: { name: 'Rahman bin Ali', ic: '800101-03-5511', phone: '0198887766', job: 'Kerani Kerajaan', income: '2800' },
        mother: { name: 'Siti Nurhaliza', ic: '830505-03-6622', phone: '0123456789', job: 'Suri rumah', income: '0' } },
      U2: { district: 'Pasir Mas',
        father: { name: 'Aziz bin Hassan', ic: '820202-03-5533', phone: '0175551122', job: 'Peniaga', income: '3500' },
        mother: { name: 'Farah binti Kamal', ic: '850707-03-6644', phone: '0176543210', job: 'Guru', income: '4200' } },
      U3: { district: 'Tumpat',
        father: { name: 'Amirul Hakim', ic: '810303-03-5544', phone: '0112223344', job: 'Pemandu', income: '2200' },
        mother: { name: 'Noraini binti Yaakob', ic: '840808-03-6655', phone: '0119998877', job: 'Suri rumah', income: '0' } },
    };
    users.forEach(u => {
      if (u.role && u.role !== 'parent') return;
      if (u.accountType === undefined) u.accountType = 'screening';
      if (u.verified === undefined) u.verified = true;
      const bf = backfill[u.id];
      if (bf) {
        if (!u.district) u.district = bf.district;
        if (!u.father) u.father = bf.father;
        if (!u.mother) u.mother = bf.mother;
      } else {
        if (u.district === undefined) u.district = '';
      }
    });
    // Tambah 1–2 akaun e-Pembelajaran demo jika belum wujud.
    if (!users.some(x => x.accountType === 'knowledge')) {
      users.push(
        { id: 'U4', name: 'Cikgu Hafiz', email: 'hafiz.elearn@contoh.com', phone: '0139991234', password: 'demo1234', role: 'parent', accountType: 'knowledge', verified: true, district: '' },
        { id: 'U5', name: 'Puan Rohana', email: 'rohana.elearn@contoh.com', phone: '0148887777', password: 'demo1234', role: 'parent', accountType: 'knowledge', verified: true, district: '' },
      );
    }
    saveUsers(users);
    // Backfill tempatLahir untuk anak benih sedia ada (jika kosong).
    const children = getChildren();
    const cbf = {
      C1: 'Hospital USM, Kubang Kerian',
      C2: 'Hospital Raja Perempuan Zainab II, Kota Bharu',
      C3: 'Hospital Pasir Mas',
      C4: 'Klinik Kesihatan Tumpat',
    };
    let cChanged = false;
    children.forEach(c => { if (cbf[c.id] && !c.tempatLahir) { c.tempatLahir = cbf[c.id]; cChanged = true; } });
    if (cChanged) saveChildren(children);
  }
  // Isi/segar semula sesi contoh. Jika hanya wujud data benih lama (id 'SEED…'),
  // ganti dengan set 6-bulan yang baharu; kekalkan saringan sebenar (id 'S…').
  const existingSubs = getSubmissions();
  const onlySeeded = existingSubs.length > 0 && existingSubs.every(s => String(s.id).startsWith('SEED'));
  if (existingSubs.length === 0 || onlySeeded) {
    // Meta anak (tetap) — dikongsi merentas banyak sesi saringan.
    const kids = {
      C1: { uid: 'U1', name: 'Aisyah binti Rahman', gender: 'perempuan', pName: 'Siti Nurhaliza', pPhone: '0123456789', pEmail: 'ibu@contoh.com' },
      C2: { uid: 'U1', name: 'Haziq bin Rahman',    gender: 'lelaki',    pName: 'Siti Nurhaliza', pPhone: '0123456789', pEmail: 'ibu@contoh.com' },
      C3: { uid: 'U2', name: 'Nurin Damia',         gender: 'perempuan', pName: 'Farah Aziz',     pPhone: '0176543210', pEmail: 'farah@contoh.com' },
      C4: { uid: 'U3', name: 'Danish Iman',         gender: 'lelaki',    pName: 'Amirul Hakim',   pPhone: '0112223344', pEmail: 'amir@contoh.com' },
    };
    // Sejarah sesi merentas 6 bulan (Feb–Jul 2026) untuk carta trend.
    // [cid, tarikh, umur(bulan), nisbah dicapai, status]
    const sess = [
      ['C1', '2026-02-10T09:00:00', 13, 0.70, 'dihubungi'],
      ['C4', '2026-02-22T15:30:00', 25, 0.65, 'dihubungi'],
      ['C2', '2026-03-05T10:20:00', 38, 0.55, 'dihubungi'],
      ['C1', '2026-03-19T09:45:00', 14, 0.80, 'baharu'],
      ['C3', '2026-04-02T11:10:00',  6, 1.00, 'baharu'],
      ['C4', '2026-04-14T14:00:00', 27, 0.60, 'dihubungi'],
      ['C2', '2026-04-28T16:35:00', 40, 0.50, 'dihubungi'],
      ['C1', '2026-05-08T08:50:00', 16, 0.85, 'baharu'],
      ['C3', '2026-05-17T10:05:00',  8, 0.90, 'baharu'],
      ['C4', '2026-05-29T13:20:00', 28, 0.70, 'baharu'],
      ['C2', '2026-06-06T09:30:00', 41, 0.45, 'dihubungi'],
      ['C1', '2026-06-15T11:40:00', 17, 0.75, 'baharu'],
      ['C3', '2026-06-24T15:15:00',  9, 0.95, 'baharu'],
      ['C4', '2026-06-30T10:00:00', 29, 0.65, 'baharu'],
      ['C1', '2026-07-25T09:15:00', 18, 0.75, 'baharu'],
      ['C2', '2026-07-25T14:40:00', 42, 0.50, 'baharu'],
      ['C3', '2026-07-24T11:05:00', 10, 1.00, 'dihubungi'],
      ['C4', '2026-07-24T16:20:00', 30, 0.60, 'baharu'],
    ];
    const seeds = sess
      .map(([cid, date, age, ratio, status]) => ({ ...kids[cid], cid, age, date, ratio, status }))
      .sort((a, b) => (a.date < b.date ? 1 : -1)); // terbaharu dahulu
    saveSubmissions(seeds.map((s, i) => {
      const fd = domainsForAge(s.age);
      const domains = {}; let ta = 0, tot = 0;
      fd.forEach(d => {
        const k = Math.round(d.qs.length * s.ratio);
        const items = d.qs.map((q, idx) => ({ text: q.text, answer: idx < k ? 'ya' : 'tidak' }));
        const ach = items.filter(x => x.answer === 'ya').length;
        domains[d.code] = { name: d.name, color: d.color, achieved: ach, total: d.qs.length, items };
        ta += ach; tot += d.qs.length;
      });
      return {
        id: 'SEED' + i, submittedAt: s.date, userId: s.uid, childId: s.cid,
        childName: s.name, childGender: s.gender, ageMonths: s.age, ageGroup: ageGroupLabel(s.age),
        parentName: s.pName, parentPhone: s.pPhone, parentEmail: s.pEmail,
        total: tot, totalAchieved: ta, totalNot: tot - ta, domains, status: s.status, note: '',
      };
    }));
  }
  write('ejejak_seed_v5', true);
}

/* ---------- 5. HEADER / FOOTER (satu sumber) ----------------------- */
const SITE = {
  name: ['e-Jejak', 'Anak'],
  tagline: 'Saringan Perkembangan Kanak-kanak',
  // Menu AWAM (guest) — hanya pautan yang boleh diakses tanpa log masuk.
  // Saringan, Pusat Pendidikan & Dashboard dibuang (perlu log masuk); pengguna
  // berdaftar dapat MEMBER_MENU dalam buildHeader.
  menu: [
    { label: 'Beranda', href: 'index.html', key: 'beranda' },
    { label: 'Tentang Kami', href: 'index.html#tentang', key: 'tentang' },
    { label: '5 Domain', key: 'domain', children: [
      { label: '5 Domain Perkembangan', href: 'index.html#domain' },
      { label: 'Cara Guna', href: 'index.html#cara' },
    ]},
    { label: 'Pusat Pendidikan', key: 'pendidikan', children: [
      { label: 'Artikel Perkembangan', href: 'pendidikan.html#artikel' },
      { label: 'Tips Keibubapaan', href: 'pendidikan.html#tips' },
      { label: 'Aktiviti di Rumah', href: 'pendidikan.html#aktiviti' },
      { label: 'Soalan Lazim (FAQ)', href: 'pendidikan.html#faq' },
    ]},
    { label: 'Rakan NGO', href: 'mba.html', key: 'mba' },
  ],
};

function buildHeader(active) {
  const user = currentUser();
  const brand = `
    <a class="brand" href="index.html" aria-label="e-Jejak Anak — Beranda">
      <span class="brand__logos">
        <img class="brand__logo brand__logo--maik" src="assets/img/logo-maik.png?v=2" alt="Logo MAIK">
        <img class="brand__logo brand__logo--usm" src="assets/img/logo-usm.png?v=2" alt="Logo USM">
      </span>
      <span class="brand__text">
        <span class="brand__name">${SITE.name[0]}<b>${SITE.name[1]}</b></span>
        <span class="brand__tag">${SITE.tagline}</span>
      </span>
    </a>`;

  // Menu AHLI (log masuk) vs menu AWAM (guest). Ibu bapa tidak nampak "Beranda"
  // & "Tentang Kami" — mereka dapat navigasi ahli tersendiri. Akaun e-Pembelajaran
  // (tiada anak/saringan) dapat menu ringkas.
  const rec = user ? getUsers().find(x => x.id === user.id) : null;
  const isKnowledge = rec ? rec.accountType === 'knowledge' : false;
  const MEMBER_MENU = isKnowledge
    ? [
        { label: 'Dashboard', href: 'dashboard.html', key: 'dashboard' },
        { label: 'Program', href: 'program.html', key: 'program' },
        { label: 'e-Pembelajaran', href: 'pendidikan.html', key: 'pendidikan' },
        { label: 'Keluarga', href: 'profil.html', key: 'profil' },
      ]
    : [
        { label: 'Dashboard', href: 'dashboard.html', key: 'dashboard' },
        { label: 'Anak', href: 'anak.html', key: 'anak' },
        { label: 'Saringan', href: 'saringan.html', key: 'saringan' },
        { label: 'Sejarah', href: 'sejarah.html', key: 'sejarah' },
        { label: 'Program', href: 'program.html', key: 'program' },
        { label: 'e-Pembelajaran', href: 'pendidikan.html', key: 'pendidikan' },
        { label: 'Keluarga', href: 'profil.html', key: 'profil' },
      ];
  const menuSource = user ? MEMBER_MENU : SITE.menu;
  const menuItems = menuSource.map(item => {
    const isActive = item.key === active ? ' aria-current="page"' : '';
    if (item.children) {
      const sub = item.children.map(c => `<li><a href="${c.href}">${c.label}</a></li>`).join('');
      return `<li>
        <a href="${item.href || '#'}" class="has-dropdown" aria-expanded="false" aria-haspopup="true"${isActive}>
          ${item.label} <span class="caret">${ICONS.chevronDown}</span>
        </a>
        <ul class="dropdown">${sub}</ul>
      </li>`;
    }
    return `<li><a href="${item.href}"${isActive}>${item.label}</a></li>`;
  }).join('');

  const cta = user
    ? `<a class="btn btn--ghost" href="akaun.html" title="Akaun Saya — tukar kata laluan">${ICONS.user} ${user.name.split(' ')[0]}</a>
       <a class="btn" href="#" id="logoutBtn">${ICONS.logout} Log Keluar</a>`
    : `<a class="btn btn--ghost" href="login.html">Log Masuk</a>
       <a class="btn" href="daftar.html">Daftar Percuma</a>`;

  return `
  <div class="topbar">
    <div class="container">
      <div class="topbar__meta">
        <span>${ICONS.phone} 04-653 0000</span>
        <span>${ICONS.mail} bantuan@ejejakanak.my</span>
        <span>${ICONS.clock} Akses 24 jam · Percuma</span>
      </div>
      <div style="display:flex; align-items:center; gap:var(--sp-3)">
        <a href="admin-login.html" style="display:inline-flex; align-items:center; gap:6px; font-family:var(--font-head); font-weight:600">${ICONS.stethoscope} Log Masuk Doktor</a>
        <div class="topbar__social">
          <a href="#" aria-label="Facebook">${ICONS.fb}</a>
          <a href="#" aria-label="Instagram">${ICONS.ig}</a>
          <a href="#" aria-label="YouTube">${ICONS.yt}</a>
        </div>
      </div>
    </div>
  </div>
  <nav class="nav" aria-label="Navigasi utama">
    <div class="container">
      ${brand}
      <ul class="menu" id="mainmenu">${menuItems}</ul>
      <div class="nav__cta">
        ${cta}
        <button class="nav-toggle" id="navToggle" aria-label="Buka menu" aria-expanded="false" aria-controls="mainmenu">${ICONS.menu}</button>
      </div>
    </div>
  </nav>`;
}

function buildFooter() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <a class="brand" href="index.html">
            <span class="brand__logos">
        <img class="brand__logo brand__logo--maik" src="assets/img/logo-maik.png?v=2" alt="Logo MAIK">
        <img class="brand__logo brand__logo--usm" src="assets/img/logo-usm.png?v=2" alt="Logo USM">
      </span>
            <span class="brand__text">
              <span class="brand__name">${SITE.name[0]}<b>${SITE.name[1]}</b></span>
              <span class="brand__tag">${SITE.tagline}</span>
            </span>
          </a>
          <p>Sistem saringan awal perkembangan kanak-kanak berasaskan web. Membantu ibu bapa mengesan tahap perkembangan anak merentasi lima domain utama.</p>
          <div class="footer__social">
            <a href="#" aria-label="Facebook">${ICONS.fb}</a>
            <a href="#" aria-label="Instagram">${ICONS.ig}</a>
            <a href="#" aria-label="YouTube">${ICONS.yt}</a>
          </div>
        </div>
        <details class="footer-acc" open>
          <summary><h4>Pautan Pantas</h4>${ICONS.chevronDown}</summary>
          <div class="acc-body">
            <ul>
              <li><a href="index.html#tentang">Tentang Kami</a></li>
              <li><a href="saringan.html">Mula Saringan</a></li>
              <li><a href="index.html#domain">5 Domain</a></li>
              <li><a href="dashboard.html">Dashboard</a></li>
              <li><a href="mba.html">Rakan NGO / MBA</a></li>
              <li><a href="admin-login.html">Panel Doktor / Pentadbir</a></li>
            </ul>
          </div>
        </details>
        <details class="footer-acc" open>
          <summary><h4>Pendidikan</h4>${ICONS.chevronDown}</summary>
          <div class="acc-body">
            <ul>
              <li><a href="pendidikan.html#artikel">Artikel</a></li>
              <li><a href="pendidikan.html#tips">Tips</a></li>
              <li><a href="pendidikan.html#aktiviti">Aktiviti</a></li>
              <li><a href="pendidikan.html#faq">Soalan Lazim</a></li>
            </ul>
          </div>
        </details>
        <details class="footer-acc" open>
          <summary><h4>Hubungi Kami</h4>${ICONS.chevronDown}</summary>
          <div class="acc-body">
            <ul class="footer__contact">
              <li>${ICONS.pin} <span>Tingkat 1, Kota Kenangan, PT 2499, Jalan Hospital, Taman Kenangan, 15200 Kota Bharu, Kelantan</span></li>
              <li>${ICONS.phone} <span>04-653 0000</span></li>
              <li>${ICONS.mail} <span>bantuan@ejejakanak.my</span></li>
            </ul>
          </div>
        </details>
      </div>
    </div>
    <div class="footer__bar">
      <div class="container">
        <span>© 2026 e-Jejak Anak. Hak cipta terpelihara.</span>
        <span>Dasar Privasi · Terma Penggunaan · Penafian Perubatan</span>
      </div>
    </div>
  </footer>`;
}

function mountChrome() {
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');
  const active = document.body.dataset.page || '';
  if (header) header.innerHTML = buildHeader(active);
  if (footer) footer.innerHTML = buildFooter();

  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mainmenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.innerHTML = open ? ICONS.close : ICONS.menu;
    });
  }
  document.querySelectorAll('.has-dropdown').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 1200) {
        e.preventDefault();
        link.setAttribute('aria-expanded', String(link.getAttribute('aria-expanded') !== 'true'));
      }
    });
  });
  document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentImpersonation()) { stopImpersonation(); return; } // kembali ke panel, bukan log keluar penuh
    sessionStorage.removeItem('ejejak_user');
    window.location.href = 'index.html';
  });

  // Footer accordion: buka penuh di desktop, tutup (boleh ketuk) di mobile.
  // Hanya bertindak bila melintasi breakpoint 760px supaya toggle pengguna
  // di mobile tak tertutup semula bila skrol (mobile fire 'resize').
  let footerAccDesktop = null;
  const syncFooterAcc = () => {
    const desktop = window.innerWidth > 760;
    if (desktop === footerAccDesktop) return;
    footerAccDesktop = desktop;
    document.querySelectorAll('.footer-acc').forEach(d => { d.open = desktop; });
  };
  syncFooterAcc();
  window.addEventListener('resize', syncFooterAcc);
}

/* Tunjuk/sembunyi elemen ikut status log masuk:
   data-when="guest" → hanya bila BELUM log masuk
   data-when="user"  → hanya bila SUDAH log masuk */
function updateAuthUI() {
  const logged = !!currentUser();
  document.querySelectorAll('[data-when="user"]').forEach(el => { el.style.display = logged ? '' : 'none'; });
  document.querySelectorAll('[data-when="guest"]').forEach(el => { el.style.display = logged ? 'none' : ''; });
}

/* ---------- 6. KAWALAN AKSES --------------------------------------- */
function guard() {
  const need = document.body.dataset.auth;
  if (need === 'parent' && !currentUser()) {
    // Mesej boleh disesuaikan per halaman melalui data-auth-msg.
    alert(document.body.dataset.authMsg || 'Sila log masuk atau daftar akaun terlebih dahulu.');
    const here = (location.pathname.split('/').pop() || '');
    window.location.replace('login.html' + (here ? '?next=' + encodeURIComponent(here) : ''));
    return false;
  }
  if (need === 'admin' && !currentAdmin()) {
    window.location.replace('admin-login.html');
    return false;
  }
  return true;
}

/* Halaman untuk dituju selepas log masuk: hormati ?next= (halaman dalaman sahaja,
   elak open-redirect), jika tiada → dashboard. */
function nextAfterLogin() {
  const n = new URLSearchParams(location.search).get('next');
  return (n && /^[a-z0-9_-]+\.html$/i.test(n)) ? n : 'dashboard.html';
}

/* Kawalan akses ikut peranan (superadmin/admin/doctor) di panel staf.
   Sembunyikan tab & sub-panel yang tidak dibenarkan; aktifkan tab pertama. */
function setupRoleAccess() {
  const wrap = document.querySelector('[data-tabs]');
  const me = currentAdmin();
  if (!wrap || !me) return;
  const role = me.role || 'doctor';

  // Papar nama + peranan (+ organisasi) di header panel.
  const nameEl = document.getElementById('doctor-name');
  if (nameEl) nameEl.textContent = `${me.name} · ${ROLE_LABEL[role] || role}${me.org ? ' (' + me.org + ')' : ''}`;

  // Tapis tab mengikut peranan.
  const tabs = [...wrap.querySelectorAll('.tab')];
  let firstVisible = null, hasActive = false;
  tabs.forEach(tab => {
    const roles = (tab.dataset.roles || '').split(',').map(s => s.trim()).filter(Boolean);
    const ok = roles.length === 0 || roles.includes(role);
    const panel = document.getElementById(tab.dataset.target);
    tab.style.display = ok ? '' : 'none';
    if (!ok) { tab.classList.remove('is-active'); panel?.classList.remove('is-active'); }
    else if (!firstVisible) firstVisible = tab;
    if (ok && tab.classList.contains('is-active')) hasActive = true;
  });
  if (!hasActive && firstVisible) {
    firstVisible.classList.add('is-active');
    document.getElementById(firstVisible.dataset.target)?.classList.add('is-active');
  }

  // Sub-panel urus akaun: superadmin & admin sahaja (doktor nampak profil sahaja).
  if (!canManageAccounts(role)) {
    document.querySelectorAll('[data-manage-accounts]').forEach(el => { el.style.display = 'none'; });
  }
}

/* ---------- 7. HERO CAROUSEL --------------------------------------- */
function initCarousel() {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;
  const slides = [...root.querySelectorAll('.slide')];
  const dotsWrap = root.querySelector('.carousel-dots');
  if (slides.length === 0) return;
  let idx = 0, timer = null;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Papar slaid ' + (i + 1));
    b.addEventListener('click', () => go(i, true));
    dotsWrap.appendChild(b);
  });
  const dots = [...dotsWrap.children];
  function go(n, manual) {
    slides[idx].classList.remove('is-active'); dots[idx].classList.remove('is-active');
    idx = (n + slides.length) % slides.length;
    slides[idx].classList.add('is-active'); dots[idx].classList.add('is-active');
    if (manual) restart();
  }
  function next() { go(idx + 1); }
  function restart() { if (reduce) return; clearInterval(timer); timer = setInterval(next, 6000); }
  root.querySelector('.next')?.addEventListener('click', () => go(idx + 1, true));
  root.querySelector('.prev')?.addEventListener('click', () => go(idx - 1, true));
  go(0); restart();
  root.addEventListener('mouseenter', () => clearInterval(timer));
  root.addEventListener('mouseleave', restart);
}

/* ---------- 8. TABS + FAQ ------------------------------------------ */
function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const tabs = [...group.querySelectorAll('.tab')];
    const panels = [...group.querySelectorAll('.tab-panel')];
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      panels.forEach(p => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      group.querySelector('#' + tab.dataset.target)?.classList.add('is-active');
    }));
  });
}
function initFaq() {
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const ans = item.querySelector('.faq-a');
      const open = item.classList.toggle('open');
      ans.style.maxHeight = open ? ans.scrollHeight + 'px' : null;
    });
  });
}

/* ---------- 9. AUTH FORMS (login / daftar) ------------------------- */
function val(id) { return (document.getElementById(id)?.value || '').trim(); }
function setMsg(id, text) {
  const el = document.getElementById(id); if (!el) return;
  const span = el.querySelector('span');
  if (span) span.textContent = text; else el.textContent = text;
  el.style.display = text ? 'flex' : 'none';
}

// Normalisasi no. telefon: buang aksara bukan digit; tukar awalan '60' → '0'
// supaya 0123456789 / 012-3456789 / +60123456789 dianggap sama.
function normalizePhone(v) {
  let d = String(v || '').replace(/\D/g, '');
  if (d.startsWith('60')) d = '0' + d.slice(2);
  return d;
}

function initAuthForms() {
  const lf = document.getElementById('login-form');
  if (lf) {
    lf.addEventListener('submit', (e) => {
      e.preventDefault();
      const idRaw = val('login-id').trim(), pass = val('login-pass');
      const isEmail = idRaw.includes('@');
      const u = isEmail
        ? getUsers().find(x => (x.email || '').toLowerCase() === idRaw.toLowerCase())
        : getUsers().find(x => normalizePhone(x.phone) === normalizePhone(idRaw));
      if (!u) { setMsg('login-msg', isEmail ? 'E-mel ini belum berdaftar. Sila daftar akaun dahulu.' : 'No. telefon ini belum berdaftar. Sila daftar akaun dahulu.'); return; }
      if (u.password && pass && u.password !== pass) { setMsg('login-msg', 'Kata laluan salah. Sila cuba lagi.'); return; }
      sessionStorage.setItem('ejejak_user', JSON.stringify({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: 'parent' }));
      window.location.href = nextAfterLogin();
    });
  }

  // Butang "Log masuk / Daftar dengan Google" pada login.html & daftar.html
  const gbtn = document.getElementById('google-login');
  if (gbtn) gbtn.addEventListener('click', () => openGoogleChooser(loginWithGoogle));
  const af = document.getElementById('admin-login-form');
  if (af) {
    af.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = val('admin-email').toLowerCase(), pass = val('admin-pass');
      const a = getAdmins().find(x => x.email.toLowerCase() === email);
      if (!a) { setMsg('admin-msg', 'E-mel doktor tidak berdaftar. Sila hubungi pentadbir.'); return; }
      if (a.password && pass && a.password !== pass) { setMsg('admin-msg', 'Kata laluan salah. Sila cuba lagi.'); return; }
      sessionStorage.setItem('ejejak_admin', JSON.stringify({ id: a.id, name: a.name, email: a.email, phone: a.phone, jawatan: a.jawatan, org: a.org, role: a.role || 'doctor' }));
      logAudit('login', 'Log masuk panel staf');
      window.location.href = 'admin.html';
    });
  }

  const rf = document.getElementById('register-form');
  if (rf) {
    // Jenis akaun terpilih: 'screening' (ada anak + saringan) atau 'knowledge' (e-Pembelajaran sahaja).
    // Butiran keluarga (ibu/bapa) & daerah TIDAK dikumpul di sini — ia dilengkapkan di Profil Saya.
    const acctType = () => (document.querySelector('input[name="reg-acctype"]:checked')?.value) || 'screening';

    // ---- Keadaan OTP (simulasi mockup — tiada SMS/e-mel sebenar) ----
    let otpCode = null;        // kod demo 6-digit semasa
    let pendingUser = null;    // objek pengguna menanti pengesahan OTP

    const genOtp = () => String(Math.floor(100000 + Math.random() * 900000));

    // Saluran OTP yang dipilih: 'email' atau 'phone' (telefon/SMS).
    const otpMethod = () => (document.querySelector('input[name="otp-method"]:checked')?.value) || 'email';
    const otpDestText = () => {
      const via = otpMethod();
      const dest = via === 'phone' ? val('reg-phone') : val('reg-email');
      return via === 'phone'
        ? `no. telefon ${dest || 'anda'} (SMS)`
        : `e-mel ${dest || 'anda'}`;
    };

    const showOtp = () => {
      const sec = document.getElementById('otp-section');
      if (!sec) return;
      otpCode = genOtp();
      const codeEl = document.getElementById('otp-demo-code');
      if (codeEl) codeEl.textContent = `Kod demo: ${otpCode} — dalam sistem sebenar dihantar ke ${otpDestText()}.`;
      const inp = document.getElementById('otp-input'); if (inp) inp.value = '';
      setMsg('otp-msg', '');
      sec.style.display = '';
      sec.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (inp) inp.focus();
    };

    const finalizeUser = () => {
      if (!pendingUser) return;
      const users = getUsers();
      // Semak semula pertindihan e-mel (mungkin dicipta di tab lain).
      if (users.some(x => (x.email || '').toLowerCase() === pendingUser.email)) {
        setMsg('otp-msg', 'E-mel ini sudah berdaftar. Sila log masuk.'); return;
      }
      pendingUser.verified = true;
      users.push(pendingUser);
      saveUsers(users);
      sessionStorage.setItem('ejejak_user', JSON.stringify({
        id: pendingUser.id, name: pendingUser.name, email: pendingUser.email,
        phone: pendingUser.phone, role: 'parent', accountType: pendingUser.accountType,
      }));
      // Akaun e-Pembelajaran → pendidikan.html; saringan → dashboard.html.
      window.location.href = pendingUser.accountType === 'knowledge' ? 'pendidikan.html' : 'dashboard.html';
    };

    // Wayar butang pengesahan & hantar semula OTP (sekali sahaja).
    const otpVerifyBtn = document.getElementById('otp-verify');
    if (otpVerifyBtn) otpVerifyBtn.addEventListener('click', () => {
      const entered = val('otp-input');
      if (!entered) { setMsg('otp-msg', 'Sila masukkan kod pengesahan 6-digit.'); return; }
      if (entered !== otpCode) { setMsg('otp-msg', 'Kod pengesahan salah. Sila semak dan cuba lagi.'); return; }
      finalizeUser();
    });
    const otpResendBtn = document.getElementById('otp-resend');
    if (otpResendBtn) otpResendBtn.addEventListener('click', () => {
      showOtp();
      setMsg('otp-msg', 'Kod baharu dijana (demo).');
    });

    rf.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = acctType();
      const name = val('reg-name'), email = val('reg-email').toLowerCase(), phone = val('reg-phone'), pass = val('reg-pass'), pass2 = val('reg-pass2');

      // Medan asas — wajib untuk kedua-dua jenis akaun.
      if (!name)  { setMsg('reg-msg', 'Sila masukkan nama penuh anda.'); return; }
      if (!email) { setMsg('reg-msg', 'Sila masukkan e-mel anda.'); return; }
      if (!phone) { setMsg('reg-msg', 'Sila masukkan nombor telefon — diperlukan supaya doktor boleh menghubungi anda.'); return; }
      if (!pass)  { setMsg('reg-msg', 'Sila masukkan kata laluan.'); return; }
      if (pass !== pass2) { setMsg('reg-msg', 'Kata laluan dan pengesahan tidak sepadan.'); return; }

      const users = getUsers();
      if (users.some(x => (x.email || '').toLowerCase() === email)) { setMsg('reg-msg', 'E-mel ini sudah berdaftar. Sila log masuk.'); return; }

      const id = 'U' + Date.now();
      // Butiran keluarga & daerah dilengkapkan kemudian di Profil Saya (kedua-dua jenis akaun).
      const base = { id, name, email, phone, password: pass, role: 'parent', accountType: type, verified: false, district: '', createdAt: new Date().toISOString() };

      pendingUser = base;
      setMsg('reg-msg', '');
      showOtp();
    });
  }
}

/* ---------- LOG MASUK GOOGLE (SIMULASI MOCKUP) ---------------------
   PENTING: Ini BUKAN OAuth sebenar. Tiada backend, tiada Client Secret,
   tiada panggilan ke pelayan Google. Ia hanya MENIRU rupa pemilih akaun
   Google untuk demo. Dalam sistem Laravel sebenar, butang ini akan
   redirect ke Laravel Socialite: /auth/google/redirect → /callback.
------------------------------------------------------------------- */
const GOOGLE_G_SVG = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';

// Akaun demo yang dipaparkan dalam pemilih. Akaun pertama sepadan dengan
// pengguna sedia ada (ibu@contoh.com); yang lain akan dicipta bila dipilih.
const GOOGLE_DEMO_ACCOUNTS = [
  { name: 'Siti Nurhaliza', email: 'ibu@contoh.com',       avatar: 'S', color: '#DB4437' },
  { name: 'Nurul Huda',     email: 'nurul.huda@gmail.com', avatar: 'N', color: '#4285F4' },
];

function openGoogleChooser(onPick) {
  document.getElementById('g-chooser')?.remove();
  const rows = GOOGLE_DEMO_ACCOUNTS.map((a, i) => `
    <button class="g-acct" type="button" data-g="${i}">
      <span class="g-acct__av" style="background:${a.color}">${a.avatar}</span>
      <span class="g-acct__meta"><b>${a.name}</b><span>${a.email}</span></span>
    </button>`).join('');
  const ov = document.createElement('div');
  ov.className = 'modal-overlay open';
  ov.id = 'g-chooser';
  ov.innerHTML = `
    <div class="modal" style="max-width:400px" role="dialog" aria-label="Pilih akaun Google">
      <div class="modal__body">
        <div style="display:flex; align-items:center; gap:.55em; margin-bottom:var(--sp-2)">
          <span class="g-logo" style="width:22px; height:22px">${GOOGLE_G_SVG}</span>
          <strong style="font-family:var(--font-head)">Pilih akaun</strong>
        </div>
        <p class="muted" style="font-size:var(--fs-sm); margin:0 0 var(--sp-3)">untuk meneruskan ke <b>e-Jejak Anak</b></p>
        <div class="g-list">
          ${rows}
          <button class="g-acct g-acct--other" type="button" data-g="other">
            <span class="g-acct__av">+</span>
            <span class="g-acct__meta"><b>Guna akaun lain</b></span>
          </button>
        </div>
        <p class="g-note">Simulasi demo — tiada log masuk Google sebenar.</p>
      </div>
    </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', (e) => {
    if (e.target === ov) { ov.remove(); return; }        // klik luar → tutup
    const btn = e.target.closest('[data-g]');
    if (!btn) return;
    const key = btn.dataset.g;
    ov.remove();
    if (key === 'other') {
      const email = (prompt('Masukkan e-mel Google anda:') || '').trim().toLowerCase();
      if (!email || !email.includes('@')) return;
      const name = email.split('@')[0].replace(/[._]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      onPick({ name, email });
    } else {
      onPick(GOOGLE_DEMO_ACCOUNTS[+key]);
    }
  });
}

function loginWithGoogle(account) {
  const users = getUsers();
  let u = users.find(x => (x.email || '').toLowerCase() === account.email.toLowerCase());
  if (!u) {
    // Akaun Google baharu → cipta pengguna (tiada kata laluan; telefon dilengkapkan kemudian di profil)
    u = { id: 'U' + Date.now(), name: account.name, email: account.email, phone: '',
          role: 'parent', provider: 'google', createdAt: new Date().toISOString() };
    users.push(u);
    saveUsers(users);
  }
  sessionStorage.setItem('ejejak_user', JSON.stringify({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: 'parent' }));
  window.location.href = nextAfterLogin();
}

/* ---------- 10. DASHBOARD IBU BAPA (ringkasan sahaja) --------------
   Halaman dashboard kini bersih: statistik + kad hub + sejarah terkini.
   Butiran penuh dipecahkan: Anak → anak.html, Sejarah → sejarah.html,
   Keluarga & Profil → profil.html. */
function initDashboard() {
  const hub = document.getElementById('dash-hub');
  if (!hub) return;
  const user = currentUser();
  if (!user) return;
  document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = user.name.split(' ')[0]);

  const rec = getUsers().find(x => x.id === user.id) || user;
  const isKnowledge = rec.accountType === 'knowledge';

  const kids = childrenOf(user.id);
  const subs = getSubmissions().filter(s => s.userId === user.id);
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('st-children', kids.length);
  set('st-screenings', subs.length);
  const avg = subs.length ? Math.round(subs.reduce((a, s) => a + s.totalAchieved / s.total, 0) / subs.length * 100) : 0;
  set('st-avg', avg + '%');

  // Akaun e-Pembelajaran: sembunyikan elemen khusus saringan, papar banner.
  if (isKnowledge) {
    document.getElementById('dash-knowledge')?.style.setProperty('display', 'flex');
    document.querySelectorAll('[data-screening-only]').forEach(el => el.style.setProperty('display', 'none'));
  }

  // Sejarah saringan terkini (5) — merentas semua anak.
  const hb = document.getElementById('dash-history');
  if (hb) {
    const recent = subs.slice().sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1)).slice(0, 5);
    hb.innerHTML = recent.length ? recent.map(s => {
      const isAsd = s.type === 'mchat' || s.type === 'sensori';
      const t = triageOf(s);
      const markah = isAsd ? `<span class="muted">Risiko autisme</span> <strong class="tnum">${s.autismRisk}%</strong>`
        : `<strong class="tnum">${s.totalAchieved}/${s.total}</strong> <span class="muted">(${t.pct}%)</span>`;
      const tag = isAsd ? `<span class="chip">${s.type === 'mchat' ? 'M-CHAT' : 'Deria'} · ${s.autismBand || '—'}</span>`
        : `<span class="triage ${t.cls}"><span class="tdot"></span>${t.label}</span>`;
      return `<tr class="${isAsd ? '' : t.row}">
        <td><strong>${s.childName}</strong></td>
        <td class="muted" style="white-space:nowrap">${fmtDate(s.submittedAt)}</td>
        <td>${ageText(s.ageMonths)}</td>
        <td>${markah}</td>
        <td>${tag}</td>
        <td class="col-action"><a class="btn btn--ghost" href="sejarah.html?child=${s.childId}" style="padding:.3em .6em">${ICONS.eye} Lihat</a></td>
      </tr>`;
    }).join('') : `<tr><td colspan="6" style="text-align:center; padding:var(--sp-4); color:var(--muted)">Tiada saringan lagi. <a href="saringan.html">Mula saringan pertama</a>.</td></tr>`;
  }
}

/* ---------- 10b. MAKLUMAT ANAK (anak.html) ------------------------
   Urus profil anak: senarai kad anak + borang tambah. Dipisahkan
   daripada dashboard supaya dashboard kekal ringkas. */
function initAnak() {
  const grid = document.getElementById('child-grid');
  if (!grid) return;
  const user = currentUser();
  if (!user) return;
  document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = user.name.split(' ')[0]);

  function render() {
    const kids = childrenOf(user.id);
    const subs = getSubmissions().filter(s => s.userId === user.id);
    grid.innerHTML = kids.map(c => {
      const m = ageInMonths(c.dob);
      const kidSubs = subs.filter(s => s.childId === c.id);
      const last = kidSubs[0];
      const lastPct = last ? Math.round(last.totalAchieved / last.total * 100) + '%' : '—';
      const initial = (c.name || '?').charAt(0).toUpperCase();
      return `<div class="child-card">
        <div class="child-card__top">
          <span class="avatar avatar--${c.gender === 'perempuan' ? 'girl' : 'boy'}">${initial}</span>
          <div class="child-card__meta">
            <strong>${c.name}</strong><br>
            <span class="muted" style="font-size:var(--fs-sm)">${c.gender} · ${ageText(m)} · ${ageGroupLabel(m)}</span>
            ${c.tempatLahir ? `<br><span class="muted" style="font-size:var(--fs-xs); display:inline-flex; align-items:center; gap:4px"><svg viewBox="0 0 24 24" width="13" height="13" style="flex:none" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>${c.tempatLahir}</span>` : ''}
          </div>
        </div>
        <div class="child-card__stats">
          <div class="mini-stat"><b class="tnum">${kidSubs.length}</b><span>Saringan</span></div>
          <div class="mini-stat"><b class="tnum">${lastPct}</b><span>Terakhir</span></div>
        </div>
        <a class="btn btn--block" href="saringan.html?child=${c.id}">Mula Saringan</a>
        <div class="flex gap-2">
          <a class="btn btn--ghost btn--block" href="sejarah.html?child=${c.id}">${ICONS.chart} Sejarah</a>
          <button class="btn btn--ghost" data-del-child="${c.id}" title="Padam profil" style="flex:none">${ICONS.trash}</button>
        </div>
      </div>`;
    }).join('') + `
      <button class="add-card" id="show-add-child" type="button">
        <div>
          ${ICONS.plus}
          <strong style="display:block; font-family:var(--font-head)">Tambah Profil Anak</strong>
          <span class="muted" style="font-size:var(--fs-sm)">Nama, tarikh lahir &amp; jantina</span>
        </div>
      </button>`;

    document.getElementById('empty-hint')?.style.setProperty('display', kids.length === 0 ? 'flex' : 'none');

    grid.querySelectorAll('[data-del-child]').forEach(btn => btn.addEventListener('click', () => {
      if (!confirm('Padam profil anak ini? Sejarah saringan berkaitan juga akan dipadam.')) return;
      const id = btn.dataset.delChild;
      saveChildren(getChildren().filter(c => c.id !== id));
      saveSubmissions(getSubmissions().filter(s => s.childId !== id));
      render();
    }));
    document.getElementById('show-add-child')?.addEventListener('click', () => {
      document.getElementById('add-child-card')?.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('cn')?.focus();
    });
  }
  render();

  document.getElementById('add-child-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = val('cn'), dob = val('dob'), gender = val('gender'), tempatLahir = val('c-tempat');
    if (!name || !dob || !gender) { alert('Sila lengkapkan nama, tarikh lahir dan jantina.'); return; }
    const kids = getChildren();
    kids.push({ id: 'C' + Date.now(), userId: user.id, name, dob, gender, tempatLahir });
    saveChildren(kids);
    e.target.reset();
    render();
    alert('Profil anak berjaya disimpan.');
  });
}

/* ---------- 11. SARINGAN ------------------------------------------- */
/* Soalan M-CHAT (versi ringkas, gaya M-CHAT-R untuk kanak-kanak kecil) —
   saringan tanda awal autisme. Setiap item: { text, riskIf } di mana `riskIf`
   ialah jawapan yang menandakan RISIKO ('tidak' bagi kemahiran sepatutnya ada;
   'ya' bagi tingkah laku membimbangkan). DEMO/SIMULASI — bukan diagnosis. */
const MCHAT_ITEMS = [
  { text: 'Jika anda menunjuk sesuatu di seberang bilik, adakah anak anda memandang ke arah tersebut?', riskIf: 'tidak' },
  { text: 'Adakah anak anda menunjuk dengan jari untuk meminta sesuatu atau meminta bantuan?', riskIf: 'tidak' },
  { text: 'Adakah anak anda menunjuk dengan jari untuk menunjukkan sesuatu yang menarik kepada anda?', riskIf: 'tidak' },
  { text: 'Adakah anak anda melihat wajah anda untuk melihat reaksi anda dalam situasi baharu?', riskIf: 'tidak' },
  { text: 'Adakah anak anda meniru perbuatan anda (cth. melambai, bertepuk tangan)?', riskIf: 'tidak' },
  { text: 'Adakah anak anda bertindak balas apabila namanya dipanggil?', riskIf: 'tidak' },
  { text: 'Adakah anak anda tersenyum balas apabila anda tersenyum kepadanya?', riskIf: 'tidak' },
  { text: 'Adakah anak anda berminat bermain bersama kanak-kanak lain?', riskIf: 'tidak' },
  { text: 'Adakah anak anda membawa objek untuk menunjukkannya kepada anda?', riskIf: 'tidak' },
  { text: 'Adakah anak anda berpura-pura bermain (cth. berpura-pura memberi makan anak patung)?', riskIf: 'tidak' },
  { text: 'Adakah anak anda kerap melakukan pergerakan berulang yang luar biasa (cth. mengibas tangan, bergoyang badan)?', riskIf: 'ya' },
  { text: 'Adakah anak anda sangat terganggu oleh bunyi harian (cth. mesin basuh, keramaian)?', riskIf: 'ya' },
];

/* Soalan Profil Deria (Sensori) — versi ringkas. Setiap item riskIf='ya'
   (tindak balas deria luar biasa). DEMO/SIMULASI. */
const SENSORI_ITEMS = [
  { text: 'Adakah anak anda kelihatan terlalu sensitif terhadap bunyi kuat (menutup telinga, menangis)?', riskIf: 'ya' },
  { text: 'Adakah anak anda mengelak daripada disentuh atau tidak suka dipeluk?', riskIf: 'ya' },
  { text: 'Adakah anak anda terlalu memilih dari segi tekstur makanan atau pakaian?', riskIf: 'ya' },
  { text: 'Adakah anak anda kerap mencari rangsangan gerakan (berpusing, melompat, menghayun) secara berlebihan?', riskIf: 'ya' },
  { text: 'Adakah anak anda kelihatan tidak bertindak balas terhadap kesakitan atau suhu?', riskIf: 'ya' },
  { text: 'Adakah anak anda mudah terganggu oleh cahaya terang atau corak visual?', riskIf: 'ya' },
  { text: 'Adakah anak anda suka menghidu atau menjilat objek yang bukan makanan?', riskIf: 'ya' },
  { text: 'Adakah anak anda sukar menumpukan perhatian dalam persekitaran yang bising atau sibuk?', riskIf: 'ya' },
];

function autismBandFor(pct) {
  if (pct >= 60) return 'tinggi';
  if (pct >= 30) return 'sederhana';
  return 'rendah';
}

function initScreening() {
  const host = document.getElementById('screening-form');
  if (!host) return;
  const user = currentUser();
  if (!user) return;

  const noChild = document.getElementById('no-child');
  const formArea = document.getElementById('screening-area');

  // Pengguna e-Pembelajaran sahaja tidak membuat saringan → pandu ke Pusat Pendidikan.
  if (user.accountType === 'knowledge') {
    if (formArea) formArea.style.display = 'none';
    const main = host.closest('.container') || document.querySelector('main .container');
    if (main) {
      const guardBox = document.createElement('div');
      guardBox.className = 'notice';
      guardBox.style.marginBottom = 'var(--sp-4)';
      guardBox.innerHTML = `${ICONS.info}<span>Akaun anda ialah akaun <strong>e-Pembelajaran sahaja</strong> — tanpa saringan anak. Sila lawati <a href="pendidikan.html">Pusat Pendidikan</a> untuk artikel, tips dan video pembelajaran. Anda dialihkan ke sana sebentar lagi…</span>`;
      main.insertBefore(guardBox, main.firstChild);
    }
    setTimeout(() => { window.location.replace('pendidikan.html'); }, 2500);
    return;
  }

  const kids = childrenOf(user.id);
  const childSelect = document.getElementById('child-select');

  // Tiada anak → minta tambah dahulu
  if (kids.length === 0) {
    if (noChild) noChild.style.display = 'block';
    if (formArea) formArea.style.display = 'none';
    return;
  }

  // Isi pemilih anak
  const params = new URLSearchParams(location.search);
  const preChild = params.get('child');
  childSelect.innerHTML = kids.map(c =>
    `<option value="${c.id}"${c.id === preChild ? ' selected' : ''}>${c.name}</option>`).join('');

  const ageEl = document.getElementById('child-age');
  const groupEl = document.getElementById('child-agegroup');
  const domainNav = document.getElementById('domain-nav');
  const bannerEl = document.getElementById('age-banner');
  const totalEl = document.getElementById('q-total');
  const doneEl = document.getElementById('q-done');
  const bar = document.getElementById('q-bar');
  const ringVal = document.getElementById('ring-val');
  const submitBtn = document.getElementById('submit-screening');
  const modeTabs = document.getElementById('screen-mode');
  function selectedChild() { return kids.find(c => c.id === childSelect.value) || kids[0]; }

  let mode = 'perkembangan';   // 'perkembangan' | 'mchat' | 'sensori'
  let total = 0;

  // Domain + soalan yang SEPADAN dengan umur anak (Checklist mengikut umur)
  function checklistFor(ageM) {
    return getDomains()
      .map(d => ({ ...d, qs: (d.questions || []).filter(q => ageM >= q.minM && ageM <= q.maxM) }))
      .filter(d => d.qs.length > 0);
  }

  function refresh() {
    const done = host.querySelectorAll('input[type=radio]:checked').length;
    if (doneEl) doneEl.textContent = done;
    const pct = total ? Math.round((done / total) * 100) : 0;
    if (bar) bar.style.width = pct + '%';
    if (ringVal) ringVal.textContent = pct + '%';
    host.querySelectorAll('.q-item').forEach(item => item.classList.toggle('answered', !!item.querySelector('input:checked')));
  }

  // Bina blok soalan Ya/Tidak generik (dipakai oleh M-CHAT & Sensori).
  function ynBlock(code, name, icon, color, items, note) {
    const block = document.createElement('div');
    block.className = 'domain-block';
    block.id = 'dom-' + code;
    block.style.setProperty('--dc', color);
    const qhtml = items.map((q, i) => {
      const nm = `${code}_${i}`;
      return `<div class="q-item" data-q="${nm}">
        <div class="q-item__text"><span class="qn">${i + 1}.</span>${q.text}</div>
        <div class="yn">
          <input type="radio" id="${nm}_y" name="${nm}" value="ya">
          <label for="${nm}_y">${ICONS.check} Ya</label>
          <input type="radio" id="${nm}_t" name="${nm}" value="tidak">
          <label for="${nm}_t">Tidak</label>
        </div>
      </div>`;
    }).join('');
    block.innerHTML = `<div class="domain-block__head"><span class="badge-ico">${ICONS[icon] || ICONS.star}</span><h3>${name}</h3></div>` +
      (note ? `<div class="notice notice--warn" style="margin:0 0 var(--sp-3)">${ICONS.warning}<span>${note}</span></div>` : '') + qhtml;
    return block;
  }

  // ---- MOD: Perkembangan (5 domain, mengikut umur) — kelakuan asal ----
  function buildDevelopment() {
    const c = selectedChild();
    const m = ageInMonths(c.dob);
    if (ageEl) ageEl.value = ageText(m);
    if (groupEl) groupEl.value = ageGroupLabel(m);

    const fd = checklistFor(m);
    total = fd.reduce((a, d) => a + d.qs.length, 0);
    host.innerHTML = '';
    if (domainNav) domainNav.innerHTML = '';

    if (bannerEl) bannerEl.innerHTML = `${ICONS.info}<span>Menyaring kemahiran untuk kumpulan umur <strong>${ageGroupLabel(m)}</strong> — ${total} soalan disesuaikan mengikut umur anak.</span>`;

    if (total === 0) {
      host.innerHTML = `<div class="notice notice--warn">${ICONS.warning}<span>Tiada soalan disediakan untuk kumpulan umur ini lagi. Sila hubungi pentadbir.</span></div>`;
      if (submitBtn) submitBtn.disabled = true;
      if (totalEl) totalEl.textContent = 0;
      refresh();
      return;
    }
    if (submitBtn) submitBtn.disabled = false;

    fd.forEach(d => {
      if (domainNav) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#dom-${d.code}" style="--dc:${d.color}"><span class="dot"></span>${d.name}<span class="cnt">${d.qs.length}</span></a>`;
        domainNav.appendChild(li);
      }
      host.appendChild(ynBlock(d.code, d.name, d.icon, d.color, d.qs));
    });
    if (totalEl) totalEl.textContent = total;
    refresh();
  }

  // ---- MOD: M-CHAT (saringan autisme) & Sensori (profil deria) ----
  function buildYnScreen(kind) {
    const c = selectedChild();
    const m = ageInMonths(c.dob);
    if (ageEl) ageEl.value = ageText(m);
    if (groupEl) groupEl.value = ageGroupLabel(m);
    if (domainNav) domainNav.innerHTML = '';
    host.innerHTML = '';

    const cfg = kind === 'mchat'
      ? { code: 'MCHAT', name: 'Saringan Autisme (M-CHAT)', icon: 'help', color: '#7C6BB0', items: MCHAT_ITEMS,
          banner: `${ICONS.info}<span><strong>Saringan tanda awal autisme (M-CHAT)</strong> — paling sesuai untuk kanak-kanak <strong>16–30 bulan</strong>. Jawab berdasarkan tingkah laku biasa anak. <em>(demo/simulasi — bukan diagnosis)</em></span>`,
          note: 'Saringan ini <strong>bukan diagnosis</strong>. Ia hanya menganggarkan risiko untuk membantu keputusan sama ada rujukan profesional diperlukan.' }
      : { code: 'SENSORI', name: 'Profil Deria (Sensori)', icon: 'bulb', color: '#E0913C', items: SENSORI_ITEMS,
          banner: `${ICONS.info}<span><strong>Profil deria ringkas</strong> — menilai cara anak bertindak balas terhadap bunyi, sentuhan, gerakan &amp; cahaya. <em>(demo/simulasi — bukan diagnosis)</em></span>`,
          note: 'Profil deria ini <strong>bukan diagnosis</strong>. Rujuk ahli terapi cara kerja (OT) jika terdapat kebimbangan.' };

    total = cfg.items.length;
    if (bannerEl) bannerEl.innerHTML = cfg.banner;
    if (domainNav) {
      const li = document.createElement('li');
      li.innerHTML = `<a href="#dom-${cfg.code}" style="--dc:${cfg.color}"><span class="dot"></span>${cfg.name}<span class="cnt">${total}</span></a>`;
      domainNav.appendChild(li);
    }
    host.appendChild(ynBlock(cfg.code, cfg.name, cfg.icon, cfg.color, cfg.items, cfg.note));
    if (submitBtn) submitBtn.disabled = false;
    if (totalEl) totalEl.textContent = total;
    refresh();
  }

  function build() {
    if (mode === 'perkembangan') buildDevelopment();
    else buildYnScreen(mode);
  }

  // Maklumat ibu bapa (dari akaun — selari dengan data doktor)
  const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v || '—'; };
  setTxt('acc-name', user.name);
  setTxt('acc-phone', user.phone);
  setTxt('acc-email', user.email);

  // Pemilih mod (segmented control)
  if (modeTabs) {
    modeTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-mode]');
      if (!btn || btn.dataset.mode === mode) return;
      mode = btn.dataset.mode;
      modeTabs.querySelectorAll('.tab').forEach(t => {
        const on = t === btn;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      build();
    });
  }

  childSelect.addEventListener('change', build);
  host.addEventListener('change', refresh);
  build();

  submitBtn?.addEventListener('click', () => {
    const c = selectedChild();
    const m = ageInMonths(c.dob);
    const answered = host.querySelectorAll('input[type=radio]:checked').length;
    if (total === 0) return;
    if (answered < total) {
      alert(`Sila jawab semua soalan sebelum menghantar.\nSelesai: ${answered}/${total}`);
      [...host.querySelectorAll('.q-item')].find(it => !it.querySelector('input:checked'))
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (mode === 'mchat' || mode === 'sensori') {
      const items = mode === 'mchat' ? MCHAT_ITEMS : SENSORI_ITEMS;
      const code = mode === 'mchat' ? 'MCHAT' : 'SENSORI';
      const domName = mode === 'mchat' ? 'Saringan Autisme (M-CHAT)' : 'Profil Deria (Sensori)';
      const domColor = mode === 'mchat' ? '#7C6BB0' : '#E0913C';
      let risk = 0; const answers = [];
      items.forEach((q, i) => {
        const ans = host.querySelector(`input[name="${code}_${i}"]:checked`)?.value || 'tidak';
        const atRisk = ans === q.riskIf;
        if (atRisk) risk++;
        answers.push({ text: q.text, answer: ans, atRisk });
      });
      const autismRisk = Math.round((risk / items.length) * 100);
      const autismBand = autismBandFor(autismRisk);
      // "achieved" = item TIADA risiko (untuk paparan carta domain sedia ada).
      const achieved = items.length - risk;

      const result = {
        childName: c.name, type: mode,
        total: items.length, totalAchieved: achieved, totalNot: risk,
        autismRisk, autismBand,
        domains: { [code]: { name: domName, color: domColor, achieved, total: items.length, items: answers } },
      };
      sessionStorage.setItem('ejejak_result', JSON.stringify(result));

      const submission = {
        id: 'S' + Date.now() + Math.floor(Math.random() * 1000),
        submittedAt: new Date().toISOString(),
        type: mode, userId: user.id, childId: c.id,
        childName: c.name, childGender: c.gender, ageMonths: m, ageGroup: ageGroupLabel(m),
        parentName: user.name, parentPhone: user.phone, parentEmail: user.email,
        total: items.length, totalAchieved: achieved, totalNot: risk,
        autismRisk, autismBand,
        domains: result.domains, status: 'baharu', note: '',
      };
      const list = getSubmissions(); list.unshift(submission); saveSubmissions(list);
      window.location.href = 'keputusan.html';
      return;
    }

    // ---- MOD: Perkembangan (5 domain) ----
    const fd = checklistFor(m);
    const result = { childName: c.name, type: 'perkembangan', domains: {}, totalAchieved: 0, totalNot: 0, total };
    fd.forEach(d => {
      let ok = 0; const items = [];
      d.qs.forEach((q, i) => {
        const ans = host.querySelector(`input[name="${d.code}_${i}"]:checked`)?.value || 'tidak';
        if (ans === 'ya') ok++;
        items.push({ text: q.text, answer: ans });
      });
      result.domains[d.code] = { name: d.name, color: d.color, achieved: ok, total: d.qs.length, items };
      result.totalAchieved += ok;
    });
    result.totalNot = total - result.totalAchieved;
    sessionStorage.setItem('ejejak_result', JSON.stringify(result));

    // Hantar ke doktor (selari dengan akaun & profil anak)
    const submission = {
      id: 'S' + Date.now() + Math.floor(Math.random() * 1000),
      submittedAt: new Date().toISOString(),
      type: 'perkembangan', userId: user.id, childId: c.id,
      childName: c.name, childGender: c.gender, ageMonths: m, ageGroup: ageGroupLabel(m),
      parentName: user.name, parentPhone: user.phone, parentEmail: user.email,
      total, totalAchieved: result.totalAchieved, totalNot: result.totalNot,
      domains: result.domains, status: 'baharu', note: '',
    };
    const list = getSubmissions(); list.unshift(submission); saveSubmissions(list);
    window.location.href = 'keputusan.html';
  });
}

/* ---------- 12. KEPUTUSAN ------------------------------------------ */
function initResult() {
  const host = document.getElementById('result-root');
  if (!host) return;
  let data;
  try { data = JSON.parse(sessionStorage.getItem('ejejak_result')); } catch (e) { data = null; }
  if (!data) {
    data = { childName: 'Aisyah binti Rahman', total: 12, totalAchieved: 9, totalNot: 3, domains: mkDom(3, 1, 2, 2, 1) };
  }
  document.querySelectorAll('[data-child-name]').forEach(el => el.textContent = data.childName);

  // Kepala surat + butang cetak (halaman keputusan dicetak sepenuhnya).
  const ph = document.getElementById('print-head');
  if (ph) ph.innerHTML = printLetterhead(data.childName + ' &middot; ' +
    new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' }));
  document.getElementById('btn-print')?.addEventListener('click', () => window.print());

  document.getElementById('sc-achieved').textContent = data.totalAchieved;
  document.getElementById('sc-not').textContent = data.totalNot;
  document.getElementById('sc-total').textContent = data.total;

  // Ringkasan Autisme / Sensori — hanya bila keputusan mempunyai autismRisk.
  const autismEl = document.getElementById('autism-summary');
  const hasAutism = typeof data.autismRisk === 'number';
  if (autismEl) {
    if (hasAutism) {
      const band = data.autismBand || autismBandFor(data.autismRisk);
      const bandMap = {
        rendah:    { label: 'Risiko Rendah',    color: '#4FA96A', tint: 'rgba(79,169,106,.12)' },
        sederhana: { label: 'Risiko Sederhana', color: '#E0913C', tint: 'rgba(224,145,60,.12)' },
        tinggi:    { label: 'Risiko Tinggi',    color: '#D06B7A', tint: 'rgba(208,107,122,.14)' },
      };
      const b = bandMap[band] || bandMap.sederhana;
      const isMchat = data.type === 'mchat';
      const title = isMchat ? 'Keputusan Saringan Autisme (M-CHAT)' : 'Keputusan Profil Deria (Sensori)';
      const advice = band === 'tinggi'
        ? 'Skor menunjukkan beberapa tanda yang perlu diberi perhatian. <strong>Kami sangat menggalakkan rujukan</strong> kepada pegawai perubatan, pakar pediatrik atau ahli terapi untuk penilaian lanjut.'
        : band === 'sederhana'
          ? 'Terdapat beberapa item yang perlu diperhatikan. Pantau perkembangan anak dan pertimbangkan untuk berbincang dengan profesional kesihatan jika kebimbangan berterusan.'
          : 'Buat masa ini, sedikit sahaja tanda dikesan. Teruskan pemantauan berkala dan ulang saringan apabila perlu.';
      autismEl.style.display = 'block';
      autismEl.innerHTML = `
        <div class="card" style="border-left:6px solid ${b.color}; background:${b.tint}">
          <div class="flex items-center gap-2" style="justify-content:space-between; flex-wrap:wrap; gap:var(--sp-3)">
            <div>
              <span class="chip" style="background:${b.color}; color:#fff; border:none">${title}</span>
              <h2 style="margin:var(--sp-2) 0 2px; font-size:var(--fs-lg)">Anggaran risiko: <span style="color:${b.color}">${b.label}</span></h2>
              <p class="muted" style="margin:0; font-size:var(--fs-sm)">${data.totalNot} daripada ${data.total} item menunjukkan tanda yang perlu diperhatikan.</p>
            </div>
            <div style="text-align:center; flex:none">
              <div class="tnum" style="font-family:var(--font-head); font-weight:800; font-size:2.6rem; line-height:1; color:${b.color}">${data.autismRisk}%</div>
              <div class="muted" style="font-size:var(--fs-xs); letter-spacing:.06em; text-transform:uppercase">skor risiko</div>
            </div>
          </div>
          <div class="progress-bar" style="margin:var(--sp-3) 0"><span style="width:${data.autismRisk}%; background:${b.color}"></span></div>
          <p style="margin:0 0 var(--sp-3); font-size:var(--fs-sm)">${advice}</p>
          <div class="notice notice--warn" style="margin:0">${ICONS.warning}<span><strong>PENAFIAN PENTING:</strong> Ini adalah <strong>saringan awal, BUKAN diagnosis perubatan</strong>. Skor ini tidak mengesahkan atau menolak autisme/masalah deria. Hanya profesional kesihatan yang berkelayakan boleh membuat diagnosis. <em>(demo/simulasi)</em></span></div>
        </div>`;
    } else {
      autismEl.style.display = 'none';
      autismEl.innerHTML = '';
    }
  }

  document.getElementById('domain-scores').innerHTML = Object.values(data.domains).map(d => {
    const pct = Math.round((d.achieved / d.total) * 100);
    return `<div class="dscore" style="--dc:${d.color}">
      <div class="dscore__label"><span class="dot"></span>${d.name}</div>
      <div class="progress-bar"><span style="width:${pct}%"></span></div>
      <div class="dscore__pct tnum">${pct}%</div>
    </div>`;
  }).join('');

  const adv = document.getElementById('advisory');
  if (hasAutism) {
    // Mesej susulan untuk M-CHAT/Sensori (penafian penuh sudah di #autism-summary).
    if (data.totalNot > 0) {
      adv.className = 'advisory';
      adv.innerHTML = `${ICONS.info}<p>Ringkasan risiko penuh dipaparkan di bahagian atas. Simpan keputusan ini dan bincangkan dengan doktor atau ahli terapi anak semasa lawatan berikutnya. Saringan ini <strong>bukan diagnosis perubatan</strong>.</p>`;
    } else {
      adv.className = 'advisory advisory--ok';
      adv.innerHTML = `${ICONS.check}<p><strong>Tiada tanda ketara dikesan</strong> dalam saringan ini. Teruskan pemantauan berkala. Saringan ini bukan diagnosis perubatan.</p>`;
    }
  } else if (data.totalNot > 0) {
    adv.className = 'advisory';
    adv.innerHTML = `${ICONS.warning}<p><strong>Terdapat beberapa kemahiran yang belum dicapai.</strong> Ibu bapa digalakkan mendapatkan nasihat daripada profesional sekiranya terdapat kebimbangan. Keputusan ini adalah saringan awal, bukan diagnosis perubatan.</p>`;
  } else {
    adv.className = 'advisory advisory--ok';
    adv.innerHTML = `${ICONS.check}<p><strong>Syabas!</strong> Anak anda telah mencapai semua kemahiran dalam saringan ini mengikut kumpulan umurnya. Teruskan pemantauan berkala.</p>`;
  }

  // Papar Maklumat Pendidikan (Carta Alir) — cadangan bacaan pada halaman keputusan
  const eduEl = document.getElementById('result-edu');
  if (eduEl) {
    const media = { artikel: 'var(--brand)', tips: '#E0913C', aktiviti: '#4FA96A' };
    const picks = getArticles().filter(a => a.published && a.category !== 'faq').slice(0, 3);
    eduEl.innerHTML = picks.map(a => `
      <a class="article-card" href="pendidikan.html#${a.category}">
        <div class="article-card__media" style="background:linear-gradient(135deg, ${media[a.category] || 'var(--brand)'}, #0C4A5A)">${ICONS.book}</div>
        <div class="article-card__body">
          <span class="chip">${ARTICLE_CATS[a.category]}</span>
          <h3>${a.title}</h3>
          <p>${a.body.slice(0, 100)}…</p>
          <div class="article-card__meta"><span>Bacaan 4 minit</span><span>Baca →</span></div>
        </div>
      </a>`).join('');
  }
}

/* ---------- 13. PANEL DOKTOR: KEPUTUSAN + HUBUNGI ------------------ */
function triageOf(s) {
  const pct = Math.round((s.totalAchieved / s.total) * 100);
  if (s.totalNot === 0) return { label: 'Pemantauan', cls: 'triage--ok', row: 'row-ok', pct };
  if (pct < 70) return { label: 'Perlu Rujukan', cls: 'triage--ref', row: 'row-ref', pct };
  return { label: 'Perhatian', cls: 'triage--warn', row: 'row-warn', pct };
}
function waLink(phone) { let p = (phone || '').replace(/\D/g, ''); if (p.startsWith('0')) p = '60' + p.slice(1); return 'https://wa.me/' + p; }
function fmtDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' +
           d.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' });
  } catch (e) { return iso; }
}

function initAdmin() {
  const rows = document.getElementById('sub-rows');
  if (!rows) return;
  const admin = currentAdmin();
  if ((admin?.role || 'doctor') !== 'doctor') return; // klinikal: doktor sahaja

  let fSearch = '', fTriage = 'semua', fStatus = 'semua';
  const triageMap = { ok: 'triage--ok', warn: 'triage--warn', ref: 'triage--ref' };
  const modal = document.getElementById('contact-modal');
  let activeId = null;

  function render() {
    const list = getSubmissions();
    const ref = list.filter(s => triageOf(s).cls === 'triage--ref').length;
    const baharu = list.filter(s => s.status === 'baharu').length;
    document.getElementById('st-total').textContent = list.length;
    document.getElementById('st-baharu').textContent = baharu;
    document.getElementById('st-rujukan').textContent = ref;

    const q = fSearch.trim().toLowerCase();
    const shown = list.filter(s => {
      if (fTriage !== 'semua' && triageOf(s).cls !== triageMap[fTriage]) return false;
      if (fStatus !== 'semua' && s.status !== fStatus) return false;
      if (q && !(`${s.childName} ${s.parentName || ''}`.toLowerCase().includes(q))) return false;
      return true;
    });

    const countEl = document.getElementById('sub-count');
    if (countEl) countEl.textContent = `Memaparkan ${shown.length} daripada ${list.length} saringan.`;

    if (shown.length === 0) {
      rows.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:var(--sp-5); color:var(--muted)">Tiada rekod untuk penapis ini.</td></tr>`;
      return;
    }
    rows.innerHTML = shown.map(s => {
      const t = triageOf(s);
      const bars = Object.values(s.domains).map(d => {
        const p = d.achieved / d.total;
        return `<i style="background:${d.color}; opacity:${0.25 + p * 0.75}" title="${d.name}: ${d.achieved}/${d.total}"></i>`;
      }).join('');
      const contact = s.parentPhone || s.parentEmail || '—';
      return `<tr class="${t.row}">
        <td class="sev"><strong>${s.childName}</strong><br>
          <span class="muted" style="font-size:var(--fs-xs)">${s.childGender || '-'} · ${ageText(s.ageMonths)} · ${s.ageGroup}</span>
          <span class="mini-domains">${bars}</span></td>
        <td>${s.parentName}<br><span class="muted" style="font-size:var(--fs-xs)">${contact}</span></td>
        <td class="muted" style="font-size:var(--fs-sm); white-space:nowrap">${fmtDate(s.submittedAt)}</td>
        <td><strong class="tnum">${s.totalAchieved}/${s.total}</strong> <span class="muted">(${t.pct}%)</span><br>
          <span class="triage ${t.cls}"><span class="tdot"></span>${t.label}</span></td>
        <td><span class="status-pill ${s.status}">${s.status === 'dihubungi' ? 'Dihubungi' : 'Baharu'}</span>${s.contactedBy ? `<br><span class="muted" style="font-size:var(--fs-xs)">${s.contactedBy}</span>` : ''}</td>
        <td><div class="flex gap-2" style="flex-wrap:wrap">
          <button class="btn btn--ghost" data-view="${s.id}" style="padding:.55em .8em">${ICONS.eye} Lihat</button>
          <button class="btn" data-contact="${s.id}" style="padding:.55em .9em">${ICONS.phone} Hubungi</button>
        </div></td>
      </tr>`;
    }).join('');
  }

  document.getElementById('sub-search')?.addEventListener('input', (e) => { fSearch = e.target.value; render(); });
  document.getElementById('sub-triage')?.addEventListener('change', (e) => { fTriage = e.target.value; render(); });
  document.getElementById('sub-status')?.addEventListener('change', (e) => { fStatus = e.target.value; render(); });

  rows.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-contact]');
    if (!btn) return;
    activeId = btn.dataset.contact;
    const s = getSubmissions().find(x => x.id === activeId);
    if (!s || !modal) return;
    const t = triageOf(s);
    document.getElementById('m-child').textContent = `${s.childName} · ${ageText(s.ageMonths)} · ${s.ageGroup}`;
    document.getElementById('m-parent').textContent = s.parentName;
    document.getElementById('m-summary').innerHTML =
      `Markah: <strong>${s.totalAchieved}/${s.total} (${t.pct}%)</strong> · <span class="triage ${t.cls}"><span class="tdot"></span>${t.label}</span>`;
    document.getElementById('m-info').innerHTML =
      (s.parentPhone ? `<div class="contact-row">${ICONS.phone}<span><b>Telefon:</b> ${s.parentPhone}</span></div>` : '') +
      (s.parentEmail ? `<div class="contact-row">${ICONS.mail}<span><b>E-mel:</b> ${s.parentEmail}</span></div>` : '') +
      `<div class="contact-row">${ICONS.baby}<span><b>Status:</b> ${s.status === 'dihubungi' ? 'Sudah dihubungi' : 'Belum dihubungi'}${s.contactedBy ? ` oleh ${s.contactedBy}` : ''}${s.contactedAt ? ` · ${fmtDate(s.contactedAt)}` : ''}</span></div>`;
    const subj = encodeURIComponent('e-Jejak Anak — Susulan Keputusan Saringan ' + s.childName);
    const body = encodeURIComponent(`Salam ${s.parentName},\n\nSaya ${admin ? admin.name : 'doktor'} dari e-Jejak Anak. Berdasarkan keputusan saringan perkembangan ${s.childName} (${s.totalAchieved}/${s.total} kemahiran dicapai), kami ingin menjemput anda untuk sesi susulan.\n\nSekian, terima kasih.`);
    const call = document.getElementById('m-call'), wa = document.getElementById('m-wa'), mail = document.getElementById('m-mail');
    call.href = s.parentPhone ? 'tel:' + s.parentPhone : '#';
    wa.href = s.parentPhone ? waLink(s.parentPhone) : '#';
    mail.href = s.parentEmail ? `mailto:${s.parentEmail}?subject=${subj}&body=${body}` : '#';
    call.style.opacity = wa.style.opacity = s.parentPhone ? 1 : .4;
    mail.style.opacity = s.parentEmail ? 1 : .4;
    document.getElementById('m-note').value = s.note || '';
    modal.classList.add('open');
  });

  function closeModal() { modal?.classList.remove('open'); activeId = null; }
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.getElementById('m-close')?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Lihat soalan & jawapan yang dijawab
  const detail = document.getElementById('detail-modal');
  function closeDetail() { detail?.classList.remove('open'); }
  rows.addEventListener('click', (e) => {
    const vb = e.target.closest('[data-view]');
    if (!vb || !detail) return;
    const s = getSubmissions().find(x => x.id === vb.dataset.view);
    if (!s) return;
    const t = triageOf(s);
    document.getElementById('d-child').innerHTML =
      `${s.childName} · ${ageText(s.ageMonths)} · ${s.ageGroup} · ${fmtDate(s.submittedAt)} · <strong>${s.totalAchieved}/${s.total} (${t.pct}%)</strong>`;
    document.getElementById('d-body').innerHTML = Object.values(s.domains).map(d => {
      const items = d.items || [];
      const li = items.length
        ? items.map((it, i) => `<li class="flex items-center gap-2" style="justify-content:space-between; padding:.5em .7em; border-radius:8px; background:var(--brand-tint); font-size:var(--fs-sm)">
            <span>${i + 1}. ${it.text}</span>
            <span class="triage ${it.answer === 'ya' ? 'triage--ok' : 'triage--warn'}" style="flex:none">${it.answer === 'ya' ? 'Ya' : 'Tidak'}</span></li>`).join('')
        : `<li class="muted" style="font-size:var(--fs-sm)">Butiran jawapan tidak direkod untuk rekod contoh ini.</li>`;
      return `<div style="margin-bottom:var(--sp-4)">
        <div class="flex items-center gap-2" style="border-bottom:2px solid ${d.color}; padding-bottom:6px; margin-bottom:8px">
          <strong style="color:${d.color}">${d.name}</strong>
          <span class="muted" style="margin-left:auto; font-size:var(--fs-xs)">${d.achieved}/${d.total} dicapai</span>
        </div>
        <ul style="list-style:none; padding:0; margin:0; display:grid; gap:6px">${li}</ul>
      </div>`;
    }).join('');
    detail.classList.add('open');
  });
  detail?.addEventListener('click', (e) => { if (e.target === detail) closeDetail(); });
  document.getElementById('d-close')?.addEventListener('click', closeDetail);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDetail(); });
  document.getElementById('m-mark')?.addEventListener('click', () => {
    const list = getSubmissions();
    const s = list.find(x => x.id === activeId);
    if (s) {
      s.status = 'dihubungi';
      s.note = document.getElementById('m-note').value;
      s.contactedBy = admin ? admin.name : 'Doktor';
      s.contactedAt = new Date().toISOString();
      saveSubmissions(list);
      logAudit('parent.contact', `Tandakan dihubungi: ${s.childName} (ibu bapa: ${s.parentName})`);
    }
    closeModal(); render();
  });

  render();
}

/* ---------- 14. PENTADBIR: URUS DOMAIN & SOALAN (Modul 6) ---------- */
function initDomainAdmin() {
  const listEl = document.getElementById('domain-list');
  if (!listEl) return;
  if ((currentAdmin()?.role || 'doctor') !== 'doctor') return; // soalan = klinikal (doktor)
  let pickIcon = DOMAIN_ICONS[0];
  let pickColor = DOMAIN_COLORS[0];
  let fDomain = 'all', fBand = 'all';

  // Jadual ringkasan: bilangan soalan berkaitan setiap kumpulan umur × domain
  function renderCoverage() {
    const cov = document.getElementById('coverage-table');
    if (!cov) return;
    const doms = getDomains();
    const head = '<thead><tr><th>Kumpulan Umur</th>' +
      doms.map(d => `<th style="white-space:nowrap">${d.name}</th>`).join('') +
      '<th>Jumlah</th></tr></thead>';
    const rows = AGE_GROUPS.map(([lo, hi, label]) => {
      let rowTotal = 0;
      const cells = doms.map(d => {
        const n = d.questions.filter(q => q.minM <= hi && q.maxM >= lo).length;
        rowTotal += n;
        return `<td class="tnum"${n === 0 ? ' style="color:var(--danger); font-weight:700"' : ''}>${n}</td>`;
      }).join('');
      return `<tr><td><strong>${label}</strong></td>${cells}<td class="tnum"><strong>${rowTotal}</strong></td></tr>`;
    }).join('');
    cov.innerHTML = head + '<tbody>' + rows + '</tbody>';
  }

  function populateFilters() {
    const fd = document.getElementById('filter-domain');
    if (fd) {
      const doms = getDomains();
      if (!doms.some(d => d.code === fDomain)) fDomain = 'all';
      fd.innerHTML = '<option value="all">Semua Domain</option>' +
        doms.map(d => `<option value="${d.code}"${d.code === fDomain ? ' selected' : ''}>${d.name}</option>`).join('');
    }
    const fb = document.getElementById('filter-band');
    if (fb && !fb.dataset.ready) {
      fb.innerHTML = '<option value="all">Semua Umur</option>' +
        AGE_GROUPS.map(([lo, hi, l]) => `<option value="${lo}-${hi}">${l}</option>`).join('');
      fb.dataset.ready = '1';
    }
    if (fb) fb.value = fBand;
  }

  function render() {
    renderCoverage();
    populateFilters();
    let domains = getDomains();
    if (fDomain !== 'all') domains = domains.filter(d => d.code === fDomain);
    const [blo, bhi] = fBand !== 'all' ? fBand.split('-').map(Number) : [0, 72];
    const qMatch = (q) => fBand === 'all' || (q.minM <= bhi && q.maxM >= blo);
    const defBand = fBand !== 'all' ? fBand : '0-72';

    listEl.innerHTML = domains.map(d => {
      const ql = d.questions.map((q, i) => ({ q, i })).filter(o => qMatch(o.q));
      const qhtml = ql.length
        ? ql.map((o, pos) => `<li class="flex items-center gap-2" style="justify-content:space-between; font-size:var(--fs-sm); background:var(--brand-tint); padding:.5em .7em; border-radius:8px">
            <span><b style="color:var(--muted)">${pos + 1}.</b> ${o.q.text} <span class="chip" style="padding:.05em .5em; font-size:.68rem">${bandLabel(o.q)}</span></span>
            <button class="btn btn--ghost" data-del-q="${d.code}|${o.i}" title="Padam soalan" style="padding:.2em .45em; flex:none">${ICONS.trash}</button>
          </li>`).join('')
        : `<li class="muted" style="font-size:var(--fs-sm)">Tiada soalan untuk tapisan ini.</li>`;
      return `
      <div class="card" style="--dc:${d.color}; border-left:4px solid ${d.color}">
        <div class="flex items-center gap-2" style="justify-content:space-between">
          <div class="flex items-center gap-2">
            <span class="domain-card__ico" style="width:38px;height:38px;margin:0">${ICONS[d.icon] || ICONS.star}</span>
            <strong style="font-family:var(--font-head)">${d.name}</strong>
            <span class="muted" style="font-size:var(--fs-xs)">(${ql.length})</span>
          </div>
          ${d.locked ? `<span class="chip">Domain teras</span>`
            : `<button class="btn btn--ghost" data-del-domain="${d.code}" style="padding:.35em .7em">${ICONS.trash} Padam domain</button>`}
        </div>
        <ul style="list-style:none; padding:0; margin:var(--sp-3) 0 0; display:grid; gap:6px">${qhtml}</ul>
        <form data-add-q="${d.code}" class="flex gap-2 wrap mt-3">
          <input class="input" name="q" placeholder="Tambah soalan baharu…" style="flex:1; min-width:180px" required>
          <select class="select" name="band" title="Kumpulan umur" style="flex:none; width:auto">${ageBandOptions(defBand)}</select>
          <button class="btn" type="submit" style="flex:none">${ICONS.plus} Soalan</button>
        </form>
      </div>`;
    }).join('') || `<div class="notice">${ICONS.info}<span>Tiada domain sepadan dengan tapisan.</span></div>`;

    listEl.querySelectorAll('[data-del-domain]').forEach(btn => btn.addEventListener('click', () => {
      if (!confirm('Padam domain ini daripada saringan?')) return;
      saveDomains(getDomains().filter(d => d.code !== btn.dataset.delDomain));
      render();
    }));
    listEl.querySelectorAll('[data-del-q]').forEach(btn => btn.addEventListener('click', () => {
      const [code, idx] = btn.dataset.delQ.split('|');
      const domains = getDomains();
      const d = domains.find(x => x.code === code);
      if (d) { d.questions.splice(Number(idx), 1); saveDomains(domains); render(); }
    }));
    listEl.querySelectorAll('[data-add-q]').forEach(form => form.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = form.dataset.addQ;
      const input = form.querySelector('input[name=q]');
      const q = (input.value || '').trim();
      if (!q) return;
      const [mn, mx] = (form.querySelector('[name=band]')?.value || '0-72').split('-').map(Number);
      const domains = getDomains();
      const d = domains.find(x => x.code === code);
      if (d) { d.questions.push({ text: q, minM: mn, maxM: mx }); saveDomains(domains); logAudit('question.add', `Tambah soalan domain ${d.name}: "${q.slice(0, 50)}"`); render(); }
    }));
  }

  const iconWrap = document.getElementById('icon-picks');
  const colorWrap = document.getElementById('color-swatches');
  if (iconWrap) {
    iconWrap.innerHTML = DOMAIN_ICONS.map((k, i) => `<button type="button" class="icon-pick${i === 0 ? ' sel' : ''}" data-icon="${k}">${ICONS[k]}</button>`).join('');
    iconWrap.addEventListener('click', (e) => {
      const b = e.target.closest('[data-icon]'); if (!b) return;
      iconWrap.querySelectorAll('.icon-pick').forEach(x => x.classList.remove('sel'));
      b.classList.add('sel'); pickIcon = b.dataset.icon;
    });
  }
  if (colorWrap) {
    colorWrap.innerHTML = DOMAIN_COLORS.map((c, i) => `<button type="button" class="swatch${i === 0 ? ' sel' : ''}" data-color="${c}" style="background:${c}" aria-label="Warna ${c}"></button>`).join('');
    colorWrap.addEventListener('click', (e) => {
      const b = e.target.closest('[data-color]'); if (!b) return;
      colorWrap.querySelectorAll('.swatch').forEach(x => x.classList.remove('sel'));
      b.classList.add('sel'); pickColor = b.dataset.color;
    });
  }
  const bandSel = document.getElementById('dom-band');
  if (bandSel) bandSel.innerHTML = ageBandOptions();

  // Penapis domain & kumpulan umur
  document.getElementById('filter-domain')?.addEventListener('change', (e) => { fDomain = e.target.value; render(); });
  document.getElementById('filter-band')?.addEventListener('change', (e) => { fBand = e.target.value; render(); });

  document.getElementById('add-domain-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = val('dom-name');
    const lines = (document.getElementById('dom-questions')?.value || '').split('\n').map(q => q.trim()).filter(Boolean);
    if (!name) { alert('Sila masukkan nama domain.'); return; }
    if (lines.length === 0) { alert('Sila masukkan sekurang-kurangnya satu soalan (satu baris = satu soalan).'); return; }
    const [dmn, dmx] = (document.getElementById('dom-band')?.value || '0-72').split('-').map(Number);
    const questions = lines.map(t => ({ text: t, minM: dmn, maxM: dmx }));
    const domains = getDomains();
    let code = name.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '') || 'DOMAIN';
    let unique = code, n = 2;
    while (domains.some(d => d.code === unique)) unique = code + '_' + (n++);
    domains.push({ code: unique, name, icon: pickIcon, color: pickColor, locked: false, questions });
    saveDomains(domains);
    logAudit('domain.create', `Cipta domain "${name}" (${questions.length} soalan)`);
    e.target.reset();
    iconWrap?.querySelectorAll('.icon-pick').forEach((x, i) => x.classList.toggle('sel', i === 0));
    colorWrap?.querySelectorAll('.swatch').forEach((x, i) => x.classList.toggle('sel', i === 0));
    pickIcon = DOMAIN_ICONS[0]; pickColor = DOMAIN_COLORS[0];
    render();
    alert('Domain baharu ditambah. Ia akan muncul dalam saringan seterusnya.');
  });
  render();
}

/* ---------- 15. PENTADBIR: STATISTIK PENGGUNAAN (Modul 6) ---------- */
/* ---------- 15a. CETAK / PDF (guna window.print) ------------------ */
// Cetak satu kawasan sahaja: isi #print-region, tandakan body, cetak, bersih.
function printRegion(html) {
  let region = document.getElementById('print-region');
  if (!region) { region = document.createElement('div'); region.id = 'print-region'; document.body.appendChild(region); }
  region.innerHTML = html;
  document.body.classList.add('print-mode');
  const cleanup = () => {
    document.body.classList.remove('print-mode');
    region.innerHTML = '';
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
  window.print();
}

// Kepala surat cetak (dikongsi keputusan.html & sejarah.html).
function printLetterhead(sub) {
  return `<div class="print-head">
    <div><h2>e-Jejak Anak</h2><div class="print-sub">Laporan Saringan Perkembangan Kanak-kanak</div></div>
    <div class="print-sub" style="text-align:right">USM &middot; MAIK<br>${sub || 'Saringan Awal'}</div>
  </div>`;
}

// Laporan penuh satu sesi saringan (markah + jawapan) untuk dicetak.
function sessionReportHTML(heading, subtitle, s) {
  const t = triageOf(s);
  const scores = Object.values(s.domains).map(d => {
    const pct = Math.round(d.achieved / d.total * 100);
    return `<div class="dscore" style="--dc:${d.color}"><div class="dscore__label"><span class="dot"></span>${d.name}</div><div class="progress-bar"><span style="width:${pct}%"></span></div><div class="dscore__pct tnum">${pct}%</div></div>`;
  }).join('');
  const ans = Object.values(s.domains).map(d => {
    const items = d.items || []; if (!items.length) return '';
    return `<div style="margin-top:10px; break-inside:avoid"><strong style="color:${d.color}">${d.name}</strong>
      <ul style="list-style:none; padding:0; margin:6px 0 0; display:grid; gap:4px">${items.map((it, i) => `<li style="display:flex; justify-content:space-between; gap:8px; border:1px solid #ddd; padding:4px 8px; border-radius:6px; font-size:10pt"><span>${i + 1}. ${it.text}</span><span class="triage ${it.answer === 'ya' ? 'triage--ok' : 'triage--warn'}">${it.answer === 'ya' ? 'Ya' : 'Tidak'}</span></li>`).join('')}</ul></div>`;
  }).join('');
  return `${printLetterhead('Saringan Awal')}
    <h3 style="margin:0 0 4pt">${heading}</h3>
    <p class="print-sub" style="margin:0 0 10pt">${subtitle}</p>
    <div class="flex gap-3 wrap" style="margin-bottom:10pt"><span class="chip">Markah ${s.totalAchieved}/${s.total} (${t.pct}%)</span><span class="triage ${t.cls}"><span class="tdot"></span>${t.label}</span></div>
    <div class="domain-scores">${scores}</div>
    ${ans}
    <p style="font-size:8pt; color:#555; margin-top:14pt; border-top:1px solid #ddd; padding-top:6pt">Penafian: Keputusan saringan adalah untuk saringan awal sahaja dan bukan diagnosis perubatan. Setiap sesi kekal muktamad selepas dihantar. Dijana pada ${new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>`;
}

// Muat turun HTML sebagai fail PDF sebenar (satu klik) guna html2pdf.js.
// Jika pustaka gagal dimuat, jatuh balik ke dialog cetak.
function downloadPDF(html, filename) {
  if (!window.html2pdf) { window.print(); return; }
  const holder = document.createElement('div');
  holder.style.cssText = 'position:fixed; left:-9999px; top:0;';
  holder.innerHTML = html;
  document.body.appendChild(holder);
  const opt = {
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] },
  };
  const done = () => holder.remove();
  window.html2pdf().set(opt).from(holder.firstElementChild).save().then(done).catch(done);
}

// Leraikan warna 'var(--x)' kepada hex sebenar (html2canvas tak baca CSS var).
function resolveColor(c) {
  if (typeof c === 'string' && c.startsWith('var(')) {
    const name = c.slice(4, -1).trim();
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#12718A';
  }
  return c || '#12718A';
}

// Warna chip triage (sebaris — untuk pemaparan html2canvas yang boleh dipercayai).
const TRIAGE_STYLE = {
  'triage--ok':   'background:#E7F4EC; color:#1f6d3a;',
  'triage--warn': 'background:#FBEEDD; color:#8a4b12;',
  'triage--ref':  'background:#FBE9E5; color:#99311e;',
};

// Laporan sejarah penuh (kepala surat + jadual semua sesi) — gaya sebaris
// supaya keluaran PDF konsisten dengan paparan cetak.
function historyReportHTML(child, subInfo, subs) {
  const rows = subs.map(s => {
    const t = triageOf(s);
    return `<tr>
      <td style="padding:7px 9px; border:1px solid #d8e2e4; white-space:nowrap">${fmtDate(s.submittedAt)}</td>
      <td style="padding:7px 9px; border:1px solid #d8e2e4">${ageText(s.ageMonths)}<br><span style="color:#5B7178; font-size:10px">${s.ageGroup}</span></td>
      <td style="padding:7px 9px; border:1px solid #d8e2e4"><strong>${s.totalAchieved}/${s.total}</strong> <span style="color:#5B7178">(${t.pct}%)</span></td>
      <td style="padding:7px 9px; border:1px solid #d8e2e4"><span style="display:inline-block; padding:2px 9px; border-radius:999px; font-size:11px; font-weight:600; ${TRIAGE_STYLE[t.cls]}">${t.label}</span></td>
    </tr>`;
  }).join('');
  return `<div style="font-family:Arial,Helvetica,sans-serif; color:#16303A; width:700px; box-sizing:border-box; padding:8px 4px">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #12718A; padding-bottom:10px; margin-bottom:14px">
      <div><div style="font-size:22px; font-weight:800; color:#12718A; line-height:1.1">e-Jejak Anak</div>
        <div style="font-size:12px; color:#333">Laporan Sejarah Saringan Perkembangan Kanak-kanak</div></div>
      <div style="text-align:right; font-size:11px; color:#333; white-space:nowrap">USM &middot; MAIK<br>${child.name}</div>
    </div>
    <div style="font-size:13px; color:#333; margin-bottom:12px">${subInfo}</div>
    <table style="width:100%; border-collapse:collapse; font-size:12px">
      <thead><tr style="background:#FAEDED">
        <th style="text-align:left; padding:8px 9px; border:1px solid #d8e2e4">Tarikh</th>
        <th style="text-align:left; padding:8px 9px; border:1px solid #d8e2e4">Umur Ketika Saring</th>
        <th style="text-align:left; padding:8px 9px; border:1px solid #d8e2e4">Markah</th>
        <th style="text-align:left; padding:8px 9px; border:1px solid #d8e2e4">Triage</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="font-size:9px; color:#555; margin-top:16px; border-top:1px solid #ddd; padding-top:8px">
      Penafian: Keputusan saringan adalah untuk saringan awal sahaja dan bukan diagnosis perubatan. Setiap sesi kekal muktamad selepas dihantar.
      Dijana pada ${new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>
  </div>`;
}

// Laporan satu sesi (markah domain + jawapan) bergaya sebaris untuk PDF.
function sessionReportPDF(heading, subtitle, s) {
  const t = triageOf(s);
  const bars = Object.values(s.domains).map(d => {
    const pct = Math.round(d.achieved / d.total * 100);
    const col = resolveColor(d.color);
    return `<div style="display:flex; align-items:center; gap:10px; margin:6px 0; font-size:12px">
      <div style="flex:0 0 130px"><span style="display:inline-block; width:9px; height:9px; border-radius:50%; background:${col}; margin-right:6px"></span>${d.name}</div>
      <div style="flex:1; height:9px; background:#E1E9EB; border-radius:99px; overflow:hidden"><div style="width:${pct}%; height:100%; background:${col}"></div></div>
      <div style="flex:0 0 42px; text-align:right; font-weight:700">${pct}%</div>
    </div>`;
  }).join('');
  const answers = Object.values(s.domains).map(d => {
    const items = d.items || []; if (!items.length) return '';
    const col = resolveColor(d.color);
    const lis = items.map((it, i) => `<li style="display:flex; justify-content:space-between; gap:8px; border:1px solid #e2e8ea; padding:4px 8px; border-radius:6px; font-size:11px; margin-bottom:4px">
      <span>${i + 1}. ${it.text}</span>
      <span style="flex:none; padding:1px 8px; border-radius:99px; font-weight:600; ${it.answer === 'ya' ? TRIAGE_STYLE['triage--ok'] : TRIAGE_STYLE['triage--warn']}">${it.answer === 'ya' ? 'Ya' : 'Tidak'}</span>
    </li>`).join('');
    return `<div style="margin-top:10px; page-break-inside:avoid"><strong style="color:${col}; font-size:12px">${d.name}</strong>
      <ul style="list-style:none; padding:0; margin:6px 0 0">${lis}</ul></div>`;
  }).join('');
  return `<div style="font-family:Arial,Helvetica,sans-serif; color:#16303A; width:700px; box-sizing:border-box; padding:8px 4px">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #12718A; padding-bottom:10px; margin-bottom:14px">
      <div><div style="font-size:22px; font-weight:800; color:#12718A; line-height:1.1">e-Jejak Anak</div>
        <div style="font-size:12px; color:#333">Laporan Saringan Perkembangan Kanak-kanak</div></div>
      <div style="text-align:right; font-size:11px; color:#333; white-space:nowrap">USM &middot; MAIK<br>Saringan Awal</div>
    </div>
    <div style="font-size:15px; font-weight:700; margin:0 0 2px">${heading}</div>
    <div style="font-size:12px; color:#333; margin-bottom:12px">${subtitle}</div>
    <div style="margin-bottom:12px">
      <span style="display:inline-block; padding:3px 12px; border-radius:99px; background:#FAEDED; color:#12718A; font-size:12px; font-weight:600; margin-right:8px">Markah ${s.totalAchieved}/${s.total} (${t.pct}%)</span>
      <span style="display:inline-block; padding:3px 12px; border-radius:99px; font-size:12px; font-weight:600; ${TRIAGE_STYLE[t.cls]}">${t.label}</span>
    </div>
    ${bars}
    ${answers}
    <p style="font-size:9px; color:#555; margin-top:16px; border-top:1px solid #ddd; padding-top:8px">
      Penafian: e-Jejak Anak menyediakan saringan awal sahaja dan bukan diagnosis perubatan.
      Dijana pada ${new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>
  </div>`;
}

/* ---------- 15b. CARTA CANVAS (tulen, tiada pustaka luar) ---------- */
// Skala paparan tajam pada skrin HiDPI; kembalikan {ctx,w,h} dalam unit CSS.
function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || 320;
  const h = canvas.clientHeight || 220;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  return { ctx, w, h };
}
function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#12718A';
}
// Carta bar menegak dengan garis grid & label bulan.
function drawBarChart(canvas, labels, values, color) {
  const { ctx, w, h } = setupCanvas(canvas);
  const padL = 28, padR = 8, padT = 12, padB = 26;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const max = Math.max(1, ...values);
  const ticks = 4;
  ctx.font = '11px "Source Sans 3", system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  // garis grid + skala paksi-Y
  ctx.strokeStyle = '#E1E9EB'; ctx.fillStyle = '#5B7178'; ctx.lineWidth = 1;
  for (let i = 0; i <= ticks; i++) {
    const val = Math.round(max * i / ticks);
    const y = padT + plotH - (plotH * i / ticks);
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
    ctx.textAlign = 'right'; ctx.fillText(String(val), padL - 6, y);
  }
  // bar
  const n = values.length;
  const slot = plotW / n;
  const bw = Math.min(38, slot * 0.6);
  values.forEach((v, i) => {
    const bh = (v / max) * plotH;
    const x = padL + slot * i + (slot - bw) / 2;
    const y = padT + plotH - bh;
    ctx.fillStyle = color;
    ctx.beginPath();
    const r = Math.min(5, bw / 2);
    ctx.moveTo(x, y + bh); ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
    ctx.lineTo(x + bw - r, y); ctx.arcTo(x + bw, y, x + bw, y + r, r);
    ctx.lineTo(x + bw, y + bh); ctx.closePath(); ctx.fill();
    // nilai atas bar
    if (v > 0) { ctx.fillStyle = '#16303A'; ctx.textAlign = 'center'; ctx.fillText(String(v), x + bw / 2, y - 8); }
    // label bulan
    ctx.fillStyle = '#5B7178'; ctx.textAlign = 'center';
    ctx.fillText(labels[i], padL + slot * i + slot / 2, h - padB / 2 + 2);
  });
}
// Carta donat + kembalikan HTML legenda.
function drawDonut(canvas, segments) {
  const { ctx, w, h } = setupCanvas(canvas);
  const total = segments.reduce((a, s) => a + s.value, 0);
  const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 10, r = R * 0.58;
  if (total === 0) {
    ctx.fillStyle = '#5B7178'; ctx.font = '13px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Tiada data', cx, cy); return;
  }
  let a0 = -Math.PI / 2;
  segments.forEach(s => {
    const a1 = a0 + (s.value / total) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a0, a1); ctx.closePath();
    ctx.fillStyle = s.color; ctx.fill();
    a0 = a1;
  });
  // lubang tengah
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.fillStyle = '#16303A'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '700 20px "Plus Jakarta Sans", system-ui'; ctx.fillText(String(total), cx, cy - 6);
  ctx.font = '11px "Source Sans 3", system-ui'; ctx.fillStyle = '#5B7178'; ctx.fillText('saringan', cx, cy + 12);
}

function initStats() {
  const host = document.getElementById('stat-cards');
  if (!host) return;
  const users = getUsers(), children = getChildren(), subs = getSubmissions(), domains = getDomains();
  const activeUsers = new Set(subs.map(s => s.userId).filter(Boolean)).size;
  const avg = subs.length ? Math.round(subs.reduce((a, s) => a + s.totalAchieved / s.total, 0) / subs.length * 100) : 0;
  const refCount = subs.filter(s => triageOf(s).cls === 'triage--ref').length;

  host.innerHTML = [
    ['Jumlah Pendaftaran', users.length, 'akaun ibu bapa'],
    ['Profil Anak', children.length, 'kanak-kanak didaftar'],
    ['Saringan Selesai', subs.length, 'sesi saringan'],
    ['Pengguna Aktif', activeUsers, 'membuat saringan'],
    ['Purata Pencapaian', avg + '%', 'kemahiran dicapai'],
    ['Kes Perlu Rujukan', refCount, 'saringan < 70%'],
  ].map(([label, num, sub]) => `
    <div class="card"><div class="mini-stat"><b class="tnum">${num}</b><span>${label}</span></div>
      <p class="muted" style="font-size:var(--fs-xs); margin:4px 0 0">${sub}</p></div>`).join('');

  // Purata pencapaian setiap domain (merentas semua saringan)
  const barsEl = document.getElementById('stat-domains');
  if (barsEl) {
    const agg = {};
    subs.forEach(s => Object.entries(s.domains).forEach(([code, d]) => {
      agg[code] = agg[code] || { name: d.name, color: d.color, ach: 0, tot: 0 };
      agg[code].ach += d.achieved; agg[code].tot += d.total;
    }));
    const rows = Object.values(agg);
    barsEl.innerHTML = rows.length ? rows.map(d => {
      const pct = Math.round(d.ach / d.tot * 100);
      return `<div class="dscore" style="--dc:${d.color}">
        <div class="dscore__label"><span class="dot"></span>${d.name}</div>
        <div class="progress-bar"><span style="width:${pct}%"></span></div>
        <div class="dscore__pct tnum">${pct}%</div></div>`;
    }).join('') : '<p class="muted">Tiada data saringan lagi.</p>';
  }

  // ---- Carta trend & taburan triage (Canvas) ----
  const trendEl = document.getElementById('chart-trend');
  const triageEl = document.getElementById('chart-triage');
  const legendEl = document.getElementById('triage-legend');
  if (!trendEl && !triageEl) return;

  // Trend: 6 bulan terakhir — bilangan saringan/bulan. Titik rujukan ialah
  // saringan terbaharu (bukan jam sistem) supaya carta sentiasa berisi.
  const MONTHS = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];
  const times = subs.map(s => new Date(s.submittedAt).getTime()).filter(t => !isNaN(t));
  const anchor = times.length ? new Date(Math.max(...times)) : new Date();
  const buckets = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(anchor.getFullYear(), anchor.getMonth() - i, 1);
    buckets.push({ key: d.getFullYear() + '-' + d.getMonth(), label: MONTHS[d.getMonth()], count: 0 });
  }
  const idx = {}; buckets.forEach((b, i) => idx[b.key] = i);
  subs.forEach(s => {
    const d = new Date(s.submittedAt);
    const k = d.getFullYear() + '-' + d.getMonth();
    if (k in idx) buckets[idx[k]].count++;
  });

  // Taburan triage.
  const tri = { ok: 0, warn: 0, ref: 0 };
  subs.forEach(s => {
    const c = triageOf(s).cls;
    if (c === 'triage--ok') tri.ok++; else if (c === 'triage--ref') tri.ref++; else tri.warn++;
  });
  const segs = [
    { label: 'Pemantauan', value: tri.ok, color: cssVar('--ok') },
    { label: 'Perhatian', value: tri.warn, color: cssVar('--warn') },
    { label: 'Perlu Rujukan', value: tri.ref, color: cssVar('--danger') },
  ];

  function draw() {
    if (trendEl) drawBarChart(trendEl, buckets.map(b => b.label), buckets.map(b => b.count), cssVar('--brand'));
    if (triageEl) drawDonut(triageEl, segs);
    if (legendEl) legendEl.innerHTML = segs.map(s =>
      `<span class="chart-legend__item"><i style="background:${s.color}"></i>${s.label} <b class="tnum">${s.value}</b></span>`).join('');
  }

  // Canvas perlu lebar tampak; lukis bila tab Statistik dibuka.
  const panel = document.getElementById('tab-statistik');
  const tabBtn = document.querySelector('[data-target="tab-statistik"]');
  let drawn = false;
  const drawOnce = () => { requestAnimationFrame(() => { draw(); drawn = true; }); };
  if (panel && panel.classList.contains('is-active')) drawOnce();
  tabBtn?.addEventListener('click', drawOnce);
  let rt;
  window.addEventListener('resize', () => {
    if (!drawn) return;
    clearTimeout(rt); rt = setTimeout(draw, 150);
  });
}

/* ---------- 16. PENTADBIR: LAPORAN PENGGUNA (Modul 6) -------------- */
function buildReportRows() {
  const users = getUsers(), subs = getSubmissions();
  return users.map(u => {
    const us = subs.filter(s => s.userId === u.id);
    const last = us[0];
    const avg = us.length ? Math.round(us.reduce((a, s) => a + s.totalAchieved / s.total, 0) / us.length * 100) : 0;
    return {
      id: u.id, name: u.name, email: u.email, phone: u.phone || '-',
      children: childrenOf(u.id).length, screenings: us.length,
      avg: us.length ? avg + '%' : '-', last: last ? fmtDate(last.submittedAt) : '-',
    };
  });
}
/* ---------- 16b. PENTADBIR: URUS PENGGUNA (ibu bapa) ---------------
   Jadual pengurusan akaun ibu bapa dengan tindakan: sunting, lihat,
   set semula kata laluan, padam, dan "Login as" (menyamar). */
function userCreatedText(u) {
  if (u.createdAt) return fmtDate(u.createdAt);
  const m = /^U(\d{12,})$/.exec(u.id || '');
  if (m) return fmtDate(new Date(Number(m[1])).toISOString());
  return '—';
}
// Jambatan antara jadual Urus Pengguna & modal borang staf (initStaffForm):
// modal set fungsi buka di sini; jadual daftar fungsi segar semula di sini.
const StaffForm = { openCreate: null, openEdit: null };
let refreshUsersTable = null;

function initUsersAdmin() {
  const rows = document.getElementById('user-rows');
  if (!rows) return;
  const me = currentAdmin();
  if (!canManageAccounts(me?.role)) return; // urus pengguna: pentadbir sahaja
  const isSuper = me.role === 'superadmin';
  const searchEl = document.getElementById('user-search');
  const filterEl = document.getElementById('user-filter');
  const districtFilterEl = document.getElementById('user-district-filter');
  const viewModal = document.getElementById('user-view-modal');
  const editModal = document.getElementById('user-edit-modal');
  let q = '', lvl = 'semua', dist = 'semua';

  // Senarai doktor dalam skop (untuk kad statistik).
  function scopedDoctors() {
    let docs = getAdmins().filter(a => a.role === 'doctor');
    if (!isSuper) docs = docs.filter(a => a.org === me.org);
    return docs;
  }
  // Staf boleh urus: doktor (superadmin semua / pentadbir org sendiri) + pentadbir
  // lain (superadmin sahaja). Superadmin & akaun sendiri dikecualikan.
  function scopedStaff() {
    return getAdmins().filter(a => {
      if (a.role === 'doctor') return isSuper || a.org === me.org;
      if (a.role === 'admin')  return isSuper && a.id !== me.id;
      return false; // superadmin tidak disenaraikan
    });
  }
  // Senarai akaun bersatu: ibu bapa + staf.
  function accounts() {
    const parents = getUsers().map(u => ({ kind: 'parent', role: 'parent', id: u.id, name: u.name, email: u.email, phone: u.phone, org: null, createdAt: u.createdAt, district: u.district || '' }));
    const staff = scopedStaff().map(a => ({ kind: 'staff', role: a.role, id: a.id, name: a.name, email: a.email, phone: a.phone, org: a.org, jawatan: a.jawatan }));
    return [...parents, ...staff];
  }

  function stats() {
    const subs = getSubmissions();
    const ref = subs.filter(s => s.total && (s.totalAchieved / s.total) < 0.7).length;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('us-parents', getUsers().length); set('us-doctors', scopedDoctors().length);
    set('us-screenings', subs.length); set('us-referral', ref);
  }

  function render() {
    stats();
    const subs = getSubmissions();
    let list = accounts();
    if (lvl !== 'semua') list = list.filter(a => a.role === lvl);
    // Tapis daerah: hanya terpakai kepada ibu bapa (staf tiada daerah → disembunyikan bila tapisan aktif).
    if (dist !== 'semua') list = list.filter(a => a.kind === 'parent' && a.district === dist);
    if (q) list = list.filter(a => `${a.name} ${a.email} ${a.phone || ''} ${a.org || ''} ${a.district || ''}`.toLowerCase().includes(q));
    const cnt = document.getElementById('user-count');
    if (cnt) cnt.textContent = `${list.length} pengguna`;
    rows.innerHTML = list.length ? list.map(a => {
      const isParent = a.kind === 'parent';
      const kids = isParent ? childrenOf(a.id).length : '—';
      const scr = isParent ? subs.filter(s => s.userId === a.id).length : '—';
      const level = isParent
        ? `<span class="chip">Ibu Bapa</span>`
        : `<span class="chip chip--accent">${ROLE_LABEL[a.role] || a.role}</span>${a.org ? ` <span class="chip">${a.org}</span>` : ''}`;
      const created = isParent ? userCreatedText(a) : '—';
      const districtLine = (isParent && a.district)
        ? `<br><span class="muted" style="font-size:var(--fs-xs)">${ICONS.pin} ${a.district}</span>` : '';
      return `<tr>
        <td class="muted" style="white-space:nowrap">${created}</td>
        <td><strong>${a.name}</strong>${districtLine}</td>
        <td>${level}</td>
        <td>${a.email}</td>
        <td style="white-space:nowrap">${a.phone || '-'}</td>
        <td class="tnum">${kids}</td>
        <td class="tnum">${scr}</td>
        <td class="col-action">
          <div class="flex gap-2" style="justify-content:flex-end; flex-wrap:wrap">
            <button class="btn btn--ghost" data-act="edit" data-kind="${a.kind}" data-id="${a.id}" style="padding:.35em .55em" title="Sunting butiran">${ICONS.edit}</button>
            <button class="btn btn--ghost" data-act="view" data-kind="${a.kind}" data-id="${a.id}" style="padding:.35em .55em" title="Lihat butiran">${ICONS.eye}</button>
            <button class="btn btn--ghost" data-act="reset" data-kind="${a.kind}" data-id="${a.id}" style="padding:.35em .55em" title="Set semula kata laluan">${ICONS.key}</button>
            <button class="btn btn--ghost" data-act="del" data-kind="${a.kind}" data-id="${a.id}" style="padding:.35em .55em" title="Padam">${ICONS.trash}</button>
            <button class="btn btn--ghost" data-act="login" data-kind="${a.kind}" data-id="${a.id}" style="padding:.35em .7em" title="Log masuk sebagai pengguna ini">${ICONS.arrowRight} Login as</button>
          </div>
        </td>
      </tr>`;
    }).join('') : `<tr><td colspan="8" style="text-align:center; padding:var(--sp-4); color:var(--muted)">Tiada pengguna dijumpai.</td></tr>`;
  }

  // ---- Tindakan (didelegasikan) ----
  function doLogin(kind, id) {
    if (kind === 'parent') {
      const u = getUsers().find(x => x.id === id);
      if (!confirm(`Log masuk sebagai ibu bapa "${u ? u.name : ''}"?\n\nAnda akan melihat dashboard & saringan mereka. Tindakan ini direkodkan dalam Log Aktiviti.`)) return;
      startImpersonation(id);
    } else {
      const d = getAdmins().find(x => x.id === id);
      const label = d ? (ROLE_LABEL[d.role] || 'staf') : 'staf';
      if (!confirm(`Log masuk sebagai ${label} "${d ? d.name : ''}"?\n\nAnda akan melihat panel mereka. Tindakan ini direkodkan dalam Log Aktiviti.`)) return;
      impersonateStaff(id);
    }
  }
  function doReset(kind, id) {
    if (kind === 'parent') {
      const users = getUsers(); const u = users.find(x => x.id === id); if (!u) return;
      if (!confirm(`Set semula kata laluan untuk "${u.name}" kepada kata laluan sementara?`)) return;
      u.password = 'demo1234'; saveUsers(users);
      logAudit('user.reset', `Set semula kata laluan: ${u.name} (${u.email})`);
      alert(`Kata laluan untuk ${u.name} ditetapkan semula kepada:\n\ndemo1234\n\nMinta pengguna menukarnya selepas log masuk.`);
    } else {
      const admins = getAdmins(); const d = admins.find(x => x.id === id); if (!d) return;
      const label = ROLE_LABEL[d.role] || 'staf';
      if (!isSuper && d.org !== me.org) { alert('Anda hanya boleh urus staf dalam organisasi anda.'); return; }
      if (!confirm(`Set semula kata laluan untuk ${label} "${d.name}" kepada kata laluan sementara?`)) return;
      d.password = 'demo1234'; saveAdmins(admins);
      logAudit('user.reset', `Set semula kata laluan ${label}: ${d.name} (${d.org})`);
      alert(`Kata laluan untuk ${d.name} ditetapkan semula kepada:\n\ndemo1234\n\nMinta pengguna menukarnya selepas log masuk.`);
    }
  }
  function doDelete(kind, id) {
    if (kind === 'parent') {
      const u = getUsers().find(x => x.id === id); if (!u) return;
      const kidCount = childrenOf(u.id).length;
      if (!confirm(`Padam pengguna "${u.name}"?\n\nProfil ${kidCount} anak & semua sejarah saringan mereka turut dipadam. Tindakan ini tidak boleh dibatalkan.`)) return;
      saveUsers(getUsers().filter(x => x.id !== u.id));
      saveChildren(getChildren().filter(c => c.userId !== u.id));
      saveSubmissions(getSubmissions().filter(s => s.userId !== u.id));
      logAudit('user.delete', `Padam pengguna: ${u.name} (${u.email})`);
      render();
    } else {
      const d = getAdmins().find(x => x.id === id); if (!d) return;
      const label = ROLE_LABEL[d.role] || 'staf';
      if (d.id === me.id) { alert('Tidak boleh padam akaun sendiri.'); return; }
      if (d.role === 'superadmin') { alert('Akaun superadmin dilindungi.'); return; }
      if (!isSuper && d.org !== me.org) { alert('Anda hanya boleh urus staf dalam organisasi anda.'); return; }
      if (!confirm(`Padam akaun ${label} "${d.name}" (${d.org})?`)) return;
      saveAdmins(getAdmins().filter(x => x.id !== d.id));
      logAudit('account.delete', `Padam ${label}: ${d.name} (${d.org})`);
      render();
    }
  }
  function openView(kind, id) {
    if (!viewModal) return;
    if (kind === 'parent') {
      const u = getUsers().find(x => x.id === id); if (!u) return;
      const kids = childrenOf(u.id);
      const subs = getSubmissions().filter(s => s.userId === u.id);
      document.getElementById('uv-title').textContent = u.name;
      document.getElementById('uv-body').innerHTML = `
        <div style="margin-bottom:var(--sp-3)"><span class="chip">Ibu Bapa</span></div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--sp-3)">
          <div><span class="muted" style="display:block; font-size:var(--fs-xs)">E-mel</span><strong>${u.email}</strong></div>
          <div><span class="muted" style="display:block; font-size:var(--fs-xs)">Telefon</span><strong>${u.phone || '-'}</strong></div>
          <div><span class="muted" style="display:block; font-size:var(--fs-xs)">Didaftar</span><strong>${userCreatedText(u)}</strong></div>
          <div><span class="muted" style="display:block; font-size:var(--fs-xs)">Bil. Saringan</span><strong>${subs.length}</strong></div>
        </div>
        <h4 style="margin:var(--sp-4) 0 var(--sp-2)">Profil Anak (${kids.length})</h4>
        ${kids.length ? `<ul style="list-style:none; padding:0; margin:0">${kids.map(c => {
          const mm = ageInMonths(c.dob);
          const cs = subs.filter(s => s.childId === c.id).length;
          return `<li class="flex items-center gap-2" style="justify-content:space-between; background:var(--brand-tint); padding:.5em .7em; border-radius:8px; margin-bottom:6px">
            <span><strong>${c.name}</strong> · <span class="muted">${c.gender} · ${ageText(mm)}</span></span>
            <span class="chip">${cs} saringan</span></li>`;
        }).join('')}</ul>` : `<p class="muted">Tiada profil anak.</p>`}`;
    } else {
      const d = getAdmins().find(x => x.id === id); if (!d) return;
      const label = ROLE_LABEL[d.role] || 'staf';
      document.getElementById('uv-title').textContent = d.name;
      document.getElementById('uv-body').innerHTML = `
        <div style="margin-bottom:var(--sp-3)"><span class="chip chip--accent">${label}</span> <span class="chip">${d.org}</span></div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--sp-3)">
          <div><span class="muted" style="display:block; font-size:var(--fs-xs)">E-mel</span><strong>${d.email}</strong></div>
          <div><span class="muted" style="display:block; font-size:var(--fs-xs)">Telefon</span><strong>${d.phone || '-'}</strong></div>
          <div><span class="muted" style="display:block; font-size:var(--fs-xs)">Jawatan</span><strong>${d.jawatan || '-'}</strong></div>
          <div><span class="muted" style="display:block; font-size:var(--fs-xs)">Organisasi</span><strong>${d.org}</strong></div>
        </div>
        <p class="muted" style="font-size:var(--fs-sm); margin-top:var(--sp-3)">Peranan & organisasi staf diurus penuh di tab <strong>Profil &amp; Akaun</strong>.</p>`;
    }
    viewModal.classList.add('open');
  }
  function openEdit(kind, id) {
    if (!editModal) return;
    const rec = kind === 'parent' ? getUsers().find(x => x.id === id) : getAdmins().find(x => x.id === id);
    if (!rec) return;
    if (kind !== 'parent' && !isSuper && rec.org !== me.org) { alert('Anda hanya boleh urus staf dalam organisasi anda.'); return; }
    document.getElementById('ue-kind').value = kind;
    document.getElementById('ue-id').value = rec.id;
    document.getElementById('ue-name').value = rec.name || '';
    document.getElementById('ue-email').value = rec.email || '';
    document.getElementById('ue-phone').value = rec.phone || '';
    document.getElementById('ue-h').textContent = kind === 'parent' ? 'Sunting Butiran Pengguna' : `Sunting Butiran ${ROLE_LABEL[rec.role] || 'Staf'}`;
    editModal.classList.add('open');
  }

  rows.onclick = (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const { act, kind, id } = b.dataset;
    if (act === 'login') doLogin(kind, id);
    else if (act === 'reset') doReset(kind, id);
    else if (act === 'del') doDelete(kind, id);
    else if (act === 'view') openView(kind, id);
    else if (act === 'edit') { if (kind === 'parent') openEdit(kind, id); else if (StaffForm.openEdit) StaffForm.openEdit(id); }
  };

  // Butang "Tambah Akaun Baharu" → buka modal borang staf (mod cipta).
  document.getElementById('add-staff-btn')?.addEventListener('click', () => { if (StaffForm.openCreate) StaffForm.openCreate(); });

  document.getElementById('user-edit-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const kind = val('ue-kind'), id = val('ue-id'), email = val('ue-email').toLowerCase();
    if (!val('ue-name') || !email) { alert('Nama dan e-mel diperlukan.'); return; }
    if (kind === 'parent') {
      const users = getUsers(); const u = users.find(x => x.id === id); if (!u) return;
      if (users.some(x => x.id !== id && x.email.toLowerCase() === email)) { alert('E-mel ini sudah digunakan oleh pengguna lain.'); return; }
      Object.assign(u, { name: val('ue-name'), email, phone: val('ue-phone') });
      saveUsers(users);
      logAudit('user.update', `Kemas kini pengguna: ${u.name} (${u.email})`);
    } else {
      const admins = getAdmins(); const d = admins.find(x => x.id === id); if (!d) return;
      const label = ROLE_LABEL[d.role] || 'staf';
      if (!isSuper && d.org !== me.org) { alert('Anda hanya boleh urus staf dalam organisasi anda.'); return; }
      if (admins.some(x => x.id !== id && x.email.toLowerCase() === email)) { alert('E-mel ini sudah digunakan oleh akaun lain.'); return; }
      Object.assign(d, { name: val('ue-name'), email, phone: val('ue-phone') });
      saveAdmins(admins);
      logAudit('account.update', `Kemas kini ${label}: ${d.name} (${d.org})`);
    }
    editModal.classList.remove('open');
    render();
    alert('Butiran dikemas kini.');
  });

  [['uv-close', viewModal], ['ue-close', editModal], ['ue-cancel', editModal]].forEach(([bid, modal]) => {
    document.getElementById(bid)?.addEventListener('click', () => modal?.classList.remove('open'));
  });
  [viewModal, editModal].forEach(m => m?.addEventListener('click', (e) => { if (e.target === m) m.classList.remove('open'); }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { viewModal?.classList.remove('open'); editModal?.classList.remove('open'); } });

  searchEl?.addEventListener('input', () => { q = searchEl.value.trim().toLowerCase(); render(); });
  filterEl?.addEventListener('change', () => { lvl = filterEl.value; render(); });
  districtFilterEl?.addEventListener('change', () => { dist = districtFilterEl.value; render(); });
  document.getElementById('user-reload')?.addEventListener('click', render);
  refreshUsersTable = render; // modal borang staf boleh segar semula jadual selepas simpan
  render();
}

// Butiran jawapan satu sesi (markah domain + senarai soalan & jawapan) — untuk
// paparan skrin (dikembangkan dalam modal laporan / sejarah).
function sessionAnswersHTML(s) {
  const scores = Object.values(s.domains).map(d => {
    const pct = Math.round(d.achieved / d.total * 100);
    return `<div class="dscore" style="--dc:${d.color}"><div class="dscore__label"><span class="dot"></span>${d.name}</div><div class="progress-bar"><span style="width:${pct}%"></span></div><div class="dscore__pct tnum">${pct}%</div></div>`;
  }).join('');
  const ans = Object.values(s.domains).map(d => {
    const items = d.items || []; if (!items.length) return '';
    return `<div style="margin-top:var(--sp-3)"><strong style="color:${d.color}">${d.name}</strong>
      <ul style="list-style:none; padding:0; margin:6px 0 0; display:grid; gap:6px">${items.map((it, i) => `<li class="flex items-center gap-2" style="justify-content:space-between; background:#fff; border:1px solid var(--line); padding:.5em .7em; border-radius:8px; font-size:var(--fs-sm)"><span>${i + 1}. ${it.text}</span><span class="triage ${it.answer === 'ya' ? 'triage--ok' : 'triage--warn'}">${it.answer === 'ya' ? 'Ya' : 'Tidak'}</span></li>`).join('')}</ul></div>`;
  }).join('');
  return `<div class="domain-scores">${scores}</div>${ans || '<p class="muted" style="margin:var(--sp-2) 0 0">Tiada butiran jawapan direkodkan untuk sesi ini.</p>'}`;
}

// Laporan seorang ibu bapa (paparan skrin) — ringkasan + sejarah saringan
// setiap anak. Dipapar dalam modal di tab Laporan Pengguna.
function parentReportScreenHTML(u, kids, subs) {
  const avg = subs.length ? Math.round(subs.reduce((a, s) => a + s.totalAchieved / s.total, 0) / subs.length * 100) : 0;
  const childBlocks = kids.length ? kids.map(c => {
    const cs = subs.filter(s => s.childId === c.id);
    const m = ageInMonths(c.dob);
    const rowsH = cs.length ? cs.map(s => {
      const t = triageOf(s);
      return `<tr class="${t.row}">
        <td class="muted" style="white-space:nowrap">${fmtDate(s.submittedAt)}</td>
        <td>${ageText(s.ageMonths)}</td>
        <td><strong class="tnum">${s.totalAchieved}/${s.total}</strong> <span class="muted">(${t.pct}%)</span></td>
        <td><span class="triage ${t.cls}"><span class="tdot"></span>${t.label}</span></td>
        <td class="col-action"><button class="btn btn--ghost" data-sess="${s.id}" style="padding:.3em .6em" title="Lihat jawapan saringan ini">${ICONS.eye} Jawapan</button></td>
      </tr>`;
    }).join('') : `<tr><td colspan="5" class="muted" style="padding:var(--sp-3)">Tiada saringan lagi.</td></tr>`;
    return `<div style="margin-top:var(--sp-4)">
      <strong style="font-family:var(--font-head)">${c.name}</strong> <span class="muted">· ${c.gender} · ${ageText(m)} · ${ageGroupLabel(m)}</span>
      <div class="table-wrap" style="margin-top:6px"><table class="data">
        <thead><tr><th>Tarikh</th><th>Umur</th><th>Markah</th><th>Triage</th><th></th></tr></thead>
        <tbody>${rowsH}</tbody></table></div>
    </div>`;
  }).join('') : `<p class="muted">Tiada profil anak.</p>`;
  return `
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:var(--sp-3); margin-bottom:var(--sp-2)">
      <div><span class="muted" style="display:block; font-size:var(--fs-xs)">E-mel</span><strong>${u.email}</strong></div>
      <div><span class="muted" style="display:block; font-size:var(--fs-xs)">Telefon</span><strong>${u.phone || '-'}</strong></div>
      <div><span class="muted" style="display:block; font-size:var(--fs-xs)">Purata Kemahiran</span><strong>${subs.length ? avg + '%' : '—'}</strong></div>
    </div>
    <div class="flex gap-2 wrap"><span class="chip">${kids.length} anak</span><span class="chip">${subs.length} saringan</span></div>
    ${childBlocks}`;
}

// Versi cetak / PDF (gaya sebaris) laporan seorang ibu bapa.
function parentReportPrintHTML(u, kids, subs) {
  const childBlock = kids.length ? kids.map(c => {
    const cs = subs.filter(s => s.childId === c.id);
    const m = ageInMonths(c.dob);
    const rowsHtml = cs.length ? cs.map(s => {
      const t = triageOf(s);
      return `<tr>
        <td style="padding:6px 8px;border:1px solid #d8e2e4;white-space:nowrap">${fmtDate(s.submittedAt)}</td>
        <td style="padding:6px 8px;border:1px solid #d8e2e4">${ageText(s.ageMonths)}</td>
        <td style="padding:6px 8px;border:1px solid #d8e2e4"><strong>${s.totalAchieved}/${s.total}</strong> (${t.pct}%)</td>
        <td style="padding:6px 8px;border:1px solid #d8e2e4"><span style="display:inline-block;padding:2px 9px;border-radius:999px;font-size:11px;font-weight:600;${TRIAGE_STYLE[t.cls]}">${t.label}</span></td>
      </tr>`;
    }).join('') : `<tr><td colspan="4" style="padding:8px;border:1px solid #d8e2e4;color:#777">Tiada saringan.</td></tr>`;
    return `<div style="margin-bottom:14px;break-inside:avoid">
      <div style="font-weight:700;font-size:13px;margin-bottom:6px">${c.name} <span style="font-weight:400;color:#555">· ${c.gender} · ${ageText(m)}</span></div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead><tr style="background:#FAEDED">
          <th style="text-align:left;padding:7px 8px;border:1px solid #d8e2e4">Tarikh</th>
          <th style="text-align:left;padding:7px 8px;border:1px solid #d8e2e4">Umur</th>
          <th style="text-align:left;padding:7px 8px;border:1px solid #d8e2e4">Markah</th>
          <th style="text-align:left;padding:7px 8px;border:1px solid #d8e2e4">Triage</th>
        </tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>`;
  }).join('') : `<p style="color:#777">Tiada profil anak.</p>`;
  return `<div style="font-family:Arial,Helvetica,sans-serif;color:#16303A;width:700px;box-sizing:border-box;padding:8px 4px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #12718A;padding-bottom:10px;margin-bottom:14px">
      <div><div style="font-size:22px;font-weight:800;color:#12718A;line-height:1.1">e-Jejak Anak</div>
        <div style="font-size:12px;color:#333">Laporan Pengguna — Ringkasan Saringan</div></div>
      <div style="text-align:right;font-size:11px;color:#333;white-space:nowrap">USM &middot; MAIK<br>${u.name}</div>
    </div>
    <div style="font-size:13px;color:#333;margin-bottom:12px">
      <strong>${u.name}</strong> &middot; ${u.email} &middot; ${u.phone || '-'}<br>${kids.length} anak &middot; ${subs.length} saringan</div>
    ${childBlock}
    <p style="font-size:9px;color:#555;margin-top:16px;border-top:1px solid #ddd;padding-top:8px">
      Penafian: Keputusan saringan adalah untuk saringan awal sahaja dan bukan diagnosis perubatan.
      Dijana pada ${new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>
  </div>`;
}

function initReports() {
  const rows = document.getElementById('report-rows');
  if (!rows) return;
  if (!canManageAccounts(currentAdmin()?.role)) return; // laporan pengguna: pentadbir sahaja
  const data = buildReportRows();
  rows.innerHTML = data.length ? data.map(r => `<tr>
    <td>${r.name}</td><td>${r.email}</td><td>${r.phone}</td>
    <td class="tnum">${r.children}</td><td class="tnum">${r.screenings}</td>
    <td class="tnum">${r.avg}</td><td class="muted" style="white-space:nowrap">${r.last}</td>
    <td class="col-action"><button class="btn btn--ghost" data-report="${r.id}" style="padding:.4em .7em" title="Lihat laporan saringan pengguna ini">${ICONS.eye} Lihat Laporan</button></td>
  </tr>`).join('') : `<tr><td colspan="8" style="text-align:center; padding:var(--sp-4); color:var(--muted)">Tiada data pengguna.</td></tr>`;

  // Modal laporan pengguna
  const reportModal = document.getElementById('report-modal');
  let activeReport = null;
  function openReport(userId) {
    const u = getUsers().find(x => x.id === userId); if (!u || !reportModal) return;
    const kids = childrenOf(u.id);
    const subs = getSubmissions().filter(s => s.userId === u.id).sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
    activeReport = { u, kids, subs };
    document.getElementById('rp-title').textContent = `Laporan — ${u.name}`;
    const sub = document.getElementById('rp-sub'); if (sub) sub.textContent = `${u.email} · ${u.phone || '-'}`;
    document.getElementById('rp-body').innerHTML = parentReportScreenHTML(u, kids, subs);
    reportModal.classList.add('open');
  }
  rows.querySelectorAll('[data-report]').forEach(b => b.addEventListener('click', () => openReport(b.dataset.report)));

  // Kembang/tutup butiran jawapan bagi setiap sesi saringan dalam modal.
  document.getElementById('rp-body')?.addEventListener('click', (e) => {
    const b = e.target.closest('[data-sess]'); if (!b) return;
    const id = b.dataset.sess;
    const existing = document.getElementById('rpd-' + id);
    if (existing) { existing.remove(); b.classList.remove('is-active'); return; }
    const s = getSubmissions().find(x => x.id === id); if (!s) return;
    const tr = b.closest('tr'); if (!tr) return;
    const detail = document.createElement('tr');
    detail.id = 'rpd-' + id;
    detail.innerHTML = `<td colspan="5" style="background:var(--brand-tint); padding:var(--sp-3)">${sessionAnswersHTML(s)}</td>`;
    tr.after(detail);
    b.classList.add('is-active');
  });

  document.getElementById('rp-close')?.addEventListener('click', () => reportModal?.classList.remove('open'));
  reportModal?.addEventListener('click', (e) => { if (e.target === reportModal) reportModal.classList.remove('open'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') reportModal?.classList.remove('open'); });
  document.getElementById('rp-print')?.addEventListener('click', () => {
    if (activeReport) printRegion(parentReportPrintHTML(activeReport.u, activeReport.kids, activeReport.subs));
  });
  document.getElementById('rp-pdf')?.addEventListener('click', () => {
    if (!activeReport) return;
    const slug = activeReport.u.name.replace(/\s+/g, '-').toLowerCase();
    downloadPDF(parentReportPrintHTML(activeReport.u, activeReport.kids, activeReport.subs), `laporan-${slug}.pdf`);
    logAudit('report.export', `Muat turun PDF laporan pengguna: ${activeReport.u.name}`);
  });

  document.getElementById('export-csv')?.addEventListener('click', () => {
    const head = ['Nama', 'E-mel', 'Telefon', 'Bil. Anak', 'Bil. Saringan', 'Purata', 'Saringan Terakhir'];
    const csv = [head].concat(buildReportRows().map(r => [r.name, r.email, r.phone, r.children, r.screenings, r.avg, r.last]))
      .map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'laporan-pengguna-ejejak.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    logAudit('report.export', 'Muat turun CSV Laporan Pengguna');
  });
}

/* ---------- 17. PENTADBIR: URUS ARTIKEL (Modul 6) ----------------- */
function initArticlesAdmin() {
  const listEl = document.getElementById('article-list');
  if (!listEl) return;
  if (!canManageAccounts(currentAdmin()?.role)) return; // artikel: pentadbir sahaja
  const form = document.getElementById('article-form');
  let editId = null;
  let filter = 'semua';

  function render() {
    const arts = getArticles().filter(a => filter === 'semua' || a.category === filter);
    if (arts.length === 0) {
      listEl.innerHTML = `<div class="notice">${ICONS.info}<span>Tiada kandungan dalam kategori ini. Tambah menggunakan borang di sebelah.</span></div>`;
      return;
    }
    listEl.innerHTML = arts.map(a => `
      <div class="card flex items-center gap-3" style="justify-content:space-between">
        <div>
          <span class="chip">${ARTICLE_CATS[a.category]}</span>
          <strong style="display:block; font-family:var(--font-head); margin-top:6px">${a.title}</strong>
          <span class="muted" style="font-size:var(--fs-xs)">${a.body.slice(0, 80)}…</span>
        </div>
        <div class="flex gap-2" style="flex:none; align-items:center">
          <span class="status-pill ${a.published ? 'dihubungi' : 'baharu'}">${a.published ? 'Diterbitkan' : 'Draf'}</span>
          <button class="btn btn--ghost" data-toggle="${a.id}" style="padding:.35em .6em" title="${a.published ? 'Jadikan draf' : 'Terbitkan'}">${a.published ? ICONS.close : ICONS.check}</button>
          <button class="btn btn--ghost" data-edit="${a.id}" style="padding:.35em .6em" title="Sunting">${ICONS.edit}</button>
          <button class="btn btn--ghost" data-del="${a.id}" style="padding:.35em .6em" title="Padam">${ICONS.trash}</button>
        </div>
      </div>`).join('');

    listEl.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => {
      const arts = getArticles(); const a = arts.find(x => x.id === b.dataset.toggle);
      if (a) { a.published = !a.published; saveArticles(arts); render(); }
    }));
    listEl.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      if (!confirm('Padam artikel ini?')) return;
      const art = getArticles().find(x => x.id === b.dataset.del);
      saveArticles(getArticles().filter(x => x.id !== b.dataset.del));
      logAudit('article.delete', `Padam artikel: ${art ? art.title : b.dataset.del}`);
      render();
    }));
    listEl.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => {
      const a = getArticles().find(x => x.id === b.dataset.edit);
      if (!a) return;
      editId = a.id;
      document.getElementById('art-cat').value = a.category;
      document.getElementById('art-title').value = a.title;
      document.getElementById('art-body').value = a.body;
      document.getElementById('art-pub').checked = a.published;
      document.getElementById('art-form-title').textContent = 'Sunting Artikel';
      form.scrollIntoView({ behavior: 'smooth' });
    }));
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const category = val('art-cat'), title = val('art-title'), body = val('art-body');
    const published = document.getElementById('art-pub').checked;
    if (!category || !title || !body) { alert('Sila lengkapkan kategori, tajuk dan kandungan.'); return; }
    const arts = getArticles();
    if (editId) {
      const a = arts.find(x => x.id === editId);
      if (a) Object.assign(a, { category, title, body, published });
      editId = null;
      document.getElementById('art-form-title').textContent = 'Tambah Artikel';
    } else {
      arts.unshift({ id: 'A' + Date.now(), category, title, body, published });
      logAudit('article.create', `Tambah artikel: ${title}`);
    }
    saveArticles(arts);
    e.target.reset();
    render();
  });
  document.getElementById('art-reset')?.addEventListener('click', () => {
    editId = null;
    form.reset();
    document.getElementById('art-form-title').textContent = 'Tambah Artikel';
  });

  // Penapis kategori
  document.querySelectorAll('[data-artfilter]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-artfilter]').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    filter = btn.dataset.artfilter;
    // Selari borang: pra-pilih kategori yang ditapis (kemudahan)
    if (filter !== 'semua' && !editId) {
      const sel = document.getElementById('art-cat');
      if (sel) sel.value = filter;
    }
    render();
  }));

  render();
}

/* ---------- 18. PENDIDIKAN (paparan awam, dari stor artikel) -------- */
function initArticlesPublic() {
  const root = document.getElementById('edu-root');
  if (!root) return;
  const arts = getArticles().filter(a => a.published);
  const media = { artikel: 'var(--brand)', tips: '#E0913C', aktiviti: '#4FA96A', faq: 'var(--dom-motor-halus)' };

  ['artikel', 'tips', 'aktiviti'].forEach(cat => {
    const host = document.getElementById('art-' + cat);
    if (!host) return;
    const items = arts.filter(a => a.category === cat);
    host.innerHTML = items.length ? items.map(a => `
      <a class="article-card" href="#">
        <div class="article-card__media" style="background:linear-gradient(135deg, ${media[cat]}, #0C4A5A)">${ICONS.book}</div>
        <div class="article-card__body">
          <span class="chip">${ARTICLE_CATS[cat]}</span>
          <h3>${a.title}</h3>
          <p>${a.body.slice(0, 110)}…</p>
          <div class="article-card__meta"><span>Bacaan 4 minit</span><span>Baca →</span></div>
        </div>
      </a>`).join('') : '<p class="muted">Tiada kandungan lagi.</p>';
  });

  const faqHost = document.getElementById('art-faq');
  if (faqHost) {
    const faqs = arts.filter(a => a.category === 'faq');
    faqHost.innerHTML = faqs.map(a => `
      <div class="faq-item">
        <button class="faq-q">${a.title} <span class="pm">${ICONS.plus}</span></button>
        <div class="faq-a"><p>${a.body}</p></div>
      </div>`).join('');
    faqHost.querySelectorAll('.faq-q').forEach(q => q.addEventListener('click', () => {
      const item = q.closest('.faq-item'); const ans = item.querySelector('.faq-a');
      const open = item.classList.toggle('open');
      ans.style.maxHeight = open ? ans.scrollHeight + 'px' : null;
    }));
  }
}

/* ---------- 18b. PENTADBIR: PROFIL SAYA ---------------------------- */
function initAdminAccounts() {
  const pf = document.getElementById('profile-form');
  if (!pf) return;
  const me = currentAdmin();
  if (!me) return;
  const role = me.role || 'doctor';
  document.getElementById('pf-name').value = me.name || '';
  document.getElementById('pf-email').value = me.email || '';
  document.getElementById('pf-phone').value = me.phone || '';
  document.getElementById('pf-jawatan').value = me.jawatan || '';
  document.getElementById('pf-org').value = me.org || 'USM';
  pf.addEventListener('submit', (e) => {
    e.preventDefault();
    const admins = getAdmins();
    const a = admins.find(x => x.id === me.id) || admins.find(x => x.email === me.email);
    const upd = { name: val('pf-name'), phone: val('pf-phone'), jawatan: val('pf-jawatan'), org: val('pf-org') };
    if (a) { Object.assign(a, upd); saveAdmins(admins); }
    const ns = { ...me, ...upd };
    sessionStorage.setItem('ejejak_admin', JSON.stringify(ns));
    const nameEl = document.getElementById('doctor-name');
    if (nameEl) nameEl.textContent = `${ns.name} · ${ROLE_LABEL[role] || role}${ns.org ? ' (' + ns.org + ')' : ''}`;
    alert('Profil dikemas kini.');
  });

  // Tukar kata laluan sendiri (admin / doktor / superadmin)
  const pwForm = document.getElementById('staff-password-form');
  if (pwForm) {
    pwForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cur = val('spw-current'), nw = val('spw-new'), cf = val('spw-confirm');
      const admins = getAdmins();
      const a = admins.find(x => x.id === me.id) || admins.find(x => x.email === me.email);
      if (!a) { setMsg('spw-msg', 'Akaun tidak dijumpai. Sila log masuk semula.'); return; }
      if (a.password && a.password !== cur) { setMsg('spw-msg', 'Kata laluan semasa tidak betul.'); return; }
      if (nw.length < 6) { setMsg('spw-msg', 'Kata laluan baharu mesti sekurang-kurangnya 6 aksara.'); return; }
      if (nw !== cf) { setMsg('spw-msg', 'Kata laluan baharu dan pengesahan tidak sepadan.'); return; }
      if (nw === cur) { setMsg('spw-msg', 'Kata laluan baharu mesti berbeza daripada kata laluan semasa.'); return; }
      a.password = nw;
      saveAdmins(admins);
      setMsg('spw-msg', '');
      pwForm.reset();
      logAudit('account.password', `Tukar kata laluan sendiri: ${a.name}`);
      alert('Kata laluan berjaya dikemas kini.');
    });
  }
}

/* ---------- 18b-2. MODAL AKAUN STAF (cipta / sunting doktor & pentadbir) --
   Dibuka oleh butang "Tambah Akaun Baharu" (mod cipta) atau tindakan Sunting
   pada baris staf di jadual Urus Pengguna (mod kemas kini). Skop organisasi:
   superadmin urus semua; pentadbir org sendiri sahaja. */
function initStaffForm() {
  const modal = document.getElementById('staff-modal');
  const formEl = document.getElementById('admin-form');
  if (!modal || !formEl) return;
  const me = currentAdmin();
  if (!me || !canManageAccounts(me.role)) return;
  const isSuper = me.role === 'superadmin';
  const myOrg = me.org;
  let editId = null; // null = cipta; jika tidak = kemas kini

  const adOrg = document.getElementById('ad-org');
  const passInput = document.getElementById('ad-pass');
  const passHint = document.getElementById('ad-pass-hint');
  const formTitle = document.getElementById('admin-form-title');
  const submitBtn = document.getElementById('admin-submit-btn');

  function lockOrg() { if (adOrg && !isSuper) { adOrg.value = myOrg; adOrg.disabled = true; } }
  function close() { modal.classList.remove('open'); }

  function openCreate() {
    editId = null;
    formEl.reset();
    if (formTitle) formTitle.textContent = 'Tambah Akaun Baharu';
    if (submitBtn) submitBtn.innerHTML = `${ICONS.plus} Cipta Akaun`;
    if (passHint) passHint.style.display = 'none';
    if (passInput) passInput.value = 'demo1234';
    if (adOrg) { adOrg.disabled = false; if (isSuper) adOrg.value = 'USM'; }
    lockOrg();
    modal.classList.add('open');
    setTimeout(() => document.getElementById('ad-name')?.focus(), 40);
  }
  function openEdit(id) {
    const a = getAdmins().find(x => x.id === id); if (!a) return;
    if (a.role === 'superadmin') { alert('Akaun superadmin dilindungi.'); return; }
    if (a.id === me.id) { alert('Sunting akaun anda sendiri di tab Profil Saya.'); return; }
    if (!isSuper && a.org !== myOrg) { alert('Anda hanya boleh urus akaun dalam organisasi anda.'); return; }
    editId = a.id;
    document.getElementById('ad-role').value = a.role;
    document.getElementById('ad-name').value = a.name || '';
    document.getElementById('ad-email').value = a.email || '';
    document.getElementById('ad-phone').value = a.phone || '';
    document.getElementById('ad-jawatan').value = a.jawatan || '';
    if (adOrg) { adOrg.disabled = false; adOrg.value = a.org; lockOrg(); }
    if (passInput) passInput.value = '';
    if (passHint) passHint.style.display = 'block';
    if (formTitle) formTitle.textContent = `Kemas Kini: ${a.name}`;
    if (submitBtn) submitBtn.innerHTML = `${ICONS.check} Kemas Kini`;
    modal.classList.add('open');
  }

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = val('ad-email').toLowerCase();
    const newRole = val('ad-role') || 'doctor';
    if (!['admin', 'doctor'].includes(newRole)) { alert('Peranan tidak sah.'); return; }
    const newOrg = isSuper ? val('ad-org') : myOrg;
    const newName = val('ad-name');
    const admins = getAdmins();

    if (editId) {
      const a = admins.find(x => x.id === editId);
      if (!a) { close(); return; }
      if (admins.some(x => x.id !== editId && x.email.toLowerCase() === email)) { alert('E-mel ini sudah digunakan.'); return; }
      const newPass = val('ad-pass');
      Object.assign(a, { name: newName, email, phone: val('ad-phone'), jawatan: val('ad-jawatan'), org: newOrg, role: newRole });
      if (newPass) a.password = newPass; // kosong = kekalkan
      saveAdmins(admins);
      logAudit('account.update', `Kemas kini ${ROLE_LABEL[newRole]}: ${newName} (${newOrg})`);
      close(); if (refreshUsersTable) refreshUsersTable();
      alert('Akaun dikemas kini.');
      return;
    }

    if (admins.some(x => x.email.toLowerCase() === email)) { alert('E-mel ini sudah digunakan.'); return; }
    const prefix = newRole === 'admin' ? 'AD' : 'DR';
    admins.push({ id: prefix + Date.now(), name: newName, email, phone: val('ad-phone'), jawatan: val('ad-jawatan'), org: newOrg, password: val('ad-pass') || 'demo1234', role: newRole });
    saveAdmins(admins);
    logAudit('account.create', `Cipta ${ROLE_LABEL[newRole]}: ${newName} (${newOrg})`);
    close(); if (refreshUsersTable) refreshUsersTable();
    alert(`Akaun ${ROLE_LABEL[newRole]} berjaya dicipta.`);
  });

  document.getElementById('staff-close')?.addEventListener('click', close);
  document.getElementById('admin-cancel')?.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  StaffForm.openCreate = openCreate;
  StaffForm.openEdit = openEdit;
}

/* ---------- 18b. LOG AKTIVITI (audit — superadmin & pentadbir) ----- */
function initAuditLog() {
  const rows = document.getElementById('audit-rows');
  if (!rows) return;
  const me = currentAdmin();
  if (!canManageAccounts(me?.role)) return; // superadmin & pentadbir sahaja
  const isSuper = me.role === 'superadmin';

  function render() {
    let list = getAudit();
    if (!isSuper) list = list.filter(e => e.actorOrg === me.org); // pentadbir: org sendiri
    const cnt = document.getElementById('audit-count');
    if (cnt) cnt.textContent = `${list.length} rekod` + (isSuper ? ' · semua organisasi' : ` · organisasi ${me.org}`);
    rows.innerHTML = list.length ? list.map(e => `
      <tr>
        <td class="muted" style="white-space:nowrap">${fmtDate(e.at)}</td>
        <td>${e.actorName}<br><span class="muted" style="font-size:var(--fs-xs)">${ROLE_LABEL[e.actorRole] || e.actorRole} · ${e.actorOrg}</span></td>
        <td><span class="chip">${ACTION_LABEL[e.action] || e.action}</span></td>
        <td class="muted">${e.detail || '-'}</td>
      </tr>`).join('') : `<tr><td colspan="4" style="text-align:center; padding:var(--sp-4); color:var(--muted)">Tiada rekod aktiviti lagi.</td></tr>`;
  }
  document.getElementById('audit-refresh')?.addEventListener('click', render);
  render();
}

/* ---------- 18c. IBU BAPA: SEJARAH SARINGAN ANAK ------------------- */
/* Hab sejarah umum (sejarah.html tanpa ?child) — senarai anak untuk dipilih. */
function renderHistoryHub(host, user) {
  document.querySelectorAll('[data-child]').forEach(el => el.textContent = 'Semua Anak');
  const info = document.getElementById('child-info');
  if (info) info.textContent = 'Pilih anak untuk melihat sejarah saringan penuh.';
  ['btn-print-hist', 'btn-pdf-hist'].forEach(id => document.getElementById(id)?.style.setProperty('display', 'none'));

  const kids = childrenOf(user.id);
  const subs = getSubmissions().filter(s => s.userId === user.id);
  if (!kids.length) {
    host.innerHTML = `<div class="notice">${ICONS.info}<span>Belum ada profil anak. <a href="anak.html">Tambah anak</a> dan mula saringan untuk melihat sejarah di sini.</span></div>`;
    return;
  }
  const cards = kids.map(c => {
    const m = ageInMonths(c.dob);
    const cs = subs.filter(s => s.childId === c.id).sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
    const last = cs[0];
    return `<div class="card">
      <div class="flex items-center gap-2" style="margin-bottom:var(--sp-3)">
        <span class="avatar avatar--${c.gender === 'perempuan' ? 'girl' : 'boy'}">${(c.name || '?').charAt(0).toUpperCase()}</span>
        <div><strong>${c.name}</strong><br><span class="muted" style="font-size:var(--fs-sm)">${c.gender} · ${ageText(m)}</span></div>
      </div>
      <div class="flex gap-3 wrap" style="margin-bottom:var(--sp-3)">
        <span class="chip">${cs.length} saringan</span>
        <span class="muted" style="font-size:var(--fs-sm)">Terakhir: ${last ? fmtDate(last.submittedAt) : 'Tiada lagi'}</span>
      </div>
      <a class="btn btn--block" href="sejarah.html?child=${c.id}">${ICONS.chart} Lihat Sejarah Penuh</a>
    </div>`;
  }).join('');
  host.innerHTML = `<div class="grid grid-3">${cards}</div>`;
}

function initHistory() {
  const host = document.getElementById('history-root');
  if (!host) return;
  const user = currentUser(); if (!user) return;
  const params = new URLSearchParams(location.search);
  const child = getChildren().find(c => c.id === params.get('child') && c.userId === user.id);
  const rows = document.getElementById('history-rows');
  if (!child) {
    // Mod umum (dari navigasi "Sejarah") — papar hab pemilihan anak.
    renderHistoryHub(host, user);
    return;
  }
  const m = ageInMonths(child.dob);
  document.querySelectorAll('[data-child]').forEach(el => el.textContent = child.name);
  const info = document.getElementById('child-info');
  if (info) info.textContent = `${child.gender} · ${ageText(m)} · ${ageGroupLabel(m)}`;

  const ph = document.getElementById('print-head');
  if (ph) ph.innerHTML = printLetterhead('Sejarah Saringan &middot; ' + child.name);
  document.getElementById('btn-print-hist')?.addEventListener('click', () => window.print());

  const subs = getSubmissions().filter(s => s.childId === child.id);
  if (subs.length === 0) {
    rows.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:var(--sp-5); color:var(--muted)">Tiada saringan lagi. <a href="saringan.html?child=${child.id}">Mula saringan pertama</a>.</td></tr>`;
    return;
  }
  rows.innerHTML = subs.map(s => {
    const t = triageOf(s);
    return `<tr class="${t.row}">
      <td class="muted" style="white-space:nowrap">${fmtDate(s.submittedAt)}</td>
      <td>${ageText(s.ageMonths)}<br><span class="muted" style="font-size:var(--fs-xs)">${s.ageGroup}</span></td>
      <td><strong class="tnum">${s.totalAchieved}/${s.total}</strong> <span class="muted">(${t.pct}%)</span></td>
      <td><span class="triage ${t.cls}"><span class="tdot"></span>${t.label}</span></td>
      <td class="col-action"><button class="btn btn--ghost" data-hist="${s.id}" style="padding:.5em .8em">${ICONS.eye} Lihat</button></td>
    </tr>`;
  }).join('');

  // "Muat Turun PDF" — jana & muat turun fail PDF terus (kandungan sama seperti
  // paparan cetak). Jatuh balik ke dialog cetak jika pustaka tiada.
  document.getElementById('btn-pdf-hist')?.addEventListener('click', () => {
    const slug = child.name.replace(/\s+/g, '-').toLowerCase();
    const info = `${child.gender} · ${ageText(m)} · ${ageGroupLabel(m)}`;
    downloadPDF(historyReportHTML(child, info, subs), `sejarah-saringan-${slug}.pdf`);
  });

  const modal = document.getElementById('hist-modal');
  let activeSess = null;
  document.getElementById('h-print')?.addEventListener('click', () => {
    if (activeSess) printRegion(sessionReportHTML(child.name, fmtDate(activeSess.submittedAt), activeSess));
  });
  document.getElementById('h-pdf')?.addEventListener('click', () => {
    if (!activeSess) return;
    const slug = child.name.replace(/\s+/g, '-').toLowerCase();
    downloadPDF(sessionReportPDF(child.name, fmtDate(activeSess.submittedAt), activeSess), `keputusan-${slug}.pdf`);
  });
  rows.addEventListener('click', (e) => {
    const b = e.target.closest('[data-hist]'); if (!b || !modal) return;
    const s = subs.find(x => x.id === b.dataset.hist); if (!s) return;
    activeSess = s;
    const t = triageOf(s);
    document.getElementById('h-title2').textContent = `${child.name} · ${fmtDate(s.submittedAt)}`;
    const scores = Object.values(s.domains).map(d => {
      const pct = Math.round(d.achieved / d.total * 100);
      return `<div class="dscore" style="--dc:${d.color}"><div class="dscore__label"><span class="dot"></span>${d.name}</div><div class="progress-bar"><span style="width:${pct}%"></span></div><div class="dscore__pct tnum">${pct}%</div></div>`;
    }).join('');
    const ans = Object.values(s.domains).map(d => {
      const items = d.items || []; if (!items.length) return '';
      return `<div style="margin-top:var(--sp-3)"><strong style="color:${d.color}">${d.name}</strong>
        <ul style="list-style:none; padding:0; margin:6px 0 0; display:grid; gap:6px">${items.map((it, i) => `<li class="flex items-center gap-2" style="justify-content:space-between; background:var(--brand-tint); padding:.5em .7em; border-radius:8px; font-size:var(--fs-sm)"><span>${i + 1}. ${it.text}</span><span class="triage ${it.answer === 'ya' ? 'triage--ok' : 'triage--warn'}">${it.answer === 'ya' ? 'Ya' : 'Tidak'}</span></li>`).join('')}</ul></div>`;
    }).join('');
    document.getElementById('h-body').innerHTML =
      `<div class="flex gap-3 wrap" style="margin-bottom:var(--sp-3)"><span class="chip">Markah ${s.totalAchieved}/${s.total} (${t.pct}%)</span><span class="triage ${t.cls}"><span class="tdot"></span>${t.label}</span></div>
       <div class="domain-scores">${scores}</div>${ans}
       <p class="muted" style="font-size:var(--fs-xs); margin-top:var(--sp-4); border-top:1px solid var(--line); padding-top:var(--sp-3)"><strong>Penafian:</strong> Keputusan saringan adalah untuk saringan awal sahaja dan bukan diagnosis perubatan. Setiap sesi kekal muktamad selepas dihantar.</p>`;
    modal.classList.add('open');
  });
  document.getElementById('h-close')?.addEventListener('click', () => modal.classList.remove('open'));
  modal?.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal?.classList.remove('open'); });
}

/* ---------- 18d. IBU BAPA: MAKLUMAT KELUARGA ----------------------
   Halaman ini kini fokus pada butiran keluarga sahaja (daerah + ibu/bapa)
   yang disimpan ke rekod pengguna. */
function initProfile() {
  const famForm = document.getElementById('family-form');
  if (!famForm) return;
  const user = currentUser();
  if (!user) return;

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
  const rec = getUsers().find(x => x.id === user.id) || user;

  // Isi borang daripada rekod semasa.
  set('fam-district', rec.district);
  const fill = (who, p) => {
    p = p || {};
    set(`fam-${who}-name`, p.name); set(`fam-${who}-ic`, p.ic); set(`fam-${who}-phone`, p.phone);
    set(`fam-${who}-job`, p.job); set(`fam-${who}-income`, p.income);
  };
  fill('father', rec.father); fill('mother', rec.mother);

  famForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const readParent = (who) => ({
      name: val(`fam-${who}-name`), ic: val(`fam-${who}-ic`), phone: val(`fam-${who}-phone`),
      job: val(`fam-${who}-job`), income: val(`fam-${who}-income`),
    });
    const users = getUsers();
    const u = users.find(x => x.id === user.id);
    if (!u) { setMsg('fam-msg', 'Akaun tidak dijumpai. Sila log masuk semula.'); return; }
    u.district = val('fam-district');
    u.father = readParent('father');
    u.mother = readParent('mother');
    saveUsers(users);
    setMsg('fam-msg', 'Maklumat keluarga berjaya disimpan.');
    const box = document.getElementById('fam-msg'); if (box) box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

/* ---------- 18d-2. IBU BAPA: AKAUN SAYA (akaun.html) --------------
   Butiran akaun (baca-sahaja) + tukar kata laluan. Dipautkan dari
   butang nama pengguna di header. */
function initAkaun() {
  const form = document.getElementById('password-form');
  if (!form) return;
  const user = currentUser();
  if (!user) return;

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
  set('pr-name', user.name); set('pr-email', user.email); set('pr-phone', user.phone);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cur = val('pw-current'), nw = val('pw-new'), cf = val('pw-confirm');
    const users = getUsers();
    const u = users.find(x => x.id === user.id);
    if (!u) { setMsg('pw-msg', 'Akaun tidak dijumpai. Sila log masuk semula.'); return; }
    if (u.password && u.password !== cur) { setMsg('pw-msg', 'Kata laluan semasa tidak betul.'); return; }
    if (nw.length < 6) { setMsg('pw-msg', 'Kata laluan baharu mesti sekurang-kurangnya 6 aksara.'); return; }
    if (nw !== cf) { setMsg('pw-msg', 'Kata laluan baharu dan pengesahan tidak sepadan.'); return; }
    if (nw === cur) { setMsg('pw-msg', 'Kata laluan baharu mesti berbeza daripada kata laluan semasa.'); return; }
    u.password = nw;
    saveUsers(users);
    setMsg('pw-msg', '');
    form.reset();
    alert('Kata laluan berjaya dikemas kini.');
  });

  // Naik taraf akaun e-Pembelajaran → Saringan Anak (mockup).
  const rec = getUsers().find(x => x.id === user.id) || user;
  const upCard = document.getElementById('upgrade-card');
  if (upCard && rec.accountType === 'knowledge') {
    upCard.style.display = '';
    document.getElementById('btn-upgrade')?.addEventListener('click', () => {
      if (!confirm('Naik taraf ke akaun Saringan Anak?\n\nAnda akan boleh menambah profil anak dan membuat saringan perkembangan.')) return;
      const users = getUsers();
      const u = users.find(x => x.id === user.id);
      if (u) { u.accountType = 'screening'; saveUsers(users); }
      const s = currentUser(); if (s) { s.accountType = 'screening'; sessionStorage.setItem('ejejak_user', JSON.stringify(s)); }
      alert('Akaun anda kini akaun Saringan Anak. Sila lengkapkan maklumat keluarga & tambah profil anak.');
      window.location.href = 'anak.html';
    });
  }
}

/* ---------- 18e. LUPA KATA LALUAN (mockup) ------------------------
   Langkah 1: masukkan e-mel berdaftar → jana kod demo. Langkah 2:
   masukkan kod + kata laluan baharu → kemas kini rekod pengguna. */
function initForgot() {
  const form = document.getElementById('fp-form');
  if (!form) return;
  let code = null, targetId = null;
  const genOtp = () => String(Math.floor(100000 + Math.random() * 900000));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = val('fp-email').toLowerCase();
    if (!email) { setMsg('fp-msg', 'Sila masukkan alamat e-mel anda.'); return; }
    const u = getUsers().find(x => (x.email || '').toLowerCase() === email);
    if (!u) { setMsg('fp-msg', 'E-mel ini tidak berdaftar. Sila semak atau daftar akaun baharu.'); return; }
    targetId = u.id;
    code = genOtp();
    setMsg('fp-msg', '');
    const demo = document.getElementById('fp-demo');
    if (demo) demo.textContent = 'Kod demo: ' + code + ' — dalam sistem sebenar dihantar ke e-mel/SMS anda.';
    document.getElementById('fp-step1')?.style.setProperty('display', 'none');
    document.getElementById('fp-step2')?.style.setProperty('display', 'block');
    document.getElementById('fp-code')?.focus();
  });

  document.getElementById('fp-reset')?.addEventListener('click', () => {
    const entered = val('fp-code'), nw = val('fp-new'), cf = val('fp-confirm');
    if (entered !== code) { setMsg('fp-msg2', 'Kod pengesahan salah. Sila semak semula.'); return; }
    if (nw.length < 6) { setMsg('fp-msg2', 'Kata laluan baharu mesti sekurang-kurangnya 6 aksara.'); return; }
    if (nw !== cf) { setMsg('fp-msg2', 'Kata laluan dan pengesahan tidak sepadan.'); return; }
    const users = getUsers();
    const u = users.find(x => x.id === targetId);
    if (!u) { setMsg('fp-msg2', 'Akaun tidak dijumpai.'); return; }
    u.password = nw;
    saveUsers(users);
    setMsg('fp-msg2', '');
    document.getElementById('fp-step2')?.style.setProperty('display', 'none');
    document.getElementById('fp-done')?.style.setProperty('display', 'flex');
  });
}

/* ---------- 18f. PROGRAM KOMUNITI (paparan ibu bapa) --------------
   Papar program (dicipta pentadbir) & benarkan ibu bapa "Sertai"
   (disimpan ke ejejak_attendance — sama stor yang dilihat urus setia). */
function initProgram() {
  const grid = document.getElementById('program-grid');
  if (!grid) return;
  const user = currentUser();
  if (!user) return;

  function joinedIds() {
    return new Set(getAttendance().filter(a => a.userId === user.id).map(a => a.programId));
  }
  function render() {
    const progs = getPrograms().slice().sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
    const joined = joinedIds();
    if (!progs.length) {
      grid.innerHTML = `<div class="notice" style="grid-column:1/-1">${ICONS.info}<span>Tiada program buat masa ini. Sila semak semula kelak.</span></div>`;
      return;
    }
    grid.innerHTML = progs.map(p => {
      const isJoined = joined.has(p.id);
      return `<div class="card" style="display:flex; flex-direction:column; gap:var(--sp-2)">
        <strong style="font-family:var(--font-head); font-size:var(--fs-md)">${p.title}</strong>
        <div class="muted" style="font-size:var(--fs-sm); display:flex; flex-direction:column; gap:4px">
          <span>${ICONS.clock} ${programDateText(p.date)}</span>
          <span>${ICONS.pin} ${p.location || 'Lokasi akan diumumkan'}</span>
        </div>
        ${p.desc ? `<p class="muted" style="font-size:var(--fs-sm); margin:0; flex:1">${p.desc}</p>` : '<div style="flex:1"></div>'}
        <span class="chip" style="align-self:flex-start">${programDistrictsLabel(p.districts)}</span>
        <button class="btn ${isJoined ? 'btn--ghost' : ''} btn--block" data-join="${p.id}" ${isJoined ? 'disabled' : ''}>
          ${isJoined ? ICONS.check + ' Telah Daftar' : 'Sertai Program'}
        </button>
      </div>`;
    }).join('');
    grid.querySelectorAll('[data-join]').forEach(btn => btn.addEventListener('click', () => {
      const pid = btn.dataset.join;
      const rec = getUsers().find(x => x.id === user.id) || user;
      const list = getAttendance();
      list.push({ id: 'AT' + Date.now(), programId: pid, userId: user.id, name: user.name, phone: user.phone || '', district: rec.district || '', checkedIn: false, checkedAt: null, joinedAt: new Date().toISOString() });
      saveAttendance(list);
      alert('Terima kasih! Anda telah mendaftar untuk program ini. Urus setia akan menghubungi anda. (demo/simulasi)');
      render();
    }));
  }
  render();
}

/* ---------- 18g. VIDEO PEMBELAJARAN (paparan awam + urus pentadbir) */
function videoEmbedHTML(v) {
  return `<div class="card">
    <div class="video-embed"><iframe src="https://www.youtube.com/embed/${encodeURIComponent(v.youtube || '')}" title="${(v.title || '').replace(/"/g, '&quot;')}" loading="lazy" allowfullscreen></iframe></div>
    <div style="padding:var(--sp-3)">
      <strong>${v.title || 'Video'}</strong>
      <p class="muted" style="font-size:var(--fs-sm); margin-top:4px">${v.desc || ''}</p>
    </div>
  </div>`;
}
function initVideosPublic() {
  const grid = document.getElementById('video-grid');
  if (!grid) return;
  const vids = getVideos();
  grid.innerHTML = vids.length ? vids.map(videoEmbedHTML).join('')
    : `<p class="muted" style="grid-column:1/-1">Tiada video buat masa ini.</p>`;
}
function initVideosAdmin() {
  const listEl = document.getElementById('video-admin-list');
  if (!listEl) return;
  if (!canManageAccounts(currentAdmin()?.role)) return; // superadmin & pentadbir
  const form = document.getElementById('video-form');
  let editId = null;
  function render() {
    const vids = getVideos();
    listEl.innerHTML = vids.length ? vids.map(v => `
      <div class="card flex items-center gap-3" style="justify-content:space-between">
        <div style="min-width:0">
          <strong style="display:block; font-family:var(--font-head)">${v.title}</strong>
          <span class="muted" style="font-size:var(--fs-xs)">ID YouTube: ${v.youtube || '—'}</span>
        </div>
        <div class="flex gap-2" style="flex:none">
          <button class="btn btn--ghost" data-vedit="${v.id}" title="Sunting" style="padding:.35em .6em">${ICONS.edit}</button>
          <button class="btn btn--ghost" data-vdel="${v.id}" title="Padam" style="padding:.35em .6em">${ICONS.trash}</button>
        </div>
      </div>`).join('') : `<div class="notice">${ICONS.info}<span>Tiada video. Tambah menggunakan borang di sebelah.</span></div>`;
    listEl.querySelectorAll('[data-vedit]').forEach(b => b.addEventListener('click', () => {
      const v = getVideos().find(x => x.id === b.dataset.vedit); if (!v) return;
      editId = v.id;
      document.getElementById('vid-title').value = v.title || '';
      document.getElementById('vid-youtube').value = v.youtube || '';
      document.getElementById('vid-desc').value = v.desc || '';
      document.getElementById('video-form-title').textContent = 'Sunting Video';
      form.scrollIntoView({ behavior: 'smooth' });
    }));
    listEl.querySelectorAll('[data-vdel]').forEach(b => b.addEventListener('click', () => {
      if (!confirm('Padam video ini?')) return;
      saveVideos(getVideos().filter(x => x.id !== b.dataset.vdel));
      if (editId === b.dataset.vdel) { editId = null; form.reset(); document.getElementById('video-form-title').textContent = 'Tambah Video'; }
      render();
    }));
  }
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = val('vid-title'), youtube = val('vid-youtube'), desc = val('vid-desc');
    if (!title || !youtube) { alert('Sila lengkapkan tajuk dan ID YouTube.'); return; }
    const vids = getVideos();
    if (editId) {
      const v = vids.find(x => x.id === editId); if (v) Object.assign(v, { title, youtube, desc });
      editId = null; document.getElementById('video-form-title').textContent = 'Tambah Video';
    } else {
      vids.unshift({ id: 'V' + Date.now(), title, youtube, desc });
    }
    saveVideos(vids);
    e.target.reset();
    render();
  });
  document.getElementById('video-reset')?.addEventListener('click', () => {
    editId = null; form.reset(); document.getElementById('video-form-title').textContent = 'Tambah Video';
  });
  render();
}

/* ---------- 18b. PEMUAT MODUL CIRI (feature module loader) ---------
   Menyuntik CSS/JS ciri tambahan mengikut jenis halaman. Setiap fail modul
   ialah IIFE yang menjalankan persediaannya sendiri & no-op jika elemen
   sasarannya tiada — jadi selamat dimuat pada mana-mana halaman. Semua
   dengan cache-busting ?v=20260806a. */
const FEATURE_V = '20260806p';
function loadFeatureModules() {
  const injectCss = (href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${href}?v=${FEATURE_V}`;
    document.head.appendChild(link);
  };
  const injectJs = (src) => {
    const s = document.createElement('script');
    s.src = `${src}?v=${FEATURE_V}`;
    s.defer = false; // dimuat selepas DOM sedia; jalankan ikut turutan suntikan
    document.body.appendChild(s);
  };
  const isAdmin = document.body.dataset.page === 'admin';
  if (isAdmin) {
    injectJs('assets/js/features/programs-blast.js');
    injectJs('assets/js/features/attendance.js');
    injectJs('assets/js/features/mba-report.js');
  } else {
    injectCss('assets/css/features/widgets.css');
    injectJs('assets/js/features/i18n.js');
    injectJs('assets/js/features/a11y.js');
    injectJs('assets/js/features/chatbot.js');
  }
}

/* ---------- 19. INIT ----------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  ensureSeed();
  if (!guard()) return;      // kawalan akses (parent / admin)
  mountChrome();
  updateAuthUI();
  renderImpersonationBanner();
  setupRoleAccess();
  initCarousel();
  initTabs();
  initFaq();
  initAuthForms();
  initDashboard();
  initAnak();
  initScreening();
  initResult();
  initAdmin();
  initDomainAdmin();
  initStats();
  initReports();
  initArticlesAdmin();
  initArticlesPublic();
  initUsersAdmin();
  initAdminAccounts();
  initStaffForm();
  initAuditLog();
  initHistory();
  initProfile();
  initAkaun();
  initForgot();
  initProgram();
  initVideosPublic();
  initVideosAdmin();
  loadFeatureModules(); // suntik modul ciri (widget awam / modul admin) — di penghujung
});
