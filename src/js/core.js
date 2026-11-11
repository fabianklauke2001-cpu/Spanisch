// Zeit, Zustand, Speicherung, Abgleich zwischen Geräten.
const DAY_MS = 864e5, SHIFT = 4 * 36e5, EP = Date.UTC(2026, 0, 1);
let _nowOffset = 0;                                   // nur für Tests: Zeitreise
const nowMs = () => Date.now() + _nowOffset;
// Ein Lerntag beginnt um 4 Uhr morgens, damit spätes Lernen noch zum Vortag zählt.
function dayIdx(ms) { const d = new Date(ms - SHIFT); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY_MS); }
const today = () => dayIdx(nowMs());
const dayStr = i => new Date(i * DAY_MS).toISOString().slice(0, 10);
function parseDay(s) { const p = String(s || '').split('-').map(Number); const v = Math.floor(Date.UTC(p[0], (p[1] || 1) - 1, p[2] || 1) / DAY_MS); return isFinite(v) ? v : today(); }
const weekdayOf = i => new Date(i * DAY_MS).getUTCDay();          // 0 = Sonntag
const WD = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const MON = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
function fmtDate(i) { const d = new Date(i * DAY_MS); return WD[d.getUTCDay()] + ', ' + d.getUTCDate() + '. ' + MON[d.getUTCMonth()]; }
function fmtShort(i) { const d = new Date(i * DAY_MS); return d.getUTCDate() + '. ' + MON[d.getUTCMonth()].slice(0, 3) + '.'; }

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const round = (x, n) => { const f = Math.pow(10, n); return Math.round(x * f) / f; };
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
const pick = a => a[Math.floor(Math.random() * a.length)];
function hashId(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); }

// ---------- Zustand ----------
function freshState() {
  return {
    v: 1, created: nowMs(), at: 0,
    set: {budget: 45, auto: true, npd: 9, prod: 'core', dep: dayStr(today() + 56), start: dayStr(today()), rate: 0.9, onb: false, at: 0},
    cards: {},      // Schlüssel: Karten-ID (Spanisch→Deutsch) bzw. ID + '~' (Deutsch→Spanisch)
    days: {},       // Tagesprotokoll
    gr: {},         // Grammatik-Fortschritt je Lektion
    gi: {},         // Fehlergedächtnis für Aufgaben
    ba: {},         // Basiswissen-Fortschritt
    li: {lt: 0, level: 1, fb: []},
    ad: {last: 0, note: '', hist: []},
    pri: []         // vorgezogene Decks
  };
}
let S = freshState();
const DAY0 = {r: 0, rr: 0, ok: 0, n: 0, p: 0, k: 0, tc: 0, tg: 0, tl: 0, tt: 0, ts: 0, gs: 0, gm: 0, sp: 0, cd: 0};
function dayRO(i) { return S.days[dayStr(i === undefined ? today() : i)] || DAY0; }
function dayRW(i) { const k = dayStr(i === undefined ? today() : i); if (!S.days[k]) S.days[k] = Object.assign({}, DAY0); return S.days[k]; }

function migrate(o) {
  const f = freshState();
  const s = Object.assign(f, o || {});
  s.set = Object.assign(freshState().set, (o && o.set) || {});
  s.li = Object.assign({lt: 0, level: 1, fb: []}, (o && o.li) || {});
  s.ad = Object.assign({last: 0, note: '', hist: []}, (o && o.ad) || {});
  ['cards', 'days', 'gr', 'gi', 'ba'].forEach(k => { if (!s[k] || typeof s[k] !== 'object') s[k] = {}; });
  if (!Array.isArray(s.pri)) s.pri = [];
  if (!Array.isArray(s.li.fb)) s.li.fb = [];
  if (!Array.isArray(s.ad.hist)) s.ad.hist = [];
  s.v = 1;
  return s;
}

