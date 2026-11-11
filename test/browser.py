"""Klickt die gebaute App im echten Browser durch und macht Bildschirmfotos."""
import sys, os
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = 'file://' + os.path.join(ROOT, 'dist', 'Spanisch-Lernzentrale.html')
OUT = os.path.join(ROOT, 'shots'); os.makedirs(OUT, exist_ok=True)
scheme = sys.argv[1] if len(sys.argv) > 1 else 'light'
errors = []

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, color_scheme=scheme, locale='de-DE')
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'fonts.g' not in m.text and 'ERR_' not in m.text else None)
    pg.on('pageerror', lambda e: errors.append('PAGEERROR ' + str(e)))
    pg.goto(URL); pg.wait_for_timeout(600)
    shot = lambda n: pg.screenshot(path=os.path.join(OUT, f'{scheme}-{n}.png'))
    shot('01-onboarding')
    pg.click('[data-a=startApp]'); pg.wait_for_timeout(200); shot('02-heute')
    # Kartensitzung
    pg.click('.task[data-go=cards]'); pg.wait_for_timeout(200); shot('03-karte-vorn')
    pg.click('[data-a=reveal]'); pg.wait_for_timeout(100); shot('04-karte-hinten')
    n = 0
    for i in range(400):
        if pg.query_selector('[data-a=reveal]'):
            pg.click('[data-a=reveal]')
        if pg.query_selector('[data-a=known]') and i % 3 == 0:
            pg.click('[data-a=known]')
        elif pg.query_selector('.rb'):
            pg.click(f'.rb[data-g="{3 if i % 5 else 1}"]')
        else:
            break
        n += 1
    pg.wait_for_timeout(200); shot('05-sitzung-ende')
    print('Karten bewertet:', n, '| Endtext:', pg.inner_text('.endv h1') if pg.query_selector('.endv h1') else '(keine Endansicht)')
    pg.click('[data-a=home]'); pg.wait_for_timeout(150); shot('06-heute-nach-karten')
    # Karten-Tab, Suche, Detail
    pg.click('.tab[data-tab=karten]'); pg.wait_for_timeout(150); shot('07-karten')
    pg.fill('#card-q', 'tener'); pg.wait_for_timeout(150)
    pg.click('.crow'); pg.wait_for_timeout(150); shot('08-karte-detail')
    pg.click('[data-a=verb]'); pg.wait_for_timeout(150); shot('09-verb')
    # Grammatik
    pg.click('.tab[data-tab=grammatik]'); pg.wait_for_timeout(150); shot('10-grammatik')
    pg.click('.lesson[data-id=g03]'); pg.wait_for_timeout(150); shot('11-lektion')
    pg.click('[data-a=startLesson] >> nth=0'); pg.wait_for_timeout(150); shot('12-drill')
    kinds = {}
    for i in range(60):
        if pg.query_selector('.endv'):
            break
        if pg.query_selector('#ans:not([readonly])'):
            kinds['typed'] = kinds.get('typed', 0) + 1
            pg.fill('#ans', 'voy' if i % 2 else 'xx'); pg.keyboard.press('Enter'); pg.wait_for_timeout(60)
            if i == 1: shot('13-drill-feedback')
        elif pg.query_selector('.opt:not([disabled])'):
            kinds['choice'] = kinds.get('choice', 0) + 1
            pg.click('.opt'); pg.wait_for_timeout(60)
        elif pg.query_selector('[data-a=showSol]'):
            kinds['self'] = kinds.get('self', 0) + 1
            pg.click('[data-a=showSol]'); pg.click('[data-a=selfYes]'); pg.wait_for_timeout(60)
        if pg.query_selector('[data-a=drillNext]'):
            pg.click('[data-a=drillNext]'); pg.wait_for_timeout(60)
    shot('14-drill-ende'); print('Drill-Aufgaben:', kinds, '| Ergebnis:', pg.inner_text('.endv h1') if pg.query_selector('.endv h1') else '?')
    pg.click('[data-a=drillDone]'); pg.wait_for_timeout(100)
    pg.click('[data-a=back]'); pg.wait_for_timeout(100)
    # ser/estar-Lektion mit Auswahl, Basiswissen Zahlen
    pg.click('.lesson[data-id=g02]'); pg.click('[data-a=startLesson] >> nth=0'); pg.wait_for_timeout(150)
    while pg.query_selector('#ans:not([readonly])'):
        pg.fill('#ans', 'x'); pg.keyboard.press('Enter'); pg.click('[data-a=drillNext]')
    shot('15-auswahl'); pg.click('[data-a=quitDrill]'); pg.click('[data-a=back]')
    pg.click('[data-a=gseg][data-v=bas]'); pg.wait_for_timeout(100); shot('16-basis')
    pg.click('.lesson[data-id=b2]'); pg.wait_for_timeout(100); shot('17-zahlen')
    pg.click('[data-a=startBasic]'); pg.wait_for_timeout(100); shot('18-zahlen-drill'); pg.click('[data-a=quitDrill]'); pg.click('[data-a=back]')
    pg.click('[data-a=gseg][data-v=vrb]'); pg.wait_for_timeout(100); shot('19-verben')
    # Praxis, Fortschritt
    pg.click('.tab[data-tab=praxis]'); pg.wait_for_timeout(150); shot('20-praxis')
    pg.click('[data-a=logLi][data-m="10"]'); pg.wait_for_timeout(100); pg.click('[data-a=liFb][data-v=easy]')
    pg.click('[data-a=logLt][data-m="20"]'); pg.click('[data-a=ltStep][data-d="1"]'); pg.click('[data-a=logSp][data-m="5"]'); pg.wait_for_timeout(100)
    pg.screenshot(path=os.path.join(OUT, f'{scheme}-21-praxis-voll.png'), full_page=False)
    pg.click('.tab[data-tab=fortschritt]'); pg.wait_for_timeout(150); shot('22-fortschritt')
    pg.evaluate("document.querySelector('#view').scrollTop = 900"); pg.wait_for_timeout(100); shot('23-fortschritt-unten')
    pg.click('.tab[data-tab=heute]'); pg.wait_for_timeout(150); shot('24-heute-ende')
    # Zustand übersteht Neuladen
    before = pg.evaluate("JSON.parse(localStorage.getItem('rumbo-sur-v1')).S.cards ? Object.keys(JSON.parse(localStorage.getItem('rumbo-sur-v1')).S.cards).length : 0")
    pg.reload(); pg.wait_for_timeout(500)
    after = pg.evaluate("Object.keys(JSON.parse(localStorage.getItem('rumbo-sur-v1')).S.cards).length")
    print('Kartenstände vor und nach Neuladen:', before, after, '| Onboarding nach Neuladen sichtbar:', bool(pg.query_selector('.onb')))
    # Horizontales Überlaufen?
    ov = pg.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth || document.querySelector('#view').scrollWidth > document.querySelector('#view').clientWidth")
    print('Seitliches Überlaufen:', ov)
    b.close()
print('Konsolenfehler:', errors if errors else 'keine')
