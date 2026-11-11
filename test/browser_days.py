"""Simuliert mehrere Lerntage im Browser (mit verstellter Uhr) und klickt dazwischen zufällig herum."""
import os, random, json
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = 'file://' + os.path.join(ROOT, 'dist', 'artifact', 'index.html')
random.seed(7); errs = []
SKIP = {'resetDo', 'resetOpen', 'importDo', 'importOpen', 'export', 'copyRp', 'impFile'}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--disable-background-networking', '--disable-sync', '--disable-component-update'])
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, locale='de-DE', timezone_id='Europe/Berlin')
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' and 'ERR_' not in m.text and 'fonts' not in m.text else None)
    pg.clock.set_fixed_time('2026-11-11T08:00:00+01:00')
    pg.goto(URL); pg.wait_for_selector('[data-a=startApp]'); pg.click('[data-a=startApp]')
    state = lambda: pg.evaluate("JSON.parse(localStorage.getItem('rumbo-sur-v1')).S")
    for day in range(int(os.environ.get('DAYS', '7'))):
        pg.clock.set_fixed_time(f'2026-11-{11 + day:02d}T08:00:00+01:00')
        pg.reload(); pg.wait_for_timeout(150)
        pg.click('.tab[data-tab=heute]')
        tasks = pg.eval_on_selector_all('.task', 'els => els.map(e => e.dataset.go)')
        # Karten
        pg.click('.task[data-go=cards]'); n = 0
        for i in range(500):
            if pg.query_selector('[data-a=reveal]'): pg.click('[data-a=reveal]')
            if pg.query_selector('[data-a=known]') and random.random() < 0.3: pg.click('[data-a=known]')
            elif pg.query_selector('.rb'): pg.click(f'.rb[data-g="{random.choice([1, 3, 3, 3, 3, 4, 2])}"]')
            else: break
            n += 1
            if i % 25 == 5 and pg.query_selector('[data-a=undo]:not([disabled])'): pg.click('[data-a=undo]')
        end = pg.inner_text('.endv h1') if pg.query_selector('.endv h1') else '?'
        if pg.query_selector('[data-a=home]'): pg.click('[data-a=home]')
        # Grammatik, wenn dran
        g = [t for t in tasks if t.startswith('lesson:') or t == 'mix']
        if g:
            pg.click(f'.task[data-go="{g[0]}"]')
            if pg.query_selector('[data-a=startLesson]'): pg.click('[data-a=startLesson] >> nth=0')
            for i in range(80):
                if pg.query_selector('.endv') or not pg.query_selector('.dq'): break
                if pg.query_selector('#ans:not([readonly])'):
                    pg.fill('#ans', random.choice(['voy', 'tengo', 'hablo', 'x'])); pg.keyboard.press('Enter')
                elif pg.query_selector('.opt:not([disabled])'): pg.click('.opt >> nth=0')
                elif pg.query_selector('[data-a=showSol]'): pg.click('[data-a=showSol]'); pg.click(random.choice(['[data-a=selfYes]', '[data-a=selfNo]']))
                if pg.query_selector('[data-a=drillNext]'): pg.click('[data-a=drillNext]')
            if pg.query_selector('[data-a=drillDone]'): pg.click('[data-a=drillDone]')
        # Zufälliges Herumklicken
        for i in range(int(os.environ.get('CLICKS', '25'))):
            els = pg.query_selector_all('#view [data-a]:not([disabled]), #tabs [data-a], #sheet [data-a]')[:60]
            els = [e for e in els if e.get_attribute('data-a') not in SKIP]
            if not els: pg.click('.tab[data-tab=heute]', force=True); continue
            e = random.choice(els)
            try: e.click(timeout=300, force=True)
            except Exception: pass
            if pg.query_selector('#ans:not([readonly])') and random.random() < 0.5:
                pg.fill('#ans', 'como'); pg.keyboard.press('Enter')
        pg.evaluate("(() => { const s = document.querySelector('#sheet'); if (s && !s.hidden) { s.hidden = true; s.innerHTML = ''; } })()")
        s = state(); d = s['days'].get(f'2026-11-{11 + day:02d}', {})
        print(f"Tag {day + 1}: Aufgaben {tasks} | Karten {n} ({end}) | bewertet {d.get('r', 0)}, neu {d.get('n', 0)}, bekannt {d.get('k', 0)}, Wiederh. {d.get('rr', 0)} | Stand {len(s['cards'])} | Tempo {s['set']['npd']} | Grammatik {sum(1 for g in s['gr'].values() if g.get('st', 0) >= 1)}")
    b.close()
print('Fehler:', errs[:8] if errs else 'keine')
