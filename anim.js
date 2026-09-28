/* Illustrations animées des exercices.
   Chaque mouvement = un squelette (torse, bras, jambes) interpolé entre 2 positions clés ou plus.
   Angles en degrés : 0 = vers le bas, 90 = vers l'avant (droite), 180 = vers le haut. */
(function () {
  'use strict';
  const R = Math.PI / 180;
  const L = { t: 32, ua: 17, fa: 16, th: 25, sh: 25 };
  const dir = a => [Math.sin(a * R), Math.cos(a * R)];
  const mv = (p, a, l) => { const d = dir(a); return [p[0] + d[0] * l, p[1] + d[1] * l]; };
  const lerp = (a, b, t) => a + (b - a) * t;
  const lp = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
  const ease = t => .5 - .5 * Math.cos(Math.PI * t);
  const r1 = n => Math.round(n * 10) / 10;
  const st = (x, y) => ['ankle', x == null ? 92 : x, y == null ? 128 : y];

  /* ---------- décor ---------- */
  const E = {
    l: (x1, y1, x2, y2) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="g-env"/>',
    r: (x, y, w, h) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2" class="g-envf"/>',
    c: (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" class="g-env"/>'
  };
  const bench = (x, y, w) => E.r(x, y, w, 6) + E.l(x + 8, y + 6, x + 8, 134) + E.l(x + w - 8, y + 6, x + w - 8, 134);

  /* ---------- mouvements de profil ---------- */
  const SIDE = {
    squat: { label: 'Squat', prop: { t: 'bb', at: 'sho' }, kf: [
      { an: st(), t: 176, ua: -30, fa: 150 }, { an: st(), t: 142, th: 80, sh: -35, ua: -30, fa: 150 }] },
    frontsquat: { label: 'Squat avant', prop: { t: 'bb', at: 'hnd' }, kf: [
      { an: st(), t: 178, ua: 80, fa: 200 }, { an: st(), t: 158, th: 80, sh: -35, ua: 80, fa: 200 }] },
    goblet: { label: 'Goblet squat', prop: { t: 'db', at: 'hnd' }, kf: [
      { an: st(), t: 178, ua: 60, fa: 190 }, { an: st(), t: 158, th: 80, sh: -35, ua: 60, fa: 190 }] },
    legpress: { label: 'Presse à cuisses', prop: { t: 'platform', at: 'ank' }, env: E.l(92, 108, 118, 60) + E.r(40, 116, 44, 4), kf: [
      { an: ['hip', 62, 100], t: -135, th: 135, sh: 60, ua: 80, fa: 110 }, { an: ['hip', 62, 100], t: -135, th: 112, sh: 112, ua: 80, fa: 110 }] },
    benchpress: { label: 'Développé couché', prop: { t: 'bb', at: 'hnd' }, env: bench(30, 115, 72), kf: [
      { an: ['hip', 85, 111], t: -90, th: 100, sh: 5, ua: 180, fa: 180 }, { an: ['hip', 85, 111], t: -90, th: 100, sh: 5, ua: 25, fa: 175 }] },
    inclinepress: { label: 'Développé incliné', prop: { t: 'bb', at: 'hnd' }, env: E.l(90, 112, 58, 80) + E.r(82, 112, 30, 4) + E.l(96, 116, 96, 134), kf: [
      { an: ['hip', 95, 104], t: -135, th: 80, sh: 20, ua: 170, fa: 170 }, { an: ['hip', 95, 104], t: -135, th: 80, sh: 20, ua: 40, fa: 170 }] },
    chestpress: { label: 'Développé machine (assis)', prop: { t: 'handle', at: 'hnd' }, env: E.r(66, 113, 32, 4) + E.l(68, 66, 68, 112) + E.l(82, 117, 82, 134), kf: [
      { an: ['hip', 80, 108], t: 178, th: 90, sh: 0, ua: -70, fa: 90 }, { an: ['hip', 80, 108], t: 178, th: 90, sh: 0, ua: 90, fa: 90 }] },
    pushup: { label: 'Pompes', kf: [
      { an: ['ankle', 40, 127], t: 109, th: -71, sh: -71, ikh: [118, 132] }, { an: ['ankle', 40, 127], t: 96, th: -84, sh: -84, ikh: [118, 132] }] },
    dips: { label: 'Dips', env: E.l(78, 80, 122, 80) + E.l(82, 80, 82, 134) + E.l(118, 80, 118, 134), kf: [
      { an: ['hand', 100, 80], t: 172, th: -8, sh: -45, ua: 0, fa: 0 }, { an: ['hand', 100, 80], t: 158, th: -8, sh: -45, ua: -35, fa: 45 }] },
    pullover: { label: 'Pull-over', prop: { t: 'db', at: 'hnd' }, env: bench(20, 115, 88), kf: [
      { an: ['hip', 85, 111], t: -90, th: 100, sh: 5, ua: 180, fa: 180 }, { an: ['hip', 85, 111], t: -90, th: 100, sh: 5, ua: 250, fa: 250 }] },
    pullup: { label: 'Tractions', nofloor: false, env: E.l(70, 20, 126, 20) + E.l(74, 20, 74, 4) + E.l(122, 20, 122, 4), kf: [
      { an: ['hand', 98, 20], t: 180, th: -10, sh: -60, ua: 180, fa: 180 }, { an: ['hand', 98, 20], t: 176, th: -10, sh: -60, ua: 10, fa: 170 }] },
    pulldown: { label: 'Tirage vertical', prop: { t: 'cable', at: 'hnd', from: [104, 6] }, env: E.r(80, 116, 32, 4) + E.l(96, 120, 96, 134), kf: [
      { an: ['hip', 95, 112], t: 176, th: 95, sh: 5, ua: 165, fa: 165 }, { an: ['hip', 95, 112], t: 170, th: 95, sh: 5, ua: -20, fa: 100 }] },
    seatedrow: { label: 'Tirage horizontal', prop: { t: 'cable', at: 'hnd', from: [188, 80] }, env: E.r(54, 115, 30, 4) + E.l(126, 98, 126, 130), kf: [
      { an: ['hip', 70, 110], t: 168, th: 100, sh: 70, ua: 90, fa: 90 }, { an: ['hip', 70, 110], t: 182, th: 100, sh: 70, ua: -35, fa: 95 }] },
    bentrow: { label: 'Rowing penché', prop: { t: 'bb', at: 'hnd' }, kf: [
      { an: st(), t: 120, th: 25, sh: -15, ua: 0, fa: 0 }, { an: st(), t: 120, th: 25, sh: -15, ua: -60, fa: 5 }] },
    deadlift: { label: 'Soulevé de terre', prop: { t: 'bb', at: 'hnd' }, kf: [
      { an: st(), t: 115, th: 75, sh: -30, ua: -15, fa: -15 }, { an: st(), t: 178, th: 0, sh: 0, ua: 0, fa: 0 }] },
    straightarm: { label: 'Pull-over poulie', prop: { t: 'cable', at: 'hnd', from: [132, 10] }, kf: [
      { an: st(), t: 168, th: 8, sh: -5, ua: 150, fa: 150 }, { an: st(), t: 168, th: 8, sh: -5, ua: 5, fa: 5 }] },
    backext: { label: 'Extension lombaires', env: E.l(78, 94, 98, 94) + E.l(88, 94, 88, 134) + E.l(36, 124, 58, 124) + E.l(46, 124, 46, 134), kf: [
      { an: ['hip', 85, 88], t: 20, th: -50, sh: -50, ua: 20, fa: 20 }, { an: ['hip', 85, 88], t: 130, th: -50, sh: -50, ua: 130, fa: 130 }] },
    ohp: { label: 'Développé épaules', prop: { t: 'bb', at: 'hnd' }, kf: [
      { an: st(), t: 178, ua: 40, fa: 180 }, { an: st(), t: 178, ua: 175, fa: 178 }] },
    frontraise: { label: 'Élévations frontales', prop: { t: 'db', at: 'hnd' }, kf: [
      { an: st(), t: 178, ua: 0, fa: 0 }, { an: st(), t: 178, ua: 90, fa: 85 }] },
    uprightrow: { label: 'Tirage menton', prop: { t: 'bb', at: 'hnd' }, kf: [
      { an: st(), t: 178, ua: 0, fa: 0 }, { an: st(), t: 178, ua: 125, fa: 10 }] },
    facepull: { label: 'Face pull', prop: { t: 'cable', at: 'hnd', from: [176, 48] }, kf: [
      { an: st(), t: 178, ua: 88, fa: 88 }, { an: st(), t: 178, ua: 75, fa: 230 }] },
    curl: { label: 'Curl biceps', prop: { t: 'bb', at: 'hnd' }, kf: [
      { an: st(), t: 180, ua: 5, fa: 5 }, { an: st(), t: 180, ua: 10, fa: 150 }] },
    preacher: { label: 'Curl pupitre', prop: { t: 'bb', at: 'hnd' }, env: E.l(86, 76, 116, 93) + E.l(101, 86, 101, 134) + E.r(70, 107, 30, 4), kf: [
      { an: ['hip', 85, 102], t: 172, th: 90, sh: 0, ua: 60, fa: 60 }, { an: ['hip', 85, 102], t: 172, th: 90, sh: 0, ua: 60, fa: 200 }] },
    inclinecurl: { label: 'Curl incliné', prop: { t: 'db', at: 'hnd' }, env: E.l(90, 112, 58, 80) + E.r(82, 112, 30, 4) + E.l(96, 116, 96, 134), kf: [
      { an: ['hip', 95, 104], t: -145, th: 80, sh: 20, ua: 20, fa: 20 }, { an: ['hip', 95, 104], t: -145, th: 80, sh: 20, ua: 25, fa: 165 }] },
    pushdown: { label: 'Extension poulie haute', prop: { t: 'cable', at: 'hnd', from: [120, 8] }, kf: [
      { an: st(), t: 176, ua: 5, fa: 110 }, { an: st(), t: 176, ua: 5, fa: 0 }] },
    skull: { label: 'Barre au front', prop: { t: 'bb', at: 'hnd' }, env: bench(30, 115, 72), kf: [
      { an: ['hip', 85, 111], t: -90, th: 100, sh: 5, ua: 195, fa: 195 }, { an: ['hip', 85, 111], t: -90, th: 100, sh: 5, ua: 195, fa: 250 }] },
    overheadext: { label: 'Extension nuque', prop: { t: 'db', at: 'hnd' }, kf: [
      { an: st(), t: 180, ua: 180, fa: 180 }, { an: st(), t: 180, ua: 180, fa: 310 }] },
    kickback: { label: 'Kickback triceps', prop: { t: 'db', at: 'hnd' }, kf: [
      { an: st(), t: 100, th: 25, sh: -15, ua: -85, fa: 0 }, { an: st(), t: 100, th: 25, sh: -15, ua: -88, fa: -85 }] },
    wristcurl: { label: 'Curl poignets', prop: { t: 'db', at: 'hnd' }, env: E.r(66, 108, 30, 4) + E.l(80, 112, 80, 134), kf: [
      { an: ['hip', 85, 104], t: 125, th: 90, sh: 0, ua: 0, fa: 105 }, { an: ['hip', 85, 104], t: 125, th: 90, sh: 0, ua: 0, fa: 75 }] },
    walk: { label: 'Marche chargée', prop: { t: 'db', at: 'hnd' }, dur: 1400, kf: [
      { an: ['hip', 95, 80], t: 178, th: 22, sh: 0, th2: -22, sh2: -15 }, { an: ['hip', 95, 80], t: 178, th: -22, sh: -15, th2: 22, sh2: 0 }] },
    lunge: { label: 'Fentes', prop: { t: 'db', at: 'hnd' }, kf: [
      { an: ['hip', 87, 88], t: 180, ik: [112, 128], ik2: [62, 128] }, { an: ['hip', 87, 104], t: 180, ik: [112, 128], ik2: [62, 128] }] },
    bulgarian: { label: 'Squat bulgare', prop: { t: 'db', at: 'hnd' }, env: E.r(40, 108, 30, 5) + E.l(46, 113, 46, 134) + E.l(64, 113, 64, 134), kf: [
      { an: ['hip', 88, 86], t: 180, ik: [114, 128], ik2: [58, 106] }, { an: ['hip', 88, 104], t: 180, ik: [114, 128], ik2: [58, 106] }] },
    stepup: { label: 'Step-up', prop: { t: 'db', at: 'hnd' }, env: E.r(82, 106, 38, 28), kf: [
      { an: ['hip', 86, 78], t: 180, ik: [98, 104], ik2: [70, 128] }, { an: ['hip', 100, 56], t: 180, ik: [98, 104], ik2: [114, 92] }] },
    legext: { label: 'Leg extension', prop: { t: 'pad', at: 'ank' }, env: E.r(66, 109, 32, 4) + E.l(70, 68, 72, 108) + E.l(84, 113, 84, 134), kf: [
      { an: ['hip', 80, 104], t: 176, th: 92, sh: 0 }, { an: ['hip', 80, 104], t: 176, th: 92, sh: 88 }] },
    legcurl: { label: 'Leg curl', prop: { t: 'pad', at: 'ank' }, env: E.r(66, 109, 32, 4) + E.l(70, 68, 72, 108) + E.l(84, 113, 84, 134), kf: [
      { an: ['hip', 80, 104], t: 176, th: 92, sh: 88 }, { an: ['hip', 80, 104], t: 176, th: 92, sh: -5 }] },
    goodmorning: { label: 'Good morning', prop: { t: 'bb', at: 'sho' }, kf: [
      { an: st(), t: 178, ua: -30, fa: 150 }, { an: st(), t: 105, th: 22, sh: -10, ua: -30, fa: 150 }] },
    rdl: { label: 'Soulevé de terre jambes tendues', prop: { t: 'bb', at: 'hnd' }, kf: [
      { an: st(), t: 178 }, { an: st(), t: 100, th: 18, sh: -6, ua: -40, fa: -10 }] },
    nordic: { label: 'Nordic curl', env: E.r(50, 119, 16, 6), kf: [
      { an: ['knee', 84, 130], t: 180, th: 0, sh: -90, ua: 90, fa: 90 }, { an: ['knee', 84, 130], t: 105, th: -75, sh: -90, ua: 10, fa: 10 }] },
    hipthrust: { label: 'Hip thrust / pont fessier', prop: { t: 'bb', at: 'hip' }, env: E.r(26, 108, 44, 6) + E.l(34, 114, 34, 134) + E.l(62, 114, 62, 134), kf: [
      { an: ['ankle', 112, 128], t: -116, th: 125, sh: 20, ua: 90, fa: 90 }, { an: ['ankle', 112, 128], t: -95, th: 95, sh: 5, ua: 90, fa: 90 }] },
    glutekick: { label: 'Kickback poulie', prop: { t: 'cable', at: 'ank2', from: [166, 128] }, kf: [
      { an: st(), t: 150, th: 0, sh: 0, th2: 15, sh2: -35, ua: 70, fa: 95 }, { an: st(), t: 150, th: 0, sh: 0, th2: -50, sh2: -55, ua: 70, fa: 95 }] },
    calfstand: { label: 'Mollets debout', prop: { t: 'pad', at: 'sho' }, env: E.r(78, 130, 30, 4), kf: [
      { an: ['ankle', 92, 127], t: 180, ft: 90 }, { an: ['ankle', 92, 119], t: 180, ft: 40 }] },
    calfseat: { label: 'Mollets assis', prop: { t: 'pad', at: 'kne' }, env: E.r(66, 108, 30, 5) + E.r(98, 130, 26, 4), kf: [
      { an: ['ankle', 110, 127], t: 180, th: 90, sh: 0, ft: 90 }, { an: ['ankle', 110, 119], t: 180, th: 90, sh: 0, ft: 40 }] },
    crunch: { label: 'Crunch', kf: [
      { an: ['hip', 100, 128], t: -88, th: 135, sh: 25, ua: 92, fa: 182 }, { an: ['hip', 100, 128], t: -140, th: 135, sh: 25, ua: 40, fa: 130 }] },
    legraise: { label: 'Relevé de jambes suspendu', env: E.l(70, 20, 126, 20) + E.l(74, 20, 74, 4) + E.l(122, 20, 122, 4), kf: [
      { an: ['hand', 98, 20], t: 180, th: -5, sh: -20, ua: 180, fa: 180 }, { an: ['hand', 98, 20], t: 172, th: 88, sh: 80, ua: 180, fa: 180 }] },
    plank: { label: 'Gainage', dur: 3200, kf: [
      { an: ['ankle', 40, 127], t: 100, th: -80, sh: -80, ua: 0, fa: 90 }, { an: ['ankle', 40, 127], t: 104, th: -76, sh: -76, ua: 0, fa: 90 }] },
    russian: { label: 'Russian twist', prop: { t: 'db', at: 'hnd' }, kf: [
      { an: ['hip', 100, 126], t: -150, th: 112, sh: 98, ua: 70, fa: 70 }, { an: ['hip', 100, 126], t: -150, th: 112, sh: 98, ua: 105, fa: 105 }] },
    rower: { label: 'Rameur', prop: { t: 'cable', at: 'hnd', from: [178, 112] }, env: E.l(60, 130, 172, 130) + E.l(154, 100, 154, 124), seat: true, kf: [
      { an: ['ankle', 150, 118], t: 150, th: 135, sh: 40, ua: 90, fa: 90 }, { an: ['ankle', 150, 118], t: 200, th: 97, sh: 97, ua: -30, fa: 95 }] },
    bike: { label: 'Vélo', dur: 1400, env: E.c(70, 112, 20) + E.c(138, 112, 20) + E.l(86, 93, 104, 93) + E.l(95, 93, 104, 114) + E.l(104, 114, 138, 112) + E.l(138, 112, 134, 66) + E.l(134, 66, 141, 62), kf: [
      { an: ['hip', 95, 84], t: 150, th: 15, sh: 10, th2: 100, sh2: -10, ua: 50, fa: 110 }, { an: ['hip', 95, 84], t: 150, th: 100, sh: -10, th2: 15, sh2: 10, ua: 50, fa: 110 }] },
    run: { label: 'Course', dur: 1000, env: E.r(46, 127, 118, 5), kf: [
      { an: ['hip', 95, 78], t: 170, th: 50, sh: 5, th2: -35, sh2: -100, ua: 50, fa: 140, ua2: -50, fa2: 40 },
      { an: ['hip', 95, 78], t: 170, th: -35, sh: -100, th2: 50, sh2: 5, ua: -50, fa: 40, ua2: 50, fa2: 140 }] },
    rope: { label: 'Corde à sauter', dur: 900, prop: { t: 'rope', at: 'hip' }, kf: [
      { an: ['ankle', 92, 127], t: 180, ua: 35, fa: 100 }, { an: ['ankle', 92, 117], t: 180, th: -8, sh: -25, ua: 35, fa: 100, ft: 60 }] },
    burpee: { label: 'Burpees', mode: 'cycle', dur: 4200, kf: [
      { an: ['ankle', 80, 128], t: 180 },
      { an: ['ankle', 80, 128], t: 120, th: 105, sh: -40, ikh: [104, 132] },
      { an: ['ankle', 30, 127], t: 109, th: -71, sh: -71, ikh: [108, 132] },
      { an: ['ankle', 80, 128], t: 120, th: 105, sh: -40, ikh: [104, 132] },
      { an: ['ankle', 80, 112], t: 180, th: -5, sh: -15, ua: 170, fa: 170, ft: 60 }] }
  };

  /* ---------- mouvements de face ---------- */
  const FRONT = {
    lateral: { label: 'Élévations latérales (face)', prop: { t: 'db' }, kf: [{ h: [5, 31] }, { h: [24, 22] }, { h: [32, -2] }] },
    fly: { label: 'Écarté / pec deck (face)', prop: { t: 'db' }, kf: [{ h: [33, 4] }, { h: [-9, 7] }] },
    reversefly: { label: 'Oiseau (face)', prop: { t: 'db' }, kf: [{ h: [-6, 30] }, { h: [25, 21] }, { h: [33, 3] }] },
    shrug: { label: 'Shrugs (face)', prop: { t: 'db' }, kf: [{ h: [5, 31], sy: 0 }, { h: [5, 31], sy: -7 }] },
    abduct: { label: 'Abduction (face)', seat: true, kf: [{ kx: 6, h: [7, 28] }, { kx: 26, h: [7, 28] }] }
  };

  /* ---------- correspondance avec la bibliothèque ---------- */
  const MAP = {
    'Développé couché barre': 'benchpress', 'Développé couché haltères': 'benchpress:db', 'Développé incliné barre': 'inclinepress', 'Développé incliné haltères': 'inclinepress:db',
    'Développé décliné barre': 'benchpress', 'Développé machine convergente': 'chestpress', 'Écarté haltères': 'fly:db', 'Écarté poulie vis-à-vis': 'fly:handle', 'Pec deck': 'fly:handle',
    'Pompes': 'pushup', 'Dips pectoraux': 'dips', 'Pull-over haltère': 'pullover',
    'Tractions pronation': 'pullup', 'Tractions supination': 'pullup', 'Tirage vertical poulie haute': 'pulldown', 'Tirage horizontal poulie basse': 'seatedrow',
    'Rowing barre': 'bentrow', 'Rowing Pendlay': 'bentrow', 'Rowing haltère un bras': 'bentrow:db', 'Rowing T-bar': 'bentrow:handle', 'Rowing machine': 'seatedrow',
    'Soulevé de terre': 'deadlift', 'Pull-over poulie': 'straightarm', 'Shrugs haltères': 'shrug', 'Extension lombaires': 'backext',
    'Développé militaire barre': 'ohp', 'Développé épaules haltères': 'ohp:db', 'Développé Arnold': 'ohp:db', 'Développé épaules machine': 'ohp:handle',
    'Élévations latérales haltères': 'lateral', 'Élévations latérales poulie': 'lateral:handle', 'Élévations frontales': 'frontraise', 'Oiseau haltères': 'reversefly',
    'Oiseau machine': 'reversefly:handle', 'Face pull': 'facepull', 'Tirage menton': 'uprightrow',
    'Curl barre droite': 'curl', 'Curl barre EZ': 'curl', 'Curl haltères alterné': 'curl:db', 'Curl marteau': 'curl:db', 'Curl pupitre': 'preacher', 'Curl incliné': 'inclinecurl',
    'Curl poulie basse': 'curl:handle', 'Curl concentré': 'inclinecurl',
    'Barre au front': 'skull', 'Extension poulie haute corde': 'pushdown', 'Extension poulie barre': 'pushdown', 'Dips triceps': 'dips', 'Développé couché prise serrée': 'benchpress',
    'Extension nuque haltère': 'overheadext', 'Kickback haltère': 'kickback', 'Extension un bras poulie': 'pushdown',
    'Curl poignets': 'wristcurl', 'Curl inversé': 'curl', 'Farmer walk': 'walk',
    'Squat barre': 'squat', 'Squat avant': 'frontsquat', 'Presse à cuisses': 'legpress', 'Hack squat': 'squat:none', 'Leg extension': 'legext', 'Fentes haltères': 'lunge',
    'Squat bulgare': 'bulgarian', 'Goblet squat': 'goblet', 'Step-up': 'stepup',
    'Soulevé de terre jambes tendues': 'rdl', 'Leg curl allongé': 'legcurl', 'Leg curl assis': 'legcurl', 'Good morning': 'goodmorning', 'Nordic curl': 'nordic',
    'Hip thrust': 'hipthrust', 'Pont fessier': 'hipthrust:none', 'Abduction machine': 'abduct', 'Kickback poulie': 'glutekick', 'Fentes marchées': 'lunge',
    'Mollets debout machine': 'calfstand', 'Mollets assis': 'calfseat', 'Mollets à la presse': 'calfseat',
    'Crunch': 'crunch', 'Crunch poulie': 'crunch', 'Relevé de jambes suspendu': 'legraise', 'Planche': 'plank', 'Gainage latéral': 'plank', 'Roue abdominale': 'plank', 'Russian twist': 'russian',
    'Rameur': 'rower', 'Vélo': 'bike', 'Tapis de course': 'run', 'Corde à sauter': 'rope', 'Burpees': 'burpee'
  };
  const HI = {
    'Pectoraux': ['torso'], 'Dos': ['torso'], 'Épaules': ['uarm'], 'Biceps': ['uarm', 'farm'], 'Triceps': ['uarm', 'farm'], 'Avant-bras': ['farm'],
    'Quadriceps': ['thigh'], 'Ischio-jambiers': ['thigh'], 'Fessiers': ['thigh'], 'Mollets': ['shin'], 'Abdos': ['torso'], 'Cardio': []
  };

  /* ---------- préparation ---------- */
  const DEF = { t: 180, th: 0, sh: 0, ua: 0, fa: 0 };
  const NUM = ['t', 'th', 'sh', 'ua', 'fa', 'th2', 'sh2', 'ua2', 'fa2', 'ft', 'ft2'];
  const ANCH = { ankle: 'ank', hip: 'hip', hand: 'hnd', knee: 'kne', ankle2: 'ank2', shoulder: 'sho' };
  function fk(p) {
    const hip = [0, 0], sho = mv(hip, p.t, L.t), elb = mv(sho, p.ua, L.ua), hnd = mv(elb, p.fa, L.fa);
    const kne = mv(hip, p.th, L.th), ank = mv(kne, p.sh, L.sh);
    const J = { hip, sho, elb, hnd, kne, ank };
    if (p.th2 != null) { J.kne2 = mv(hip, p.th2, L.th); J.ank2 = mv(J.kne2, p.sh2, L.sh); }
    if (p.ua2 != null) { J.elb2 = mv(sho, p.ua2, L.ua); J.hnd2 = mv(J.elb2, p.fa2, L.fa); }
    return J;
  }
  function shift(J, dx, dy) { for (const k in J) if (Array.isArray(J[k])) J[k] = [J[k][0] + dx, J[k][1] + dy]; return J; }
  function place(p) { const J = fk(p), pt = J[ANCH[p.an[0]]]; return shift(J, p.an[1] - pt[0], p.an[2] - pt[1]); }
  function prep(a) {
    const two = a.kf.some(k => 'th2' in k || 'sh2' in k || 'ik2' in k);
    const arm2 = a.kf.some(k => 'ua2' in k || 'fa2' in k);
    a.kf = a.kf.map(k => {
      const p = Object.assign({}, DEF, k);
      if (two) { if (p.th2 == null) p.th2 = p.th; if (p.sh2 == null) p.sh2 = p.sh; }
      if (arm2) { if (p.ua2 == null) p.ua2 = p.ua; if (p.fa2 == null) p.fa2 = p.fa; }
      if (p.ft == null) p.ft = (p.an[0] === 'ankle' || p.ik) ? 90 : p.sh + 90;
      if (two && p.ft2 == null) p.ft2 = (p.an[0] === 'ankle' || p.ik2) ? 90 : p.sh2 + 90;
      p._abs = place(p);
      return p;
    });
    return a;
  }
  Object.values(SIDE).forEach(prep);
  Object.values(FRONT).forEach(a => { a.kf = a.kf.map(k => Object.assign({ h: [5, 31], sy: 0, kx: 6 }, k)); });

  function ik(P, T, l1, l2, bend) {
    const dx = T[0] - P[0], dy = T[1] - P[1]; let d = Math.hypot(dx, dy) || 1e-6;
    const mx = l1 + l2 - 0.01; let end = T;
    if (d > mx) { end = [P[0] + dx / d * mx, P[1] + dy / d * mx]; d = mx; }
    const ux = dx / d, uy = dy / d, a = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
    return { mid: [P[0] + ux * a + bend * uy * h, P[1] + uy * a - bend * ux * h], end };
  }
  function mix(A, B, f) {
    const p = {};
    for (const k of NUM) if (A[k] != null) p[k] = lerp(A[k], B[k] != null ? B[k] : A[k], f);
    let J;
    if (A.an[0] === B.an[0]) { p.an = [A.an[0], lerp(A.an[1], B.an[1], f), lerp(A.an[2], B.an[2], f)]; J = place(p); }
    else { const h = lp(A._abs.hip, B._abs.hip, f); J = fk(p); shift(J, h[0] - J.hip[0], h[1] - J.hip[1]); p.an = A.an; }
    const tg = (ka, key) => lp(A[ka] || A._abs[key], B[ka] || B._abs[key], f);
    if (A.ik || B.ik) { const r = ik(J.hip, tg('ik', 'ank'), L.th, L.sh, 1); J.kne = r.mid; J.ank = r.end; }
    if (A.ik2 || B.ik2) { const r = ik(J.hip, tg('ik2', 'ank2'), L.th, L.sh, 1); J.kne2 = r.mid; J.ank2 = r.end; }
    if (A.ikh || B.ikh) { const r = ik(J.sho, tg('ikh', 'hnd'), L.ua, L.fa, -1); J.elb = r.mid; J.hnd = r.end; }
    J.p = p; return J;
  }
  function sample(a, u) {
    const N = a.kf.length;
    if (a.mode === 'cycle') { const x = u * N, i = Math.floor(x) % N; return [a.kf[i], a.kf[(i + 1) % N], ease(x - Math.floor(x))]; }
    const ph = u * 2, f = ease(ph < 1 ? ph : 2 - ph), x = f * (N - 1), i = Math.min(N - 2, Math.floor(x));
    return [a.kf[i], a.kf[i + 1], x - i];
  }

  /* ---------- dessin ---------- */
  const seg = (a, b, c) => '<line x1="' + r1(a[0]) + '" y1="' + r1(a[1]) + '" x2="' + r1(b[0]) + '" y2="' + r1(b[1]) + '" class="' + c + '"/>';
  const FLOOR = '<line x1="8" y1="134" x2="192" y2="134" class="g-fl"/>';
  function prop(pr, J, a) {
    if (!pr || pr.t === 'none') return '';
    const P = J[pr.at] || J.hnd, x = r1(P[0]), y = r1(P[1]);
    switch (pr.t) {
      case 'bb': return '<circle cx="' + x + '" cy="' + y + '" r="10" class="g-plate"/><circle cx="' + x + '" cy="' + y + '" r="2.4" class="g-hub"/>';
      case 'db': return '<circle cx="' + x + '" cy="' + y + '" r="5.5" class="g-plate"/>';
      case 'handle': return '<circle cx="' + x + '" cy="' + y + '" r="3.2" class="g-hub"/>';
      case 'cable': return '<line x1="' + pr.from[0] + '" y1="' + pr.from[1] + '" x2="' + x + '" y2="' + y + '" class="g-cable"/><circle cx="' + pr.from[0] + '" cy="' + pr.from[1] + '" r="3.5" class="g-env"/><circle cx="' + x + '" cy="' + y + '" r="3" class="g-hub"/>';
      case 'pad': return '<rect x="' + (x - 7) + '" y="' + (y - 4) + '" width="14" height="8" rx="3" class="g-plate"/>';
      case 'platform': { const d = dir(J.p.sh + 90); return '<line x1="' + r1(x - d[0] * 15) + '" y1="' + r1(y - d[1] * 15) + '" x2="' + r1(x + d[0] * 15) + '" y2="' + r1(y + d[1] * 15) + '" class="g-env g-thick"/>'; }
      case 'rope': return '<ellipse cx="' + x + '" cy="' + r1(y + 8) + '" rx="30" ry="58" class="g-rope"/>';
    }
    return '';
  }
  function bodySide(a, J, hi, spec) {
    const p = J.p, has = k => hi.indexOf(k) >= 0, cl = (k, x) => 'g-b ' + (has(k) ? 'g-hi ' : '') + (x || '');
    let s = a.nofloor ? '' : FLOOR;
    s += a.env || '';
    if (a.seat) s += '<rect x="' + r1(J.hip[0] - 11) + '" y="' + r1(J.hip[1] + 4) + '" width="22" height="5" rx="2" class="g-envf"/>';
    if (J.kne2) { s += seg(J.hip, J.kne2, 'g-b g-far') + seg(J.kne2, J.ank2, 'g-b g-far') + seg(J.ank2, mv(J.ank2, p.ft2, 8), 'g-b g-far g-foot'); }
    if (J.elb2) { s += seg(J.sho, J.elb2, 'g-b g-far') + seg(J.elb2, J.hnd2, 'g-b g-far'); }
    s += seg(J.hip, J.sho, cl('torso', 'g-t'));
    s += seg(J.hip, J.kne, cl('thigh')) + seg(J.kne, J.ank, cl('shin')) + seg(J.ank, mv(J.ank, p.ft, 8), 'g-b g-foot');
    s += seg(J.sho, J.elb, cl('uarm')) + seg(J.elb, J.hnd, cl('farm'));
    const h = mv(J.sho, p.t, 12.5);
    s += '<circle cx="' + r1(h[0]) + '" cy="' + r1(h[1]) + '" r="7" class="g-head"/>';
    return s + prop(spec.prop, J, a);
  }

  /* face */
  function armF(S, side, h, sy) {
    const T = [S[0] + side * h[0], S[1] + h[1]], P = S;
    const c1 = ik(P, T, L.ua, L.fa, 1), c2 = ik(P, T, L.ua, L.fa, -1);
    const sc = c => side * (c.mid[0] - P[0]) - 0.35 * (c.mid[1] - P[1]);
    const c = sc(c1) > sc(c2) ? c1 : c2;
    return { e: c.mid, h: c.end };
  }
  function bodyFront(a, f, hi, spec, seg0) {
    const A = seg0[0], B = seg0[1], t = seg0[2];
    const sy = lerp(A.sy, B.sy, t), kx = lerp(A.kx, B.kx, t), h = lp(A.h, B.h, t);
    const has = k => hi.indexOf(k) >= 0, cl = (k, x) => 'g-b ' + (has(k) ? 'g-hi ' : '') + (x || '');
    const sh = 46 + sy, SR = [117, sh], SL = [83, sh];
    let s = a.nofloor ? '' : FLOOR;
    if (a.seat) s += '<rect x="76" y="92" width="48" height="6" rx="2" class="g-envf"/><line x1="100" y1="98" x2="100" y2="134" class="g-env"/>';
    if (a === FRONT.abduct) {
      const kn = 8 + kx * 0.9;
      s += seg([92, 92], [100 - kn, 108], cl('thigh')) + seg([100 - kn, 108], [100 - kn - 2, 132], cl('shin'));
      s += seg([108, 92], [100 + kn, 108], cl('thigh')) + seg([100 + kn, 108], [100 + kn + 2, 132], cl('shin'));
    } else {
      s += seg([92, 92], [90, 132], cl('thigh')) + seg([108, 92], [110, 132], cl('thigh'));
    }
    s += seg([100, 44 + sy], [100, 92], cl('torso', 'g-t')) + seg(SL, SR, cl('torso', 'g-t'));
    const ar = armF(SR, 1, h), al = armF(SL, -1, h);
    s += seg(SR, ar.e, cl('uarm')) + seg(ar.e, ar.h, cl('farm')) + seg(SL, al.e, cl('uarm')) + seg(al.e, al.h, cl('farm'));
    s += '<circle cx="100" cy="28" r="8" class="g-head"/>';
    if (spec.prop && spec.prop.t !== 'none') {
      for (const P of [ar.h, al.h]) s += spec.prop.t === 'db' ? '<circle cx="' + r1(P[0]) + '" cy="' + r1(P[1]) + '" r="5.5" class="g-plate"/>' : '<circle cx="' + r1(P[0]) + '" cy="' + r1(P[1]) + '" r="3.2" class="g-hub"/>';
    }
    return s;
  }

  function body(spec, u) {
    const a = spec.a;
    if (spec.front) return bodyFront(a, u, spec.hi, spec, sampleF(a, u));
    const s = sample(a, u);
    return bodySide(a, mix(s[0], s[1], s[2]), spec.hi, spec);
  }
  function sampleF(a, u) {
    const N = a.kf.length, ph = u * 2, f = ease(ph < 1 ? ph : 2 - ph), x = f * (N - 1), i = Math.min(N - 2, Math.floor(x));
    return [a.kf[i], a.kf[i + 1], x - i];
  }
  const uFor = (spec, f) => spec.a.mode === 'cycle' ? f : f / 2;

  /* ---------- API ---------- */
  function specFor(ex) {
    let key = ex.base ? MAP[ex.name] : ex.anim;
    if (!key) return null;
    const parts = key.split(':'), k = parts[0], ov = parts[1];
    const front = !!FRONT[k], a = front ? FRONT[k] : SIDE[k];
    if (!a) return null;
    let pr = a.prop ? Object.assign({}, a.prop) : null;
    if (ov === 'none') pr = null;
    else if (ov && pr && pr.t !== 'cable' && pr.t !== 'platform') pr.t = ov;
    else if (ov && !pr && !front) pr = { t: ov, at: 'hnd' };
    return { key: k, a, front, prop: pr, hi: HI[ex.muscle] || [], label: a.label };
  }
  const BLANK = '<svg class="fig" viewBox="0 0 200 150" aria-hidden="true"><circle cx="70" cy="75" r="18" class="g-plate"/><circle cx="130" cy="75" r="18" class="g-plate"/><line x1="70" y1="75" x2="130" y2="75" class="g-b"/><line x1="52" y1="75" x2="40" y2="75" class="g-b"/><line x1="148" y1="75" x2="160" y2="75" class="g-b"/></svg>';
  const svgWrap = (inner, label) => '<svg class="fig" viewBox="0 0 200 150" ' + (label ? 'role="img" aria-label="' + label + '"' : 'aria-hidden="true"') + '>' + inner + '</svg>';

  function thumb(spec) { return spec ? svgWrap(body(spec, uFor(spec, 0.8))) : BLANK; }

  function mount(el, spec) {
    const label = 'Animation du mouvement : ' + spec.label;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.innerHTML = '<div class="pair"><figure>' + svgWrap(body(spec, uFor(spec, 0)), label + ', départ') + '<figcaption>Départ</figcaption></figure><figure>' + svgWrap(body(spec, uFor(spec, 1)), label + ', arrivée') + '<figcaption>Arrivée</figcaption></figure></div>';
      return function () { };
    }
    el.innerHTML = svgWrap('<g></g>', label);
    const g = el.querySelector('g'), d = spec.a.dur || 2600; let raf = 0, t0 = performance.now(), on = true;
    (function step(ts) {
      if (!on || !el.isConnected) return;
      g.innerHTML = body(spec, ((ts - t0) % d) / d);
      raf = requestAnimationFrame(step);
    })(t0);
    return function () { on = false; cancelAnimationFrame(raf); };
  }

  const LABELS = {};
  Object.keys(SIDE).forEach(k => LABELS[k] = SIDE[k].label);
  Object.keys(FRONT).forEach(k => LABELS[k] = FRONT[k].label);

  window.ANIM = { spec: specFor, thumb, mount, labels: LABELS, _body: body, _sides: SIDE, _fronts: FRONT, _uFor: uFor };
  if (typeof module !== 'undefined') module.exports = window.ANIM;
})();
