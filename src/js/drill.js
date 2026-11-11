// Übungen: Aufgaben erzeugen, auswählen, auswerten.
function conjItems(lessonId, spec) {
  const out = [];
  spec.v.forEach(v => {
    if (!hasVerb(v)) return;
    const persons = spec.t === 'imp' ? [1, 2, 5] : (spec.t === 'vos' || spec.t === 'impvos') ? ['vos'] : DRILL_PERSONS;
    persons.forEach(p => {
      const a = conjForm(v, spec.t, p);
      if (a) out.push({k: lessonId + ':' + spec.t + ':' + v + ':' + p, les: lessonId, type: 'conj', verb: v, tense: spec.t, person: p, a: [a]});
    });
  });
  return out;
}
function fixedItems(lesson) {
  return ((lesson.drill && lesson.drill.items) || []).map((it, i) => {
    const k = lesson.id + ':i' + i;
    if (it[0] === 'c') return {k: k, les: lesson.id, type: 'c', q: it[1], opts: it[2], ai: it[3], ex: it[4] || ''};
    if (it[0] === 'f') return {k: k, les: lesson.id, type: 'f', q: it[1], a: [].concat(it[2]), ex: it[3] || ''};
    return {k: k, les: lesson.id, type: 's', q: it[1], a: [it[2]]};
  });
}
function lessonPool(lesson) {
  let pool = fixedItems(lesson);
  ((lesson.drill && lesson.drill.conj) || []).forEach(sp => { pool = pool.concat(conjItems(lesson.id, sp)); });
  return pool;
}
// Gewichtete Auswahl ohne Wiederholung; Aufgaben mit früheren Fehlern kommen eher dran
function sampleItems(pool, n) {
  const arr = pool.map(it => ({it: it, w: (1 + 2 * (S.gi[it.k] || 0)) * (0.5 + Math.random())}));
  arr.sort((a, b) => b.w - a.w);
  const out = [], verbs = {};
  for (let i = 0; i < arr.length && out.length < n; i++) {
    const it = arr[i].it;
    if (it.type === 'conj') { verbs[it.verb] = (verbs[it.verb] || 0) + 1; if (verbs[it.verb] > 2) continue; }
    out.push(it);
  }
  return out;
}
function buildLessonDrill(lesson, n) {
  const pool = lessonPool(lesson);
  const by = t => pool.filter(x => x.type === t);
  const conj = by('conj'), ch = by('c'), fill = by('f'), self = by('s');
  const nS = Math.min(self.length, Math.round(n * 0.17));
  const want = conj.length ? {f: Math.round(n * 0.35), c: Math.round(n * 0.2)} : {f: Math.round(n * 0.3), c: n};
  let main = sampleItems(fill, Math.min(fill.length, want.f));
  main = main.concat(sampleItems(ch, Math.min(ch.length, want.c, n - nS - main.length)));
  main = main.concat(sampleItems(conj, n - nS - main.length));
  // Auffüllen, falls eine Aufgabenart nicht genug hergibt
  const have = {}; main.forEach(x => { have[x.k] = 1; });
  [ch, fill, conj].forEach(src => { if (main.length < n - nS) shuffle(src.slice()).forEach(x => { if (main.length < n - nS && !have[x.k]) { have[x.k] = 1; main.push(x); } }); });
  let tail = sampleItems(self, nS);
  if (main.length + tail.length < n) tail = tail.concat(shuffle(self.filter(x => tail.indexOf(x) < 0)).slice(0, n - main.length - tail.length));
  return shuffle(main).concat(tail);
}
function buildMixDrill(n) {
  const ls = GRAMMAR.filter(l => grSt(l.id) >= 1);
  if (!ls.length) return [];
  const bag = [];
  ls.forEach(l => { const w = 4 - grSt(l.id); for (let i = 0; i < w; i++) bag.push(l); });
  const pools = {}, used = {}, out = [];
  let guard = 0;
  while (out.length < n && guard++ < n * 20) {
    const l = pick(bag);
    const pool = pools[l.id] || (pools[l.id] = lessonPool(l).filter(x => x.type !== 's'));
    const c = sampleItems(pool.filter(x => !used[x.k]), 1)[0];
    if (c) { used[c.k] = 1; out.push(c); }
  }
  return out;
}
function nounGenderItems(n) {
  const cand = CARDS.filter(c => c.t === 'n' && /^(el|la) [^\s,]+$/.test(c.es) && !/^el agua/.test(c.es));
  return shuffle(cand.slice()).slice(0, n).map(c => {
    const art = c.es.split(' ')[0], noun = c.es.split(' ')[1];
    return {k: 'b7:' + c.id, type: 'c', q: '___ ' + noun + '  (' + c.de + ')', opts: ['el', 'la'], ai: art === 'el' ? 0 : 1, ex: c.note || ''};
  });
}
function numberItems(n, canHear) {
  const ranges = [() => Math.floor(Math.random() * 31), () => 31 + Math.floor(Math.random() * 69), () => 100 + Math.floor(Math.random() * 900),
    () => (1 + Math.floor(Math.random() * 40)) * 500, () => (1 + Math.floor(Math.random() * 100)) * 1000];
  const out = [];
  for (let i = 0; i < n; i++) {
    const v = ranges[i % ranges.length](), w = numEs(v), mode = i % 3;
    if (mode === 0) out.push({k: '', type: 'f', q: fmtNum(v), hint: 'Schreib die Zahl als Wort', a: [w]});
    else if (mode === 1 || !canHear) out.push({k: '', type: 'f', q: w, hint: 'Schreib die Zahl in Ziffern', a: [String(v), fmtNum(v)], num: true});
    else out.push({k: '', type: 'f', q: 'Hör zu und schreib die Zahl in Ziffern', say: w, a: [String(v), fmtNum(v)], num: true, reveal: w});
  }
  return out;
}
function timeItems(n) {
  const mins = [0, 15, 30, 45, 10, 20, 25, 40, 50, 55, 5, 35], out = [];
  for (let i = 0; i < n; i++) {
    const h = 1 + Math.floor(Math.random() * 12), m = mins[i % mins.length];
    out.push({k: '', type: 's', q: h + ':' + (m < 10 ? '0' : '') + m + ' Uhr', hint: 'Sag die Uhrzeit laut auf Spanisch', a: [timeEs(h, m)]});
  }
  return out;
}
function buildBasicDrill(topic, canHear) {
  if (topic.gen === 'num') return numberItems(12, canHear);
  if (topic.gen === 'time') return timeItems(10);
  if (topic.gen === 'gender') return nounGenderItems(15);
  return shuffle((topic.pairs || []).slice()).slice(0, 12).map((p, i) => ({k: '', type: 'f', q: p[0], hint: 'Auf Spanisch', a: p.slice(1)}));
}
function conjPrompt(it) {
  const card = CARDS.find(c => c.t === 'v' && c.es === it.verb);
  const who = it.person === 'vos' ? 'vos' : (it.tense === 'imp' ? ['', 'tú', 'usted', '', '', 'ustedes'][it.person] : PERSONS[it.person]);
  return {verb: it.verb, de: card ? card.de : '', tense: TENSE[it.tense] || it.tense, who: who};
}

