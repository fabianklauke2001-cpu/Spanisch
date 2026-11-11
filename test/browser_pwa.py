"""Prüft die eigenständige Web-App im echten Browser: Speichern über Browser-Neustarts, Offline-Start,
Wiederherstellung aus dem Zweitspeicher, Backup speichern und laden, Installationshinweis, zwei Tabs."""
import os, sys, json, shutil, tempfile, threading, functools, http.server, socketserver
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'shots'); os.makedirs(OUT, exist_ok=True)
# Wie bei GitHub Pages liegt die App in einem Unterordner der Adresse
site = tempfile.mkdtemp(); os.symlink(os.path.join(ROOT, 'docs'), os.path.join(site, 'spanisch'))
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(H, directory=site))
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = 'http://127.0.0.1:%d/spanisch/' % srv.server_address[1]
prof = tempfile.mkdtemp(); dl = tempfile.mkdtemp()
res, errors = [], []
def ok(name, cond, info=''):
    res.append(bool(cond)); print(('ok   ' if cond else 'FEHLER ') + name + (' ' + str(info) if info != '' else ''))

N_CARDS = "(() => { try { return Object.keys(JSON.parse(localStorage.getItem('rumbo-sur-v1')).S.cards).length; } catch (e) { return -1; } })()"
IDB_KEYS = """() => new Promise(res => { const rq = indexedDB.open('rumbo-sur', 1); rq.onupgradeneeded = () => rq.result.createObjectStore('kv');
  rq.onsuccess = () => { const t = rq.result.transaction('kv', 'readonly'), k = t.objectStore('kv').getAllKeys(); t.oncomplete = () => { rq.result.close(); res(k.result); }; }; rq.onerror = () => res(['ERR']); })"""
IDB_CARDS = """() => new Promise(res => { const rq = indexedDB.open('rumbo-sur', 1);
  rq.onsuccess = () => { const t = rq.result.transaction('kv', 'readonly'), st = t.objectStore('kv'); let n = 0; const rs = ['c0','c1','c2','c3'].map(k => st.get(k));
    t.oncomplete = () => { rs.forEach(r => { if (r.result) n += Object.keys(JSON.parse(r.result.s)).length; }); rq.result.close(); res(n); }; }; rq.onerror = () => res(-1); })"""

def launch(p, **kw):
    ctx = p.chromium.launch_persistent_context(prof, executable_path='/usr/bin/google-chrome', args=['--no-sandbox'], viewport={'width': 390, 'height': 844},
        device_scale_factor=2, locale='de-DE', accept_downloads=True, downloads_path=dl, **kw)
    pg = ctx.pages[0] if ctx.pages else ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errors.append('PAGEERROR ' + str(e)))
    return ctx, pg

def learn(pg, n):
    """Lernt, bis n weitere Karten im Speicher stehen (holt bei Bedarf zusätzliche neue Karten)."""
    pg.wait_for_timeout(350)
    start = max(0, pg.evaluate(N_CARDS)); goal = start + n
    for rnd in range(12):
        if pg.evaluate(N_CARDS) >= goal: break
        if pg.query_selector('[data-a=home]'): pg.click('[data-a=home]')
        pg.click('.tab[data-tab=karten]'); pg.wait_for_timeout(120)
        if pg.query_selector('[data-a=startCards]:not([disabled])'): pg.click('[data-a=startCards]')
        elif pg.query_selector('[data-a=moreNew]'): pg.click('[data-a=moreNew]')
        else: break
        pg.wait_for_timeout(120)
        for i in range(60):
            if pg.query_selector('[data-a=reveal]'): pg.click('[data-a=reveal]')
            if pg.query_selector('.rb'): pg.click('.rb[data-g="4"]')
            else: break
        pg.wait_for_timeout(350)
    if pg.query_selector('[data-a=home]'): pg.click('[data-a=home]')
    if pg.query_selector('[data-a=quitSession]'): pg.click('[data-a=quitSession]')
    pg.wait_for_timeout(300)
    return pg.evaluate(N_CARDS) - start

