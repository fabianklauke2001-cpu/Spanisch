#!/usr/bin/env python3
"""Parst die Karten-Dateien, prüft sie und erzeugt Konjugationsdaten (verbecc)."""
import json, glob, os, re, sys, logging

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXTRA_VERBS = json.load(open(os.path.join(ROOT, 'src', 'extra_verbs.json'), encoding='utf-8'))

def parse_cards():
    decks, cards, errors = [], [], []
    seen = {}
    for path in sorted(glob.glob(os.path.join(ROOT, 'src', 'cards', '*.txt'))):
        for ln, raw in enumerate(open(path, encoding='utf-8'), 1):
            line = raw.strip()
            if not line:
                continue
            if line.startswith('#deck'):
                p = [x.strip() for x in line[5:].split('|')]
                decks.append({'id': p[0], 'name': p[1], 'phase': int(p[2])})
                continue
            f = [x.strip() for x in line.split('|')]
            where = f'{os.path.basename(path)}:{ln}'
            if len(f) < 5 or len(f) > 6:
                errors.append(f'{where}: {len(f)} Felder: {line[:60]}'); continue
            es, de, ex, exd, t = f[:5]
            note = f[5] if len(f) > 5 else ''
            if not es or not de:
                errors.append(f'{where}: es/de leer')
            if t not in 'nvapo' or len(t) != 1:
                errors.append(f'{where}: Typ {t!r}')
            if bool(ex) != bool(exd):
                errors.append(f'{where}: Beispiel ohne Übersetzung (oder umgekehrt)')
            if es in seen:
                errors.append(f'{where}: doppelt: {es} (auch {seen[es]})')
            seen[es] = where
            if t == 'n' and not re.match(r'^(el|la|los|las) ', es):
                errors.append(f'{where}: Nomen ohne Artikel: {es}')
            if t == 'n' and not re.match(r'^(der|die|das) |^[A-ZÄÖÜ]', de):
                errors.append(f'{where}: deutsches Nomen ohne Artikel: {de}')
            vk, rf = '', 0
            if t == 'v':
                w = es.split(' ')[0]
                if w.endswith('se'):
                    w, rf = w[:-2], 1
                if not re.search(r'(ar|er|ir|ír)$', w):
                    errors.append(f'{where}: kein Infinitiv: {es}')
                vk = w
            cards.append([len(decks) - 1, es, de, ex, exd, t, note, vk, rf])
    return decks, cards, errors

PERS = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos']
MONO_FIX = {'vás': 'vas', 'dás': 'das', 'vés': 'ves', 'sós': 'sos', 'hás': 'has', 'dá': 'da', 'vé': 've'}

def strip_pr(s, pr):
    s = s.strip()
    if s.startswith(pr + ' '):
        s = s[len(pr) + 1:]
    return s

def forms(lst, wanted):
    out = {}
    for e in lst:
        pr = e.get('pr')
        if pr in wanted and pr not in out:
            out[pr] = strip_pr(e['c'][0], pr)
    return out

# Korrekturen an der Referenz (von Hand geprüft)
OVERRIDES = {
    'ir': {'imp': {1: 'andá'}},
    'haber': {'pres': {2: 'ha'}, 'vos': 'has', 'imp': {0: '', 1: '', 2: '', 3: ''}},
    'reír': {'indef': {2: 'rio'}, 'imp': {1: 'reí'}, 'subj': {4: 'riais'}},
    'elegir': {'part': 'elegido'},
    'despertar': {'part': 'despertado'},
    'prender': {'part': 'prendido'},
}
# Echte unregelmäßige Partizipien; alles andere, was die Referenz abweichend liefert, ist veraltet oder adjektivisch
IRREG_PART = {'abierto', 'dicho', 'escrito', 'hecho', 'muerto', 'puesto', 'roto', 'visto', 'vuelto', 'devuelto',
              'descubierto', 'resuelto', 'supuesto', 'cubierto', 'ido', 'sido'}

def regular_part(v):
    if v.endswith('ar'):
        return v[:-2] + 'ado'
    stem = v[:-2]
    return stem + ('ído' if stem[-1:] in 'aeo' else 'ido')