// ---------- Lokale Speicherung ----------
const LS_KEY = 'rumbo-sur-v1';
const PARTS = ['core', 'days', 'c0', 'c1', 'c2', 'c3'];
const cardPart = key => { const k = key.charAt(key.length - 1) === '~' ? key.slice(0, -1) : key; return 'c' + (k.charCodeAt(k.length - 1) % 4); };
function partData(p) {
  if (p === 'core') return {set: S.set, gr: S.gr, gi: S.gi, ba: S.ba, li: S.li, ad: S.ad, pri: S.pri, created: S.created, at: S.at};
  if (p === 'days') return S.days;
  const o = {}; for (const k in S.cards) if (cardPart(k) === p) o[k] = S.cards[k]; return o;
}
const Store = {
  works: true, dirty: new Set(), syncedAt: 0,
  load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const o = JSON.parse(raw);
        if (o && o.S && typeof o.S === 'object') {
          S = migrate(o.S); this.syncedAt = o.syncedAt || 0; (o.dirty || []).forEach(x => this.dirty.add(x));
          return true;
        }
      }
    } catch (e) { this.works = false; }
    return false;
  },
  saveLocal() {
    try { localStorage.setItem(LS_KEY, JSON.stringify({S: S, syncedAt: this.syncedAt, dirty: Array.from(this.dirty)})); this.works = true; }
    catch (e) { this.works = false; }
  },
  backup() { try { const raw = localStorage.getItem(LS_KEY); if (raw) localStorage.setItem(LS_KEY + '-bak', raw); } catch (e) {} }
};
let _saveT = null;
function touch() {
  S.at = nowMs();
  for (let i = 0; i < arguments.length; i++) Store.dirty.add(arguments[i]);
  if (!_saveT) _saveT = setTimeout(() => { _saveT = null; Store.saveLocal(); }, 250);
  Cloud.schedule();
}
function flushLocal() { if (_saveT) { clearTimeout(_saveT); _saveT = null; } Store.saveLocal(); }

// ---------- Zusammenführen zweier Stände (z. B. Handy und Laptop) ----------
function mergeStates(L, R) {
  const M = freshState();
  M.created = Math.min(L.created || nowMs(), R.created || nowMs());
  M.at = Math.max(L.at || 0, R.at || 0);
  const newer = (L.set.at || 0) >= (R.set.at || 0) ? L : R, older = newer === L ? R : L;
  M.set = Object.assign({}, older.set, newer.set);
  M.ad = newer.ad; M.pri = newer.pri;
  M.li = {lt: Math.max(L.li.lt || 0, R.li.lt || 0), level: newer.li.level, fb: newer.li.fb};
  const keys = (a, b) => Array.from(new Set(Object.keys(a).concat(Object.keys(b))));
  keys(L.cards, R.cards).forEach(k => {
    const a = L.cards[k], b = R.cards[k];
    M.cards[k] = !a ? b : !b ? a : ((a[2] || 0) > (b[2] || 0) ? a : (a[2] || 0) < (b[2] || 0) ? b : (a[8] >= b[8] ? a : b));
  });
  keys(L.days, R.days).forEach(k => {
    const a = L.days[k], b = R.days[k];
    if (!a || !b) { M.days[k] = a || b; return; }
    const o = {}; keys(a, b).forEach(f => { o[f] = Math.max(a[f] || 0, b[f] || 0); }); M.days[k] = o;
  });
  keys(L.gr, R.gr).forEach(k => {
    const a = L.gr[k], b = R.gr[k];
    if (!a || !b) { M.gr[k] = a || b; return; }
    const ses = {}; (a.ses || []).concat(b.ses || []).forEach(x => { if (!ses[x[0]] || ses[x[0]][1] < x[1]) ses[x[0]] = x; });
    M.gr[k] = {st: Math.max(a.st || 0, b.st || 0), read: (a.read || b.read) ? 1 : 0, ses: Object.keys(ses).sort().map(d => ses[d]).slice(-8)};
  });
  keys(L.gi, R.gi).forEach(k => { M.gi[k] = Math.max(L.gi[k] || 0, R.gi[k] || 0); });
  keys(L.ba, R.ba).forEach(k => {
    const a = L.ba[k] || {}, b = R.ba[k] || {};
    M.ba[k] = {best: Math.max(a.best || 0, b.best || 0), n: Math.max(a.n || 0, b.n || 0), last: Math.max(a.last || 0, b.last || 0)};
  });
  return M;
}

