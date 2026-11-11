// Ansichten: Grammatik, Basiswissen, Verbtabellen, Übungen.
const ST_CLS = ['new', 'learn', 'young', 'mature'];
TABS.grammatik = function () {
  const seg = View.gseg;
  let h = head('Grammatik') + '<div class="seg" role="group">' + [['lek', 'Lektionen'], ['bas', 'Basiswissen'], ['vrb', 'Verben']].map(x => '<button data-a="gseg" data-v="' + x[0] + '" class="' + (seg === x[0] ? 'on' : '') + '">' + x[1] + '</button>').join('') + '</div>';
  if (seg === 'lek') {
    const nl = nextLesson(), pi = planInfo(), any = GRAMMAR.some(l => grSt(l.id) >= 1);
    h += '<section class="card soft"><p>' + pi.done + ' von ' + GRAMMAR.length + ' Lektionen bestanden' + (pi.behind >= 2 ? ', ' + pi.behind + ' hinter dem Plan.' : pi.behind <= -2 ? ', ' + (-pi.behind) + ' vor dem Plan.' : ', im Plan.') + '</p>' +
      '<button class="btn" data-a="startMix"' + (any ? '' : ' disabled') + '>Gemischter Drill</button>' + (any ? '' : '<p class="muted small">Wird frei, sobald Du die erste Lektion geübt hast.</p>') + '</section>';
    h += '<ol class="lessons">' + GRAMMAR.map((l, i) => {
      const st = grSt(l.id), g = S.gr[l.id], best = g && g.ses.length ? Math.max.apply(null, g.ses.map(x => x[1])) : null;
      return '<li><button class="lesson' + (nl && nl.id === l.id ? ' next' : '') + '" data-a="lesson" data-id="' + l.id + '"><span class="l-n">' + (i + 1) + '</span><span class="l-t"><b>' + esc(l.title) + '</b><small>' + esc(l.sub) + '</small></span>' +
        '<span class="st ' + ST_CLS[st] + '">' + GR_LABEL[st] + (best !== null ? ' · ' + best + ' %' : '') + '</span></button></li>';
    }).join('') + '</ol>';
  } else if (seg === 'bas') {
    h += '<ol class="lessons">' + BASICS.map(t => {
      const b = S.ba[t.id];
      return '<li><button class="lesson" data-a="basic" data-id="' + t.id + '"><span class="l-t"><b>' + esc(t.title) + '</b><small>' + esc(t.sub) + '</small></span>' + (b ? '<span class="st ' + (b.best >= 90 ? 'mature' : 'young') + '">' + b.best + ' %</span>' : '') + '</button></li>';
    }).join('') + '</ol>';
  } else {
    h += '<input class="inp" type="search" id="verb-q" data-i="verbSearch" placeholder="Verb suchen" value="' + esc(View.vq) + '" autocomplete="off"><div id="verb-list">' + verbListHtml() + '</div>';
  }
  return h;
};
ACT.gseg = el => { View.gseg = el.dataset.v; render(); };
function verbListHtml() {
  const q = unaccent(View.vq || '');
  const seen = {}, list = [];
  CARDS.forEach(c => { if (c.t === 'v') { const v = c.es.split(' ')[0]; if (!seen[v]) { seen[v] = 1; list.push([v, c.de]); } } });
  list.sort((a, b) => a[0].localeCompare(b[0], 'es'));
  const hits = q ? list.filter(x => unaccent(x[0]).indexOf(q) >= 0 || unaccent(x[1]).indexOf(q) >= 0) : list;
  return '<ul class="clist">' + hits.map(x => { const pp = principalParts(x[0]); return '<li><button class="crow" data-a="verb" data-v="' + esc(x[0]) + '"><span class="dot ' + (pp && pp.regular ? 'known' : 'learn') + '"></span><span class="c-es">' + esc(x[0]) + '</span><span class="c-de">' + esc(x[1]) + '</span></button></li>'; }).join('') +
    '</ul><p class="muted small pad">Gelber Punkt: unregelmäßige Formen.</p>';
}
ACT.verbSearch = el => { View.vq = el.value; $('#verb-list').innerHTML = verbListHtml(); };
SUB.verb = function (v) {
  const sv = splitVerb(v), d = CONJ[sv.base], card = CARDS.find(c => c.t === 'v' && c.es.split(' ')[0] === v), pp = principalParts(v);
  if (!d) return head(v, '', true) + '<p class="pad">Für dieses Verb gibt es keine Tabelle.</p>';
  let h = head(v, card ? card.de : '', true);
  h += '<section class="card soft"><p>' + (pp.regular ? 'Regelmäßiges Verb auf -' + pp.grp + '.' : 'Abweichende Formen: ' + pp.parts.map(p => '<b>' + p[0] + '</b> ' + esc(p[1])).join(' · ')) + '</p>' +
    '<p class="small">Gerundio: <b>' + esc(d.ger) + '</b> · Partizip: <b>' + esc(d.part) + '</b> · vos: <b>' + esc(conjForm(v, 'vos', 'vos')) + '</b></p></section>';
  [['pres', 'indef'], ['imperf', 'fut'], ['cond', 'subj']].forEach(pair => {
    h += '<div class="tw"><table class="conj"><thead><tr><th></th>' + pair.map(t => '<th>' + TENSE[t] + '</th>').join('') + '</tr></thead><tbody>' +
      [0, 1, 2, 3, 4, 5].map(p => '<tr' + (p === 4 ? ' class="dim"' : '') + '><th>' + PERSONS[p] + '</th>' + pair.map(t => {
        const f = conjForm(v, t, p), r = !sv.refl && (t === 'pres' || t === 'indef') ? regularForms(sv.base)[t][p] : f;
        return '<td' + (r !== f ? ' class="irr"' : '') + '>' + esc(f) + '</td>';
      }).join('') + '</tr>').join('') + '</tbody></table></div>';
  });
  h += '<div class="tw"><table class="conj"><thead><tr><th></th><th>Perfecto</th>' + (sv.refl ? '' : '<th>Imperativo</th>') + '</tr></thead><tbody>' +
    [0, 1, 2, 3, 5].map(p => '<tr><th>' + PERSONS[p] + '</th><td>' + esc(conjForm(v, 'perf', p)) + '</td>' + (sv.refl ? '' : '<td>' + esc(conjForm(v, 'imp', p) || '') + '</td>') + '</tr>').join('') + '</tbody></table></div>';
  return h + '<p class="muted small pad">Hervorgehoben: Formen, die vom regelmäßigen Muster abweichen. Grau: vosotros, nur in Spanien.</p>';
};

