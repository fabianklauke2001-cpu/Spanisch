// Karten, Wiederholungsplanung (FSRS), adaptives Tempo, Tagesplan.
const CONJ = DATA.conj;
const DECKS = DATA.decks.map(d => ({id: d.id, name: d.name, phase: d.phase, cards: []}));
const CARD_BY_ID = {};
const CARDS = DATA.cards.map((c, i) => {
  const o = {i: i, id: hashId(c[1]), deck: c[0], es: c[1], de: c[2], ex: c[3], exd: c[4], t: c[5], note: c[6], vk: c[7], rf: c[8]};
  DECKS[c[0]].cards.push(o); CARD_BY_ID[o.id] = o; return o;
});

// Reihenfolge, in der neue Karten kommen: vorgezogene Decks zuerst, dann Phase für Phase, innerhalb der Phase reihum
function introOrder() {
  const out = [], used = {};
  S.pri.forEach(did => { const d = DECKS.find(x => x.id === did); if (d) d.cards.forEach(c => { if (!used[c.id]) { out.push(c); used[c.id] = 1; } }); });
  for (let ph = 1; ph <= 4; ph++) {
    const ds = DECKS.filter(d => d.phase === ph);
    const max = ds.reduce((m, d) => Math.max(m, d.cards.length), 0);
    for (let i = 0; i < max; i++) ds.forEach(d => { const c = d.cards[i]; if (c && !used[c.id]) { out.push(c); used[c.id] = 1; } });
  }
  return out;
}

// ---------- FSRS ----------
let F = null;
function initFsrs() {
  const lib = typeof FSRS !== 'undefined' ? FSRS : null;
  if (!lib || !lib.fsrs) return false;
  F = lib.fsrs(lib.generatorParameters({request_retention: (typeof RET_OVERRIDE !== 'undefined' ? RET_OVERRIDE : 0.9), maximum_interval: 365, enable_fuzz: true, enable_short_term: true}));
  return true;
}
const toMin = ms => Math.round((ms - EP) / 6e4), fromMin = m => EP + m * 6e4;
// Kartenzustand kompakt: [state, due, last, stability, difficulty, elapsed, scheduled, steps, reps, lapses, flags]
function unpack(a) {
  return {state: a[0], due: new Date(fromMin(a[1])), last_review: a[2] ? new Date(fromMin(a[2])) : undefined, stability: a[3], difficulty: a[4],
    elapsed_days: a[5], scheduled_days: a[6], learning_steps: a[7], reps: a[8], lapses: a[9]};
}
function pack(c, flags) {
  return [c.state, toMin(+new Date(c.due)), c.last_review ? toMin(+new Date(c.last_review)) : 0, round(c.stability, 3), round(c.difficulty, 3),
    c.elapsed_days || 0, c.scheduled_days || 0, c.learning_steps || 0, c.reps || 0, c.lapses || 0, flags || 0];
}
const isLearning = a => a[0] === 1 || a[0] === 3;
const isDueReview = (a, td) => a[0] === 2 && dayIdx(fromMin(a[1])) <= td;

function effNpd() { return S.ad.pause === today() ? 0 : S.set.npd; }
// Rückrichtung (Deutsch→Spanisch): im Modus „core“ nur für Wendungen, Verben und kleine Wörter
function prodWanted(c) { const m = S.set.prod || 'core'; return !!c && (m === 'all' || (m === 'core' && (c.t === 'p' || c.t === 'v' || c.t === 'o'))); }
// Deutsch→Spanisch wird freigeschaltet, sobald die Karte in der anderen Richtung sitzt
function prodCandidates() {
  const out = [];
  for (const k in S.cards) {
    if (k.charAt(k.length - 1) === '~') continue;
    const a = S.cards[k];
    if (a[0] === 2 && a[6] >= 4 && !S.cards[k + '~'] && prodWanted(CARD_BY_ID[k])) out.push(k);
  }
  return out.sort((x, y) => S.cards[x][2] - S.cards[y][2]);
}
function dueCounts(t) {
  t = t || nowMs(); const td = dayIdx(t);
  let learn = 0, rev = 0, seenR = 0, seenP = 0, known = 0, mature = 0;
  for (const k in S.cards) {
    const a = S.cards[k], prod = k.charAt(k.length - 1) === '~';
    if (prod) seenP++; else { seenR++; if (a[10] & 1) known++; if (a[0] === 2 && a[3] >= 21) mature++; }
    if (isLearning(a)) learn++; else if (isDueReview(a, td)) rev++;
  }
  const d = dayRO(td), npd = effNpd(), unseen = Math.max(0, CARDS.length - seenR);
  return {learn: learn, rev: rev, seenR: seenR, seenP: seenP, known: known, mature: mature, unseen: unseen,
    newLeft: Math.max(0, Math.min(unseen, npd - d.n)), prodLeft: Math.max(0, Math.min(prodCandidates().length, npd - d.p))};
}