// ---------- Zweiter Speicher auf dem Gerät (IndexedDB) ----------
// Gleiche Schnittstelle wie die Artifact-Datenbank, damit Laden, Zusammenführen und Schreiben denselben geprüften Weg nehmen.
function idbCol() {
  let dbp = null;
  const open = () => dbp || (dbp = new Promise((res, rej) => {
    const rq = indexedDB.open('rumbo-sur', 1);
    rq.onupgradeneeded = () => { rq.result.createObjectStore('kv'); };
    rq.onsuccess = () => res(rq.result);
    rq.onerror = () => rej({code: 'idb'}); rq.onblocked = () => rej({code: 'idb'});
  }));
  const run = (mode, fn) => open().then(db => new Promise((res, rej) => {
    const t = db.transaction('kv', mode), rq = fn(t.objectStore('kv'));
    t.oncomplete = () => res(rq ? rq.result : undefined);
    t.onerror = () => rej({code: 'idb'}); t.onabort = () => rej({code: 'idb'});
  }));
  return {doc: id => ({
    get: () => run('readonly', st => st.get(id)).then(v => ({exists: v !== undefined && v !== null, data: () => v})),
    set: v => run('readwrite', st => st.put(v, id))
  })};
}

// ---------- Gerät: Installation, Schutz vor automatischem Löschen, Backup-Zeitpunkt ----------
const Device = {
  ios: false, standalone: false, persisted: null, installEvt: null,
  init() {
    try {
      const n = navigator;
      this.ios = /iphone|ipad|ipod/i.test(n.userAgent || '') || (n.platform === 'MacIntel' && n.maxTouchPoints > 1);
      this.standalone = !!n.standalone || !!(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
      window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); this.installEvt = e; onSync(); });
      window.addEventListener('appinstalled', () => { this.installEvt = null; this.standalone = true; onSync(); });
    } catch (e) {}
  },
  needsInstall() { return BUILD === 'pwa' && this.ios && !this.standalone; },
  async persist() {
    try {
      const st = navigator.storage; if (!st || !st.persist) return;
      this.persisted = (st.persisted ? await st.persisted() : false) || await st.persist();
      onSync();
    } catch (e) {}
  },
  get(k) { try { return +localStorage.getItem(LS_KEY + k) || 0; } catch (e) { return 0; } },
  put(k, v) { try { localStorage.setItem(LS_KEY + k, String(v)); } catch (e) {} },
  lastBackup() { return this.get('-bk'); },
  markBackup() { this.put('-bk', nowMs()); },
  backupDue() {
    if (BUILD === 'artifact' || !S.set.onb) return false;
    if (Object.keys(S.cards).length < 20) return false;
    const last = this.lastBackup();
    return (!last || nowMs() - last > 7 * DAY_MS) && this.get('-bks') < nowMs();
  },
  snoozeBackup() { this.put('-bks', nowMs() + 3 * DAY_MS); }
};

