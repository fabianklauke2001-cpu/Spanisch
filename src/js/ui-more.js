// Ansichten: Praxis (Hören, Sprechen), Fortschritt, Einstellungen. Start der App.

// ---------- Praxis ----------
function promptOfDay(off) {
  const pi = planInfo(), list = PROMPTS[pi.phase - 1];
  return list[(today() + (off || 0)) % list.length];
}
TABS.praxis = function () {
  const d = dayRO(), lv = RES.levels[clamp(S.li.level, 0, 2)], lt = RES.lt;
  const logBtns = (act, arr) => '<div class="logrow">' + arr.map(m => '<button class="chipbtn" data-a="' + act + '" data-m="' + m + '">+' + m + ' Min</button>').join('') + '</div>';
  let h = head('Praxis', 'Hören und Sprechen passieren außerhalb der App. Hier findest Du den Einstieg und trägst Deine Minuten ein.');
  h += '<h2 class="sec">Hören</h2>';
  h += '<section class="card"><h3>' + esc(lt.name) + '</h3><p class="small">' + esc(lt.note) + '</p>' + lt.links.map(l => link(l[0], l[1])).join('') +
    '<div class="counter"><span>Ich bin bei Lektion</span><button class="stepbtn" data-a="ltStep" data-d="-1" aria-label="Eine Lektion zurück">−</button><b>' + S.li.lt + '</b><button class="stepbtn" data-a="ltStep" data-d="1" aria-label="Eine Lektion weiter">+</button><span>von ' + lt.total + '</span></div>' +
    bar(S.li.lt, lt.total) + '<p class="small muted">Heute eingetragen: ' + d.tt + ' Min</p>' + logBtns('logLt', [5, 10, 15, 20]) + '</section>';
  h += '<section class="card"><div class="lvl"><div><h3>Dein Hörniveau: ' + esc(lv.name) + '</h3><p class="small">' + esc(lv.hint) + '</p></div>' +
    '<div class="lvlbtn"><button class="stepbtn" data-a="lvl" data-d="-1" aria-label="Leichter"' + (S.li.level <= 0 ? ' disabled' : '') + '>−</button><button class="stepbtn" data-a="lvl" data-d="1" aria-label="Schwerer"' + (S.li.level >= 2 ? ' disabled' : '') + '>+</button></div></div>' +
    '<h4>Videos</h4>' + lv.video.map(l => link(l[0], l[1], l[2])).join('') + '<h4>Podcasts</h4>' + lv.pod.map(l => link(l[0], l[1], l[2])).join('') +
    '<p class="small muted">Heute eingetragen: ' + d.tl + ' Min</p>' + logBtns('logLi', [5, 10, 15, 20, 30]) +
    (View.askFb ? '<div class="fbask"><p><b>Wie gut hast Du es verstanden?</b></p><div class="logrow"><button class="chipbtn" data-a="liFb" data-v="easy">Zu leicht</button><button class="chipbtn" data-a="liFb" data-v="ok">Passt</button><button class="chipbtn" data-a="liFb" data-v="hard">Zu schwer</button></div></div>' : '') + '</section>';
  h += '<h2 class="sec">Sprechen</h2>';
  h += '<section class="card"><h3>Frage des Tages</h3><p class="q">' + esc(promptOfDay(View.pOff)) + '</p><p class="small">Sprich zwei Minuten laut, ohne anzuhalten. Fehlt ein Wort, umschreib es. Dann noch einmal, flüssiger.</p>' +
    '<p class="small muted">Heute eingetragen: ' + d.ts + ' Min</p>' + logBtns('logSp', [2, 5, 10]) + '<button class="linkbtn" data-a="otherPrompt">Andere Frage</button></section>';
  h += '<section class="card"><h3>Rollenspiele mit einer KI</h3><p class="small">Kopier einen Auftrag und füg ihn in eine kostenlose KI-App mit Sprachmodus ein. Sprich, statt zu tippen.</p><ul class="rp">' +
    ROLEPLAYS.map((r, i) => '<li><span>' + esc(r[0]) + '</span><button class="chipbtn" data-a="copyRp" data-i="' + i + '">' + icon('copy') + ' Kopieren</button></li>').join('') + '</ul></section>';
  h += '<section class="card"><h3>Fragen für Deinen Kumpel</h3><p class="small">Bitte ihn, nur Spanisch zu sprechen und Dich zu korrigieren.</p><ul class="exs">' + FRIEND_Q.map(q => '<li><span class="es">' + esc(q) + '</span>' + spk(q) + '</li>').join('') + '</ul></section>';
  return h;
};
function logMin(field, m, msg) { const d = dayRW(); d[field] = Math.max(0, (d[field] || 0) + m); touch('days'); toast(msg); }
ACT.logLt = el => { logMin('tt', +el.dataset.m, el.dataset.m + ' Minuten Language Transfer eingetragen'); rerender(); };
ACT.logLi = el => { logMin('tl', +el.dataset.m, el.dataset.m + ' Minuten Hören eingetragen'); View.askFb = true; rerender(); };
ACT.logSp = el => { logMin('ts', +el.dataset.m, el.dataset.m + ' Minuten Sprechen eingetragen'); dayRW().sp = 1; rerender(); };
ACT.ltStep = el => { S.li.lt = clamp(S.li.lt + (+el.dataset.d), 0, RES.lt.total); touch('core'); rerender(); };
ACT.lvl = el => { S.li.level = clamp(S.li.level + (+el.dataset.d), 0, 2); S.li.fb = []; touch('core'); rerender(); };
ACT.liFb = el => {
  View.askFb = false;
  S.li.fb.push(el.dataset.v); if (S.li.fb.length > 4) S.li.fb.shift();
  const last2 = S.li.fb.slice(-2);
  if (last2.length === 2 && last2[0] === last2[1] && last2[0] !== 'ok') {
    const up = last2[0] === 'easy', nl = clamp(S.li.level + (up ? 1 : -1), 0, 2);
    if (nl !== S.li.level) { S.li.level = nl; S.li.fb = []; toast(up ? 'Zweimal zu leicht: Hörniveau erhöht auf ' + RES.levels[nl].name : 'Zweimal zu schwer: Hörniveau gesenkt auf ' + RES.levels[nl].name); }
  }
  touch('core'); rerender();
};
ACT.otherPrompt = () => { View.pOff = (View.pOff || 0) + 1; rerender(); };
ACT.copyRp = el => copyText(ROLEPLAYS[+el.dataset.i][1], 'Auftrag kopiert');