// ---------- Ablauf einer Übung ----------
let Drill = null;
function startDrill(items, meta) {
  Drill = Object.assign({items: items.slice(), i: 0, right: 0, total: items.length, answered: null, startAt: nowMs(), lastAt: nowMs(), wrong: []}, meta);
  return Drill;
}
// result: 2 richtig, 1 fast (Akzent), 0 falsch
function answerDrill(result) {
  const it = Drill.items[Drill.i];
  const t = nowMs();
  dayRW().tg += Math.round(clamp((t - Drill.lastAt) / 1000, 1, 90)); Drill.lastAt = t;
  if (!it.retry) {
    if (result > 0) Drill.right++;
    noteItem(it.k, result > 0);
    if (result === 0) { Drill.wrong.push(it); Drill.items.push(Object.assign({}, it, {retry: true})); }
  }
  Drill.answered = result;
  touch('core', 'days');
}
function nextDrillItem() { Drill.i++; Drill.answered = null; Drill.lastAt = nowMs(); return Drill.i < Drill.items.length; }
function finishDrill() {
  const pct = Drill.total ? Math.round(100 * Drill.right / Drill.total) : 0;
  let msg = '';
  if (Drill.mode === 'lesson' || Drill.mode === 'test') msg = recordLesson(Drill.ref, pct, Drill.total, Drill.mode);
  else if (Drill.mode === 'mix') { dayRW().gm++; msg = pct >= 85 ? 'Stark. Das sitzt.' : 'Die Fehler kommen im nächsten gemischten Drill häufiger dran.'; touch('days'); }
  else if (Drill.mode === 'basic') {
    const b = S.ba[Drill.ref] || (S.ba[Drill.ref] = {best: 0, n: 0, last: 0});
    b.best = Math.max(b.best, pct); b.n++; b.last = today();
    msg = pct >= 90 ? 'Sitzt.' : 'Schau noch einmal in die Tabelle und wiederhol die Abfrage.'; touch('core');
  }
  return {pct: pct, right: Drill.right, total: Drill.total, msg: msg, wrong: Drill.wrong};
}