// ---------- Lernsitzung ----------
let Session = null;
function startSession() {
  const t = nowMs(), td = dayIdx(t), c = dueCounts(t);
  const revs = [];
  for (const k in S.cards) if (isDueReview(S.cards[k], td)) revs.push(k);
  shuffle(revs);
  const news = [], order = introOrder();
  for (let i = 0; i < order.length && news.length < c.newLeft; i++) if (!S.cards[order[i].id]) news.push(order[i].id);
  const prods = prodCandidates().slice(0, c.prodLeft).map(k => k + '~');
  const fresh = [];
  for (let i = 0; i < Math.max(news.length, prods.length); i++) { if (news[i]) fresh.push(news[i]); if (prods[i]) fresh.push(prods[i]); }
  const main = []; let fi = 0;
  revs.forEach((k, i) => { main.push(k); if ((i + 1) % 4 === 0 && fi < fresh.length) main.push(fresh[fi++]); });
  while (fi < fresh.length) main.push(fresh[fi++]);
  Session = {main: main, cur: null, shownAt: t, done: 0, again: 0, undo: null, total: main.length + c.learn};
  return Session;
}
function nextCard() {
  const t = nowMs(), td = dayIdx(t);
  let best = null, bestDue = Infinity;
  for (const k in S.cards) { const a = S.cards[k]; if (isLearning(a) && CARD_BY_ID[k.replace('~', '')]) { const due = fromMin(a[1]); if (due < bestDue) { best = k; bestDue = due; } } }
  if (best && bestDue <= t) return best;
  while (Session && Session.main.length) {
    const k = Session.main.shift(), a = S.cards[k];
    if (!a || isDueReview(a, td)) return k;
  }
  if (best && bestDue <= t + 20 * 6e4) return best;      // Lernkarten bis 20 Minuten vorziehen
  // Nachfüllen: übersprungene („kenne ich schon“) Karten verbrauchen das Tagespensum nicht
  if (Session && refillSession()) return nextCard();
  return null;
}
function refillSession() {
  const c = dueCounts(), add = [];
  if (c.newLeft > 0) { const order = introOrder(); for (let i = 0; i < order.length && add.length < c.newLeft; i++) if (!S.cards[order[i].id]) add.push(order[i].id); }
  prodCandidates().slice(0, c.prodLeft).forEach(k => add.push(k + '~'));
  Session.main = Session.main.concat(add);
  return add.length > 0;
}
function remainingCount() {
  if (!Session) return 0;
  let learn = 0; for (const k in S.cards) if (isLearning(S.cards[k])) learn++;
  return Session.main.length + learn + (Session.cur ? 1 : 0);
}
function snapshot(keys) {
  const td = today();
  return {cards: keys.map(k => [k, S.cards[k] ? S.cards[k].slice() : null]), dayKey: dayStr(td), day: Object.assign({}, dayRO(td)), had: !!S.days[dayStr(td)]};
}
function rateCard(key, rating) {
  if (!F) return;
  const t = nowMs(), prev = S.cards[key];
  const snap = snapshot([key]);
  const card = prev ? unpack(prev) : FSRS.createEmptyCard(new Date(t));
  const res = F.next(card, new Date(t), rating);
  S.cards[key] = pack(res.card, prev ? prev[10] : 0);
  const d = dayRW(dayIdx(t));
  d.r++;
  if (!prev) { if (key.charAt(key.length - 1) === '~') d.p++; else d.n++; }
  else if (prev[0] === 2) { d.rr++; if (rating > 1) d.ok++; }
  if (Session) {
    d.tc += Math.round(clamp((t - Session.shownAt) / 1000, 1, 60));
    Session.undo = snap; Session.done++; if (rating === 1) Session.again++;
  }
  touch(cardPart(key), 'days');
}
function markKnown(id) {
  const t = nowMs(), snap = snapshot([id, id + '~']);
  [['', 21, 20], ['~', 12, 18]].forEach(x => {
    if (x[0] && !prodWanted(CARD_BY_ID[id])) return;
    const days = x[1] + Math.floor(Math.random() * x[2]);
    S.cards[id + x[0]] = [2, toMin(t + days * DAY_MS), toMin(t), 40, 3.5, 0, days, 0, 1, 0, 1];
  });
  dayRW().k++;
  if (Session) { Session.undo = snap; Session.done++; }
  touch(cardPart(id), 'days');
}
function undoLast() {
  const u = Session && Session.undo; if (!u) return false;
  u.cards.forEach(x => { if (x[1]) S.cards[x[0]] = x[1]; else delete S.cards[x[0]]; });
  if (u.had) S.days[u.dayKey] = u.day; else delete S.days[u.dayKey];
  if (Session.cur) Session.main.unshift(Session.cur);
  Session.cur = null; Session.main.unshift(u.cards[0][0]); Session.undo = null; Session.done = Math.max(0, Session.done - 1);
  touch(cardPart(u.cards[0][0]), 'days');
  return true;
}
function fmtIv(ms) {
  const m = ms / 6e4;
  if (m < 1.5) return '1 Min';
  if (m < 60) return Math.round(m) + ' Min';
  if (m < 1440) return Math.round(m / 60) + ' Std';
  const d = m / 1440;
  if (d < 30) return Math.round(d) + (Math.round(d) === 1 ? ' Tag' : ' Tage');
  if (d < 365) return round(d / 30, 1).toString().replace('.', ',') + ' Mon';
  return round(d / 365, 1).toString().replace('.', ',') + ' J';
}
function previewIntervals(key) {
  if (!F) return ['', '', '', ''];
  const t = nowMs(), prev = S.cards[key], card = prev ? unpack(prev) : FSRS.createEmptyCard(new Date(t));
  const rec = F.repeat(card, new Date(t));
  return [1, 2, 3, 4].map(g => fmtIv(+new Date(rec[g].card.due) - t));
}
function cardStatus(id) {
  const a = S.cards[id];
  if (!a) return {label: 'neu', cls: 'new'};
  if (a[10] & 1) return {label: 'bekannt', cls: 'known'};
  if (isLearning(a)) return {label: 'lernt', cls: 'learn'};
  return a[3] >= 21 ? {label: 'sitzt', cls: 'mature'} : {label: 'jung', cls: 'young'};
}
function deckStats(d) {
  let seen = 0, mature = 0;
  d.cards.forEach(c => { const a = S.cards[c.id]; if (a) { seen++; if (a[0] === 2 && a[3] >= 21) mature++; } });
  return {total: d.cards.length, seen: seen, mature: mature};
}

