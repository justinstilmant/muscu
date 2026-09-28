'use strict';

/* ============ Outils ============ */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 10);
const norm = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const slug = s => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const num = v => { const n = parseFloat(String(v ?? '').replace(',', '.')); return isFinite(n) ? n : 0; };
const fmt = n => Number(n).toLocaleString('fr-FR', { maximumFractionDigits: 1 });
const fmtVol = v => v >= 1000 ? fmt(v / 1000) + ' t' : Math.round(v) + ' kg';
const clock = s => { s = Math.max(0, Math.floor(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); };
const dateLong = t => new Date(t).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
const dateShort = t => new Date(t).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
const e1rm = (w, r) => r <= 1 ? w : w * (1 + r / 30);
const isoDay = t => new Date(t).toISOString().slice(0, 10);

/* ============ Bibliothèque de base ============ */
const MUSCLES = ['Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Avant-bras', 'Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets', 'Abdos', 'Cardio'];
const EQUIP = ['Barre', 'Haltères', 'Machine', 'Poulie', 'Poids du corps', 'Kettlebell', 'Élastique', 'Autre'];
const BASE_DATA = {
  'Pectoraux': [['Développé couché barre', 'Barre'], ['Développé couché haltères', 'Haltères'], ['Développé incliné barre', 'Barre'], ['Développé incliné haltères', 'Haltères'], ['Développé décliné barre', 'Barre'], ['Développé machine convergente', 'Machine'], ['Écarté haltères', 'Haltères'], ['Écarté poulie vis-à-vis', 'Poulie'], ['Pec deck', 'Machine'], ['Pompes', 'Poids du corps'], ['Dips pectoraux', 'Poids du corps'], ['Pull-over haltère', 'Haltères']],
  'Dos': [['Tractions pronation', 'Poids du corps'], ['Tractions supination', 'Poids du corps'], ['Tirage vertical poulie haute', 'Poulie'], ['Tirage horizontal poulie basse', 'Poulie'], ['Rowing barre', 'Barre'], ['Rowing Pendlay', 'Barre'], ['Rowing haltère un bras', 'Haltères'], ['Rowing T-bar', 'Barre'], ['Rowing machine', 'Machine'], ['Soulevé de terre', 'Barre'], ['Pull-over poulie', 'Poulie'], ['Shrugs haltères', 'Haltères'], ['Extension lombaires', 'Poids du corps']],
  'Épaules': [['Développé militaire barre', 'Barre'], ['Développé épaules haltères', 'Haltères'], ['Développé Arnold', 'Haltères'], ['Développé épaules machine', 'Machine'], ['Élévations latérales haltères', 'Haltères'], ['Élévations latérales poulie', 'Poulie'], ['Élévations frontales', 'Haltères'], ['Oiseau haltères', 'Haltères'], ['Oiseau machine', 'Machine'], ['Face pull', 'Poulie'], ['Tirage menton', 'Barre']],
  'Biceps': [['Curl barre droite', 'Barre'], ['Curl barre EZ', 'Barre'], ['Curl haltères alterné', 'Haltères'], ['Curl marteau', 'Haltères'], ['Curl pupitre', 'Barre'], ['Curl incliné', 'Haltères'], ['Curl poulie basse', 'Poulie'], ['Curl concentré', 'Haltères']],
  'Triceps': [['Barre au front', 'Barre'], ['Extension poulie haute corde', 'Poulie'], ['Extension poulie barre', 'Poulie'], ['Dips triceps', 'Poids du corps'], ['Développé couché prise serrée', 'Barre'], ['Extension nuque haltère', 'Haltères'], ['Kickback haltère', 'Haltères'], ['Extension un bras poulie', 'Poulie']],
  'Avant-bras': [['Curl poignets', 'Barre'], ['Curl inversé', 'Barre'], ['Farmer walk', 'Haltères']],
  'Quadriceps': [['Squat barre', 'Barre'], ['Squat avant', 'Barre'], ['Presse à cuisses', 'Machine'], ['Hack squat', 'Machine'], ['Leg extension', 'Machine'], ['Fentes haltères', 'Haltères'], ['Squat bulgare', 'Haltères'], ['Goblet squat', 'Kettlebell'], ['Step-up', 'Haltères']],
  'Ischio-jambiers': [['Soulevé de terre jambes tendues', 'Barre'], ['Leg curl allongé', 'Machine'], ['Leg curl assis', 'Machine'], ['Good morning', 'Barre'], ['Nordic curl', 'Poids du corps']],
  'Fessiers': [['Hip thrust', 'Barre'], ['Pont fessier', 'Poids du corps'], ['Abduction machine', 'Machine'], ['Kickback poulie', 'Poulie'], ['Fentes marchées', 'Haltères']],
  'Mollets': [['Mollets debout machine', 'Machine'], ['Mollets assis', 'Machine'], ['Mollets à la presse', 'Machine']],
  'Abdos': [['Crunch', 'Poids du corps'], ['Crunch poulie', 'Poulie'], ['Relevé de jambes suspendu', 'Poids du corps'], ['Planche', 'Poids du corps'], ['Gainage latéral', 'Poids du corps'], ['Roue abdominale', 'Autre'], ['Russian twist', 'Autre']],
  'Cardio': [['Rameur', 'Machine'], ['Vélo', 'Machine'], ['Tapis de course', 'Machine'], ['Corde à sauter', 'Autre'], ['Burpees', 'Poids du corps']]
};
const BASE = [];
for (const m of MUSCLES) for (const [n, e] of BASE_DATA[m]) BASE.push({ id: 'b_' + slug(n), name: n, muscle: m, equip: e, base: true });

const TPL = [
  { name: 'Push / Pull / Legs', desc: '3 jours · pousser, tirer, jambes', days: [
    { name: 'Push', items: [['Développé couché barre', 4, '6-8'], ['Développé incliné haltères', 3, '8-10'], ['Développé épaules haltères', 3, '8-10'], ['Élévations latérales haltères', 3, '12-15'], ['Extension poulie haute corde', 3, '10-12']] },
    { name: 'Pull', items: [['Tractions pronation', 4, '6-10'], ['Rowing barre', 4, '8'], ['Tirage horizontal poulie basse', 3, '10-12'], ['Face pull', 3, '12-15'], ['Curl barre EZ', 3, '8-12'], ['Curl marteau', 3, '10-12']] },
    { name: 'Legs', items: [['Squat barre', 4, '6-8'], ['Soulevé de terre jambes tendues', 3, '8-10'], ['Presse à cuisses', 3, '10-12'], ['Leg curl allongé', 3, '10-12'], ['Mollets debout machine', 4, '12-15'], ['Crunch poulie', 3, '12-15']] }
  ] },
  { name: 'Full body', desc: '2 séances A/B · 3 fois par semaine en alternance', days: [
    { name: 'Full body A', items: [['Squat barre', 3, '6-8'], ['Développé couché haltères', 3, '8-10'], ['Rowing haltère un bras', 3, '10'], ['Développé militaire barre', 3, '8'], ['Planche', 3, '45 s']] },
    { name: 'Full body B', items: [['Soulevé de terre', 3, '5'], ['Développé incliné barre', 3, '8'], ['Tirage vertical poulie haute', 3, '10'], ['Fentes haltères', 3, '10'], ['Curl haltères alterné', 2, '12'], ['Extension poulie barre', 2, '12']] }
  ] },
  { name: 'Haut / Bas', desc: '4 jours · haut du corps et bas du corps', days: [
    { name: 'Haut A', items: [['Développé couché barre', 4, '6-8'], ['Rowing barre', 4, '6-8'], ['Développé épaules haltères', 3, '8-10'], ['Tirage vertical poulie haute', 3, '8-10'], ['Curl barre EZ', 3, '10'], ['Barre au front', 3, '10']] },
    { name: 'Bas A', items: [['Squat barre', 4, '6-8'], ['Soulevé de terre jambes tendues', 3, '8-10'], ['Presse à cuisses', 3, '10-12'], ['Leg curl assis', 3, '10-12'], ['Mollets debout machine', 4, '12']] },
    { name: 'Haut B', items: [['Développé incliné haltères', 4, '8-10'], ['Tractions supination', 4, '6-10'], ['Élévations latérales haltères', 4, '12-15'], ['Rowing machine', 3, '10-12'], ['Curl marteau', 3, '10-12'], ['Extension poulie haute corde', 3, '10-12']] },
    { name: 'Bas B', items: [['Soulevé de terre', 3, '5'], ['Squat bulgare', 3, '8-10'], ['Hip thrust', 3, '8-10'], ['Leg extension', 3, '12'], ['Mollets assis', 4, '12-15'], ['Relevé de jambes suspendu', 3, '10-12']] }
  ] }
];

/* ============ État ============ */
const KEY = 'muscu.v1';
const defaults = () => ({ custom: [], programs: [], history: [], active: null, settings: { rest: 90, theme: 'auto' } });
function load() {
  try {
    const r = JSON.parse(localStorage.getItem(KEY));
    if (r && typeof r === 'object') { const d = defaults(); return Object.assign(d, r, { settings: Object.assign(d.settings, r.settings) }); }
  } catch (e) { /* stockage vide ou illisible */ }
  return defaults();
}
let S = load();
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); }
  catch (e) { toast('Enregistrement impossible : stockage bloqué ou plein'); }
}
let EX = new Map();
function reindex() { EX = new Map(BASE.concat(S.custom).map(x => [x.id, x])); }
reindex();
const getEx = id => EX.get(id) || { id, name: 'Exercice supprimé', muscle: '', equip: '' };
const exByName = n => BASE.find(x => x.name === n);
const ui = { tab: 'seance', edit: null, q: '', m: '' };
let pk = null;          // état du sélecteur d'exercices
let deferredPrompt = null;
let wake = null;