def vos_imp(v):
    special = {'ir': 'andá', 'dar': 'da', 'ver': 've', 'ser': 'sé', 'haber': ''}
    if v in special:
        return special[v]
    base = v[:-1]
    return base[:-1] + {'a': 'á', 'e': 'é', 'i': 'í', 'í': 'í'}[base[-1]]

def fix(v, d):
    if d['part'] not in IRREG_PART:
        d['part'] = regular_part(v)
    d['imp'][1] = vos_imp(v)
    if v.endswith('tener') and v != 'tener':
        d['imp'][0] = v[:-5] + 'tén'
    for k, val in OVERRIDES.get(v, {}).items():
        if isinstance(val, dict):
            for i, f in val.items():
                d[k][i] = f
        else:
            d[k] = val
    return d

def conj_all(verbs):
    logging.disable(logging.CRITICAL)
    from verbecc import CompleteConjugator
    cg = CompleteConjugator(lang='es')
    res, predicted = {}, []
    # verbecc scheitert an einzelnen regelmäßigen Verben; diese (von Hand als regelmäßig bestätigt) werden vom Muster abgeleitet
    REGULAR_OK = {'pasar', 'resultar', 'suceder'}
    MODEL = {'ar': ('hablar', 'habl'), 'er': ('comer', 'com'), 'ir': ('vivir', 'viv')}
    fallback = []
    for v in verbs:
        try:
            j = json.loads(cg.conjugate(v).to_json())
        except Exception:
            if v not in REGULAR_OK:
                raise SystemExit('Referenz scheitert an: ' + v)
            model, a = MODEL[v[-2:]]
            j = json.loads(cg.conjugate(model).to_json().replace(a, v[:-2]))
            j['verb']['predicted'] = False
            fallback.append(v)
        m = j['moods']
        if j['verb'].get('predicted'):
            predicted.append(v)
        ind, sub, imp = m['indicativo'], m['subjuntivo'], m['imperativo']
        def six(lst):
            f = forms(lst, PERS)
            return [f.get(p, '') for p in PERS]
        pres_all = forms(ind['presente'], PERS + ['vos'])
        impf = forms(imp['afirmativo'], ['tú', 'vos', 'usted', 'ustedes'])
        vos = MONO_FIX.get(pres_all.get('vos', ''), pres_all.get('vos', ''))
        impvos = MONO_FIX.get(impf.get('vos', ''), impf.get('vos', ''))
        res[v] = fix(v, {
            'pres': six(ind['presente']),
            'vos': vos,
            'indef': six(ind['pretérito-perfecto-simple']),
            'imperf': six(ind['pretérito-imperfecto']),
            'fut': six(ind['futuro']),
            'cond': six(m['condicional']['presente']),
            'subj': six(sub['presente']),
            'imp': [impf.get('tú', ''), impvos, impf.get('usted', ''), impf.get('ustedes', '')],
            'ger': m['gerundio']['gerundio'][0]['c'][0],
            'part': m['participo']['participo'][0]['c'][0],
        })
    print('vom Muster abgeleitet:', fallback)
    return res, predicted

def main():
    decks, cards, errors = parse_cards()
    if errors:
        print('\n'.join(errors)); sys.exit(1)
    verbs = sorted(set([c[7] for c in cards if c[7]] + EXTRA_VERBS))
    conj, predicted = conj_all(verbs)
    os.makedirs(os.path.join(ROOT, 'build'), exist_ok=True)
    json.dump({'decks': decks, 'cards': cards}, open(os.path.join(ROOT, 'build', 'cards.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    json.dump(conj, open(os.path.join(ROOT, 'build', 'conj.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    by = {}
    for c in cards:
        by[decks[c[0]]['id']] = by.get(decks[c[0]]['id'], 0) + 1
    print('Karten:', len(cards), '| Decks:', len(decks), '| Verben:', len(verbs))
    print(' '.join(f'{k}:{v}' for k, v in by.items()))
    print('Typen:', {t: sum(1 for c in cards if c[5] == t) for t in 'nvapo'})
    print('vorhergesagt (nicht im Lexikon):', predicted)

if __name__ == '__main__':
    main()