// ---------- Fortschritt ----------
TABS.fortschritt = function () {
  const pi = planInfo(), dc = dueCounts(), act = recentDays(7, 10), ret = retention(act), wm = weekMinutes(), fc = forecast(7), fmax = Math.max.apply(null, fc.concat([1]));
  const daysLeft = Math.max(0, pi.daysLeft), proj = Math.min(CARDS.length, dc.seenR + Math.round(daysLeft * S.set.npd * 1.3));
  let h = head('Fortschritt', pi.daysLeft > 0 ? 'Noch ' + pi.daysLeft + ' Tage bis zum Abflug' : 'Unterwegs');
  h += '<section class="card"><h2>Karten</h2><div class="stats3"><div><b>' + dc.seenR + '</b><span>gelernt</span></div><div><b>' + dc.mature + '</b><span>sitzen</span></div><div><b>' + (ret === null ? '–' : Math.round(ret * 100) + ' %') + '</b><span>Trefferquote</span></div></div>' +
    bar(dc.seenR, CARDS.length) + '<p class="small">' + dc.seenR + ' von ' + CARDS.length + ' Karten, davon ' + dc.known + ' als bekannt übersprungen und ' + dc.seenP + ' auch in der Rückrichtung.</p>' +
    (daysLeft > 0 ? '<p class="small">Bei diesem Tempo bist Du zum Abflug bei rund <b>' + proj + '</b> Karten. Stufe 1 und 2 (' + DECKS.filter(d => d.phase <= 2).reduce((s, d) => s + d.cards.length, 0) + ' Karten) sind das Ziel bis dahin, der Rest läuft unterwegs weiter.</p>' : '') +
    '<h3>Fällige Wiederholungen, nächste 7 Tage</h3><div class="fcast">' + fc.map((n, i) => '<div><b>' + n + '</b><span class="col"><i style="height:' + Math.max(3, Math.round(100 * n / fmax)) + '%"></i></span><span>' + (i === 0 ? 'heute' : WD[weekdayOf(today() + i)].slice(0, 2)) + '</span></div>').join('') + '</div></section>';
  const tot = Math.max(1, wm.k + wm.g + wm.h + wm.s);
  h += '<section class="card"><h2>Deine Zeit, letzte 7 Tage</h2>' + [['Karten', wm.k], ['Grammatik', wm.g], ['Hören', wm.h], ['Sprechen', wm.s]].map(x =>
    '<div class="trow"><span>' + x[0] + '</span>' + bar(x[1], tot) + '<b>' + Math.round(x[1]) + ' Min</b></div>').join('') +
    '<p class="small muted">Ziel ist eine ausgewogene Mischung. Language Transfer zählt je zur Hälfte als Hören und Sprechen.</p></section>';
  h += '<section class="card"><h2>Grammatik</h2><p>' + pi.done + ' von ' + GRAMMAR.length + ' Lektionen bestanden, ' + GRAMMAR.filter(l => grSt(l.id) === 3).length + ' gemeistert.</p>' + bar(pi.done, GRAMMAR.length) +
    '<p class="small">Language Transfer: Lektion ' + S.li.lt + ' von ' + RES.lt.total + '. Hörniveau: ' + esc(RES.levels[clamp(S.li.level, 0, 2)].name) + '.</p></section>';
  h += '<section class="card"><h2>Tempo</h2><div class="setrow"><span>Automatisch anpassen</span><button class="toggle' + (S.set.auto ? ' on' : '') + '" data-a="toggleAuto" role="switch" aria-checked="' + S.set.auto + '"><i></i></button></div>' +
    '<div class="setrow"><span>Neue Karten pro Tag</span><span class="stepper"><button class="stepbtn" data-a="npd" data-d="-1" aria-label="Weniger">−</button><b>' + S.set.npd + '</b><button class="stepbtn" data-a="npd" data-d="1" aria-label="Mehr">+</button></span></div>' +
    (S.ad.hist.length ? '<ul class="hist">' + S.ad.hist.slice(-3).reverse().map(x => '<li><b>' + fmtShort(x[0]) + '</b> ' + x[1] + ' → ' + x[2] + ': ' + esc(x[3]) + '</li>').join('') + '</ul>' : '<p class="small muted">Noch keine Anpassung. Die App wertet Trefferquote und Kartenzeit der letzten Lerntage aus.</p>') + '</section>';
  h += '<section class="card"><h2>Einstellungen</h2><div class="setrow col"><span>Zeit pro Tag</span><div class="seg" role="group">' + [30, 45, 60].map(x => '<button data-a="setBudget" data-v="' + x + '" class="' + (S.set.budget === x ? 'on' : '') + '">' + x + ' Min</button>').join('') + '</div></div>' +
    '<div class="setrow"><label for="set-dep">Abflug</label><input class="inp narrow" type="date" id="set-dep" data-c="setDep" value="' + esc(S.set.dep) + '"></div>' +
    '<div class="setrow col"><span>Rückrichtung Deutsch → Spanisch</span><div class="seg" role="group">' + [['core', 'Kern'], ['all', 'Alle'], ['off', 'Aus']].map(x => '<button data-a="setProd" data-v="' + x[0] + '" class="' + ((S.set.prod || 'core') === x[0] ? 'on' : '') + '">' + x[1] + '</button>').join('') + '</div>' +
    '<p class="small muted">Kern: Wendungen, Verben und kleine Wörter übst Du in beide Richtungen, Nomen und Adjektive nur Spanisch → Deutsch. „Alle“ verdoppelt etwa die Kartenzeit.</p></div>' +
    '<div class="setrow speakonly"><span>Vorlesetempo</span><span class="stepper"><button class="stepbtn" data-a="rate2" data-d="-0.1" aria-label="Langsamer">−</button><b>' + String(round(S.set.rate || 0.9, 1)).replace('.', ',') + '</b><button class="stepbtn" data-a="rate2" data-d="0.1" aria-label="Schneller">+</button><button class="chipbtn" data-a="say" data-t="Hola, ¿cómo estás? Mañana vamos a la playa.">Test</button></span></div>' +
    '<p class="small muted nospeak">Auf diesem Gerät wurde keine spanische Stimme gefunden. Die Vorlese-Knöpfe sind deshalb ausgeblendet.</p></section>';
  h += '<section class="card"><h2>Sicherung</h2><p id="sync-line" class="small">' + syncText() + '</p><div class="row"><button class="btn ghost" data-a="export">Backup speichern</button><button class="btn ghost" data-a="importOpen">Backup laden</button></div>' +
    (BUILD !== 'artifact' ? '<p class="small muted">Das Backup ist eine kleine Datei mit Deinem Lernstand. Damit ziehst Du auf ein anderes Gerät um, zum Beispiel vom Handy auf den Laptop.</p>' : '') +
    (Device.installEvt ? '<button class="btn ghost" data-a="install">Als App installieren</button>' : '') +
    '<p class="small muted">Version ' + esc(VERSION) + '</p></section>';
  h += '<section class="card"><h2>So funktioniert die App</h2><details><summary>Karten</summary><p class="small">Jede Karte kommt wieder, kurz bevor Du sie vergessen würdest. Bewerte ehrlich: <b>Nochmal</b>, wenn Du es nicht wusstest. <b>Schwer</b>, wenn es lange gedauert hat. <b>Gut</b> ist der Normalfall. <b>Leicht</b> nur, wenn es sofort da war. Neue Karten, die Du sicher kennst, überspringst Du.</p></details>' +
    '<details><summary>Grammatik</summary><p class="small">Erst die Lektion mit der vollständigen Tabelle lesen, dann üben. Ab 80 % ist eine Lektion bestanden und die nächste dran. Zwei starke Durchgänge an verschiedenen Tagen machen sie zu gemeistert. Mit dem Einstufungstest überspringst Du, was Du schon kannst.</p></details>' +
    '<details><summary>Wochenplan</summary><p class="small">Karten täglich. Montag, Mittwoch, Freitag: Grammatik und Language Transfer. Dienstag, Donnerstag: Hören und Sprechen. Samstag: langer Hörblock und gemischter Drill. Sonntag: nur Karten.</p></details>' +
    '<details><summary>Warum so?</summary><p class="small">Die Mischung folgt den vier Strängen nach Paul Nation: verstehen, sprechen, bewusst lernen, flüssig werden. Die Karten nutzen den Algorithmus FSRS. Die Wortauswahl stützt sich auf eine Häufigkeitsliste aus Film-Untertiteln: Die Karten decken 92 % der 500 häufigsten spanischen Wörter ab.</p></details></section>';
  h += '<section class="card"><h2>Zurücksetzen</h2><p class="small">Löscht den gesamten Lernstand ' + (BUILD === 'artifact' ? 'auf allen Geräten' : 'auf diesem Gerät') + '.</p><button class="btn danger" data-a="resetOpen">Alles zurücksetzen</button></section>';
  return h;
};
function syncText() {
  const st = Cloud.status;
  if (BUILD !== 'artifact') {
    const bk = Device.lastBackup(), bkT = bk ? ' Letztes Backup: ' + fmtShort(dayIdx(bk)) : ' Noch kein Backup gespeichert.';
    if (!Store.works) return 'Dieser Browser erlaubt kein Speichern. Lege ein Backup an, bevor Du die App schließt.';
    if (Device.needsInstall()) return 'Dein Fortschritt liegt vorerst im Safari-Speicher. Füg die App zum Home-Bildschirm hinzu, damit er dauerhaft bleibt.' + bkT;
    return 'Dein Fortschritt ist auf diesem Gerät gespeichert' + (Cloud.col ? ', doppelt abgelegt' : '') + (Device.persisted ? ' und vor automatischem Löschen geschützt' : '') + '.' + bkT;
  }
  if (st === 'ok') return 'Dein Fortschritt ist in Deinem Claude-Konto gespeichert und auf allen Geräten verfügbar.';
  if (st === 'saving') return 'Fortschritt wird gespeichert.';
  if (st === 'loading') return 'Fortschritt wird geladen.';
  if (st === 'error') return 'Der Abgleich hat gerade nicht geklappt. Dein Fortschritt liegt auf diesem Gerät und wird beim nächsten Versuch übertragen.';
  return Store.works ? 'Dein Fortschritt liegt nur in diesem Browser. Speichere ab und zu ein Backup.' : 'Dieser Browser erlaubt kein Speichern. Lege ein Backup an, bevor Du die Seite schließt.';
}
ACT.toggleAuto = () => { S.set.auto = !S.set.auto; S.set.at = nowMs(); if (!S.set.auto) S.ad.note = ''; touch('core'); rerender(); };
ACT.npd = el => { const v = clamp(S.set.npd + (+el.dataset.d), 2, 30); if (v !== S.set.npd) { S.set.npd = v; S.set.at = nowMs(); S.ad.chg = today(); S.ad.note = ''; touch('core'); rerender(); } };
ACT.setProd = el => { S.set.prod = el.dataset.v; S.set.at = nowMs(); touch('core'); rerender(); };
ACT.rate2 = el => { S.set.rate = clamp(round((S.set.rate || 0.9) + (+el.dataset.d), 1), 0.7, 1.3); S.set.at = nowMs(); touch('core'); rerender(); };
ACT.setDep = el => { if (el.value) { S.set.dep = el.value; S.set.at = nowMs(); touch('core'); rerender(); } };
ACT.install = async () => { const e = Device.installEvt; if (!e) return; try { e.prompt(); await e.userChoice; } catch (x) {} Device.installEvt = null; rerender(); };
ACT.export = async () => {
  const data = exportState();
  if (BUILD !== 'artifact') {
    const base = 'spanisch-backup-' + dayStr(today()), done = () => { Device.markBackup(); toast('Backup gespeichert'); if (!inFocusMode()) rerender(); };
    // Handy: Teilen-Menü, dort „In Dateien sichern“. Sonst normaler Download.
    try {
      if (navigator.canShare && window.matchMedia('(pointer: coarse)').matches) {
        const files = [new File([data], base + '.json', {type: 'application/json'}), new File([data], base + '.txt', {type: 'text/plain'})];
        for (let i = 0; i < files.length; i++) {
          if (navigator.canShare({files: [files[i]]})) { await navigator.share({files: [files[i]], title: 'Spanisch-Backup'}); done(); return; }
        }
      }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    try {
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], {type: 'application/json'})); a.download = base + '.json';
      document.body.appendChild(a); a.click(); a.remove(); done(); return;
    } catch (e) {}
    copyText(data, 'Backup in die Zwischenablage kopiert'); return;
  }
  const name = 'rumbo-sur-backup-' + dayStr(today()) + '.json';
  try {
    const dl = window.claude && window.claude.use ? await window.claude.use('downloads') : null;
    if (dl) { await dl.save({filename: name, data: data}); toast('Backup gespeichert'); return; }
  } catch (e) { if (e && e.code === 'declined') return; }
  try {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], {type: 'application/json'})); a.download = name;
    if (!window.claude) { document.body.appendChild(a); a.click(); a.remove(); toast('Backup gespeichert'); return; }
  } catch (e) {}
  copyText(data, 'Backup in die Zwischenablage kopiert');
};
ACT.importOpen = () => openSheet('<h2>Backup laden</h2><p class="small">Wähle die Backup-Datei aus oder füg ihren Inhalt ein. Der jetzige Stand wird ersetzt.</p><input class="inp" type="file" id="imp-file" accept=".json,.txt,application/json,text/plain" data-c="impFile">' +
  '<textarea class="ta" id="imp-ta" rows="5" placeholder="Oder Inhalt hier einfügen"></textarea><div class="row"><button class="btn ghost" data-a="closeSheet">Abbrechen</button><button class="btn" data-a="importDo">Laden</button></div>');