/* ============ Historique ============ */
const volume = s => s.entries.reduce((t, e) => t + e.sets.reduce((a, x) => a + x.w * x.r, 0), 0);
function lastPerf(exId) {
  for (let i = S.history.length - 1; i >= 0; i--) {
    const e = S.history[i].entries.find(x => x.exId === exId);
    if (e && e.sets.length) return e.sets;
  }
  return [];
}
function bestE1(exId) {
  let b = 0;
  for (const h of S.history) for (const e of h.entries) if (e.exId === exId) for (const s of e.sets) b = Math.max(b, e1rm(s.w, s.r));
  return b;
}

/* ============ UI de base ============ */
const dlg = $('#dlg');
function sheet(html) { dlg.innerHTML = '<div class="sheet">' + html + '</div>'; if (!dlg.open) dlg.showModal(); }
function closeSheet() { if (dlg.open) dlg.close(); }
dlg.addEventListener('click', e => { if (e.target === dlg) closeSheet(); });
let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2600);
}
function applyTheme() {
  const t = S.settings.theme === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : S.settings.theme;
  document.documentElement.dataset.theme = t;
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = t === 'dark' ? '#0F1115' : '#ECEBE6';
}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

function render() {
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === ui.tab));
  const v = $('#view');
  if (ui.tab === 'programmes' && ui.edit) vEdit(v);
  else ({ seance: vSeance, programmes: vProgrammes, exercices: vExercices, suivi: vSuivi, reglages: vReglages }[ui.tab])(v);
  updatePill(); tick();
}
function updatePill() {
  const p = $('#pill');
  p.hidden = !(S.active && ui.tab !== 'seance');
}

