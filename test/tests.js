// Läuft im selben Kontext wie die App-Logik.
let fails = 0;
function eq(name, got, exp) { if (JSON.stringify(got) !== JSON.stringify(exp)) { fails++; console.log('FEHLER ' + name + ': ' + JSON.stringify(got) + ' statt ' + JSON.stringify(exp)); } }
function ok(name, cond, info) { if (!cond) { fails++; console.log('FEHLER ' + name + (info ? ': ' + info : '')); } }

// 1. Karten
ok('ids eindeutig', new Set(CARDS.map(c => c.id)).size === CARDS.length);
ok('ids ohne Tilde', CARDS.every(c => c.id.indexOf('~') < 0));
ok('verbkarten haben Formen', CARDS.filter(c => c.t === 'v').every(c => hasVerb(c.es.split(' ')[0])), CARDS.filter(c => c.t === 'v' && !hasVerb(c.es.split(' ')[0])).map(c => c.es).join(','));
eq('reihenfolge vollständig', introOrder().length, CARDS.length);

// 2. Zahlen
const N = {0: 'cero', 1: 'uno', 16: 'dieciséis', 21: 'veintiuno', 22: 'veintidós', 30: 'treinta', 31: 'treinta y uno', 99: 'noventa y nueve', 100: 'cien', 101: 'ciento uno', 115: 'ciento quince',
  200: 'doscientos', 500: 'quinientos', 555: 'quinientos cincuenta y cinco', 700: 'setecientos', 900: 'novecientos', 1000: 'mil', 1001: 'mil uno', 1500: 'mil quinientos', 2026: 'dos mil veintiséis',
  21000: 'veintiún mil', 31000: 'treinta y un mil', 100000: 'cien mil', 101000: 'ciento un mil', 250000: 'doscientos cincuenta mil', 999999: 'novecientos noventa y nueve mil novecientos noventa y nueve',
  1000000: 'un millón', 2500000: 'dos millones quinientos mil'};
Object.keys(N).forEach(k => eq('numEs ' + k, numEs(+k), N[k]));
eq('fmtNum', fmtNum(1234567), '1.234.567');

// 3. Uhrzeit
eq('t1', timeEs(1, 0), 'Es la una.'); eq('t2', timeEs(2, 0), 'Son las dos.'); eq('t3', timeEs(3, 15), 'Son las tres y cuarto.');
eq('t4', timeEs(4, 30), 'Son las cuatro y media.'); eq('t5', timeEs(5, 45), 'Son las seis menos cuarto.'); eq('t6', timeEs(12, 45), 'Es la una menos cuarto.');
eq('t7', timeEs(7, 50), 'Son las ocho menos diez.'); eq('t8', timeEs(12, 10), 'Son las doce y diez.'); eq('t9', timeEs(1, 20), 'Es la una y veinte.');

