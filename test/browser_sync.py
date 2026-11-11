"""Prüft den Abgleich mit der Artifact-Datenbank anhand einer nachgebauten claude.use-Schnittstelle."""
import os, json
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = 'file://' + os.path.join(ROOT, 'dist', 'artifact', 'index.html')   # Artifact-Variante: nur sie nutzt die Konto-Datenbank
MOCK = """
(() => {
  const load = () => JSON.parse(localStorage.getItem('mockdb') || '{}'), save = o => localStorage.setItem('mockdb', JSON.stringify(o));
  const doc = path => ({ id: path.split('/').pop(), path,
    get: async () => { const d = load()[path]; return {id: path, exists: d !== undefined, data: () => d, metadata: {fromCache: false}}; },
    set: async data => { if (window.__failWrites) throw {code: 'unavailable'}; const o = load(); o[path] = JSON.parse(JSON.stringify(data)); save(o); } });
  const col = path => ({ path, doc: id => doc(path + '/' + id) });
  window.claude = { use: async name => name === 'db' ? {collection: col, doc} : name === 'user' ? {id: async () => 'u123'} : null };
})();
"""
fails = []
def check(name, cond, info=''):
    print(('ok   ' if cond else 'FAIL ') + name + (' ' + str(info) if info else ''))
    if not cond: fails.append(name)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, locale='de-DE')
    ctx.add_init_script(MOCK)
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    local = lambda: pg.evaluate("JSON.parse(localStorage.getItem('rumbo-sur-v1') || 'null')")
    remote = lambda: pg.evaluate("JSON.parse(localStorage.getItem('mockdb') || '{}')")
    pg.goto(URL); pg.wait_for_selector('[data-a=startApp]', timeout=8000)
    check('neues Gerät ohne Stand zeigt Einstieg', True)
    pg.click('[data-a=startApp]'); pg.click('.task[data-go=cards]')
    for i in range(300):
        if pg.query_selector('[data-a=reveal]'): pg.click('[data-a=reveal]')
        if pg.query_selector('.rb'): pg.click('.rb[data-g="3"]')
        else: break
    pg.wait_for_timeout(800)
    r = remote(); keys = sorted(k.split('/')[-1] for k in r)
    check('alle Teile gespeichert', keys == ['c0', 'c1', 'c2', 'c3', 'core', 'days', 'meta'], keys)
    n_local = len(local()['S']['cards'])
    n_remote = sum(len(json.loads(r[k]['s'])) for k in r if k.split('/')[-1].startswith('c') and k.split('/')[-1] != 'core')
    check('Kartenstände vollständig in der Datenbank', n_local == n_remote and n_local > 0, (n_local, n_remote))
    check('Sync-Zeitstempel stimmen', local()['syncedAt'] == r['data/users/u123/meta']['t'])
    check('nichts mehr offen', local()['dirty'] == [], local()['dirty'])

    # Zweites Gerät: kein lokaler Stand, Datenbank vorhanden
    pg.evaluate("localStorage.removeItem('rumbo-sur-v1')"); pg.reload(); pg.wait_for_timeout(1200)
    check('zweites Gerät übernimmt Stand', local() and len(local()['S']['cards']) == n_local and not pg.query_selector('.onb'), len(local()['S']['cards']) if local() else None)

    # Änderung von anderem Gerät (ohne lokale Änderungen)
    pg.evaluate("""() => { const o = JSON.parse(localStorage.getItem('mockdb')); const k = 'data/users/u123/'; const c = JSON.parse(o[k + 'core'].s); c.li.lt = 7; o[k + 'core'] = {t: 9e12, s: JSON.stringify(c)}; o[k + 'meta'] = {t: 9e12, v: 1}; localStorage.setItem('mockdb', JSON.stringify(o)); }""")
    pg.reload(); pg.wait_for_timeout(1200)
    check('fremde Änderung wird übernommen', local()['S']['li']['lt'] == 7, local()['S']['li']['lt'])

    # Beide Seiten geändert: lokal Minuten eingetragen, in der Datenbank anderer Lektionsstand
    pg.click('.tab[data-tab=praxis]'); pg.click('[data-a=logLt][data-m="20"]'); pg.wait_for_timeout(500)
    check('lokale Änderung vorgemerkt', len(local()['dirty']) > 0, local()['dirty'])
    pg.evaluate("""() => { const o = JSON.parse(localStorage.getItem('mockdb')); const k = 'data/users/u123/'; const c = JSON.parse(o[k + 'core'].s); c.li.lt = 12; o[k + 'core'] = {t: 9.5e12, s: JSON.stringify(c)}; o[k + 'meta'] = {t: 9.5e12, v: 1}; localStorage.setItem('mockdb', JSON.stringify(o)); }""")
    pg.reload(); pg.wait_for_timeout(1500)
    s = local()['S']; day = list(s['days'].values())[-1]
    check('Zusammenführen: Minuten bleiben, Lektion vom anderen Gerät', day.get('tt') == 20 and s['li']['lt'] == 12 and len(s['cards']) == n_local, (day.get('tt'), s['li']['lt']))
    r = remote(); core = json.loads(r['data/users/u123/core']['s']); days = json.loads(r['data/users/u123/days']['s'])
    check('zusammengeführter Stand zurückgeschrieben', core['li']['lt'] == 12 and list(days.values())[-1].get('tt') == 20 and local()['dirty'] == [])

    # Schreibfehler: lokal bleibt alles erhalten, später wird nachgeholt
    pg.evaluate("window.__failWrites = true"); pg.click('.tab[data-tab=praxis]'); pg.click('[data-a=logSp][data-m="5"]')
    pg.evaluate("document.dispatchEvent(new Event('visibilitychange'))"); pg.wait_for_timeout(300)
    pg.click('.tab[data-tab=heute]'); pg.click('.tab[data-tab=karten]')
    pg.evaluate("window.__failWrites = false")
    check('bei Schreibfehler bleibt Änderung vorgemerkt', len(local()['dirty']) > 0 and list(local()['S']['days'].values())[-1].get('ts') == 5, local()['dirty'])
    pg.reload(); pg.wait_for_timeout(1500)
    days = json.loads(remote()['data/users/u123/days']['s'])
    check('nach Neuladen nachgeholt', list(days.values())[-1].get('ts') == 5 and local()['dirty'] == [], local()['dirty'])
    check('keine Skriptfehler', not errs, errs)
    b.close()
print('ALLES OK' if not fails else 'FEHLER: ' + ', '.join(fails))