ACT.impFile = el => { const f = el.files && el.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { $('#imp-ta').value = String(r.result || ''); }; r.readAsText(f); };
ACT.importDo = () => { const err = importState($('#imp-ta').value.trim()); if (err) { toast(err); return; } closeSheet(); toast('Backup geladen'); Cloud.push(); go('heute'); };
ACT.resetOpen = () => openSheet('<h2>Wirklich alles löschen?</h2><p class="small">Karten, Grammatik und Protokoll werden gelöscht. Tipp vorher auf „Backup speichern“, falls Du unsicher bist.</p><div class="row"><button class="btn ghost" data-a="closeSheet">Abbrechen</button><button class="btn danger" data-a="resetDo">Ja, löschen</button></div>');
ACT.resetDo = () => { Store.backup(); S = freshState(); touch.apply(null, PARTS); flushLocal(); Cloud.push(); closeSheet(); go('heute'); };

// ---------- Ereignisse und Start ----------
document.addEventListener('click', e => {
  const el = e.target.closest ? e.target.closest('[data-a]') : null;
  if (!el || el.disabled) return;
  const f = ACT[el.dataset.a]; if (f) { e.preventDefault(); f(el, e); }
});
document.addEventListener('input', e => { const k = e.target.dataset && e.target.dataset.i; if (k && ACT[k]) ACT[k](e.target); });
document.addEventListener('change', e => { const k = e.target.dataset && e.target.dataset.c; if (k && ACT[k]) ACT[k](e.target); });
document.addEventListener('submit', e => { e.preventDefault(); if (Drill) { if (Drill.answered === null) ACT.check(); else ACT.drillNext(); } });
document.addEventListener('keydown', e => {
  const top = View.stack[View.stack.length - 1], tag = (e.target.tagName || '').toLowerCase();
  if (e.key === 'Escape' && !$('#sheet').hidden) { closeSheet(); return; }
  if (!top || tag === 'input' || tag === 'textarea') return;
  if (top.name === 'session' && Session && Session.cur) {
    if (!Session.rev && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); ACT.reveal(); }
    else if (Session.rev && '1234'.indexOf(e.key) >= 0 && e.key.length === 1) { rateCard(Session.cur, +e.key); Session.cur = null; sessionAdvance(); }
  }
});
window.addEventListener('hashchange', () => { const t = location.hash.slice(1); if (TABS[t] && t !== View.tab && !inFocusMode()) { View.tab = t; View.stack = []; render(); } });
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') { flushLocal(); Cloud.push(); }
  else { if (evalAdapt() && !inFocusMode()) rerender(); if (Cloud.col && !Store.dirty.size && !Cloud.pushing) Cloud.pull(); }
});
window.addEventListener('pagehide', () => flushLocal());

