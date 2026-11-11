// Ansichten: Heute, Karten, Lernsitzung.

// ---------- Heute ----------
function sunDial(p) {
  const n = 16, lit = Math.round(n * p);
  let rays = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2, long = i % 2 === 0;
    const r1 = 41, r2 = long ? 56 : 50;
    rays += '<line class="ray' + (i < lit ? ' lit' : '') + '" x1="' + round(60 + r1 * Math.cos(a), 1) + '" y1="' + round(60 + r1 * Math.sin(a), 1) + '" x2="' + round(60 + r2 * Math.cos(a), 1) + '" y2="' + round(60 + r2 * Math.sin(a), 1) + '"/>';
  }
  return '<svg class="sun' + (p >= 1 ? ' full' : '') + '" viewBox="0 0 120 120" role="img" aria-label="Tagesfortschritt ' + Math.round(p * 100) + ' Prozent">' + rays +
    '<circle class="disc" cx="60" cy="60" r="33"/><circle class="arc" cx="60" cy="60" r="33" pathLength="100" stroke-dasharray="' + round(p * 100, 1) + ' 100" transform="rotate(-90 60 60)"/></svg>';
}
TABS.heute = function () {
  if (!S.set.onb) return onboarding();
  const td = today(), pi = planInfo(), T = tasksFor(td), pr = dayProgress(td), st = streak(), ph = PHASES[pi.phase - 1];
  const p = pr.total ? pr.done / pr.total : 1;
  const left = pi.daysLeft > 0 ? 'Noch ' + pi.daysLeft + (pi.daysLeft === 1 ? ' Tag' : ' Tage') + ' bis zum Abflug' : pi.daysLeft === 0 ? 'Heute geht es los. ¡Buen viaje!' : 'Du bist unterwegs. Weiter so.';
  let h = installHint() + '<section class="hero"><div class="dial">' + sunDial(p) + '<div class="dial-n"><b>' + pr.done + '</b><span>von ' + pr.total + ' Min</span></div></div>' +
    '<div class="hero-t"><p class="eyebrow">' + esc(fmtDate(td)) + '</p><h1>' + (pr.all ? 'Hecho. Geschafft für heute.' : 'Tu plan de hoy') + '</h1><p class="muted">' + esc(left) + '</p>' +
    '<p class="chips"><span class="chip">Woche ' + pi.week + ' von ' + pi.weeks + '</span>' + (st > 0 ? '<span class="chip sunny">' + st + (st === 1 ? ' Tag' : ' Tage') + ' in Folge</span>' : '') + '</p></div></section>';
  h += '<section class="tasks">' + T.map(t =>
    '<button class="task' + (t.done ? ' done' : '') + '" data-a="task" data-go="' + esc(t.go) + '"><span class="chk">' + icon('check') + '</span><span class="t-main"><b>' + esc(t.title) + '</b><small>' + esc(t.sub) + '</small></span>' +
    '<span class="t-min">' + (t.optional ? 'frei' : t.min + ' Min') + '</span></button>').join('') + '</section>';
  h += backupHint();
  if (pr.all) h += '<section class="card soft"><h2>Noch Lust?</h2><p>Hör weiter Spanisch oder blättere durch ein Deck. Mehr neue Karten bringt heute wenig: Sie kommen morgen von selbst.</p></section>';
  h += '<section class="card"><h2>Tempo</h2><p><b>' + S.set.npd + ' neue Karten pro Tag</b>' + (S.set.auto ? ', automatisch angepasst.' : ', fest eingestellt.') + '</p>' +
    (S.ad.note ? '<p class="note">' + esc(S.ad.note) + '</p>' : '<p class="muted small">Die App passt das Tempo an Deine Trefferquote und Deine Zeit an.</p>') + '</section>';
  h += '<section class="card"><h2>' + esc(ph.name) + '</h2><p class="muted small">' + esc(ph.weeks) + '</p><p>' + esc(ph.focus) + '</p>' +
    '<p class="small">Grammatik: ' + pi.done + ' von ' + GRAMMAR.length + ' Lektionen bestanden' + (pi.behind >= 2 ? ', ' + pi.behind + ' hinter dem Plan.' : pi.behind <= -2 ? ', ' + (-pi.behind) + ' vor dem Plan.' : ', im Plan.') + '</p></section>';
  return h;
};
// iPhone: Nur die App auf dem Home-Bildschirm speichert dauerhaft und hat einen eigenen Speicher. Deshalb erst installieren, dann lernen.
const APP_URL = 'https://fabianklauke2001-cpu.github.io/Spanisch/';
function installHint() {
  // Die Artifact-Fassung in Claude speichert nicht verlässlich: dort auf die eigenständige App verweisen
  if (BUILD === 'artifact') return '<section class="card warnbox"><h2>Bitte die neue App nutzen</h2><p class="small">Diese Fassung in Claude speichert Deinen Fortschritt nicht verlässlich. Die neue App läuft ohne Claude und auch ohne Internet.</p>' +
    link('Neue App öffnen', APP_URL, 'Am iPhone in Safari öffnen, dann zum Home-Bildschirm hinzufügen') + '</section>';
  if (!Device.needsInstall()) return '';
  return '<section class="card warnbox"><h2>Erst zum Home-Bildschirm hinzufügen</h2>' +
    '<ol class="steps"><li>Tipp in Safari auf das <b>Teilen-Symbol</b> (Quadrat mit Pfeil nach oben).</li><li>Wähl <b>Zum Home-Bildschirm</b> und bestätige.</li><li>Öffne die App ab jetzt immer über das neue Icon.</li></ol>' +
    '<p class="small">Nur dort bleibt Dein Lernstand dauerhaft gespeichert und die App läuft ohne Internet. Fehlt der Menüpunkt, öffne diese Seite zuerst direkt in Safari.</p></section>';
}
function backupHint() {
  if (!Device.backupDue()) return '';
  const last = Device.lastBackup(), days = last ? Math.floor((nowMs() - last) / DAY_MS) : 0;
  return '<section class="card soft"><h2>Zeit für ein Backup</h2><p class="small">' + (last ? 'Dein letztes Backup ist ' + days + ' Tage alt.' : 'Dein Lernstand liegt nur auf diesem Gerät.') +
    ' Sichere ihn als Datei, zum Beispiel in iCloud. Geht das Handy verloren, lädst Du das Backup auf dem neuen Gerät.</p>' +
    '<div class="row"><button class="btn" data-a="export">Backup speichern</button><button class="btn ghost" data-a="bkLater">Später</button></div></section>';
}
ACT.bkLater = () => { Device.snoozeBackup(); rerender(); };
function onboarding() {
  const b = S.set.budget;
  if (Device.needsInstall() && !View.skipInstall) {
    return '<section class="onb"><p class="eyebrow">Rumbo Sur</p><h1>Dein Spanisch für Mittelamerika und Patagonien</h1>' + installHint() +
      '<button class="linkbtn" data-a="skipInstall">Trotzdem hier im Browser starten</button></section>';
  }
  return '<section class="onb"><p class="eyebrow">Rumbo Sur</p><h1>Dein Spanisch für Mittelamerika und Patagonien</h1>' + (BUILD === 'artifact' ? installHint() : '') +
    '<p>Jeden Tag zeigt Dir die App, was dran ist: Karten, Grammatik, Hören, Sprechen. Sie merkt sich, was Du kannst, und passt das Tempo an.</p>' +
    '<h2>Wie viel Zeit hast Du pro Tag?</h2><div class="seg" role="group">' + [30, 45, 60].map(x => '<button data-a="setBudget" data-v="' + x + '" class="' + (b === x ? 'on' : '') + '">' + x + ' Min</button>').join('') + '</div>' +
    '<h2>Wann fliegst Du?</h2><input class="inp" type="date" id="onb-dep" value="' + esc(S.set.dep) + '">' +
    '<ul class="plain"><li><b>Karten</b> täglich, der Rest wechselt über die Woche.</li><li><b>Kenne ich schon</b> überspringt, was Du aus der Schule weißt.</li><li><b>Fortschritt</b> ' + (BUILD === 'artifact' ? 'wird gespeichert, auf dem Handy und am Laptop.' : 'wird auf diesem Gerät gespeichert. Die App läuft auch ohne Internet.') + '</li></ul>' +
    (Cloud.status === 'loading' ? '<button class="btn big" disabled>Gespeicherter Fortschritt wird gesucht</button>' : '<button class="btn big" data-a="startApp">Los geht\'s</button>') + '</section>';
}
ACT.setBudget = el => { S.set.budget = +el.dataset.v; S.set.at = nowMs(); if (!S.set.onb || S.set.auto) S.set.npd = defaultPace(S.set.budget); touch('core'); rerender(); };
ACT.skipInstall = () => { View.skipInstall = true; rerender(); };
ACT.startApp = () => {
  const d = $('#onb-dep'); if (d && d.value) S.set.dep = d.value;
  S.set.onb = true; S.set.start = dayStr(today()); S.set.npd = defaultPace(S.set.budget); S.set.at = nowMs();
  touch('core'); render();
  if (BUILD !== 'artifact') Device.persist();
};
ACT.task = el => {
  const g = el.dataset.go;
  if (g === 'cards') return ACT.startCards();
  if (g === 'mix') return ACT.startMix();
  if (g === 'praxis') return go('praxis');
  if (g.indexOf('lesson:') === 0) { View.tab = 'grammatik'; View.stack = []; push('lesson', g.slice(7)); }
};