// ---------- Adaptives Tempo ----------
const sumOf = (arr, f) => arr.reduce((s, x) => s + (x[f] || 0), 0);
function recentDays(n, span) {
  const td = today(), out = [];
  for (let i = td - 1; i >= td - (span || 10) && out.length < n; i--) { const d = S.days[dayStr(i)]; if (d && d.r > 0) out.push(d); }
  return out;
}
function retention(days) { const rr = sumOf(days, 'rr'); return rr >= 30 ? sumOf(days, 'ok') / rr : null; }
function setPace(npd, why) {
  npd = clamp(npd, 4, 20);
  if (npd === S.set.npd) return;
  const td = today();
  S.ad.hist.push([td, S.set.npd, npd, why]); if (S.ad.hist.length > 12) S.ad.hist.shift();
  S.set.npd = npd; S.set.at = nowMs(); S.ad.chg = td; S.ad.note = why;
}
const RET_TARGET = 0.9;
function defaultPace(budget) { return ({30: 6, 45: 9, 60: 11})[budget] || 9; }
// Einmal pro Tag: Tempo an Trefferquote und Zeitaufwand anpassen.
// Neue Karten erzeugen ihre Wiederholungen erst in den Folgewochen, deshalb wird erst nach drei Wochen und nur bei viel Luft erhöht.
function evalAdapt() {
  const td = today();
  if (S.ad.last === td) return false;
  S.ad.last = td; S.ad.pause = 0;
  const due = dueCounts().rev;
  if (S.set.auto) {
    const act = recentDays(5, 10), bud = (BUDGET[S.set.budget] || BUDGET[45]).cards, npd = S.set.npd;
    if (due > bud * 12) {
      S.ad.pause = td; S.ad.note = 'Heute keine neuen Karten: erst die ' + due + ' fälligen Wiederholungen abbauen.';
    } else if (act.length >= 3 && td - (S.ad.chg || 0) >= 3) {
      const ret = retention(act), avg = sumOf(act, 'tc') / act.length / 60;
      const pct = ret === null ? '' : Math.round(ret * 100) + ' %';
      const settled = td - parseDay(S.set.start) >= 21;
      if (avg > bud * 1.5) setPace(npd - 3, 'Die Karten dauern im Schnitt ' + Math.round(avg) + ' Min statt ' + bud + ': deutlich weniger neue Karten.');
      else if (avg > bud * 1.2) setPace(npd - 2, 'Die Karten dauern im Schnitt ' + Math.round(avg) + ' Min statt ' + bud + ': weniger neue Karten.');
      else if (ret !== null && ret < 0.8) setPace(npd - 2, 'Trefferquote ' + pct + ': weniger neue Karten, damit die alten sitzen.');
      else if (settled && ret !== null && ret >= 0.88 && avg < bud * 0.55) setPace(npd + 2, 'Trefferquote ' + pct + ' und nur ' + Math.round(avg) + ' Min pro Tag: mehr neue Karten.');
    }
  }
  touch('core');
  return true;
}