onSync = () => {
  const dot = $('#syncdot'); if (dot) { dot.className = 'sync ' + (Cloud.kind === 'device' ? (Store.works ? 'local' : 'error') : Cloud.status); dot.title = syncText(); }
  const l = $('#sync-line'); if (l) l.textContent = syncText();
  if (!S.set.onb && View.tab === 'heute' && !View.stack.length && $('.onb')) rerender();
};
onRemoteState = () => { evalAdapt(); if (!inFocusMode()) rerender(); else toast(Cloud.kind === 'device' ? 'Aktueller Stand geladen' : 'Fortschritt von einem anderen Gerät übernommen'); };

function boot() {
  const had = Store.load();
  const fs = initFsrs();
  const t = location.hash.slice(1); if (TABS[t]) View.tab = t;
  Device.init();
  Speech.init();
  const start = () => { evalAdapt(); render(); if (!fs) toast('Der Wiederholungsplaner konnte nicht geladen werden.'); };
  if (BUILD !== 'artifact') {
    // Eigenständige App: Fehlt der Hauptspeicher, erst im Zweitspeicher nachsehen, bevor bei null begonnen wird
    if (BUILD === 'pwa' && 'serviceWorker' in navigator && location.protocol !== 'file:') { try { navigator.serviceWorker.register('sw.js').catch(() => {}); } catch (e) {} }
    if (had) { start(); Cloud.init(); if (S.set.onb) Device.persist(); return; }
    let started = false; const once = () => { if (!started) { started = true; start(); if (S.set.onb) Device.persist(); } };
    setTimeout(once, 2500);
    Cloud.init().then(once, once);
    return;
  }
  if (!had && window.claude && window.claude.use) {
    // Neues Gerät: kurz auf den gespeicherten Stand warten, damit nicht bei null begonnen wird
    $('#view').innerHTML = '<section class="pad center"><p class="muted">Dein Fortschritt wird geladen.</p></section>';
    let started = false; const once = () => { if (!started) { started = true; start(); } };
    const prev = onRemoteState; onRemoteState = () => { onRemoteState = prev; if (started) prev(); else once(); };
    setTimeout(once, 6000);
    Cloud.init().then(() => { onRemoteState = prev; once(); });
  } else { start(); Cloud.init(); }
}
boot();
