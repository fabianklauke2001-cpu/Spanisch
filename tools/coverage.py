#!/usr/bin/env python3
"""Vergleicht die Karten mit einer korpusbasierten Lemma-Häufigkeitsliste (OpenSubtitles, doozan/spanish_data)."""
import csv, json, re, sys, unicodedata
TOP = int(sys.argv[1]) if len(sys.argv) > 1 else 1000
cards = json.load(open('build/cards.json', encoding='utf-8'))['cards']
conj = json.load(open('build/conj.json', encoding='utf-8'))
tok = lambda s: re.findall(r"[a-záéíóúüñ]+", s.lower())
head, loose = set(), set()
for c in cards:
    es, ex, t, vk = c[1], c[3], c[5], c[7]
    for w in tok(es):
        head.add(w)
    if t == 'a':  # "bueno, -a"
        base = tok(es)[0]; head.add(base)
        if base.endswith('o'): head.add(base[:-1] + 'a')
    if vk: head.add(vk)
    for w in tok(ex): loose.add(w)
for v, d in conj.items():
    pass
# Wörter, die in Basiswissen und Grammatik systematisch gelehrt werden (keine Karten)
BASICS = set('''de el la los las que y e o u ni a en no se lo le les un una uno me te nos él ella ellos ellas yo tú usted ustedes vosotros ello mí ti conmigo contigo
su suyo mi mío tu tuyo nuestro vuestro este ese aquel éste ése aquél esto eso aquello del al sí qué quién cuál cuándo dónde cómo cuánto cual cuanto
dos tres cuatro cinco seis siete ocho nueve diez cien mil millón primero segundo tercero hola'''.split())
head |= BASICS
loose |= head
rows = []
# Häufigkeitsliste: frequency.csv aus github.com/doozan/spanish_data, Pfad als zweites Argument
with open(sys.argv[2] if len(sys.argv) > 2 else 'refdata/freq_lemma.csv', encoding='utf-8') as f:
    for r in csv.DictReader(f):
        if r['pos'] in ('prop', 'letter', 'none', 'prefix') or r['flags']:
            continue
        forms = [x.split(':', 1)[1] for x in r['usage'].split('|') if ':' in x]
        rows.append((int(r['count']), r['spanish'], r['pos'], forms))
rows = rows[:TOP]
total = sum(r[0] for r in rows)
def covered(r, S):
    return r[1] in S or any(f in S for f in r[3][:6])
ch = [r for r in rows if covered(r, head)]
cl = [r for r in rows if covered(r, loose)]
print(f'Top {TOP} Lemmata: {len(ch)} als Karte ({100*len(ch)/len(rows):.0f} %), {len(cl)} inkl. Beispielsätze ({100*len(cl)/len(rows):.0f} %)')
print(f'gewichtet nach Häufigkeit: Karten {100*sum(r[0] for r in ch)/total:.1f} %, inkl. Beispiele {100*sum(r[0] for r in cl)/total:.1f} %')
miss = [r for r in rows if not covered(r, head)]
print('\nFEHLEND (Rang, Lemma, Wortart, in Beispielen?):')
for i, r in enumerate(rows):
    if not covered(r, head):
        print(f"{i+1}:{r[1]}/{r[2]}{'*' if covered(r, loose) else ''}", end='  ')
print()