// ---------- Grammatik-Fortschritt ----------
const grSt = id => (S.gr[id] || {}).st || 0;
const GR_LABEL = ['neu', 'geübt', 'bestanden', 'gemeistert'];
function nextLesson() { return GRAMMAR.find(l => grSt(l.id) < 2) || null; }
function recordLesson(id, pct, n, mode) {
  const td = today(), g = S.gr[id] || (S.gr[id] = {st: 0, read: 1, ses: []});
  const same = g.ses.find(x => x[0] === td);
  if (same) { if (pct > same[1]) { same[1] = pct; same[2] = n; } } else g.ses.push([td, pct, n]);
  if (g.ses.length > 8) g.ses.shift();
  let msg;
  if (mode === 'test') {
    if (pct >= 90) { g.st = 3; g.skip = 1; msg = 'Einstufung bestanden: Die Lektion gilt als gemeistert.'; }
    else { g.st = Math.max(g.st, 1); msg = 'Diese Lektion lohnt sich für Dich. Lies die Tabelle und übe noch einmal.'; }
  } else {
    if (pct >= 80) g.st = Math.max(g.st, 2); else g.st = Math.max(g.st, 1);
    if (g.ses.filter(x => x[1] >= 85).length >= 2) g.st = 3;
    msg = g.st === 3 ? 'Gemeistert. Die nächste Lektion ist frei.' : g.st === 2 ? 'Bestanden. Noch ein starker Durchgang an einem anderen Tag, dann gilt sie als gemeistert.' : pct < 60 ? 'Das war schwer. Schau Dir die Tabelle noch einmal an, die Lektion kommt wieder.' : 'Fast. Ab 80 % ist die Lektion bestanden.';
  }
  dayRW().gs++;
  touch('core', 'days');
  return msg;
}
function noteItem(k, ok) {
  if (!k) return;
  if (ok) { if (S.gi[k]) { S.gi[k]--; if (S.gi[k] <= 0) delete S.gi[k]; } }
  else S.gi[k] = Math.min(5, (S.gi[k] || 0) + 1);
  const keys = Object.keys(S.gi);
  if (keys.length > 300) keys.sort((a, b) => S.gi[a] - S.gi[b]).slice(0, keys.length - 300).forEach(x => delete S.gi[x]);
}