// 4. Verbformen (von Hand notierte Erwartungen, unabhängig von der Referenzbibliothek)
const V = [
  ['ser', 'pres', 0, 'soy'], ['ser', 'pres', 1, 'eres'], ['ser', 'pres', 5, 'son'], ['ser', 'indef', 0, 'fui'], ['ser', 'indef', 2, 'fue'], ['ser', 'imperf', 3, 'éramos'], ['ser', 'subj', 0, 'sea'],
  ['estar', 'pres', 0, 'estoy'], ['estar', 'pres', 2, 'está'], ['estar', 'indef', 0, 'estuve'], ['estar', 'subj', 2, 'esté'],
  ['ir', 'pres', 0, 'voy'], ['ir', 'pres', 3, 'vamos'], ['ir', 'indef', 5, 'fueron'], ['ir', 'imperf', 0, 'iba'], ['ir', 'subj', 1, 'vayas'], ['ir', 'imp', 1, 've'], ['ir', 'impvos', 'vos', 'andá'],
  ['tener', 'pres', 0, 'tengo'], ['tener', 'pres', 1, 'tienes'], ['tener', 'pres', 3, 'tenemos'], ['tener', 'indef', 0, 'tuve'], ['tener', 'fut', 0, 'tendré'], ['tener', 'cond', 2, 'tendría'], ['tener', 'imp', 1, 'ten'], ['tener', 'vos', 'vos', 'tenés'],
  ['hacer', 'pres', 0, 'hago'], ['hacer', 'indef', 0, 'hice'], ['hacer', 'indef', 2, 'hizo'], ['hacer', 'fut', 0, 'haré'], ['hacer', 'imp', 1, 'haz'], ['hacer', 'perf', 0, 'he hecho'],
  ['decir', 'pres', 0, 'digo'], ['decir', 'pres', 2, 'dice'], ['decir', 'indef', 5, 'dijeron'], ['decir', 'fut', 0, 'diré'], ['decir', 'imp', 1, 'di'], ['decir', 'ger', 0, 'estoy diciendo'],
  ['poder', 'pres', 0, 'puedo'], ['poder', 'pres', 3, 'podemos'], ['poder', 'indef', 0, 'pude'], ['poder', 'cond', 1, 'podrías'], ['poder', 'vos', 'vos', 'podés'],
  ['querer', 'pres', 1, 'quieres'], ['querer', 'indef', 0, 'quise'], ['querer', 'fut', 0, 'querré'], ['querer', 'vos', 'vos', 'querés'],
  ['venir', 'pres', 0, 'vengo'], ['venir', 'pres', 1, 'vienes'], ['venir', 'indef', 2, 'vino'], ['venir', 'imp', 1, 'ven'], ['venir', 'impvos', 'vos', 'vení'],
  ['poner', 'pres', 0, 'pongo'], ['poner', 'indef', 0, 'puse'], ['poner', 'imp', 1, 'pon'], ['poner', 'perf', 3, 'hemos puesto'],
  ['salir', 'pres', 0, 'salgo'], ['salir', 'fut', 0, 'saldré'], ['salir', 'imp', 1, 'sal'],
  ['saber', 'pres', 0, 'sé'], ['saber', 'indef', 0, 'supe'], ['saber', 'subj', 0, 'sepa'],
  ['dar', 'pres', 0, 'doy'], ['dar', 'indef', 0, 'di'], ['dar', 'indef', 2, 'dio'], ['ver', 'pres', 0, 'veo'], ['ver', 'indef', 2, 'vio'], ['ver', 'imperf', 0, 'veía'], ['ver', 'perf', 1, 'has visto'],
  ['conocer', 'pres', 0, 'conozco'], ['traer', 'pres', 0, 'traigo'], ['traer', 'indef', 5, 'trajeron'], ['oír', 'pres', 0, 'oigo'], ['oír', 'pres', 1, 'oyes'],
  ['pedir', 'pres', 0, 'pido'], ['pedir', 'pres', 3, 'pedimos'], ['pedir', 'indef', 2, 'pidió'], ['pedir', 'ger', 2, 'está pidiendo'],
  ['dormir', 'pres', 0, 'duermo'], ['dormir', 'indef', 2, 'durmió'], ['dormir', 'indef', 5, 'durmieron'], ['dormir', 'ger', 0, 'estoy durmiendo'],
  ['jugar', 'pres', 0, 'juego'], ['jugar', 'indef', 0, 'jugué'], ['empezar', 'pres', 2, 'empieza'], ['empezar', 'indef', 0, 'empecé'], ['buscar', 'indef', 0, 'busqué'], ['pagar', 'indef', 0, 'pagué'], ['llegar', 'subj', 0, 'llegue'],
  ['leer', 'indef', 2, 'leyó'], ['leer', 'indef', 5, 'leyeron'], ['leer', 'ger', 1, 'estás leyendo'], ['seguir', 'pres', 0, 'sigo'], ['seguir', 'imp', 2, 'siga'], ['volver', 'perf', 5, 'han vuelto'],
  ['hablar', 'pres', 0, 'hablo'], ['hablar', 'indef', 0, 'hablé'], ['hablar', 'indef', 2, 'habló'], ['hablar', 'imperf', 3, 'hablábamos'], ['hablar', 'fut', 3, 'hablaremos'], ['hablar', 'subj', 1, 'hables'],
  ['hablar', 'imp', 1, 'habla'], ['hablar', 'imp', 2, 'hable'], ['hablar', 'imp', 5, 'hablen'], ['hablar', 'vos', 'vos', 'hablás'], ['hablar', 'ira', 0, 'voy a hablar'],
  ['comer', 'pres', 3, 'comemos'], ['comer', 'indef', 0, 'comí'], ['comer', 'imperf', 0, 'comía'], ['comer', 'subj', 0, 'coma'], ['comer', 'perf', 0, 'he comido'],
  ['vivir', 'pres', 3, 'vivimos'], ['vivir', 'indef', 5, 'vivieron'], ['vivir', 'cond', 0, 'viviría'], ['vivir', 'vos', 'vos', 'vivís'],
  ['levantarse', 'pres', 0, 'me levanto'], ['irse', 'pres', 3, 'nos vamos'], ['acostarse', 'pres', 1, 'te acuestas'], ['sentirse', 'pres', 0, 'me siento'], ['divertirse', 'pres', 5, 'se divierten'],
  ['ser', 'vos', 'vos', 'sos'], ['decir', 'vos', 'vos', 'decís'], ['pensar', 'vos', 'vos', 'pensás'], ['mirar', 'impvos', 'vos', 'mirá'], ['decir', 'impvos', 'vos', 'decí'],
  ['haber', 'pres', 2, 'ha'], ['escribir', 'perf', 0, 'he escrito'], ['abrir', 'perf', 2, 'ha abierto'], ['romper', 'perf', 2, 'ha roto'], ['morir', 'indef', 2, 'murió'],
  ['reír', 'pres', 0, 'río'], ['caer', 'pres', 0, 'caigo'], ['elegir', 'pres', 0, 'elijo'], ['conseguir', 'pres', 0, 'consigo'], ['oler', 'pres', 2, 'huele'], ['continuar', 'pres', 0, 'continúo'], ['enviar', 'pres', 0, 'envío']
];
V.forEach(x => eq('conj ' + x[0] + ' ' + x[1] + ' ' + x[2], conjForm(x[0], x[1], x[2]), x[3]));