// ---------- Karten ----------
TABS.karten = function () {
  const dc = dueCounts(), due = dc.rev + dc.learn, fresh = dc.newLeft + dc.prodLeft;
  let h = head('Karten', dc.seenR + ' von ' + CARDS.length + ' gelernt, ' + dc.mature + ' sitzen');
  h += '<section class="card cta">' + (F ? '' : '<p class="note">Der Wiederholungsplaner konnte nicht geladen werden. Lade die Seite neu.</p>') +
    '<div class="stats3"><div><b>' + due + '</b><span>fällig</span></div><div><b>' + dc.newLeft + '</b><span>neu</span></div><div><b>' + dc.prodLeft + '</b><span>Rückrichtung</span></div></div>' +
    '<button class="btn big" data-a="startCards"' + (due + fresh === 0 || !F ? ' disabled' : '') + '>' + (due + fresh === 0 ? 'Für heute erledigt' : 'Jetzt lernen') + '</button>' +
    (due + fresh === 0 && dc.unseen > 0 ? '<button class="btn ghost" data-a="moreNew">Trotzdem 5 neue Karten</button>' : '') + '</section>';
  h += '<input class="inp" type="search" id="card-q" data-i="cardSearch" placeholder="Wort suchen, spanisch oder deutsch" value="' + esc(View.q) + '" autocomplete="off">';
  h += '<div id="card-list">' + cardListHtml() + '</div>';
  return h;
};
function cardListHtml() {
  const q = unaccent(View.q || '');
  if (q.length >= 2) {
    const hits = CARDS.filter(c => unaccent(c.es).indexOf(q) >= 0 || unaccent(c.de).indexOf(q) >= 0).slice(0, 40);
    return hits.length ? '<ul class="clist">' + hits.map(cardRow).join('') + '</ul>' : '<p class="muted pad">Nichts gefunden.</p>';
  }
  let h = '';
  const names = ['', 'Stufe 1: Basis', 'Stufe 2: Reisealltag', 'Stufe 3: Ausbau', 'Stufe 4: Vertiefung'];
  for (let ph = 1; ph <= 4; ph++) {
    h += '<h2 class="sec">' + names[ph] + '</h2><ul class="decks">' + DECKS.filter(d => d.phase === ph).map(d => {
      const st = deckStats(d), pinned = S.pri.indexOf(d.id) >= 0;
      return '<li><button class="deck" data-a="openDeck" data-id="' + d.id + '"><span class="d-name">' + esc(d.name) + '</span>' + bar(st.seen, st.total) + '<span class="d-n">' + st.seen + ' / ' + st.total + '</span></button>' +
        '<button class="pinbtn' + (pinned ? ' on' : '') + '" data-a="pin" data-id="' + d.id + '" aria-pressed="' + pinned + '" aria-label="' + esc(d.name) + ' vorziehen">' + icon('pin') + '</button></li>';
    }).join('') + '</ul>';
  }
  return h + '<p class="muted small pad">Stern: Dieses Deck kommt bei neuen Karten zuerst dran.</p>';
}
function cardRow(c) {
  const st = cardStatus(c.id);
  return '<li><button class="crow" data-a="card" data-id="' + c.id + '"><span class="dot ' + st.cls + '"></span><span class="c-es">' + headword(c) + '</span><span class="c-de">' + esc(c.de) + '</span></button></li>';
}
ACT.cardSearch = el => { View.q = el.value; $('#card-list').innerHTML = cardListHtml(); };
ACT.pin = el => { const id = el.dataset.id, i = S.pri.indexOf(id); if (i >= 0) S.pri.splice(i, 1); else S.pri.push(id); touch('core'); rerender(); };
ACT.openDeck = el => push('deck', el.dataset.id);
ACT.moreNew = () => { const d = dayRW(); d.n = Math.max(0, d.n - 5); S.ad.pause = 0; touch('days', 'core'); ACT.startCards(); };
SUB.deck = function (id) {
  const d = DECKS.find(x => x.id === id), st = deckStats(d);
  return head(d.name, st.seen + ' von ' + st.total + ' gelernt', true) + '<ul class="clist">' + d.cards.map(cardRow).join('') + '</ul>';
};
function verbFormsHtml(c) {
  if (c.t !== 'v') return '';
  const pp = principalParts(c.es.split(' ')[0]); if (!pp) return '';
  return '<div class="forms">' + (pp.regular ? '<span class="chip">regelmäßig, -' + pp.grp + '</span>' : pp.parts.map(p => '<span class="form"><i>' + p[0] + '</i> ' + esc(p[1]) + '</span>').join('')) +
    '<button class="linkbtn" data-a="verb" data-v="' + esc(c.es.split(' ')[0]) + '">Alle Formen</button></div>';
}
function cardBackHtml(c) {
  return (c.ex ? '<p class="ex"><span class="es">' + esc(c.ex) + '</span>' + spk(c.ex) + '<span class="de">' + esc(c.exd) + '</span></p>' : '') +
    (c.note ? '<p class="cnote">' + esc(c.note) + '</p>' : '') + verbFormsHtml(c);
}
ACT.card = el => {
  const c = CARD_BY_ID[el.dataset.id], a = S.cards[c.id], st = cardStatus(c.id);
  const when = a ? (isLearning(a) ? 'In der Lernphase.' : 'Nächste Wiederholung: ' + fmtShort(dayIdx(fromMin(a[1]))) + '.') : 'Noch nicht gelernt.';
  openSheet('<p class="eyebrow">' + TYPE_LABEL[c.t] + ' · ' + esc(DECKS[c.deck].name) + '</p><h2 class="hw">' + headword(c) + spk(c.es) + '</h2><p class="tr">' + esc(c.de) + '</p>' + cardBackHtml(c) +
    '<p class="muted small"><span class="dot ' + st.cls + '"></span> ' + st.label + '. ' + when + '</p>' +
    '<div class="row">' + (a ? '<button class="btn ghost" data-a="resetCard" data-id="' + c.id + '">Neu lernen</button>' : '<button class="btn ghost" data-a="knownCard" data-id="' + c.id + '">Kenne ich schon</button>') + '<button class="btn" data-a="closeSheet">Schließen</button></div>');
};
ACT.resetCard = el => { const id = el.dataset.id; delete S.cards[id]; delete S.cards[id + '~']; touch(cardPart(id)); closeSheet(); rerender(); };
ACT.knownCard = el => { markKnown(el.dataset.id); closeSheet(); rerender(); };
ACT.verb = el => { closeSheet(); push('verb', el.dataset.v); };