// ---------- Plan ----------
function planInfo() {
  const td = today(), start = parseDay(S.set.start), dep = parseDay(S.set.dep);
  const total = Math.max(14, dep - start), el = clamp(td - start, 0, total);
  const weeks = Math.ceil(total / 7);
  const exp = Math.round(GRAMMAR.length * el / total), done = GRAMMAR.filter(l => grSt(l.id) >= 2).length;
  return {daysLeft: dep - td, week: clamp(Math.floor(el / 7) + 1, 1, weeks), weeks: weeks, phase: clamp(Math.floor(el / total * 4) + 1, 1, 4),
    exp: exp, done: done, behind: exp - done, el: el, total: total};
}
function tasksFor(i) {
  i = i === undefined ? today() : i;
  const wd = weekdayOf(i), b = BUDGET[S.set.budget] || BUDGET[45], d = dayRO(i), pi = planInfo(), T = [];
  const dc = dueCounts(), left = dc.learn + dc.rev + dc.newLeft + dc.prodLeft;
  T.push({id: 'cards', title: 'Karten', sub: left ? (dc.rev + dc.learn) + ' fällig, ' + (dc.newLeft + dc.prodLeft) + ' neu' : 'Für heute erledigt', min: b.cards,
    done: left === 0, part: Math.min(b.cards - 1, d.tc / 60), go: 'cards'});
  const nl = nextLesson(), mwf = wd === 1 || wd === 3 || wd === 5, tt = wd === 2 || wd === 4;
  const catchUp = tt && pi.behind >= 2;
  if (mwf || catchUp) {
    if (nl) T.push({id: 'gr', title: 'Grammatik: ' + nl.title, sub: catchUp ? 'Aufholen: Du liegst ' + pi.behind + ' Lektionen hinter dem Plan' : grSt(nl.id) ? 'Wiederholen und üben' : 'Neue Lektion lesen, dann üben',
      min: b.gr, done: d.gs > 0, part: Math.min(b.gr - 1, d.tg / 60), go: 'lesson:' + nl.id});
    else T.push({id: 'gr', title: 'Grammatik: gemischter Drill', sub: 'Alle Lektionen sind bestanden', min: b.gr, done: d.gm > 0 || d.gs > 0, part: Math.min(b.gr - 1, d.tg / 60), go: 'mix'});
  }
  const ltDone = S.li.lt >= RES.lt.total;
  if (mwf) {
    if (!ltDone) T.push({id: 'lt', title: 'Language Transfer', sub: 'Weiter ab Lektion ' + (S.li.lt + 1) + ', laut mitsprechen', min: b.lt, done: d.tt >= b.lt * 0.8, part: Math.min(b.lt, d.tt), go: 'praxis'});
    else T.push({id: 'li', title: 'Hören', sub: 'Video oder Podcast auf Deinem Niveau', min: b.lt, done: d.tl >= b.lt * 0.8, part: Math.min(b.lt, d.tl), go: 'praxis'});
    if (b.sp2) T.push({id: 'sp', title: 'Sprechen', sub: 'Tagesfrage laut beantworten', min: b.sp2, done: d.ts >= b.sp2 * 0.8 || d.sp > 0, part: Math.min(b.sp2, d.ts), go: 'praxis'});
  }
  if (tt) {
    const li = catchUp ? Math.max(10, b.li - b.gr) : b.li;
    T.push({id: 'li', title: 'Hören', sub: 'Video oder Podcast auf Deinem Niveau', min: li, done: d.tl >= li * 0.8, part: Math.min(li, d.tl), go: 'praxis'});
    T.push({id: 'sp', title: 'Sprechen', sub: 'Tagesfrage laut beantworten', min: b.sp, done: d.ts >= b.sp * 0.8 || d.sp > 0, part: Math.min(b.sp, d.ts), go: 'praxis'});
  }
  if (wd === 6) {
    T.push({id: 'li', title: 'Langer Hörblock', sub: 'Am Stück, ohne Pause-Taste', min: b.liSat, done: d.tl >= b.liSat * 0.8, part: Math.min(b.liSat, d.tl), go: 'praxis'});
    if (b.mix && GRAMMAR.some(l => grSt(l.id) >= 1)) T.push({id: 'mix', title: 'Gemischter Drill', sub: 'Alles Bisherige durcheinander', min: b.mix, done: d.gm > 0, part: Math.min(b.mix - 1, d.tg / 60), go: 'mix'});
  }
  if (wd === 0) T.push({id: 'free', title: 'Frei wählbar', sub: 'Gespräch mit Deinem Kumpel oder ein Lieblingsvideo', min: 0, optional: true, done: d.ts > 0 || d.tl > 0, part: 0, go: 'praxis'});
  return T;
}
function dayProgress(i) {
  const T = tasksFor(i).filter(t => !t.optional);
  const total = sumOf(T, 'min'), done = T.reduce((s, t) => s + (t.done ? t.min : Math.max(0, t.part || 0)), 0);
  return {total: total, done: Math.min(total, Math.round(done)), all: T.every(t => t.done)};
}
function streak() {
  let i = today(), n = 0;
  if (!(S.days[dayStr(i)] || {}).cd) i--;
  while ((S.days[dayStr(i)] || {}).cd) { n++; i--; }
  return n;
}
function markCardsDone() { const d = dayRW(); if (!d.cd) { d.cd = 1; touch('days'); } }
function weekMinutes() {
  const td = today(), out = {k: 0, g: 0, h: 0, s: 0};
  for (let i = td - 6; i <= td; i++) { const d = S.days[dayStr(i)]; if (!d) continue; out.k += (d.tc || 0) / 60; out.g += (d.tg || 0) / 60; out.h += (d.tl || 0) + (d.tt || 0) / 2; out.s += (d.ts || 0) + (d.tt || 0) / 2; }
  return out;
}
function forecast(n) {
  const td = today(), out = []; for (let i = 0; i < n; i++) out.push(0);
  for (const k in S.cards) { const a = S.cards[k]; if (a[0] !== 2) continue; const di = Math.max(0, dayIdx(fromMin(a[1])) - td); if (di < n) out[di]++; }
  return out;
}