// 5. Stammformen
eq('pp hablar', principalParts('hablar').regular, true);
eq('pp tener', principalParts('tener').parts, [['Präsens', 'yo tengo, tú tienes'], ['Indefinido', 'yo tuve, él tuvo'], ['Futuro', 'yo tendré']]);
eq('pp pedir', principalParts('pedir').parts, [['Präsens', 'yo pido, tú pides'], ['Indefinido', 'él pidió'], ['Gerundio', 'pidiendo']]);
eq('pp buscar', principalParts('buscar').parts, [['Indefinido', 'yo busqué']]);
eq('pp hacer', principalParts('hacer').parts, [['Präsens', 'yo hago'], ['Indefinido', 'yo hice, él hizo'], ['Futuro', 'yo haré'], ['Partizip', 'hecho']]);

// 6. Antwortprüfung
eq('chk exakt', checkAnswer('  Tengo ', ['tengo']), 2); eq('chk akzent', checkAnswer('comi', ['comí']), 1); eq('chk falsch', checkAnswer('como', ['comí']), 0);
eq('chk satz', checkAnswer('¿Has estado?', ['has estado']), 2); eq('chk zahl', checkAnswer('1.500', ['1500', '1.500']), 2); eq('chk ñ', checkAnswer('ano', ['año']), 1);

// 7. Grammatik: alle Verben vorhanden, Drills lassen sich bauen
GRAMMAR.forEach(l => {
  ((l.drill && l.drill.conj) || []).forEach(sp => sp.v.forEach(v => ok('verb ' + l.id + ' ' + v, hasVerb(v))));
  l.body.forEach(b => { if (b.conj) b.conj.v.forEach(v => ok('tabelle ' + l.id + ' ' + v, hasVerb(v))); });
  const pool = lessonPool(l);
  ok('pool ' + l.id, pool.length >= 12, 'nur ' + pool.length);
  ok('antworten ' + l.id, pool.every(it => it.type === 'c' ? (it.opts[it.ai] !== undefined) : (it.a && it.a[0])), JSON.stringify(pool.find(it => it.type !== 'c' && !(it.a && it.a[0]))));
  const d = buildLessonDrill(l, 12);
  ok('drill ' + l.id, d.length === 12, 'Länge ' + d.length);
  ok('keys eindeutig ' + l.id, new Set(pool.map(x => x.k)).size === pool.length);
});
BASICS.forEach(t => { if (t.gen || t.pairs) { const d = buildBasicDrill(t, true); ok('basic ' + t.id, d.length >= 8, 'Länge ' + d.length); } });

// 8. Zusammenführen
(function () {
  const A = freshState(), B = freshState();
  A.cards.x = [2, 100, 50, 3, 5, 0, 2, 0, 2, 0, 0]; B.cards.x = [2, 300, 90, 8, 5, 0, 7, 0, 3, 0, 0]; A.cards.y = [1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0];
  A.days['2026-11-11'] = {r: 10, tc: 100}; B.days['2026-11-11'] = {r: 4, tc: 300, n: 5};
  A.gr.g01 = {st: 1, read: 1, ses: [[1, 70, 12]]}; B.gr.g01 = {st: 2, read: 1, ses: [[1, 85, 12], [2, 90, 12]]};
  A.li.lt = 5; B.li.lt = 9; A.set.at = 10; B.set.at = 5; A.set.budget = 60;
  const M = mergeStates(A, B);
  eq('merge karte', M.cards.x[1], 300); ok('merge karte y', !!M.cards.y); eq('merge tag', M.days['2026-11-11'], {r: 10, tc: 300, n: 5});
  eq('merge gr', M.gr.g01.st, 2); eq('merge ses', M.gr.g01.ses.length, 2); eq('merge lt', M.li.lt, 9); eq('merge set', M.set.budget, 60);
})();

