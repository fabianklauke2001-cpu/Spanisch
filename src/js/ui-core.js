// Oberfläche: Grundgerüst, Navigation, Sprachausgabe, gemeinsame Bausteine.
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const View = {tab: 'heute', stack: [], gseg: 'lek', q: '', vq: ''};
const TABS = {}, SUB = {}, ACT = {};
const TAB_LIST = [['heute', 'Heute'], ['karten', 'Karten'], ['grammatik', 'Grammatik'], ['praxis', 'Praxis'], ['fortschritt', 'Fortschritt']];
const ICON = {
  heute: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  karten: '<rect x="3" y="6" width="14" height="13" rx="2"/><path d="M7 6V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/>',
  grammatik: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/>',
  praxis: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="14" width="5" height="7" rx="2"/><rect x="17" y="14" width="5" height="7" rx="2"/>',
  fortschritt: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  spk: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  back: '<path d="M15 5l-7 7 7 7"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', undo: '<path d="M9 13L4 8l5-5"/><path d="M4 8h10a6 6 0 0 1 0 12h-3"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', pin: '<path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.4l6-.8z"/>', ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'
};
const icon = (n, cls) => '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + ICON[n] + '</svg>';

function inFocusMode() { const t = View.stack[View.stack.length - 1]; return !!t && (t.name === 'session' || t.name === 'drill'); }
function render(keepScroll) {
  const main = $('#view'), top = View.stack[View.stack.length - 1];
  const y = main.scrollTop;
  if (S.set.onb) { try { evalAdapt(); } catch (e) {} }          // erkennt den Tageswechsel, läuft nur einmal pro Tag
  let html;
  try { html = top ? SUB[top.name](top.arg) : TABS[View.tab](); }
  catch (e) { html = '<section class="pad"><h1>Da ist etwas schiefgelaufen</h1><p>Lade die Seite neu. Dein Fortschritt ist gespeichert.</p><p class="muted small">' + esc(e && e.message) + '</p></section>'; }
  main.innerHTML = html;
  main.scrollTop = keepScroll ? y : 0;
  document.body.classList.toggle('focus', inFocusMode());
  $('#tabs').innerHTML = TAB_LIST.map(t => '<button class="tab' + (View.tab === t[0] ? ' on' : '') + '" data-a="tab" data-tab="' + t[0] + '"' + (View.tab === t[0] ? ' aria-current="page"' : '') + '>' + icon(t[0]) + '<span>' + t[1] + '</span></button>').join('');
  const af = main.querySelector('[data-autofocus]'); if (af) { try { af.focus({preventScroll: true}); } catch (e) {} }
}
const rerender = () => render(true);
function go(tab) { View.tab = tab; View.stack = []; try { if (location.hash !== '#' + tab) history.replaceState(null, '', '#' + tab); } catch (e) {} render(); }
function push(name, arg) { View.stack.push({name: name, arg: arg}); render(); }
function back() { View.stack.pop(); render(); }
ACT.tab = el => go(el.dataset.tab);
ACT.back = () => back();

let _toastT = null;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(_toastT); _toastT = setTimeout(() => t.classList.remove('on'), 2600); }
function openSheet(html) { const s = $('#sheet'); s.innerHTML = '<div class="sheet-bg" data-a="closeSheet"></div><div class="sheet-body" role="dialog" aria-modal="true">' + html + '</div>'; s.hidden = false; }
function closeSheet() { const s = $('#sheet'); s.hidden = true; s.innerHTML = ''; }
ACT.closeSheet = () => closeSheet();

// ---------- Sprachausgabe ----------
const Speech = {
  voice: null, tts: null, ok: false,
  init() {
    const upd = () => { this.ok = !!(this.voice || this.tts); document.body.classList.toggle('can-speak', this.ok); };
    try {
      if ('speechSynthesis' in window) {
        const pickVoice = () => {
          const pref = ['es-mx', 'es-us', 'es-419', 'es-ar', 'es-co', 'es-cl', 'es-pe', 'es'];
          let best = null, score = 999;
          (speechSynthesis.getVoices() || []).forEach(v => {
            const l = String(v.lang || '').replace('_', '-').toLowerCase();
            if (l.slice(0, 2) !== 'es') return;
            let sc = pref.findIndex(p => l.indexOf(p) === 0); if (sc < 0) sc = 50;
            if (v.localService) sc -= 0.5;
            if (sc < score) { best = v; score = sc; }
          });
          this.voice = best; upd();
        };
        pickVoice();
        if (typeof speechSynthesis.addEventListener === 'function') speechSynthesis.addEventListener('voiceschanged', pickVoice);
        setTimeout(pickVoice, 1200);
      }
    } catch (e) {}
    try { if (window.claude && window.claude.use) window.claude.use('tts').then(t => { if (t) { this.tts = t; upd(); } }).catch(() => {}); } catch (e) {}
  },
  clean(t) { return String(t || '').replace(/…/g, ' ').replace(/,\s*-a\b/g, '').replace(/[«»]/g, '').replace(/\s+/g, ' ').trim(); },
  say(text) {
    text = this.clean(text); if (!text) return;
    const rate = clamp(S.set.rate || 0.9, 0.7, 1.3);
    if (this.voice) {
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text); u.voice = this.voice; u.lang = this.voice.lang; u.rate = rate;
        speechSynthesis.speak(u); return;
      } catch (e) {}
    }
    if (this.tts) { try { this.tts.speak(text, {language: 'es', rate: rate}).catch(() => {}); } catch (e) {} }
  }
};
const spk = text => '<button class="spk" data-a="say" data-t="' + esc(text) + '" aria-label="Vorlesen">' + icon('spk') + '</button>';
ACT.say = el => Speech.say(el.dataset.t);

