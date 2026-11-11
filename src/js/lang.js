// Sprachlogik: Antworten prüfen, Verbformen, Zahlen, Uhrzeit.
function norm(s) {
  return String(s || '').toLowerCase().replace(/[¿?¡!.,;:«»"“”„()]/g, ' ').replace(/\s+/g, ' ').trim();
}
const COMBINING = new RegExp('[' + String.fromCharCode(0x300) + '-' + String.fromCharCode(0x36f) + ']', 'g');
const unaccent = s => norm(s).normalize('NFD').replace(COMBINING, '');
// 2 = richtig, 1 = richtig bis auf Akzente, 0 = falsch
function checkAnswer(input, answers) {
  const a = norm(input); if (!a) return 0;
  const list = [].concat(answers);
  if (list.some(x => norm(x) === a)) return 2;
  const u = unaccent(input);
  if (list.some(x => unaccent(x) === u)) return 1;
  return 0;
}

// ---------- Verben ----------
const PERSONS = ['yo', 'tú', 'él, ella, usted', 'nosotros', 'vosotros', 'ellos, ustedes'];
const PERSON_SHORT = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'];
const REFL = ['me', 'te', 'se', 'nos', 'os', 'se'];
const DRILL_PERSONS = [0, 1, 2, 3, 5];               // ohne vosotros
const TENSE = {
  pres: 'Presente', indef: 'Indefinido', imperf: 'Imperfecto', fut: 'Futuro', cond: 'Condicional',
  subj: 'Subjuntivo', perf: 'Perfecto', ger: 'Verlaufsform', ira: 'Nahe Zukunft', imp: 'Imperativo',
  vos: 'Presente (vos)', impvos: 'Imperativo (vos)'
};
function splitVerb(v) { const refl = /(ar|er|ir|ír)se$/.test(v); return {base: refl ? v.slice(0, -2) : v, refl: refl}; }
function hasVerb(v) { return !!CONJ[splitVerb(v).base]; }
// person: 0..5, oder 'vos'
function conjForm(verb, tense, person) {
  const sv = splitVerb(verb), d = CONJ[sv.base]; if (!d) return '';
  const pi = person === 'vos' ? 1 : person;
  const pron = sv.refl ? REFL[pi] + ' ' : '';
  switch (tense) {
    case 'pres': return pron + (person === 'vos' ? d.vos : d.pres[pi]);
    case 'vos': return pron + d.vos;
    case 'indef': case 'imperf': case 'fut': case 'cond': case 'subj': return pron + d[tense][pi];
    case 'perf': return pron + CONJ.haber.pres[pi] + ' ' + d.part;
    case 'ger': return pron + CONJ.estar.pres[pi] + ' ' + d.ger;
    case 'ira': return pron + CONJ.ir.pres[pi] + ' a ' + sv.base;
    case 'imp': return sv.refl ? '' : (pi === 1 ? d.imp[0] : pi === 2 ? d.imp[2] : pi === 5 ? d.imp[3] : '');
    case 'impvos': return sv.refl ? '' : d.imp[1];
  }
  return '';
}
function regularForms(base) {
  const grp = /ar$/.test(base) ? 'ar' : /er$/.test(base) ? 'er' : 'ir', st = base.slice(0, -2);
  const E = {
    ar: {pres: ['o', 'as', 'a', 'amos', 'áis', 'an'], indef: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'], part: 'ado', ger: 'ando'},
    er: {pres: ['o', 'es', 'e', 'emos', 'éis', 'en'], indef: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'], part: 'ido', ger: 'iendo'},
    ir: {pres: ['o', 'es', 'e', 'imos', 'ís', 'en'], indef: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'], part: 'ido', ger: 'iendo'}
  }[grp];
  const inf = st + grp;
  return {grp: grp, pres: E.pres.map(e => st + e), indef: E.indef.map(e => st + e), fut0: inf + 'é', part: st + E.part, ger: st + E.ger};
}
// „Stammformen“: nur die Formen, die vom regelmäßigen Muster abweichen
const IMPERSONAL = {llover: 1};
function principalParts(verb) {
  const sv = splitVerb(verb), d = CONJ[sv.base]; if (!d) return null;
  const r = regularForms(sv.base), out = [];
  const pr = [];
  if (IMPERSONAL[sv.base]) { if (d.pres[2] !== r.pres[2]) pr.push(d.pres[2] + ' (nur 3. Person)'); }
  else {
    if (d.pres[0] !== r.pres[0]) pr.push('yo ' + d.pres[0]);
    if (d.pres[1] !== r.pres[1]) pr.push('tú ' + d.pres[1]);
    else if (d.pres[2] !== r.pres[2]) pr.push('él ' + d.pres[2]);
  }
  if (pr.length) out.push(['Präsens', pr.join(', ')]);
  const ind = [];
  if (d.indef[0] !== r.indef[0]) ind.push('yo ' + d.indef[0]);
  if (d.indef[2] !== r.indef[2]) ind.push('él ' + d.indef[2]);
  if (ind.length) out.push(['Indefinido', ind.join(', ')]);
  if (d.fut[0] !== r.fut0) out.push(['Futuro', 'yo ' + d.fut[0]]);
  if (d.part !== r.part && unaccent(d.part) !== unaccent(r.part)) out.push(['Partizip', d.part]);
  if (d.ger !== r.ger) out.push(['Gerundio', d.ger]);
  return {grp: r.grp, parts: out, regular: out.length === 0};
}

// ---------- Zahlen ----------
const NUM_U = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
const NUM_T = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const NUM_H = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
function numBelow1000(x) {
  if (x === 100) return 'cien';
  const out = [], h = Math.floor(x / 100), r = x % 100;
  if (h) out.push(NUM_H[h]);
  if (r) { if (r < 30) out.push(NUM_U[r]); else { const t = Math.floor(r / 10), u = r % 10; out.push(NUM_T[t] + (u ? ' y ' + NUM_U[u] : '')); } }
  return out.join(' ');
}
function numEs(n) {
  n = Math.floor(n);
  if (n < 1000) return n === 0 ? 'cero' : numBelow1000(n);
  if (n < 1000000) {
    const th = Math.floor(n / 1000), r = n % 1000;
    const pre = th === 1 ? 'mil' : numBelow1000(th).replace(/veintiuno$/, 'veintiún').replace(/uno$/, 'un') + ' mil';
    return pre + (r ? ' ' + numBelow1000(r) : '');
  }
  const m = Math.floor(n / 1000000), r = n % 1000000;
  return (m === 1 ? 'un millón' : numEs(m).replace(/veintiuno$/, 'veintiún').replace(/uno$/, 'un') + ' millones') + (r ? ' ' + numEs(r) : '');
}
const fmtNum = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// ---------- Uhrzeit ----------
function timeEs(h, m) {
  const hour = x => { const k = ((x + 11) % 12) + 1; return k === 1 ? 'la una' : 'las ' + NUM_U[k]; };
  const verb = x => (((x + 11) % 12) + 1 === 1 ? 'Es ' : 'Son ');
  if (m === 0) return verb(h) + hour(h) + '.';
  if (m === 15) return verb(h) + hour(h) + ' y cuarto.';
  if (m === 30) return verb(h) + hour(h) + ' y media.';
  if (m === 45) return verb(h + 1) + hour(h + 1) + ' menos cuarto.';
  if (m < 30) return verb(h) + hour(h) + ' y ' + numEs(m) + '.';
  return verb(h + 1) + hour(h + 1) + ' menos ' + numEs(60 - m) + '.';
}