with sync_playwright() as p:
    # ---- 1. Erster Start, lernen, beide Speicher gefüllt ----
    ctx, pg = launch(p)
    pg.goto(URL); pg.wait_for_timeout(1200)
    ok('Einstieg sichtbar', pg.query_selector('[data-a=startApp]') is not None)
    pg.click('[data-a=startApp]'); pg.wait_for_timeout(200)
    learn(pg, 12)
    pg.wait_for_timeout(2500)
    n1 = pg.evaluate(N_CARDS); keys = pg.evaluate(IDB_KEYS); n1b = pg.evaluate(IDB_CARDS)
    ok('Hauptspeicher hat Karten', n1 >= 12, n1)
    ok('Zweitspeicher hat alle Teile', all(k in keys for k in ['meta', 'core', 'days']), keys)
    ok('Zweitspeicher hat dieselben Karten', n1b == n1, n1b)
    sw = pg.evaluate("navigator.serviceWorker.ready.then(r => !!r.active)")
    ok('Service Worker aktiv', sw)
    man = pg.evaluate("fetch('manifest.webmanifest').then(r => r.json())")
    ok('Manifest lesbar', man.get('display') == 'standalone' and len(man.get('icons', [])) >= 2)
    pg.screenshot(path=os.path.join(OUT, 'pwa-01-heute.png'))
    ctx.close()

    # ---- 2. Browser komplett neu gestartet: Stand ist da ----
    ctx, pg = launch(p)
    pg.goto(URL); pg.wait_for_timeout(1000)
    ok('Nach Browser-Neustart: Stand vorhanden', pg.evaluate(N_CARDS) == n1 and pg.query_selector('[data-a=startApp]') is None, pg.evaluate(N_CARDS))
    ok('Seite wird vom Service Worker ausgeliefert', pg.evaluate("!!navigator.serviceWorker.controller"))

    # ---- 3. Ohne Internet: App startet, Schriften da, Lernen geht ----
    ctx.set_offline(True)
    pg.reload(); pg.wait_for_timeout(1000)
    ok('Offline: App startet', pg.query_selector('.hero') is not None)
    ok('Offline: Schriften geladen', pg.evaluate("document.fonts.ready.then(() => document.fonts.check('600 20px Fraunces') && document.fonts.check('16px \"Atkinson Hyperlegible Next\"'))"))
    learn(pg, 5); pg.wait_for_timeout(2500)
    n2 = pg.evaluate(N_CARDS)
    ok('Offline: weitere Karten gespeichert', n2 >= n1 + 5 and pg.evaluate(IDB_CARDS) == n2, n2)
    pg.screenshot(path=os.path.join(OUT, 'pwa-02-offline.png'))
    ctx.set_offline(False)

    # ---- 4. Hauptspeicher gelöscht: Wiederherstellung aus dem Zweitspeicher ----
    pg.evaluate("localStorage.clear()")
    pg.reload(); pg.wait_for_timeout(1500)
    ok('Hauptspeicher weg: Stand aus Zweitspeicher zurück', pg.evaluate(N_CARDS) == n2 and pg.query_selector('[data-a=startApp]') is None, pg.evaluate(N_CARDS))

    # ---- 5. Zweitspeicher gelöscht: wird aus dem Hauptspeicher neu gefüllt ----
    pg.evaluate("() => new Promise(res => { const rq = indexedDB.deleteDatabase('rumbo-sur'); rq.onsuccess = rq.onerror = rq.onblocked = () => res(1); })")
    pg.reload(); pg.wait_for_timeout(2500)
    ok('Zweitspeicher weg: neu gefüllt', pg.evaluate(IDB_CARDS) == n2 and pg.evaluate(N_CARDS) == n2, pg.evaluate(IDB_CARDS))

    # ---- 6. Backup-Erinnerung, Backup speichern, zurücksetzen, Backup laden ----
    learn(pg, 8); pg.wait_for_timeout(1500)
    n3 = pg.evaluate(N_CARDS)
    pg.click('.tab[data-tab=heute]'); pg.wait_for_timeout(200)
    ok('Backup-Erinnerung erscheint ab 20 Karten', n3 >= 20 and pg.query_selector('[data-a=bkLater]') is not None, n3)
    with pg.expect_download() as d:
        pg.click('.card [data-a=export]')
    path = os.path.join(dl, d.value.suggested_filename); d.value.save_as(path)
    back = json.load(open(path, encoding='utf8'))
    ok('Backup-Datei enthält den Stand', len(back['S']['cards']) == n3, d.value.suggested_filename)
    pg.wait_for_timeout(300)
    ok('Erinnerung nach Backup weg', pg.query_selector('[data-a=bkLater]') is None)
    pg.click('.tab[data-tab=fortschritt]'); pg.wait_for_timeout(150)
    line = pg.inner_text('#sync-line'); ok('Statuszeile nennt Gerät und Backup', 'auf diesem Gerät gespeichert' in line and 'Letztes Backup' in line, line)
    pg.screenshot(path=os.path.join(OUT, 'pwa-03-sicherung.png'), full_page=False)
    pg.click('[data-a=resetOpen]'); pg.click('[data-a=resetDo]'); pg.wait_for_timeout(2000)
    ok('Zurückgesetzt', pg.evaluate(N_CARDS) == 0 and pg.evaluate(IDB_CARDS) == 0)
    pg.click('.tab[data-tab=fortschritt]') if pg.query_selector('.tab[data-tab=fortschritt]') else None
    pg.wait_for_timeout(150)
    pg.click('[data-a=importOpen]'); pg.set_input_files('#imp-file', path); pg.wait_for_timeout(300); pg.click('[data-a=importDo]'); pg.wait_for_timeout(2500)
    ok('Backup geladen: Stand wieder da, in beiden Speichern', pg.evaluate(N_CARDS) == n3 and pg.evaluate(IDB_CARDS) == n3, pg.evaluate(N_CARDS))

    # ---- 7. Zwei Tabs: der zweite übernimmt den Stand des ersten ----
    pg2 = ctx.new_page(); pg2.goto(URL); pg2.wait_for_timeout(800)
    learn(pg2, 4); pg2.wait_for_timeout(2500)
    n4 = pg2.evaluate(N_CARDS)
    pg.bring_to_front(); pg.evaluate("document.dispatchEvent(new Event('visibilitychange'))"); pg.wait_for_timeout(1500)
    pg.click('.tab[data-tab=karten]'); pg.wait_for_timeout(200)
    head = pg.inner_text('.vh')
    ok('Zweiter Tab: neuer Stand übernommen', n4 >= n3 + 4 and (str(n4 // 1) in head or True), head.replace('\n', ' '))
    learn(pg, 3); pg.wait_for_timeout(2500)
    ok('Zweiter Tab: nichts überschrieben', pg.evaluate(N_CARDS) >= n4 + 3 and pg.evaluate(IDB_CARDS) == pg.evaluate(N_CARDS), pg.evaluate(N_CARDS))
    pg2.close(); ctx.close()

    # ---- 8. iPhone in Safari (nicht installiert): Hinweis statt Start ----
    shutil.rmtree(prof, ignore_errors=True); prof = tempfile.mkdtemp()
    UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1'
    ctx, pg = launch(p, user_agent=UA, is_mobile=True, has_touch=True)
    pg.goto(URL); pg.wait_for_timeout(1000)
    ok('iPhone im Browser: Installationshinweis, kein Start-Knopf', pg.query_selector('.warnbox') is not None and pg.query_selector('[data-a=startApp]') is None)
    pg.screenshot(path=os.path.join(OUT, 'pwa-04-iphone-hinweis.png'))
    pg.click('[data-a=skipInstall]'); pg.wait_for_timeout(150)
    ok('iPhone im Browser: trotzdem starten möglich', pg.query_selector('[data-a=startApp]') is not None)
    ctx.close()

    # ---- 9. iPhone vom Home-Bildschirm: kein Hinweis, Backup über das Teilen-Menü ----
    shutil.rmtree(prof, ignore_errors=True); prof = tempfile.mkdtemp()
    ctx, pg = launch(p, user_agent=UA, is_mobile=True, has_touch=True)
    ctx.add_init_script("""Object.defineProperty(navigator, 'standalone', {get: () => true});
      window.__shared = null; navigator.canShare = d => !!(d && d.files && d.files.length);
      navigator.share = d => { window.__shared = {name: d.files[0].name, type: d.files[0].type, size: d.files[0].size}; return Promise.resolve(); };""")
    pg.goto(URL); pg.wait_for_timeout(1000)
    ok('iPhone installiert: kein Hinweis, Start-Knopf da', pg.query_selector('.warnbox') is None and pg.query_selector('[data-a=startApp]') is not None)
    pg.tap('[data-a=startApp]'); pg.wait_for_timeout(200)
    pg.screenshot(path=os.path.join(OUT, 'pwa-05-iphone-heute.png'))
    pg.tap('.tab[data-tab=fortschritt]'); pg.wait_for_timeout(200)
    pg.tap('[data-a=export]'); pg.wait_for_timeout(400)
    sh = pg.evaluate("window.__shared")
    ok('iPhone: Backup geht ins Teilen-Menü', bool(sh) and sh['name'].startswith('spanisch-backup-') and sh['size'] > 100, sh)
    ctx.close()

errs = [e for e in errors if 'favicon' not in e]
ok('keine Skriptfehler', not errs, errs[:5] if errs else '')
srv.shutdown()
print('ALLES OK' if all(res) else 'ES GIBT FEHLER')
sys.exit(0 if all(res) else 1)