/* ============ Vue : Séance ============ */
function vSeance(v) {
  const a = S.active;
  if (!a) {
    const last = S.history[S.history.length - 1];
    let h = '<div class="head"><h1>Séance</h1><p class="sub">' + dateLong(Date.now()) + '</p></div>';
    const withDays = S.programs.filter(p => p.days.length);
    if (withDays.length) {
      for (const p of withDays) {
        h += '<section class="blk"><h2>' + esc(p.name) + '</h2>';
        for (const d of p.days) h += '<button class="row" data-act="start" data-p="' + p.id + '" data-d="' + d.id + '"><span><b>' + esc(d.name) + '</b><small>' + d.items.length + ' exercice' + (d.items.length > 1 ? 's' : '') + '</small></span><span class="go">Démarrer</span></button>';
        h += '</section>';
      }
    } else h += '<p class="empty">Aucun programme pour l\'instant. Créez-en un dans l\'onglet Programmes, ou lancez une séance libre.</p>';
    h += '<button class="btn pri" data-act="start-free">Séance libre</button>';
    if (last) h += '<p class="lastnote">Dernière séance : ' + esc(last.name) + ', ' + dateShort(last.start) + ', ' + fmtVol(volume(last)) + '</p>';
    v.innerHTML = h; return;
  }
  let h = '<div class="live"><b>' + esc(a.name) + '</b><span id="elapsed">' + clock((Date.now() - a.start) / 1000) + '</span></div>';
  a.entries.forEach((en, i) => {
    const ex = getEx(en.exId), last = lastPerf(en.exId);
    h += '<article class="ex"><div class="exh"><div><h3>' + esc(ex.name) + '</h3><small>' + esc(ex.muscle) + (ex.equip ? ' · ' + esc(ex.equip) : '') + '</small></div><button class="link danger" data-act="rm-ex" data-i="' + i + '">Retirer</button></div>';
    h += '<div class="sethead"><span>#</span><span>Précédent</span><span>kg</span><span>Reps</span><span></span></div>';
    en.sets.forEach((s, j) => {
      const pv = last[j] ? fmt(last[j].w) + '×' + last[j].r : '–';
      h += '<div class="set' + (s.done ? ' done' : '') + '"><span class="n">' + (j + 1) + '</span><span class="prev">' + pv + '</span>' +
        '<input inputmode="decimal" aria-label="Charge série ' + (j + 1) + '" data-bind="set" data-f="w" data-i="' + i + '" data-j="' + j + '" value="' + esc(s.w) + '">' +
        '<input inputmode="numeric" aria-label="Répétitions série ' + (j + 1) + '" data-bind="set" data-f="r" data-i="' + i + '" data-j="' + j + '" value="' + esc(s.r) + '">' +
        '<button class="chk" data-act="chk" data-i="' + i + '" data-j="' + j + '" aria-label="Valider la série ' + (j + 1) + '">' + (s.done ? '✓' : '') + '</button></div>';
    });
    h += '<div class="exf"><button class="link" data-act="add-set" data-i="' + i + '">Ajouter une série</button>' + (en.sets.length > 1 ? '<button class="link" data-act="del-set" data-i="' + i + '">Retirer la dernière</button>' : '') + '</div></article>';
  });
  h += '<button class="btn" data-act="add-live">Ajouter un exercice</button>';
  h += '<div class="finish"><button class="btn pri" data-act="finish">Terminer la séance</button><button class="btn danger" data-act="discard">Abandonner</button></div>';
  v.innerHTML = h;
}

function begin(name, items) {
  S.active = {
    id: uid(), start: Date.now(), name, restEnd: 0,
    entries: items.map(it => {
      const last = lastPerf(it.exId), n = Math.max(1, (it.sets | 0) || 3);
      return { exId: it.exId, sets: Array.from({ length: n }, (_, j) => ({ w: last[j] ? last[j].w : (last.length ? last[last.length - 1].w : ''), r: parseInt(it.reps) || '', done: false })) };
    })
  };
  save(); keepAwake(); render();
}
async function keepAwake() {
  try { if ('wakeLock' in navigator && S.active) wake = await navigator.wakeLock.request('screen'); } catch (e) { /* refusé */ }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && S.active) keepAwake(); });

function finish() {
  const a = S.active;
  const entries = a.entries.map(e => ({ exId: e.exId, sets: e.sets.filter(s => s.done && num(s.r) > 0).map(s => ({ w: num(s.w), r: num(s.r) })) })).filter(e => e.sets.length);
  if (!entries.length) { if (confirm('Aucune série validée. Abandonner la séance ?')) discard(true); return; }
  const prs = [];
  for (const e of entries) {
    const best = Math.max(...e.sets.map(s => e1rm(s.w, s.r))), prev = bestE1(e.exId);
    if (prev > 0 && best > prev + 0.01 && best > 0) prs.push(getEx(e.exId).name);
  }
  const rec = { id: a.id, name: a.name, start: a.start, end: Date.now(), entries };
  S.history.push(rec); S.active = null; save();
  try { if (wake) wake.release(); } catch (e) { /* ok */ } wake = null;
  hideRest(); render();
  sheet('<h2>Séance terminée</h2>' +
    '<div class="kv"><span>Durée</span><b>' + clock((rec.end - rec.start) / 1000) + '</b></div>' +
    '<div class="kv"><span>Séries validées</span><b>' + entries.reduce((t, e) => t + e.sets.length, 0) + '</b></div>' +
    '<div class="kv"><span>Volume total</span><b>' + fmtVol(volume(rec)) + '</b></div>' +
    (prs.length ? '<p class="note box"><b>Nouveaux records estimés</b><br>' + prs.map(esc).join(', ') + '</p>' : '') +
    '<button class="btn pri" data-act="close">Fermer</button>');
}
function discard(silent) {
  if (!silent && !confirm('Abandonner la séance en cours ? Les séries saisies seront perdues.')) return;
  S.active = null; save(); try { if (wake) wake.release(); } catch (e) { /* ok */ } wake = null; hideRest(); render();
}

