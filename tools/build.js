// Baut die App: eine Variante für das Artifact (Bibliothek als eigene Datei) und eine Einzeldatei für den Offline-Gebrauch.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), R = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const cards = JSON.parse(R('build/cards.json')), conj = JSON.parse(R('build/conj.json'));
const data = JSON.stringify({decks: cards.decks, cards: cards.cards, conj: conj}).replace(/</g, '\\u003c').split(String.fromCharCode(0x2028)).join('\\u2028').split(String.fromCharCode(0x2029)).join('\\u2029');
const JS = ['core', 'lang', 'data-plan', 'data-grammar', 'data-grammar-extra', 'data-basics', 'srs', 'drill', 'ui-core', 'ui-learn', 'ui-grammar', 'ui-more'].map(f => R('src/js/' + f + '.js')).join('\n');
const crypto = require('crypto');
const VERSION = new Date().toISOString().slice(0, 10) + '.' + crypto.createHash('sha1').update(data + JS + R('src/style.css')).digest('hex').slice(0, 6);
// BUILD: 'artifact' (Claude-Artifact mit Konto-Speicher), 'file' (Einzeldatei), 'pwa' (eigenständige Web-App mit Offline-Betrieb)
const app = build => '(function () {\n"use strict";\nconst BUILD = ' + JSON.stringify(build) + ', VERSION = ' + JSON.stringify(VERSION) + ';\nconst DATA = ' + data + ';\n' + JS + '\n})();';
const lib = R('node_modules/ts-fsrs/dist/index.umd.js').replace(/\/\/# sourceMappingURL=.*$/m, '');
const GFONTS = `<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Spanisch-Lernzentrale</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;600;700&display=swap">`;
// Eigenständige App: Schriften, Icon und Manifest liegen neben der Seite, damit alles ohne Internet läuft
const PWA_HEAD = `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Spanisch-Lernzentrale</title>
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#EDF3F6" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#091822" media="(prefers-color-scheme: dark)">
<link rel="manifest" href="manifest.webmanifest">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Spanisch">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="48x48" href="icons/favicon-48.png">
<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">
<style>
@font-face { font-family: 'Fraunces'; font-style: normal; font-weight: 100 900; font-display: swap; src: url(fonts/fraunces-latin-wght-normal.woff2) format('woff2'); }
@font-face { font-family: 'Fraunces'; font-style: italic; font-weight: 100 900; font-display: swap; src: url(fonts/fraunces-latin-wght-italic.woff2) format('woff2'); }
@font-face { font-family: 'Atkinson Hyperlegible Next'; font-style: normal; font-weight: 200 800; font-display: swap; src: url(fonts/atkinson-hyperlegible-next-latin-wght-normal.woff2) format('woff2'); }
</style>`;
const page = (libTag, build) => `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
${build === 'pwa' ? PWA_HEAD : GFONTS}
<style>
${R('src/style.css')}
</style>
</head>
<body>
<span id="syncdot" class="sync local"></span>
<main id="view"></main>
<nav id="tabs" aria-label="Bereiche"></nav>
<div id="toast" role="status" aria-live="polite"></div>
<div id="sheet" hidden></div>
${libTag}
<script>
${app(build)}
</script>
</body>
</html>
`;
fs.mkdirSync(path.join(ROOT, 'dist/artifact/vendor'), {recursive: true});
const inlineLib = '<script>\n' + lib.replace(/<\/script/g, '<\\/script') + '\n</script>';
fs.writeFileSync(path.join(ROOT, 'dist/artifact/index.html'), page('<script src="vendor/ts-fsrs.umd.js"></script>', 'artifact'));
fs.writeFileSync(path.join(ROOT, 'dist/artifact/vendor/ts-fsrs.umd.js'), lib);
fs.writeFileSync(path.join(ROOT, 'dist/Spanisch-Lernzentrale.html'), page(inlineLib, 'file'));

// ---------- Eigenständige Web-App (Ordner docs/, so wie GitHub Pages ihn ausliefert) ----------
const PWA = path.join(ROOT, 'docs');
fs.rmSync(PWA, {recursive: true, force: true});
['icons', 'fonts'].forEach(d => {
  fs.mkdirSync(path.join(PWA, d), {recursive: true});
  fs.readdirSync(path.join(ROOT, 'src/pwa', d)).forEach(f => fs.copyFileSync(path.join(ROOT, 'src/pwa', d, f), path.join(PWA, d, f)));
});
fs.writeFileSync(path.join(PWA, 'index.html'), page(inlineLib, 'pwa'));
fs.writeFileSync(path.join(PWA, '.nojekyll'), '');
fs.copyFileSync(path.join(ROOT, 'node_modules/ts-fsrs/LICENSE'), path.join(PWA, 'fonts', 'MIT-ts-fsrs.txt'));   // Lizenztexte der eingebetteten Bestandteile liegen beisammen
fs.writeFileSync(path.join(PWA, 'manifest.webmanifest'), JSON.stringify({
  id: './', name: 'Spanisch-Lernzentrale', short_name: 'Spanisch', description: 'Tagesplan, Karteikarten, Grammatik und Hörtipps für Spanisch.',
  lang: 'de', start_url: './', scope: './', display: 'standalone', background_color: '#EDF3F6', theme_color: '#EDF3F6',
  icons: [
    {src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any'},
    {src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any'},
    {src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'}
  ]
}, null, 1));
const shell = ['./', 'manifest.webmanifest'].concat(['icons', 'fonts'].reduce((a, d) => a.concat(fs.readdirSync(path.join(PWA, d)).filter(f => /\.(png|woff2)$/.test(f)).map(f => d + '/' + f)), []));
fs.writeFileSync(path.join(PWA, 'sw.js'), R('src/pwa/sw.js').replace('__VERSION__', VERSION).replace('__SHELL__', JSON.stringify(shell)));

const kb = f => Math.round(fs.statSync(path.join(ROOT, f)).size / 1024) + ' KB';
console.log('Version', VERSION, '| artifact/index.html', kb('dist/artifact/index.html'), '| vendor', kb('dist/artifact/vendor/ts-fsrs.umd.js'), '| Einzeldatei', kb('dist/Spanisch-Lernzentrale.html'), '| Web-App docs/index.html', kb('docs/index.html'));
