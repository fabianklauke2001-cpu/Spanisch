# Spanisch-Lernzentrale

Eine kleine Web-App zum Spanischlernen: Tagesplan, Karteikarten mit Spaced Repetition (FSRS), Grammatik mit vollständigen Konjugationstabellen, Basiswissen und Links zum Hören und Sprechen.

Die App läuft komplett im Browser, auch ohne Internet. Der Lernstand liegt nur auf dem jeweiligen Gerät (Browser-Speicher) und wird nirgends hochgeladen. Für den Umzug auf ein anderes Gerät gibt es in der App unter „Fortschritt“ ein Backup zum Speichern und Laden.

## Aufbau

| Ordner | Inhalt |
|---|---|
| `docs/` | Die fertige App, so wie GitHub Pages sie ausliefert (wird vom Build erzeugt, nicht von Hand ändern) |
| `src/cards/` | Karten als Text: `spanisch \| deutsch \| Beispiel \| Übersetzung \| Typ \| Hinweis` |
| `src/js/` | Programm: Speicher (`core`), Sprache (`lang`), Inhalte (`data-*`), Planung (`srs`), Übungen (`drill`), Oberfläche (`ui-*`) |
| `src/pwa/` | Icons, Schriften und Service Worker für den Offline-Betrieb |
| `build/` | Erzeugte Daten: Karten und Konjugationen als JSON |
| `tools/` | Build-Skripte |
| `test/` | Logiktests und Browser-Tests |

## Ändern und veröffentlichen

1. Inhalte ändern, zum Beispiel Karten in `src/cards/*.txt` oder Grammatik in `src/js/data-grammar.js`.
2. Nur wenn Karten oder Verben geändert wurden: `python3 tools/build_data.py` (braucht das Python-Paket `verbecc`). Das erzeugt `build/cards.json` und `build/conj.json` neu.
3. `npm install` (einmalig), dann `node tools/build.js`. Das schreibt `docs/` neu.
4. `node test/run.js` und `python3 test/browser_pwa.py` (braucht Playwright und Chrome).
5. Änderungen committen und pushen. GitHub Pages liefert den Ordner `docs/` des Zweigs `main` aus.

Geräte mit installierter App holen die neue Version im Hintergrund und zeigen sie beim übernächsten Start. Der Lernstand bleibt dabei erhalten.

## Speicherkonzept

- Hauptspeicher: `localStorage` (Schlüssel `rumbo-sur-v1`), wird nach jeder Änderung geschrieben.
- Zweitspeicher: IndexedDB (`rumbo-sur`), wird etwa eine Sekunde später geschrieben. Fehlt einer der beiden Speicher beim Start, wird er aus dem anderen wiederhergestellt.
- Die App bittet den Browser, den Speicher nicht automatisch zu löschen (`navigator.storage.persist`).
- Auf dem iPhone gilt: Nur die zum Home-Bildschirm hinzugefügte App hat einen dauerhaften eigenen Speicher. Die App weist beim ersten Öffnen in Safari darauf hin.
- Backup: JSON-Datei über das Teilen-Menü (Handy) oder als Download (Computer). Die App erinnert wöchentlich daran.

## Fremde Bestandteile

- [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) (MIT) für die Wiederholungsplanung, in `docs/index.html` eingebettet
- Schriften Fraunces und Atkinson Hyperlegible Next (SIL Open Font License, Lizenztexte in `docs/fonts/`, dort liegt auch die MIT-Lizenz von ts-fsrs)
- Konjugationen wurden mit [verbecc](https://github.com/bretttolbert/verbecc) erzeugt und von Hand korrigiert
- Die Wortauswahl wurde gegen die Häufigkeitsliste aus [doozan/spanish_data](https://github.com/doozan/spanish_data) geprüft (die Liste selbst liegt nicht in diesem Projekt)