/* Minuteur de repos */
function hideRest() { $('#restbar').hidden = true; }
function beep() {
  try {
    const c = new (window.AudioContext || window.webkitAudioContext)(), o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination); o.frequency.value = 880; g.gain.value = 0.15; o.start(); o.stop(c.currentTime + 0.25);
  } catch (e) { /* audio indisponible */ }
}
function tick() {
  const a = S.active, el = $('#elapsed');
  if (a && el) el.textContent = clock((Date.now() - a.start) / 1000);
  const p = $('#pill'); if (a && p) p.textContent = 'Séance en cours · ' + clock((Date.now() - a.start) / 1000);
  const rb = $('#restbar');
  if (a && a.restEnd) {
    const left = Math.ceil((a.restEnd - Date.now()) / 1000);
    if (left > 0) { rb.hidden = false; $('#restleft').textContent = clock(left); }
    else { a.restEnd = 0; save(); rb.hidden = true; if (navigator.vibrate) navigator.vibrate([200, 100, 200]); beep(); toast('Repos terminé'); }
  } else rb.hidden = true;
}
setInterval(tick, 500);

/* ============ Sélecteur / liste d'exercices ============ */
function listHTML(q, m, mode, sel) {
  const nq = norm(q);
  const all = BASE.concat(S.custom).filter(x => (!m || x.muscle === m) && (!nq || norm(x.name).includes(nq) || norm(x.equip).includes(nq)));
  if (!all.length) return '<p class="empty">Aucun exercice trouvé. Vous pouvez le créer vous-même.</p>';
  let h = '';
  for (const mu of MUSCLES) {
    const g = all.filter(x => x.muscle === mu).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    if (!g.length) continue;
    h += '<h2>' + esc(mu) + ' <small>' + g.length + '</small></h2>';
    for (const x of g) {
      const on = sel && sel.has(x.id);
      h += '<button class="row" data-act="' + (mode === 'pick' ? 'pk-t' : 'exdetail') + '" data-id="' + x.id + '"><span><b>' + esc(x.name) + (x.base ? '' : '<span class="tag">perso</span>') + '</b><small>' + esc(x.equip) + '</small></span>' + (mode === 'pick' ? '<span class="tick">' + (on ? '✓' : '') + '</span>' : '') + '</button>';
    }
  }
  return h;
}
function chipsHTML(cur, act) {
  return '<div class="chips"><button class="chip' + (cur === '' ? ' on' : '') + '" data-act="' + act + '" data-m="">Tous</button>' +
    MUSCLES.map(m => '<button class="chip' + (cur === m ? ' on' : '') + '" data-act="' + act + '" data-m="' + esc(m) + '">' + esc(m) + '</button>').join('') + '</div>';
}
function openPicker(cb, sel) { pk = { cb, sel: sel || new Set(), q: '', m: '' }; drawPicker(); }
function drawPicker() {
  sheet('<h2>Ajouter des exercices</h2><input id="pq" class="search" type="search" placeholder="Rechercher un exercice" data-bind="pq" value="' + esc(pk.q) + '">' +
    chipsHTML(pk.m, 'pk-m') + '<div id="pklist">' + listHTML(pk.q, pk.m, 'pick', pk.sel) + '</div>' +
    '<div class="sheetbar"><button class="btn" data-act="pk-new">Créer un exercice</button><button class="btn pri" id="pkok" data-act="pk-ok">Ajouter (' + pk.sel.size + ')</button></div>');
}

/* ============ Vue : Exercices ============ */
function vExercices(v) {
  v.innerHTML = '<div class="head topline"><h1>Exercices</h1><button class="btn sm pri" data-act="ex-new">Créer</button></div>' +
    '<p class="note">' + (BASE.length + S.custom.length) + ' exercices, dont ' + S.custom.length + ' créé' + (S.custom.length > 1 ? 's' : '') + ' par vous.</p>' +
    '<input class="search" type="search" placeholder="Rechercher un exercice ou un matériel" data-bind="q" value="' + esc(ui.q) + '">' +
    chipsHTML(ui.m, 'lib-m') + '<div id="exlist">' + listHTML(ui.q, ui.m, 'lib') + '</div>';
}
function exDetail(id) {
  const x = getEx(id), best = bestE1(id);
  const sessions = S.history.filter(h => h.entries.some(e => e.exId === id)).slice(-5).reverse();
  let h = '<h2>' + esc(x.name) + '</h2><div class="kv"><span>Groupe musculaire</span><b>' + esc(x.muscle) + '</b></div><div class="kv"><span>Matériel</span><b>' + esc(x.equip) + '</b></div>';
  if (x.notes) h += '<p class="note">' + esc(x.notes) + '</p>';
  h += best ? '<div class="kv"><span>Meilleur 1RM estimé</span><b>' + fmt(best) + ' kg</b></div>' : '<p class="note">Pas encore d\'historique pour cet exercice.</p>';
  if (sessions.length) {
    h += '<h2>Dernières séances</h2>';
    for (const s of sessions) { const e = s.entries.find(z => z.exId === id); h += '<div class="kv"><span>' + dateShort(s.start) + '</span><b>' + e.sets.map(z => fmt(z.w) + '×' + z.r).join('  ') + '</b></div>'; }
  }
  h += '<div class="sheetbar">' + (x.base ? '<button class="btn" data-act="close">Fermer</button><span></span>' : '<button class="btn danger" data-act="ex-del" data-id="' + id + '">Supprimer</button><button class="btn pri" data-act="ex-edit" data-id="' + id + '">Modifier</button>') + '</div>';
  sheet(h);
}
function exForm(id, after) {
  const x = id ? getEx(id) : { name: '', muscle: MUSCLES[0], equip: EQUIP[0], notes: '' };
  window._exAfter = after || null;
  sheet('<h2>' + (id ? 'Modifier l\'exercice' : 'Nouvel exercice') + '</h2>' +
    '<label class="field">Nom<input id="fx-name" value="' + esc(x.name) + '" placeholder="Ex. Développé couché prise neutre"></label>' +
    '<label class="field">Groupe musculaire<select id="fx-muscle">' + MUSCLES.map(m => '<option' + (m === x.muscle ? ' selected' : '') + '>' + esc(m) + '</option>').join('') + '</select></label>' +
    '<label class="field">Matériel<select id="fx-equip">' + EQUIP.map(m => '<option' + (m === x.equip ? ' selected' : '') + '>' + esc(m) + '</option>').join('') + '</select></label>' +
    '<label class="field">Notes (facultatif)<textarea id="fx-notes" rows="2" placeholder="Réglages, consignes d\'exécution…">' + esc(x.notes || '') + '</textarea></label>' +
    '<div class="sheetbar"><button class="btn" data-act="' + (window._exAfter ? 'pk-back' : 'close') + '">Annuler</button><button class="btn pri" data-act="ex-save" data-id="' + (id || '') + '">Enregistrer</button></div>');
}

