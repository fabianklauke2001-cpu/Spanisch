# Erzeugt die App-Icons (PNG) aus einer SVG-Zeichnung: goldene Sonne mit ñ auf Seeblau.
import math, pathlib, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
font = (ROOT / 'src/pwa/fonts/fraunces-latin-wght-normal.woff2').as_uri()
rays = ''
for i in range(16):
    a = math.radians(i * 22.5)
    r1, r2, w = (128, 186, 13) if i % 2 == 0 else (128, 166, 10)
    rays += '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#F3BF4C" stroke-width="%d" stroke-linecap="round"/>' % (256 + r1 * math.sin(a), 256 - r1 * math.cos(a), 256 + r2 * math.sin(a), 256 - r2 * math.cos(a), w)
svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="{s}" height="{s}">
<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0F7FAE"/><stop offset="1" stop-color="#07415E"/></linearGradient>
<radialGradient id="sun" cx="0.42" cy="0.36" r="0.8"><stop offset="0" stop-color="#FFD978"/><stop offset="1" stop-color="#EDAA28"/></radialGradient></defs>
<rect width="512" height="512" fill="url(#bg)"/>''' + rays + '''
<circle cx="256" cy="256" r="104" fill="url(#sun)"/>
<text x="256" y="302" text-anchor="middle" font-family="Fraunces" font-weight="650" font-size="158" fill="#0B2A3C">ñ</text>
</svg>'''
html = '<!DOCTYPE html><html><head><style>@font-face{font-family:Fraunces;src:url(%s) format("woff2");font-weight:100 900}html,body{margin:0;background:transparent}</style></head><body>%s</body></html>'
out = ROOT / 'src/pwa/icons'
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
    for name, size in [('icon-512.png', 512), ('icon-192.png', 192), ('apple-touch-icon.png', 180), ('favicon-48.png', 48)]:
        pg = b.new_page(viewport={'width': size, 'height': size})
        tmp = ROOT / 'build' / '_icon.html'
        tmp.write_text(html % (font, svg.format(s=size)), encoding='utf8')
        pg.goto(tmp.as_uri()); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(250)
        pg.screenshot(path=str(out / name), clip={'x': 0, 'y': 0, 'width': size, 'height': size})
        pg.close()
    b.close()
print('Icons geschrieben nach', out)