// ---------- Lernsitzung ----------
ACT.startCards = () => {
  if (!F) { toast('Planer nicht geladen. Bitte Seite neu laden.'); return; }
  startSession(); View.stack = [];
  const k = nextCard();
  if (!k) { markCardsDone(); toast('Keine Karten fällig.'); render(); return; }
  Session.cur = k; Session.rev = false; Session.shownAt = nowMs();
  push('session');
};
function sessionAdvance() {
  const k = nextCard();
  if (!k) { endSession(); return; }
  Session.cur = k; Session.rev = false; Session.shownAt = nowMs(); render();
}
function endSession() {
  const dc = dueCounts(), left = dc.learn + dc.rev + dc.newLeft + dc.prodLeft;
  if (left === 0) markCardsDone();
  const done = Session ? Session.done : 0, again = Session ? Session.again : 0;
  Session = null; View.stack = [];
  flushLocal(); Cloud.push();
  push('sessionEnd', {done: done, again: again, left: left});
}
SUB.session = function () {
  if (!Session || !Session.cur) return '<section class="pad"><p>Die Sitzung ist beendet.</p><button class="btn" data-a="home">Zur Übersicht</button></section>';
  const k = Session.cur, prod = k.charAt(k.length - 1) === '~', c = CARD_BY_ID[prod ? k.slice(0, -1) : k], isNew = !S.cards[k], rev = Session.rev;
  const iv = rev ? previewIntervals(k) : null;
  let h = '<header class="sbar"><button class="iconbtn" data-a="quitSession" aria-label="Sitzung beenden">' + icon('x') + '</button><span class="muted">noch ' + remainingCount() + '</span>' +
    '<button class="iconbtn" data-a="undo" aria-label="Rückgängig"' + (Session.undo ? '' : ' disabled') + '>' + icon('undo') + '</button></header>';
  h += '<article class="fc"><p class="eyebrow">' + (prod ? 'Deutsch → Spanisch' : 'Spanisch → Deutsch') + ' · ' + TYPE_LABEL[c.t] + (isNew ? ' <span class="badge">neu</span>' : '') + '</p>';
  if (!prod) {
    h += '<h1 class="hw">' + headword(c) + spk(c.es) + '</h1>';
    if (rev) h += '<hr><p class="tr">' + esc(c.de) + '</p>' + cardBackHtml(c);
  } else {
    h += '<h1 class="hw de">' + esc(c.de) + '</h1>';
    if (rev) h += '<hr><p class="tr es">' + headword(c) + spk(c.es) + '</p>' + cardBackHtml(c);
    else if (c.t === 'n') h += '<p class="muted small">Mit Artikel.</p>';
  }
  h += '</article><footer class="fbar">';
  if (!rev) h += '<button class="btn big" data-a="reveal" data-autofocus>Antwort zeigen</button>';
  else {
    h += '<div class="rate">' + [['Nochmal', 'again'], ['Schwer', 'hard'], ['Gut', 'good'], ['Leicht', 'easy']].map((x, i) => '<button class="rb ' + x[1] + '" data-a="rate" data-g="' + (i + 1) + '"><b>' + x[0] + '</b><small>' + iv[i] + '</small></button>').join('') + '</div>';
    if (isNew && !prod) h += '<button class="linkbtn center" data-a="known">Kenne ich sicher, überspringen</button>';
  }
  return h + '</footer>';
};
ACT.reveal = () => { if (Session) { Session.rev = true; rerender(); } };
ACT.rate = el => { if (!Session || !Session.cur) return; rateCard(Session.cur, +el.dataset.g); Session.cur = null; sessionAdvance(); };
ACT.known = () => { if (!Session || !Session.cur) return; markKnown(Session.cur); Session.cur = null; sessionAdvance(); };
ACT.undo = () => { if (Session && undoLast()) sessionAdvance(); };
ACT.quitSession = () => endSession();
SUB.sessionEnd = function (r) {
  const d = dayRO();
  return '<section class="endv">' + sunDial(r.left === 0 ? 1 : 0.5) + '<h1>' + (r.left === 0 ? 'Karten für heute erledigt' : 'Sitzung beendet') + '</h1>' +
    '<p>' + r.done + ' Karten bewertet' + (r.again ? ', ' + r.again + ' davon nochmal.' : '.') + ' Heute insgesamt ' + Math.round(d.tc / 60) + ' Minuten mit Karten.</p>' +
    (r.left ? '<p class="muted">Noch ' + r.left + ' für heute übrig.</p><button class="btn big" data-a="startCards">Weiterlernen</button>' : '<p class="muted">Die nächsten Wiederholungen kommen morgen.</p>') +
    '<button class="btn ' + (r.left ? 'ghost' : 'big') + '" data-a="home">Zur Übersicht</button></section>';
};
ACT.home = () => go('heute');