/* ============ Vue : Programmes ============ */
function vProgrammes(v) {
  let h = '<div class="head topline"><h1>Programmes</h1><button class="btn sm pri" data-act="prog-new">Nouveau</button></div>';
  if (!S.programs.length) h += '<p class="empty">Aucun programme. Partez d\'un modèle ou créez le vôtre jour par jour.</p>';
  for (const p of S.programs) {
    h += '<div class="row"><span><b>' + esc(p.name) + '</b><small>' + (p.days.map(d => esc(d.name)).join(' · ') || 'Aucun jour') + '</small></span><span><button class="link" data-act="prog-edit" data-p="' + p.id + '">Modifier</button></span></div>';
  }
  h += '<button class="btn" data-act="prog-tpl">Partir d\'un modèle</button>';
  v.innerHTML = h;
}
function vEdit(v) {
  const p = S.programs.find(x => x.id === ui.edit);
  if (!p) { ui.edit = null; vProgrammes(v); return; }
  let h = '<div class="head"><button class="link" data-act="back">Programmes</button><input class="title" data-bind="pname" aria-label="Nom du programme" value="' + esc(p.name) + '"></div>';
  p.days.forEach((d, di) => {
    h += '<section class="blk"><div class="dayhead"><input class="dname" data-bind="dname" data-d="' + di + '" aria-label="Nom du jour" value="' + esc(d.name) + '"><button class="link danger" data-act="del-day" data-d="' + di + '">Supprimer</button></div>';
    if (!d.items.length) h += '<p class="empty">Aucun exercice pour ce jour.</p>';
    d.items.forEach((it, k) => {
      const e = getEx(it.exId);
      h += '<div class="item"><div class="iname"><b>' + esc(e.name) + '</b><small>' + esc(e.muscle) + '</small></div>' +
        '<label class="mini">Séries<input inputmode="numeric" data-bind="isets" data-d="' + di + '" data-k="' + k + '" value="' + esc(it.sets) + '"></label>' +
        '<label class="mini">Reps<input data-bind="ireps" data-d="' + di + '" data-k="' + k + '" value="' + esc(it.reps) + '"></label>' +
        '<div class="mv"><button data-act="up" data-d="' + di + '" data-k="' + k + '" aria-label="Monter">↑</button><button data-act="down" data-d="' + di + '" data-k="' + k + '" aria-label="Descendre">↓</button><button data-act="del-item" data-d="' + di + '" data-k="' + k + '" aria-label="Retirer">×</button></div></div>';
    });
    h += '<button class="btn" data-act="add-ex" data-d="' + di + '">Ajouter des exercices</button></section>';
  });
  h += '<button class="btn pri" data-act="add-day">Ajouter un jour</button><button class="btn danger" data-act="prog-del">Supprimer ce programme</button>';
  v.innerHTML = h;
}