// ---------- Lektion ----------
ACT.lesson = el => push('lesson', el.dataset.id);
SUB.lesson = function (id) {
  const l = GRAMMAR.find(x => x.id === id), st = grSt(id), i = GRAMMAR.indexOf(l);
  const g = S.gr[id] || (S.gr[id] = {st: 0, read: 0, ses: []});
  if (!g.read) { g.read = 1; touch('core'); }
  const acts = '<div class="row"><button class="btn" data-a="startLesson" data-id="' + id + '">Üben</button>' + (st < 2 ? '<button class="btn ghost" data-a="startTest" data-id="' + id + '">Einstufungstest</button>' : '') + '</div>';
  return head(l.title, 'Lektion ' + (i + 1) + ' · ' + GR_LABEL[st], true) + acts + (st < 2 ? '<p class="muted small">Kennst Du das Thema schon? Mit 90 % im Einstufungstest überspringst Du die Lektion.</p>' : '') +
    '<article class="lesson-body">' + blocks(l.body) + '</article><button class="btn big" data-a="startLesson" data-id="' + id + '">Jetzt üben</button>';
};
function drillSize() { return ({30: 10, 45: 12, 60: 15})[S.set.budget] || 12; }
function beginDrill(items, meta) {
  if (!items.length) { toast('Für diese Übung gibt es noch keine Aufgaben.'); return; }
  startDrill(items, meta); Drill.input = '';
  View.stack = View.stack.filter(v => v.name !== 'drillEnd' && v.name !== 'drill');
  push('drill');
}
ACT.startLesson = el => { const l = GRAMMAR.find(x => x.id === el.dataset.id); beginDrill(buildLessonDrill(l, drillSize()), {mode: 'lesson', ref: l.id, title: l.title}); };
ACT.startTest = el => { const l = GRAMMAR.find(x => x.id === el.dataset.id); beginDrill(buildLessonDrill(l, 10), {mode: 'test', ref: l.id, title: 'Einstufung: ' + l.title}); };
ACT.startMix = () => { View.tab = 'grammatik'; View.stack = []; beginDrill(buildMixDrill(drillSize()), {mode: 'mix', ref: '', title: 'Gemischter Drill'}); };