// ---------- Bausteine ----------
const ext = () => (window.claude ? '' : ' target="_blank" rel="noopener"');
const link = (label, url, sub) => '<a class="res" href="' + esc(url) + '"' + ext() + '><span><b>' + esc(label) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span>' + icon('ext') + '</a>';
const bar = (v, max, cls) => '<span class="bar ' + (cls || '') + '"><i style="width:' + (max ? clamp(100 * v / max, 0, 100) : 0) + '%"></i></span>';
const head = (title, sub, withBack) => '<header class="vh">' + (withBack ? '<button class="iconbtn" data-a="back" aria-label="Zurück">' + icon('back') + '</button>' : '') + '<div><h1>' + esc(title) + '</h1>' + (sub ? '<p class="muted">' + esc(sub) + '</p>' : '') + '</div></header>';
function headword(c) {
  if (c.t === 'n') return esc(c.es).replace(/(^|, )(el|la|los|las) /g, (m, a, art) => a + '<span class="art ' + (/^la/.test(art) ? 'f' : 'm') + '">' + art + '</span> ');
  return esc(c.es);
}
const TYPE_LABEL = {n: 'Nomen', v: 'Verb', a: 'Adjektiv', p: 'Wendung', o: 'Wort'};

function conjTable(spec) {
  const vs = spec.v.filter(hasVerb), t = spec.t;
  let rows;
  if (t === 'imp') rows = [['tú', v => conjForm(v, 'imp', 1)], ['usted', v => conjForm(v, 'imp', 2)], ['ustedes', v => conjForm(v, 'imp', 5)], ['no + tú', v => 'no ' + conjForm(v, 'subj', 1)]];
  else rows = [0, 1, 2, 3, 4, 5].map(p => [PERSONS[p], v => conjForm(v, t, p), p === 4]);
  const irr = (v, p, f) => { if (t !== 'pres' && t !== 'indef') return false; const sv = splitVerb(v); if (sv.refl) return false; const r = regularForms(sv.base); return r[t][p] !== f; };
  return '<div class="tw"><table class="conj"><caption>' + esc(TENSE[t] || t) + '</caption><thead><tr><th></th>' + vs.map(v => '<th>' + esc(v) + '</th>').join('') + '</tr></thead><tbody>' +
    rows.map((r, ri) => '<tr' + (r[2] ? ' class="dim"' : '') + '><th>' + esc(r[0]) + '</th>' + vs.map(v => { const f = r[1](v); return '<td' + (t !== 'imp' && irr(v, ri, f) ? ' class="irr"' : '') + '>' + esc(f) + '</td>'; }).join('') + '</tr>').join('') +
    '</tbody></table></div>';
}
function blocks(body) {
  return body.map(b => {
    if (b.p) return '<p>' + b.p + '</p>';
    if (b.ul) return '<ul>' + b.ul.map(x => '<li>' + x + '</li>').join('') + '</ul>';
    if (b.tip) return '<aside class="tip">' + b.tip + '</aside>';
    if (b.conj) return conjTable(b.conj);
    if (b.grid) return '<div class="tw"><table class="grid"><thead><tr>' + b.grid.head.map(h => '<th>' + esc(h) + '</th>').join('') + '</tr></thead><tbody>' + b.grid.rows.map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
    if (b.ex) return '<ul class="exs">' + b.ex.map(e => '<li><span class="es">' + esc(e[0]) + '</span>' + spk(e[0]) + '<span class="de">' + esc(e[1]) + '</span></li>').join('') + '</ul>';
    return '';
  }).join('');
}
function copyText(text, okMsg) {
  const fallback = () => openSheet('<h2>Text kopieren</h2><p class="muted">Markiere den Text und kopiere ihn.</p><textarea id="copy-ta" class="ta" rows="8" readonly>' + esc(text) + '</textarea><button class="btn" data-a="closeSheet">Schließen</button>');
  try { navigator.clipboard.writeText(text).then(() => toast(okMsg || 'Kopiert'), fallback); } catch (e) { fallback(); }
}