/* ============ Vue : Suivi ============ */
function weekStart(t) { const d = new Date(t); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); }
function vSuivi(v) {
  const H = S.history, ws = weekStart(Date.now());
  const wk = []; for (let i = 7; i >= 0; i--) { const s = ws - i * 7 * 864e5; wk.push({ s, vol: 0, n: 0 }); }
  for (const h of H) { const w = wk.find(x => h.start >= x.s && h.start < x.s + 7 * 864e5); if (w) { w.vol += volume(h); w.n++; } }
  const cur = wk[wk.length - 1], max = Math.max(1, ...wk.map(x => x.vol));
  let h = '<div class="head"><h1>Suivi</h1></div>';
  if (!H.length) { v.innerHTML = h + '<p class="empty">Terminez une première séance pour voir vos statistiques ici.</p>'; return; }
  h += '<div class="stats"><div class="stat"><b>' + cur.n + '</b><small>séance' + (cur.n > 1 ? 's' : '') + ' cette semaine</small></div><div class="stat"><b>' + fmtVol(cur.vol) + '</b><small>volume cette semaine</small></div><div class="stat"><b>' + H.length + '</b><small>séances au total</small></div></div>';
  h += '<h2>Volume par semaine</h2><svg class="chart" viewBox="0 0 320 120" role="img" aria-label="Volume soulevé par semaine sur 8 semaines">';
  wk.forEach((w, i) => {
    const bh = Math.round(w.vol / max * 84), x = 8 + i * 39;
    h += '<rect class="bar' + (i === 7 ? ' cur' : '') + '" x="' + x + '" y="' + (94 - bh) + '" width="30" height="' + Math.max(bh, 2) + '" rx="3"/><text x="' + (x + 15) + '" y="108" text-anchor="middle">' + new Date(w.s).getDate() + '/' + (new Date(w.s).getMonth() + 1) + '</text>';
    if (w.vol) h += '<text x="' + (x + 15) + '" y="' + (90 - bh) + '" text-anchor="middle">' + (w.vol >= 1000 ? fmt(w.vol / 1000) + 't' : Math.round(w.vol)) + '</text>';
  });
  h += '</svg>';
  // Records
  const seen = new Map();
  for (let i = H.length - 1; i >= 0; i--) for (const e of H[i].entries) if (!seen.has(e.exId)) seen.set(e.exId, H[i].start);
  const recs = [...seen.keys()].slice(0, 8).map(id => {
    let best = null; for (const s of H) for (const e of s.entries) if (e.exId === id) for (const z of e.sets) { const v1 = e1rm(z.w, z.r); if (!best || v1 > best.v) best = { v: v1, w: z.w, r: z.r }; }
    return { id, best };
  }).filter(x => x.best && x.best.v > 0);
  if (recs.length) {
    h += '<h2>Records (1RM estimé)</h2>';
    for (const r of recs) h += '<div class="kv"><span>' + esc(getEx(r.id).name) + '<br><small>' + fmt(r.best.w) + ' kg × ' + r.best.r + '</small></span><b>' + fmt(r.best.v) + ' kg</b></div>';
  }
  h += '<h2>Historique</h2>';
  for (const s of H.slice().reverse().slice(0, 30)) h += '<button class="row" data-act="hist" data-id="' + s.id + '"><span><b>' + esc(s.name) + '</b><small>' + dateLong(s.start) + '</small></span><span>' + fmtVol(volume(s)) + '</span></button>';
  v.innerHTML = h;
}
function histDetail(id) {
  const s = S.history.find(x => x.id === id); if (!s) return;
  let h = '<h2>' + esc(s.name) + '</h2><p class="note">' + dateLong(s.start) + ' · ' + clock((s.end - s.start) / 1000) + ' · ' + fmtVol(volume(s)) + '</p>';
  for (const e of s.entries) h += '<div class="kv"><span>' + esc(getEx(e.exId).name) + '</span><b>' + e.sets.map(z => fmt(z.w) + '×' + z.r).join('  ') + '</b></div>';
  h += '<div class="sheetbar"><button class="btn danger" data-act="hist-del" data-id="' + id + '">Supprimer</button><button class="btn" data-act="close">Fermer</button></div>';
  sheet(h);
}

