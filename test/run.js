// Logiktests: lädt Daten und Logikmodule in einen gemeinsamen Kontext und prüft sie.
const fs = require('fs'), vm = require('vm'), path = require('path');
const R = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const cards = JSON.parse(R('build/cards.json')), conj = JSON.parse(R('build/conj.json'));
const src = [
  'const BUILD = "artifact", VERSION = "test"; const DATA = ' + JSON.stringify({decks: cards.decks, cards: cards.cards, conj: conj}) + ';',
  R('node_modules/ts-fsrs/dist/index.umd.js'),
  'const FSRS = globalThis.FSRS;',
  R('src/js/core.js'), R('src/js/lang.js'), R('src/js/data-plan.js'), R('src/js/data-grammar.js'), R('src/js/data-grammar-extra.js'),
  R('src/js/data-basics.js'), R('src/js/srs.js'), R('src/js/drill.js'),
  R('test/tests.js')
].join('\n;\n');
const store = {};
const ctx = {console, setTimeout, clearTimeout, Date, Math, JSON, Promise, Set, Object, Array, String, Number, isFinite, parseInt,
  localStorage: {getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }}, process};
ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
vm.runInContext(src, ctx, {filename: 'bundle.js'});