// 9. Simulation: 56 Tage lernen, Arbeitslast und Abläufe prüfen
var RET_OVERRIDE;
function simulate(cfg) {
  RET_OVERRIDE = cfg.ret; ok('fsrs', initFsrs());
  S = freshState();
  const base = Date.UTC(2026, 10, 11, 7, 0, 0);                 // 11.11.2026, 8 Uhr Ortszeit
  _nowOffset = base - Date.now();
  S.set.start = dayStr(today()); S.set.npd = cfg.npd; S.set.budget = cfg.budget; S.set.prod = cfg.prod; S.set.auto = cfg.auto;
  const rnd = () => Math.random(), log = [];
  const pKnown = [0, 0.4, 0.2, 0.1, 0.08];
  for (let day = 0; day < 56; day++) {
    _nowOffset = base + day * DAY_MS - Date.now();
    evalAdapt();
    let n = 0, secs = 0;
    if (day % 9 !== 8) {                                         // ab und zu ein Tag Pause
      startSession();
      let k, guard = 0;
      while ((k = nextCard()) && guard++ < 3000) {
        Session.cur = k; Session.shownAt = nowMs();
        const a = S.cards[k], id = k.replace('~', ''), c = CARD_BY_ID[id], prod = k.indexOf('~') > 0;
        const t = !a ? 12 : prod ? 11 : 7; _nowOffset += t * 1000; secs += t;
        if (!a && !prod && rnd() < pKnown[DECKS[c.deck].phase]) markKnown(id);
        else {
          let g;
          if (!a) g = rnd() < 0.45 ? 1 : rnd() < 0.82 ? 3 : 4;
          else if (isLearning(a)) g = rnd() < 0.12 ? 1 : 3;
          else { const pr = F.get_retrievability(unpack(a), new Date(nowMs()), false); g = rnd() > pr ? 1 : rnd() < 0.08 ? 2 : 3; }
          rateCard(k, g);
        }
        Session.cur = null; n++;
      }
      ok('sitzung endet tag ' + day, guard < 3000);
      const q = dueCounts(); if (q.learn + q.rev + q.newLeft + q.prodLeft === 0) markCardsDone();
    }
    const d = dayRO(), dc = dueCounts();
    log.push({n: n, min: secs / 60, npd: S.set.npd, seen: dc.seenR, seenP: dc.seenP});
  }
  const wk = w => log.slice(w * 7, w * 7 + 7).filter(x => x.n > 0);
  const dc = dueCounts();
  return {mins: [0, 1, 2, 3, 4, 5, 6, 7].map(w => Math.round(sumOf(wk(w), 'min') / wk(w).length)), npd: [0, 1, 2, 3, 4, 5, 6, 7].map(w => wk(w)[wk(w).length - 1].npd),
    seen: dc.seenR, seenP: dc.seenP, known: dc.known, mature: dc.mature};
}
(function () {
  const cfgs = (typeof process !== 'undefined' && process.env.SIMS) ? JSON.parse(process.env.SIMS) : [{npd: 10, budget: 45, prod: 'core', auto: true, ret: 0.9}];
  cfgs.forEach(cfg => {
    const r = simulate(cfg);
    console.log(JSON.stringify(cfg) + '\n   Min/Tag je Woche ' + r.mins.join(' ') + ' | Tempo ' + r.npd.join(' ') + ' | gesehen ' + r.seen + ' von ' + CARDS.length + ' (bekannt ' + r.known + ', Rückrichtung ' + r.seenP + ', sitzen ' + r.mature + ')');
  });
  ok('serie', streak() >= 0);
  ok('tasks', tasksFor().length >= 1);
  ok('export', importState(exportState()) === '');
  console.log('Größe Kartenstand je Teil (Bytes): ' + ['c0', 'c1', 'c2', 'c3'].map(p => JSON.stringify(partData(p)).length).join(', '));
  _nowOffset = 0; RET_OVERRIDE = undefined;
})();

console.log(fails ? fails + ' Fehler' : 'Alle Tests bestanden');
if (fails) process.exitCode = 1;