// ---------- Abgleich: Artifact-Datenbank (im Claude-Konto) oder Zweitspeicher auf dem Gerät ----------
function withTimeout(p, ms) { return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej({code: 'timeout'}), ms))]); }
let onSync = () => {}, onRemoteState = () => {};
const Cloud = {
  col: null, kind: 'cloud', status: 'local', pushing: false, t: null, firstDirty: 0, err: '',
  async init() {
    const w = typeof window !== 'undefined' ? window : null;
    if (!w) { this.status = 'local'; return; }
    this.status = 'loading'; onSync();
    if (BUILD !== 'artifact') {
      // Eigenständige App: kein Konto, dafür ein zweiter Speicher auf dem Gerät
      this.kind = 'device';
      try {
        if (!w.indexedDB) throw {code: 'idb'};
        this.col = idbCol();
        await this.pull();
        if (this.status === 'error') throw {code: this.err};
      } catch (e) { this.col = null; this.status = 'local'; this.err = (e && e.code) || 'idb'; onSync(); }
      return;
    }
    // Die Artifact-Umgebung stellt window.claude bereit; kurz warten, falls sie einen Moment später kommt
    for (let i = 0; i < 8 && !(w.claude && typeof w.claude.use === 'function'); i++) await new Promise(r => setTimeout(r, 250));
    if (!w.claude || typeof w.claude.use !== 'function') { this.status = 'local'; onSync(); return; }
    try {
      const got = await Promise.all([w.claude.use('db'), w.claude.use('user')]);
      const db = got[0], user = got[1];
      if (!db || !user) { this.status = 'local'; onSync(); return; }
      const uid = await user.id();
      if (!uid) { this.status = 'local'; onSync(); return; }
      this.col = db.collection('data/users/' + uid);
      await this.pull();
    } catch (e) { this.status = 'error'; this.err = (e && e.code) || 'fehler'; onSync(); }
  },
  async pull() {
    if (!this.col) return;
    try {
      const m = await withTimeout(this.col.doc('meta').get(), 12000);
      if (!m.exists) {
        if (S.at > 0) { PARTS.forEach(p => Store.dirty.add(p)); await this.push(); }
        else { this.status = 'ok'; onSync(); }
        return;
      }
      const rt = (m.data() || {}).t || 0;
      if (rt === Store.syncedAt) { this.status = 'ok'; onSync(); if (Store.dirty.size) await this.push(); return; }
      const snaps = await Promise.all(PARTS.map(p => withTimeout(this.col.doc(p).get(), 15000)));
      const R = freshState(); R.at = rt;
      snaps.forEach((sn, i) => {
        if (!sn.exists) return;
        let d; try { d = JSON.parse((sn.data() || {}).s || '{}'); } catch (e) { return; }
        const p = PARTS[i];
        if (p === 'core') ['set', 'gr', 'gi', 'ba', 'li', 'ad', 'pri', 'created', 'at'].forEach(k => { if (d[k] !== undefined) R[k] = d[k]; });
        else if (p === 'days') R.days = d;
        else Object.assign(R.cards, d);
      });
      const remote = migrate(R);
      Store.backup();
      if (Store.dirty.size > 0 && S.at > 0) {
        S = mergeStates(S, remote);
        PARTS.forEach(p => Store.dirty.add(p));
        Store.syncedAt = rt; Store.saveLocal();
        onRemoteState();
        await this.push();
      } else {
        S = remote; Store.syncedAt = rt; Store.dirty.clear(); Store.saveLocal();
        this.status = 'ok'; onSync(); onRemoteState();
      }
    } catch (e) { this.status = 'error'; this.err = (e && e.code) || 'fehler'; onSync(); }
  },
  schedule() {
    if (!this.col) return;
    const n = Date.now();
    if (!this.firstDirty) this.firstDirty = n;
    clearTimeout(this.t);
    const quick = this.kind === 'device';                       // auf dem Gerät sofort sichern, im Konto gebündelt
    this.t = setTimeout(() => this.push(), Math.max(0, Math.min(quick ? 1200 : 20000, this.firstDirty + (quick ? 4000 : 60000) - n)));
  },
  async push() {
    if (!this.col || this.pushing || !Store.dirty.size) return;
    this.pushing = true; this.status = 'saving'; onSync();
    clearTimeout(this.t); this.firstDirty = 0;
    // Hat ein anderes Gerät inzwischen gespeichert? Dann erst holen und zusammenführen, nie blind überschreiben.
    try {
      const m = await withTimeout(this.col.doc('meta').get(), 12000);
      if (m.exists && ((m.data() || {}).t || 0) !== Store.syncedAt) { this.pushing = false; await this.pull(); return; }
    } catch (e) { this.pushing = false; this.status = 'error'; this.err = (e && e.code) || 'fehler'; onSync(); return; }
    const stamp = Date.now(), parts = Array.from(Store.dirty);
    let failed = false;
    for (const p of parts) {
      Store.dirty.delete(p);
      try { await withTimeout(this.col.doc(p).set({t: stamp, s: JSON.stringify(partData(p))}), 20000); }
      catch (e) { Store.dirty.add(p); failed = true; this.err = (e && e.code) || 'fehler'; break; }
    }
    if (!failed) {
      try { await withTimeout(this.col.doc('meta').set({t: stamp, v: 1}), 15000); Store.syncedAt = stamp; }
      catch (e) { failed = true; this.err = (e && e.code) || 'fehler'; parts.forEach(p => Store.dirty.add(p)); }
    }
    this.pushing = false;
    this.status = failed ? 'error' : 'ok';
    Store.saveLocal(); onSync();
    if (!failed && Store.dirty.size) this.schedule();
  }
};

// ---------- Export und Import ----------
function exportState() { return JSON.stringify({app: 'rumbo-sur', v: 1, exported: new Date().toISOString(), S: S}); }
function importState(str) {
  let o; try { o = JSON.parse(str); } catch (e) { return 'Das ist keine gültige Backup-Datei.'; }
  if (!o || o.app !== 'rumbo-sur' || !o.S || typeof o.S.cards !== 'object') return 'Die Datei stammt nicht aus dieser App.';
  Store.backup();
  S = migrate(o.S);
  touch.apply(null, PARTS);
  flushLocal();
  return '';
}