/* ============ Vue : Réglages ============ */
function vReglages(v) {
  const s = S.settings;
  v.innerHTML = '<div class="head"><h1>Réglages</h1></div>' +
    '<h2>Entraînement</h2>' +
    '<div class="set-row"><span>Repos entre les séries (secondes)</span><input inputmode="numeric" data-bind="rest" value="' + s.rest + '"></div>' +
    '<div class="set-row"><span>Thème</span><select data-bind="theme"><option value="auto"' + (s.theme === 'auto' ? ' selected' : '') + '>Automatique</option><option value="light"' + (s.theme === 'light' ? ' selected' : '') + '>Clair</option><option value="dark"' + (s.theme === 'dark' ? ' selected' : '') + '>Sombre</option></select></div>' +
    '<h2>Installer l\'application</h2>' +
    '<p class="note">Android (Chrome) : menu ⋮ puis « Installer l\'application ». iPhone (Safari) : Partager puis « Sur l\'écran d\'accueil ».</p>' +
    (deferredPrompt ? '<button class="btn pri" data-act="install">Installer sur cet appareil</button>' : '') +
    '<h2>Données</h2>' +
    '<p class="note">Tout est enregistré sur cet appareil. Faites une sauvegarde de temps en temps.</p>' +
    '<button class="btn" data-act="exp-json">Sauvegarder (fichier JSON)</button>' +
    '<button class="btn" data-act="imp-json">Restaurer une sauvegarde</button>' +
    '<h2>Samsung Health, Google Fit, Health Connect</h2>' +
    '<p class="note box">Une page web ne peut pas lire ni écrire directement dans ces applications. En attendant une version Android native, vous pouvez exporter vos séances en CSV (lisible dans un tableur ou importable dans d\'autres outils) ou partager la dernière séance.</p>' +
    '<button class="btn" data-act="exp-csv">Exporter les séances (CSV)</button>' +
    '<button class="btn" data-act="share-last">Partager la dernière séance</button>' +
    '<h2>Zone sensible</h2><button class="btn danger" data-act="reset">Effacer toutes les données</button>';
}
function download(name, text, type) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
function csvCell(x) { x = String(x ?? ''); return /[",;\n]/.test(x) ? '"' + x.replace(/"/g, '""') + '"' : x; }

/* ============ Actions (clics) ============ */
const ACT = {
  tab(t) { ui.tab = t.dataset.tab; if (ui.tab !== 'programmes') ui.edit = null; closeSheet(); render(); scrollTo(0, 0); },
  close() { closeSheet(); },
  back() { ui.edit = null; render(); },

  /* séance */
  start(t) {
    if (S.active) { toast('Une séance est déjà en cours'); return; }
    const p = S.programs.find(x => x.id === t.dataset.p), d = p && p.days.find(x => x.id === t.dataset.d);
    if (d) begin(d.name, d.items);
  },
  'start-free'() { if (!S.active) begin('Séance libre', []); },
  chk(t) {
    const a = S.active, s = a.entries[+t.dataset.i].sets[+t.dataset.j];
    if (!s.done) { if (!(num(s.r) > 0)) { toast('Indiquez les répétitions'); return; } s.done = true; a.restEnd = Date.now() + S.settings.rest * 1000; }
    else s.done = false;
    save(); render();
  },
  'add-set'(t) { const en = S.active.entries[+t.dataset.i], l = en.sets[en.sets.length - 1]; en.sets.push({ w: l ? l.w : '', r: l ? l.r : '', done: false }); save(); render(); },
  'del-set'(t) { const en = S.active.entries[+t.dataset.i]; if (en.sets.length > 1) en.sets.pop(); save(); render(); },
  'rm-ex'(t) { if (confirm('Retirer cet exercice de la séance ?')) { S.active.entries.splice(+t.dataset.i, 1); save(); render(); } },
  'add-live'() { openPicker(ids => { for (const id of ids) { const l = lastPerf(id); S.active.entries.push({ exId: id, sets: Array.from({ length: 3 }, (_, j) => ({ w: l[j] ? l[j].w : (l.length ? l[l.length - 1].w : ''), r: '', done: false })) }); } save(); render(); }); },
  finish, discard() { discard(); },
  'rest-15'() { const a = S.active; if (a && a.restEnd) { a.restEnd -= 15000; save(); tick(); } },
  'rest+15'() { const a = S.active; if (a && a.restEnd) { a.restEnd += 15000; save(); tick(); } },
  restskip() { const a = S.active; if (a) { a.restEnd = 0; save(); hideRest(); } },

  /* sélecteur */
  'pk-t'(t) { const id = t.dataset.id; pk.sel.has(id) ? pk.sel.delete(id) : pk.sel.add(id); $('#pklist').innerHTML = listHTML(pk.q, pk.m, 'pick', pk.sel); $('#pkok').textContent = 'Ajouter (' + pk.sel.size + ')'; },
  'pk-m'(t) { pk.m = t.dataset.m; drawPicker(); },
  'pk-ok'() { const ids = [...pk.sel], cb = pk.cb; pk = null; closeSheet(); if (ids.length) cb(ids); },
  'pk-new'() { exForm(null, (ex) => { pk.sel.add(ex.id); drawPicker(); }); },
  'pk-back'() { window._exAfter = null; if (pk) drawPicker(); else closeSheet(); },

  /* exercices */
  'lib-m'(t) { ui.m = t.dataset.m; render(); },
  exdetail(t) { exDetail(t.dataset.id); },
  'ex-new'() { exForm(null); },
  'ex-edit'(t) { exForm(t.dataset.id); },
  'ex-save'(t) {
    const name = $('#fx-name').value.trim();
    if (!name) { toast('Donnez un nom à l\'exercice'); return; }
    const id = t.dataset.id, data = { name, muscle: $('#fx-muscle').value, equip: $('#fx-equip').value, notes: $('#fx-notes').value.trim() };
    if (!id && [...EX.values()].some(x => norm(x.name) === norm(name))) { toast('Un exercice porte déjà ce nom'); return; }
    let ex;
    if (id) { ex = S.custom.find(x => x.id === id); Object.assign(ex, data); }
    else { ex = Object.assign({ id: 'c_' + uid() }, data); S.custom.push(ex); }
    save(); reindex();
    const after = window._exAfter; window._exAfter = null;
    if (after) after(ex); else { closeSheet(); render(); toast('Exercice enregistré'); }
  },
  'ex-del'(t) {
    if (!confirm('Supprimer cet exercice ? Il restera dans votre historique mais sera retiré de vos programmes.')) return;
    const id = t.dataset.id;
    S.custom = S.custom.filter(x => x.id !== id);
    for (const p of S.programs) for (const d of p.days) d.items = d.items.filter(i => i.exId !== id);
    save(); reindex(); closeSheet(); render();
  },

  /* programmes */
  'prog-new'() { const p = { id: uid(), name: 'Nouveau programme', days: [{ id: uid(), name: 'Jour 1', items: [] }] }; S.programs.push(p); save(); ui.edit = p.id; render(); },
  'prog-edit'(t) { ui.edit = t.dataset.p; render(); scrollTo(0, 0); },
  'prog-del'() { if (confirm('Supprimer ce programme ?')) { S.programs = S.programs.filter(p => p.id !== ui.edit); ui.edit = null; save(); render(); } },
  'prog-tpl'() {
    sheet('<h2>Modèles de programme</h2>' + TPL.map((t, i) => '<button class="row" data-act="tpl-use" data-i="' + i + '"><span><b>' + esc(t.name) + '</b><small>' + esc(t.desc) + '</small></span><span class="go">Choisir</span></button>').join('') + '<div class="sheetbar"><button class="btn" data-act="close">Fermer</button><span></span></div>');
  },
  'tpl-use'(t) {
    const tp = TPL[+t.dataset.i];
    const p = { id: uid(), name: tp.name, days: tp.days.map(d => ({ id: uid(), name: d.name, items: d.items.map(([n, s, r]) => { const e = exByName(n); return e ? { exId: e.id, sets: s, reps: r } : null; }).filter(Boolean) })) };
    S.programs.push(p); save(); closeSheet(); ui.edit = p.id; render(); scrollTo(0, 0);
  },
  'add-day'() { const p = S.programs.find(x => x.id === ui.edit); p.days.push({ id: uid(), name: 'Jour ' + (p.days.length + 1), items: [] }); save(); render(); },
  'del-day'(t) { const p = S.programs.find(x => x.id === ui.edit); if (confirm('Supprimer ce jour ?')) { p.days.splice(+t.dataset.d, 1); save(); render(); } },
  'add-ex'(t) { const d = S.programs.find(x => x.id === ui.edit).days[+t.dataset.d]; openPicker(ids => { for (const id of ids) d.items.push({ exId: id, sets: 3, reps: '8-12' }); save(); render(); }); },
  up(t) { const it = S.programs.find(x => x.id === ui.edit).days[+t.dataset.d].items, k = +t.dataset.k; if (k > 0) { [it[k - 1], it[k]] = [it[k], it[k - 1]]; save(); render(); } },
  down(t) { const it = S.programs.find(x => x.id === ui.edit).days[+t.dataset.d].items, k = +t.dataset.k; if (k < it.length - 1) { [it[k + 1], it[k]] = [it[k], it[k + 1]]; save(); render(); } },
  'del-item'(t) { S.programs.find(x => x.id === ui.edit).days[+t.dataset.d].items.splice(+t.dataset.k, 1); save(); render(); },

  /* suivi */
  hist(t) { histDetail(t.dataset.id); },
  'hist-del'(t) { if (confirm('Supprimer cette séance de l\'historique ?')) { S.history = S.history.filter(x => x.id !== t.dataset.id); save(); closeSheet(); render(); } },

  /* réglages */
  install() { if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.finally(() => { deferredPrompt = null; render(); }); } },
  'exp-json'() { download('muscu-sauvegarde-' + isoDay(Date.now()) + '.json', JSON.stringify(S, null, 2), 'application/json'); },
  'imp-json'() { $('#importfile').click(); },
  'exp-csv'() {
    if (!S.history.length) { toast('Aucune séance à exporter'); return; }
    const rows = [['date', 'seance', 'exercice', 'groupe', 'serie', 'charge_kg', 'repetitions']];
    for (const h of S.history) for (const e of h.entries) e.sets.forEach((s, j) => rows.push([isoDay(h.start), h.name, getEx(e.exId).name, getEx(e.exId).muscle, j + 1, s.w, s.r]));
    download('muscu-seances-' + isoDay(Date.now()) + '.csv', '\ufeff' + rows.map(r => r.map(csvCell).join(';')).join('\n'), 'text/csv');
  },
  async 'share-last'() {
    const h = S.history[S.history.length - 1]; if (!h) { toast('Aucune séance à partager'); return; }
    const text = h.name + ' · ' + dateLong(h.start) + '\n' + h.entries.map(e => getEx(e.exId).name + ' : ' + e.sets.map(s => fmt(s.w) + '×' + s.r).join(', ')).join('\n') + '\nVolume : ' + fmtVol(volume(h));
    try { if (navigator.share) await navigator.share({ title: 'Ma séance', text }); else { await navigator.clipboard.writeText(text); toast('Séance copiée'); } }
    catch (e) { /* partage annulé */ }
  },
  reset() { if (confirm('Effacer définitivement tous vos programmes, exercices créés et séances ?')) { S = defaults(); save(); reindex(); ui.edit = null; applyTheme(); render(); toast('Données effacées'); } }
};
document.addEventListener('click', e => { const t = e.target.closest('[data-act]'); if (t && ACT[t.dataset.act]) ACT[t.dataset.act](t, e); });

/* ============ Saisies ============ */
const BIND = {
  set(el) { const s = S.active.entries[+el.dataset.i].sets[+el.dataset.j]; s[el.dataset.f] = el.value; save(); },
  q(el) { ui.q = el.value; $('#exlist').innerHTML = listHTML(ui.q, ui.m, 'lib'); },
  pq(el) { pk.q = el.value; $('#pklist').innerHTML = listHTML(pk.q, pk.m, 'pick', pk.sel); },
  pname(el) { S.programs.find(x => x.id === ui.edit).name = el.value; save(); },
  dname(el) { S.programs.find(x => x.id === ui.edit).days[+el.dataset.d].name = el.value; save(); },
  isets(el) { S.programs.find(x => x.id === ui.edit).days[+el.dataset.d].items[+el.dataset.k].sets = Math.max(1, parseInt(el.value) || 1); save(); },
  ireps(el) { S.programs.find(x => x.id === ui.edit).days[+el.dataset.d].items[+el.dataset.k].reps = el.value; save(); },
  rest(el) { S.settings.rest = Math.min(600, Math.max(10, parseInt(el.value) || 90)); save(); },
  theme(el) { S.settings.theme = el.value; save(); applyTheme(); }
};
document.addEventListener('input', e => { const b = e.target.dataset && e.target.dataset.bind; if (b && BIND[b]) BIND[b](e.target); });
$('#importfile').addEventListener('change', async e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (!d || !Array.isArray(d.programs) || !Array.isArray(d.history) || !Array.isArray(d.custom)) throw new Error('format');
    if (!confirm('Remplacer toutes les données actuelles par cette sauvegarde ?')) return;
    const b = defaults(); S = Object.assign(b, d, { settings: Object.assign(b.settings, d.settings), active: null });
    save(); reindex(); applyTheme(); render(); toast('Sauvegarde restaurée');
  } catch (err) { toast('Fichier invalide : choisissez une sauvegarde JSON de cette application'); }
});

/* ============ Installation & hors-ligne ============ */
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; if (ui.tab === 'reglages') render(); });
window.addEventListener('appinstalled', () => { deferredPrompt = null; toast('Application installée'); });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { /* hors HTTPS */ }));

applyTheme();
if (S.active) keepAwake();
render();