// ---------- Basiswissen ----------
ACT.basic = el => push('basic', el.dataset.id);
SUB.basic = function (id) {
  const t = BASICS.find(x => x.id === id), has = t.gen || t.pairs;
  return head(t.title, t.sub, true) + '<article class="lesson-body">' + blocks(t.body) + '</article>' + (has ? '<button class="btn big" data-a="startBasic" data-id="' + id + '">Abfragen</button>' : '');
};
ACT.startBasic = el => { const t = BASICS.find(x => x.id === el.dataset.id); beginDrill(buildBasicDrill(t, Speech.ok), {mode: 'basic', ref: t.id, title: t.title}); };

// ---------- Übung ----------
const ACCENTS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'];
SUB.drill = function () {
  if (!Drill || !Drill.items[Drill.i]) return '<section class="pad"><p>Die Übung ist beendet.</p><button class="btn" data-a="back">Zurück</button></section>';
  const it = Drill.items[Drill.i], ans = Drill.answered, typed = it.type === 'conj' || it.type === 'f';
  let h = '<header class="sbar"><button class="iconbtn" data-a="quitDrill" aria-label="Übung abbrechen">' + icon('x') + '</button>' + bar(Drill.i, Drill.items.length, 'thin') + '<span class="muted">' + Math.min(Drill.i + 1, Drill.items.length) + ' / ' + Drill.items.length + '</span></header>';
  h += '<article class="dq"><p class="eyebrow">' + esc(Drill.title) + (it.retry ? ' · Wiederholung' : '') + '</p>';
  let right = '';
  if (it.type === 'conj') {
    const p = conjPrompt(it); right = it.a[0];
    h += '<h1 class="hw">' + esc(p.verb) + '</h1>' + (p.de ? '<p class="muted">' + esc(p.de) + '</p>' : '') + '<p class="ask"><span class="chip">' + esc(p.tense) + '</span><span class="chip sunny">' + esc(p.who) + '</span></p>';
  } else if (it.type === 'f') {
    right = it.reveal ? it.reveal + ' = ' + it.a[0] : it.a[0];
    h += (it.hint ? '<p class="muted">' + esc(it.hint) + '</p>' : '') + (it.say ? '<p class="q">' + esc(it.q) + '</p><button class="btn ghost" data-a="say" data-t="' + esc(it.say) + '">' + icon('spk') + ' Nochmal hören</button>' : '<p class="q">' + esc(it.q).replace(/___/g, '<span class="gap"></span>') + '</p>');
  } else if (it.type === 'c') {
    right = it.opts[it.ai];
    h += '<p class="q">' + esc(it.q).replace(/___/g, '<span class="gap">' + (ans !== null ? esc(right) : '') + '</span>') + '</p><div class="opts">' + it.opts.map((o, i) =>
      '<button class="opt' + (ans !== null ? (i === it.ai ? ' ok' : (Drill.picked === i ? ' bad' : '')) : '') + '" data-a="pick" data-i="' + i + '"' + (ans !== null ? ' disabled' : '') + '>' + esc(o) + '</button>').join('') + '</div>';
  } else {
    right = it.a[0];
    h += '<p class="muted">' + esc(it.hint || 'Sag es laut auf Spanisch, dann vergleiche.') + '</p><p class="q">' + esc(it.q) + '</p>';
    if (Drill.shown || ans !== null) h += '<p class="sol"><span class="es">' + esc(right) + '</span>' + spk(right) + '</p>';
  }
  if (typed) {
    h += '<form class="ansf" data-f="answer"><input class="inp ans' + (ans === null ? '' : ans === 2 ? ' ok' : ans === 1 ? ' near' : ' bad') + '" id="ans" type="' + (it.num ? 'text" inputmode="numeric' : 'text') + '" value="' + esc(Drill.input || '') + '"' +
      (ans !== null ? ' readonly' : ' data-autofocus') + ' autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="' + (it.num ? 'Zahl' : 'Antwort auf Spanisch') + '"></form>';
    if (ans === null && !it.num) h += '<div class="acc">' + ACCENTS.map(a => '<button data-a="acc" data-c="' + a + '" tabindex="-1">' + a + '</button>').join('') + '</div>';
  }
  if (ans !== null) {
    const cls = ans === 2 ? 'ok' : ans === 1 ? 'near' : 'bad';
    h += '<div class="fb ' + cls + '"><b>' + (ans === 2 ? 'Richtig' : ans === 1 ? 'Fast: Achte auf den Akzent' : 'Nicht ganz') + '</b>' + (ans !== 2 && it.type !== 's' && it.type !== 'c' ? '<p class="es">' + esc(right) + spk(right) + '</p>' : '') + (it.ex ? '<p class="small">' + esc(it.ex) + '</p>' : '') + '</div>';
  }
  h += '</article><footer class="fbar">';
  if (ans !== null) h += '<button class="btn big" data-a="drillNext" data-autofocus>Weiter</button>';
  else if (typed) h += '<button class="btn big" data-a="check">Prüfen</button><button class="linkbtn center" data-a="giveUp">Weiß ich nicht</button>';
  else if (it.type === 's') h += Drill.shown ? '<div class="rate two"><button class="rb again" data-a="selfNo"><b>Nicht gewusst</b></button><button class="rb good" data-a="selfYes"><b>Gewusst</b></button></div>' : '<button class="btn big" data-a="showSol" data-autofocus>Lösung zeigen</button>';
  return h + '</footer>';
};
function drillAnswer(res) { answerDrill(res); render(); const it = Drill.items[Drill.i]; if (it.type !== 's' && res < 2) Speech.say(it.type === 'c' ? '' : it.a[0]); }
ACT.check = () => { const el = $('#ans'); if (!el || Drill.answered !== null) return; const v = el.value; if (!v.trim()) { el.focus(); return; } Drill.input = v; const it = Drill.items[Drill.i]; drillAnswer(checkAnswer(v, it.a)); };
ACT.giveUp = () => { if (Drill.answered === null) { Drill.input = ''; drillAnswer(0); } };
ACT.pick = el => { if (Drill.answered !== null) return; const i = +el.dataset.i, it = Drill.items[Drill.i]; Drill.picked = i; drillAnswer(i === it.ai ? 2 : 0); };
ACT.showSol = () => { Drill.shown = true; rerender(); };
ACT.selfYes = () => drillAnswer(2);
ACT.selfNo = () => drillAnswer(0);
ACT.acc = el => { const i = $('#ans'); if (!i) return; const s = i.selectionStart == null ? i.value.length : i.selectionStart, e = i.selectionEnd == null ? s : i.selectionEnd; i.value = i.value.slice(0, s) + el.dataset.c + i.value.slice(e); try { i.focus(); i.setSelectionRange(s + 1, s + 1); } catch (x) {} };
ACT.drillNext = () => {
  Drill.input = ''; Drill.shown = false; Drill.picked = null;
  if (nextDrillItem()) { render(); const it = Drill.items[Drill.i]; if (it.say) Speech.say(it.say); }
  else { const r = finishDrill(), meta = {mode: Drill.mode, ref: Drill.ref, title: Drill.title}; Drill = null; View.stack.pop(); flushLocal(); Cloud.push(); push('drillEnd', {r: r, meta: meta}); }
};
ACT.quitDrill = () => { Drill = null; back(); };
SUB.drillEnd = function (x) {
  const r = x.r, m = x.meta;
  let h = '<section class="endv">' + sunDial(r.pct / 100) + '<h1>' + r.pct + ' % richtig</h1><p>' + r.right + ' von ' + r.total + ' beim ersten Versuch.</p><p class="note">' + esc(r.msg) + '</p>';
  if (r.wrong.length) h += '<h2>Zum Nachlesen</h2><ul class="wrong">' + r.wrong.map(it => '<li>' + (it.type === 'conj' ? esc(it.verb + ', ' + (TENSE[it.tense] || '') + ', ' + conjPrompt(it).who) : esc(it.q)) + '<b>' + esc(it.type === 'c' ? it.opts[it.ai] : it.a[0]) + '</b></li>').join('') + '</ul>';
  h += '<div class="row">' + (m.mode === 'lesson' || m.mode === 'test' ? '<button class="btn ghost" data-a="startLesson" data-id="' + m.ref + '">Nochmal üben</button>' : m.mode === 'basic' ? '<button class="btn ghost" data-a="startBasic" data-id="' + m.ref + '">Nochmal</button>' : '<button class="btn ghost" data-a="startMix">Nochmal</button>') +
    '<button class="btn" data-a="drillDone">Fertig</button></div></section>';
  return h;
};
ACT.drillDone = () => { View.stack.pop(); render(); };
