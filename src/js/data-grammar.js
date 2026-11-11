// Grammatiklektionen. Blöcke: p (Absatz), ul (Liste), conj (Konjugationstabelle),
// grid (freie Tabelle), ex (Beispiele), tip (Merkkasten).
// Drill: conj = generierte Formen-Aufgaben, items = feste Aufgaben
//   ['c', Satz mit ___, [Optionen], Index richtig, Erklärung]  Auswahl
//   ['f', Satz mit ___, [richtige Antworten], Erklärung]        Tippen
//   ['s', deutscher Satz, spanische Lösung]                     Übersetzen mit Selbstkontrolle
const GRAMMAR = [
{
  id: 'g01', title: 'Präsens: regelmäßige Verben', sub: '-ar, -er, -ir', phase: 1,
  body: [
    {p: 'Spanische Verben enden im Infinitiv auf <b>-ar</b>, <b>-er</b> oder <b>-ir</b>. Für das Präsens fällt diese Endung weg und die Personalendung kommt an den Stamm. Weil die Endung die Person schon zeigt, lässt man <i>yo, tú, nosotros</i> meist weg.'},
    {conj: {t: 'pres', v: ['hablar', 'comer', 'vivir']}},
    {ul: [
      '-er und -ir unterscheiden sich nur bei nosotros (comemos, vivimos) und vosotros.',
      '<b>usted</b> (Sie) nutzt die Form von él/ella, <b>ustedes</b> (ihr, Sie) die Form von ellos.',
      'In Lateinamerika sagt niemand vosotros. Für „ihr“ nimmst Du immer ustedes.',
      'Verneinung: <b>no</b> direkt vor das Verb. No hablo francés.'
    ]},
    {ex: [
      ['Hablo un poco de español.', 'Ich spreche ein bisschen Spanisch.'],
      ['¿Dónde vives?', 'Wo wohnst du?'],
      ['Comemos a las ocho.', 'Wir essen um acht.'],
      ['¿Ustedes viajan juntos?', 'Reist ihr zusammen?']
    ]}
  ],
  drill: {
    conj: [{t: 'pres', v: ['hablar', 'trabajar', 'viajar', 'comprar', 'tomar', 'necesitar', 'llegar', 'buscar', 'esperar', 'comer', 'beber', 'aprender', 'creer', 'leer', 'correr', 'vivir', 'escribir', 'abrir', 'subir', 'recibir', 'compartir']}],
    items: [
      ['s', 'Wir wohnen in München.', 'Vivimos en Múnich.'],
      ['s', 'Sprichst du Englisch?', '¿Hablas inglés?'],
      ['s', 'Ich brauche ein Ticket.', 'Necesito un boleto.'],
      ['s', 'Sie (mehrere) arbeiten viel.', 'Trabajan mucho.'],
      ['s', 'Wir warten auf den Bus.', 'Esperamos el bus.']
    ]
  }
},
{
  id: 'g02', title: 'ser, estar und hay', sub: 'Drei Wörter für „sein“', phase: 1,
  body: [
    {p: 'Deutsch hat ein „sein“, Spanisch teilt es auf. <b>ser</b> sagt, was etwas ist. <b>estar</b> sagt, wo oder wie etwas gerade ist. <b>hay</b> sagt, dass es etwas gibt.'},
    {conj: {t: 'pres', v: ['ser', 'estar']}},
    {grid: {head: ['ser', 'estar', 'hay'], rows: [
      ['Herkunft: Soy de Alemania.', 'Ort: Estoy en la playa.', 'Existenz: Hay un cajero.'],
      ['Beruf, Identität: Es médica.', 'Zustand, Befinden: Estoy cansado.', 'mit un/una, Zahl, mucho'],
      ['Eigenschaft: La playa es bonita.', 'Ergebnis: Está cerrado.', 'unveränderlich: hay = es gibt'],
      ['Uhrzeit, Datum: Son las tres.', 'Verlaufsform: Estoy comiendo.', ''],
      ['Ort einer Veranstaltung: La fiesta es aquí.', '', '']
    ]}},
    {tip: 'Faustregel: <b>hay</b> für Unbestimmtes (Hay un baño), <b>estar</b> für Bestimmtes (El baño está allí).'},
    {grid: {head: ['Adjektiv', 'mit ser', 'mit estar'], rows: [
      ['listo', 'schlau', 'fertig'],
      ['rico', 'reich', 'lecker'],
      ['aburrido', 'langweilig', 'gelangweilt'],
      ['malo', 'böse, schlecht', 'krank']
    ]}}
  ],
  drill: {
    conj: [{t: 'pres', v: ['ser', 'estar']}],
    items: [
      ['c', 'Yo ___ de Alemania.', ['soy', 'estoy'], 0, 'Herkunft: ser'],
      ['c', 'El hostal ___ cerca de la playa.', ['es', 'está'], 1, 'Lage: estar'],
      ['c', '___ muy cansado hoy.', ['Soy', 'Estoy'], 1, 'Zustand: estar'],
      ['c', '___ un cajero en la esquina.', ['Hay', 'Está', 'Es'], 0, 'Etwas Unbestimmtes gibt es: hay'],
      ['c', 'El cajero ___ en la esquina.', ['hay', 'está', 'es'], 1, 'Bestimmtes Ding, Ort: estar'],
      ['c', 'Mi hermana ___ médica.', ['es', 'está'], 0, 'Beruf: ser'],
      ['c', '¿Dónde ___ el baño?', ['es', 'está', 'hay'], 1, 'Ort: estar'],
      ['c', 'Hoy ___ lunes.', ['es', 'está'], 0, 'Datum: ser'],
      ['c', 'La sopa ___ fría.', ['es', 'está'], 1, 'Zustand im Moment: estar'],
      ['c', '___ las tres de la tarde.', ['Son', 'Están'], 0, 'Uhrzeit: ser'],
      ['c', '¿___ habitaciones libres?', ['Hay', 'Están', 'Son'], 0, 'Gibt es …?: hay'],
      ['c', 'La fiesta ___ en la playa.', ['es', 'está'], 0, 'Eine Veranstaltung findet statt: ser'],
      ['c', 'Nosotros ___ en Costa Rica.', ['somos', 'estamos'], 1, 'Ort: estar'],
      ['c', 'Esta playa ___ muy bonita.', ['es', 'está'], 0, 'Eigenschaft: ser'],
      ['c', '¿___ listo? Nos vamos.', ['Eres', 'Estás'], 1, 'estar listo = fertig sein'],
      ['c', 'La comida ___ muy rica hoy.', ['es', 'está'], 1, 'Schmeckt gerade lecker: estar'],
      ['c', '¿De dónde ___ ustedes?', ['son', 'están'], 0, 'Herkunft: ser'],
      ['c', 'Mis amigos ___ en el hostal.', ['son', 'están'], 1, 'Ort: estar'],
      ['c', '___ mucha gente en la playa.', ['Hay', 'Está', 'Es'], 0, 'mucha gente ist unbestimmt: hay'],
      ['c', 'El museo ___ cerrado.', ['es', 'está'], 1, 'Zustand: estar']
    ]
  }
},
{
  id: 'g03', title: 'Präsens: unregelmäßige Verben', sub: 'ir, tener, hacer und Co.', phase: 1,
  body: [
    {p: 'Die häufigsten Verben sind unregelmäßig. Viele sind es aber nur in der <b>yo</b>-Form: Der Rest läuft normal.'},
    {conj: {t: 'pres', v: ['ir', 'tener', 'venir']}},
    {conj: {t: 'pres', v: ['hacer', 'poner', 'salir']}},
    {conj: {t: 'pres', v: ['decir', 'ver', 'dar']}},
    {conj: {t: 'pres', v: ['saber', 'conocer', 'traer']}},
    {grid: {head: ['Muster', 'yo-Formen'], rows: [
      ['-go', 'tengo, vengo, pongo, salgo, hago, digo, traigo, caigo, oigo'],
      ['-zco', 'conozco, parezco, conduzco'],
      ['-oy', 'soy, estoy, voy, doy'],
      ['eigene', 'sé (saber), veo (ver), he (haber)']
    ]}},
    {tip: 'tener, venir und decir haben zusätzlich einen Stammwechsel: tienes, vienes, dices.'},
    {ex: [
      ['Voy a la playa.', 'Ich gehe zum Strand.'],
      ['No sé.', 'Ich weiß nicht.'],
      ['¿Qué haces mañana?', 'Was machst du morgen?'],
      ['Salgo a las ocho.', 'Ich gehe um acht los.']
    ]}
  ],
  drill: {
    conj: [{t: 'pres', v: ['ir', 'tener', 'venir', 'hacer', 'poner', 'salir', 'decir', 'ver', 'dar', 'saber', 'conocer', 'traer', 'oír']}],
    items: [
      ['s', 'Ich weiß es nicht.', 'No lo sé.'],
      ['s', 'Ich gehe zum Strand.', 'Voy a la playa.'],
      ['s', 'Was machst du?', '¿Qué haces?'],
      ['s', 'Ich kenne diese Stadt nicht.', 'No conozco esta ciudad.'],
      ['s', 'Wir haben eine Reservierung.', 'Tenemos una reserva.']
    ]
  }
},
{
  id: 'g04', title: 'Präsens: Stammwechsel', sub: 'e→ie, o→ue, e→i', phase: 1,
  body: [
    {p: 'Bei vielen Verben ändert sich der Stammvokal, sobald er betont ist: <b>e→ie</b>, <b>o→ue</b> oder <b>e→i</b>. Bei nosotros (und vosotros) liegt die Betonung auf der Endung, dort bleibt der Stamm unverändert.'},
    {conj: {t: 'pres', v: ['querer', 'poder', 'pedir']}},
    {conj: {t: 'pres', v: ['pensar', 'volver', 'jugar']}},
    {grid: {head: ['Wechsel', 'Verben'], rows: [
      ['e→ie', 'querer, pensar, entender, empezar, cerrar, perder, preferir, sentir, despertarse, sentarse'],
      ['o→ue', 'poder, volver, dormir, encontrar, costar, contar, recordar, mostrar, probar, acostarse, llover, doler'],
      ['e→i', 'pedir, seguir, repetir, servir, elegir, conseguir, reír'],
      ['u→ue', 'jugar (einziges Verb)']
    ]}},
    {tip: 'In der vos-Form (Argentinien) gibt es keinen Stammwechsel: vos querés, vos podés, vos pensás.'},
    {ex: [
      ['¿Quieres un café?', 'Möchtest du einen Kaffee?'],
      ['No puedo dormir.', 'Ich kann nicht schlafen.'],
      ['¿Cuánto cuesta?', 'Was kostet das?'],
      ['Pedimos dos cervezas.', 'Wir bestellen zwei Bier.']
    ]}
  ],
  drill: {
    conj: [{t: 'pres', v: ['querer', 'poder', 'pedir', 'pensar', 'volver', 'jugar', 'entender', 'dormir', 'seguir', 'empezar', 'cerrar', 'perder', 'preferir', 'encontrar', 'recordar', 'repetir', 'servir', 'probar']}],
    items: [
      ['s', 'Ich verstehe nicht.', 'No entiendo.'],
      ['s', 'Wann kommst du zurück?', '¿Cuándo vuelves?'],
      ['s', 'Wir können nicht kommen.', 'No podemos venir.'],
      ['s', 'Der Kurs fängt um neun an.', 'La clase empieza a las nueve.']
    ]
  }
},
{
  id: 'g05', title: 'Nahe Zukunft und Verlaufsform', sub: 'voy a + Infinitiv, estoy + Gerundio', phase: 1,
  body: [
    {p: '<b>ir a + Infinitiv</b> ist die Zukunft des Alltags: Voy a surfear = Ich werde surfen, ich gehe surfen. Du brauchst nur das Präsens von ir.'},
    {grid: {head: ['Person', 'ir', '+ a + Infinitiv'], rows: [
      ['yo', 'voy', 'a comer'], ['tú', 'vas', 'a comer'], ['él, ella, usted', 'va', 'a comer'],
      ['nosotros', 'vamos', 'a comer'], ['ellos, ustedes', 'van', 'a comer']
    ]}},
    {p: '<b>estar + Gerundio</b> beschreibt, was genau jetzt passiert: Estoy comiendo = Ich esse gerade. Das Gerundio endet auf <b>-ando</b> (-ar) oder <b>-iendo</b> (-er, -ir).'},
    {grid: {head: ['Infinitiv', 'Gerundio'], rows: [
      ['hablar', 'hablando'], ['comer', 'comiendo'], ['vivir', 'viviendo'],
      ['leer, ir, oír, traer', 'leyendo, yendo, oyendo, trayendo'],
      ['dormir, pedir, decir', 'durmiendo, pidiendo, diciendo'],
      ['venir, seguir, sentir', 'viniendo, siguiendo, sintiendo']
    ]}},
    {tip: 'Die Verlaufsform gilt nur für den Moment. Für Pläne nimmst Du ir a: Mañana voy a trabajar (nicht: estoy trabajando).'},
    {ex: [
      ['Mañana vamos a surfear.', 'Morgen gehen wir surfen.'],
      ['¿Qué vas a hacer hoy?', 'Was machst du heute?'],
      ['Estoy aprendiendo español.', 'Ich lerne gerade Spanisch.'],
      ['Está lloviendo.', 'Es regnet gerade.']
    ]}
  ],
  drill: {
    conj: [
      {t: 'ira', v: ['viajar', 'comer', 'salir', 'hacer', 'comprar', 'dormir', 'volver', 'pagar', 'cocinar', 'descansar']},
      {t: 'ger', v: ['hablar', 'comer', 'escribir', 'leer', 'dormir', 'pedir', 'esperar', 'trabajar', 'hacer', 'decir']}
    ],
    items: [
      ['s', 'Morgen gehen wir surfen.', 'Mañana vamos a surfear.'],
      ['s', 'Was machst du gerade?', '¿Qué estás haciendo?'],
      ['s', 'Es wird regnen.', 'Va a llover.'],
      ['s', 'Ich werde zwei Nächte bleiben.', 'Voy a quedarme dos noches.']
    ]
  }
},
{
  id: 'g06', title: 'gustar und ähnliche Verben', sub: 'me gusta, me duele, me encanta', phase: 2,
  body: [
    {p: '<b>gustar</b> heißt wörtlich „gefallen“. Die Sache, die gefällt, ist das Subjekt. Die Person steht als Pronomen davor: <b>Me gusta el café</b> = Mir gefällt der Kaffee.'},
    {grid: {head: ['Wem?', 'Pronomen', 'eine Sache, Infinitiv', 'mehrere Sachen'], rows: [
      ['(a mí)', 'me', 'gusta', 'gustan'],
      ['(a ti)', 'te', 'gusta', 'gustan'],
      ['(a él, ella, usted)', 'le', 'gusta', 'gustan'],
      ['(a nosotros)', 'nos', 'gusta', 'gustan'],
      ['(a ellos, ustedes)', 'les', 'gusta', 'gustan']
    ]}},
    {ul: [
      'Vor dem Nomen steht der Artikel: Me gusta <b>el</b> surf. Me gustan <b>las</b> olas.',
      'Mit Infinitiv immer gusta: Me gusta viajar.',
      'Gleiches Muster: <b>encantar</b> (lieben), <b>interesar</b>, <b>importar</b>, <b>molestar</b>, <b>doler</b> (wehtun), <b>faltar</b> (fehlen), <b>parecer</b>.',
      'Zustimmen: A mí también. Nach Verneinung: A mí tampoco.'
    ]},
    {ex: [
      ['Me gusta este hostal.', 'Dieses Hostel gefällt mir.'],
      ['¿Te gustan las empanadas?', 'Magst du Empanadas?'],
      ['Me duele la cabeza.', 'Ich habe Kopfschmerzen.'],
      ['Nos encanta Patagonia.', 'Wir lieben Patagonien.'],
      ['A Ana no le gusta el frío.', 'Ana mag die Kälte nicht.']
    ]}
  ],
  drill: {
    items: [
      ['c', 'Me ___ la playa.', ['gusta', 'gustan'], 0, 'Eine Sache: gusta'],
      ['c', 'Me ___ las empanadas.', ['gusta', 'gustan'], 1, 'Mehrere Sachen: gustan'],
      ['c', '¿Te ___ viajar?', ['gusta', 'gustan'], 0, 'Infinitiv: gusta'],
      ['c', 'A Ana ___ gusta el mate.', ['le', 'la', 'se'], 0, 'Ihr gefällt: le'],
      ['c', 'Nos ___ los perros.', ['encanta', 'encantan'], 1, 'Mehrere: encantan'],
      ['c', 'Me ___ la cabeza.', ['duele', 'duelen'], 0, 'Ein Körperteil: duele'],
      ['c', 'Me ___ los pies.', ['duele', 'duelen'], 1, 'Mehrere: duelen'],
      ['c', 'A mis amigos ___ gusta bailar.', ['les', 'le', 'los'], 0, 'Ihnen gefällt: les'],
      ['c', '¿A ustedes ___ gusta la comida?', ['les', 'le', 'los'], 0, 'ustedes: les'],
      ['c', 'No me ___ nada el ruido.', ['gusta', 'gustan'], 0, 'el ruido ist eine Sache'],
      ['c', '—Me gusta el surf. —A mí ___.', ['también', 'tampoco'], 0, 'Zustimmung nach bejahtem Satz'],
      ['c', '—No me gusta el frío. —A mí ___.', ['también', 'tampoco'], 1, 'Zustimmung nach verneintem Satz'],
      ['c', 'A nosotros ___ interesa la historia.', ['nos', 'les', 'nosotros'], 0, 'Uns interessiert: nos'],
      ['c', '¿___ molesta si abro la ventana?', ['Te', 'Tú', 'Ti'], 0, 'Dich stört: te'],
      ['c', 'Me ___ tres dólares.', ['falta', 'faltan'], 1, 'Mehrere fehlen: faltan'],
      ['s', 'Mir gefällt dieses Hostel.', 'Me gusta este hostal.'],
      ['s', 'Magst du scharfes Essen?', '¿Te gusta la comida picante?'],
      ['s', 'Mir tut der Rücken weh.', 'Me duele la espalda.'],
      ['s', 'Wir lieben Patagonien.', 'Nos encanta Patagonia.']
    ]
  }
},
{
  id: 'g07', title: 'Reflexive Verben', sub: 'me levanto, me quedo, me voy', phase: 2,
  body: [
    {p: 'Reflexive Verben tragen im Infinitiv ein <b>-se</b>: levantarse, quedarse. Beim Konjugieren wandert das Pronomen vor das Verb: <b>me, te, se, nos, se</b>.'},
    {conj: {t: 'pres', v: ['levantarse', 'quedarse', 'irse']}},
    {ul: [
      'Beim Infinitiv darf das Pronomen hinten dran: Voy a <b>ducharme</b>. Oder vorn: <b>Me</b> voy a duchar.',
      'Einige wechseln zusätzlich den Stamm: despertarse (me despierto), acostarse (me acuesto), sentarse (me siento), sentirse (me siento), divertirse (me divierto).'
    ]},
    {grid: {head: ['ohne se', 'mit se'], rows: [
      ['ir = gehen', 'irse = weggehen'],
      ['quedar = liegen, übrig sein', 'quedarse = bleiben'],
      ['llamar = rufen', 'llamarse = heißen'],
      ['dormir = schlafen', 'dormirse = einschlafen'],
      ['poner = stellen', 'ponerse = anziehen']
    ]}},
    {ex: [
      ['Me quedo tres noches.', 'Ich bleibe drei Nächte.'],
      ['¿A qué hora te levantas?', 'Wann stehst du auf?'],
      ['Nos vamos mañana.', 'Wir reisen morgen ab.'],
      ['¿Cómo se llama este lugar?', 'Wie heißt dieser Ort?']
    ]}
  ],
  drill: {
    conj: [{t: 'pres', v: ['levantarse', 'despertarse', 'acostarse', 'ducharse', 'sentarse', 'quedarse', 'irse', 'ponerse', 'sentirse', 'divertirse', 'llamarse', 'acordarse']}],
    items: [
      ['s', 'Ich bleibe zwei Nächte.', 'Me quedo dos noches.'],
      ['s', 'Wann stehst du auf?', '¿A qué hora te levantas?'],
      ['s', 'Wir gehen jetzt.', 'Nos vamos ahora.'],
      ['s', 'Ich fühle mich gut.', 'Me siento bien.']
    ]
  }
},
{
  id: 'g08', title: 'Indefinido: regelmäßige Verben', sub: 'Abgeschlossene Vergangenheit', phase: 2,
  body: [
    {p: 'Das <b>Indefinido</b> erzählt, was passiert ist und vorbei ist: gestern, letzte Woche, vor zwei Tagen. In Lateinamerika nimmt man es auch für heute: Hoy comí ceviche.'},
    {conj: {t: 'indef', v: ['hablar', 'comer', 'vivir']}},
    {ul: [
      'Der Akzent trägt die Bedeutung: <b>hablo</b> = ich spreche, <b>habló</b> = er sprach.',
      'nosotros ist bei -ar und -ir gleich wie im Präsens: hablamos, vivimos.',
      'Schreibung in der yo-Form: -car → <b>-qué</b> (busqué), -gar → <b>-gué</b> (llegué, pagué), -zar → <b>-cé</b> (empecé).',
      'Vokal vor der Endung: i wird zu y. leer → leyó, leyeron. Ebenso creer, caer, oír.',
      'Stammwechsler auf -ir ändern nur die 3. Person: pidió, pidieron; durmió, durmieron; sintió.'
    ]},
    {grid: {head: ['Signalwörter'], rows: [['ayer, anoche, anteayer, la semana pasada, el año pasado, hace dos días, en 2024, de repente']]}},
    {ex: [
      ['Ayer llegué a San José.', 'Gestern bin ich in San José angekommen.'],
      ['¿Qué comiste?', 'Was hast du gegessen?'],
      ['Salimos a las siete.', 'Wir sind um sieben losgegangen.'],
      ['Durmió muy mal.', 'Er hat sehr schlecht geschlafen.']
    ]}
  ],
  drill: {
    conj: [{t: 'indef', v: ['hablar', 'viajar', 'comprar', 'tomar', 'llegar', 'buscar', 'pagar', 'empezar', 'comer', 'beber', 'aprender', 'perder', 'volver', 'salir', 'vivir', 'escribir', 'abrir', 'conocer', 'leer', 'pedir', 'dormir', 'sentir']}],
    items: [
      ['s', 'Gestern bin ich angekommen.', 'Llegué ayer.'],
      ['s', 'Wir haben viel gegessen.', 'Comimos mucho.'],
      ['s', 'Hast du das Ticket gekauft?', '¿Compraste el boleto?'],
      ['s', 'Ich habe den Bus verpasst.', 'Perdí el bus.']
    ]
  }
},
{
  id: 'g09', title: 'Indefinido: unregelmäßige Verben', sub: 'fui, tuve, hice, dije', phase: 2,
  body: [
    {p: 'Die wichtigsten Verben haben im Indefinido einen eigenen Stamm und eigene Endungen <b>ohne Akzent</b>: -e, -iste, -o, -imos, -ieron.'},
    {grid: {head: ['Infinitiv', 'Stamm', 'yo', 'él'], rows: [
      ['tener', 'tuv-', 'tuve', 'tuvo'], ['estar', 'estuv-', 'estuve', 'estuvo'],
      ['poder', 'pud-', 'pude', 'pudo'], ['poner', 'pus-', 'puse', 'puso'],
      ['saber', 'sup-', 'supe', 'supo'], ['hacer', 'hic-', 'hice', 'hizo'],
      ['querer', 'quis-', 'quise', 'quiso'], ['venir', 'vin-', 'vine', 'vino'],
      ['decir', 'dij-', 'dije', 'dijo (dijeron)'], ['traer', 'traj-', 'traje', 'trajo (trajeron)']
    ]}},
    {conj: {t: 'indef', v: ['ser', 'tener', 'hacer']}},
    {conj: {t: 'indef', v: ['estar', 'decir', 'dar']}},
    {tip: '<b>ser</b> und <b>ir</b> sind im Indefinido identisch: fui = ich war, ich ging. Der Zusammenhang entscheidet. dar und ver haben keinen Akzent: di, dio, vi, vio.'},
    {ex: [
      ['Ayer fui a la playa.', 'Gestern bin ich an den Strand gegangen.'],
      ['Estuvimos dos semanas en Costa Rica.', 'Wir waren zwei Wochen in Costa Rica.'],
      ['¿Qué hiciste el fin de semana?', 'Was hast du am Wochenende gemacht?'],
      ['No pude dormir.', 'Ich konnte nicht schlafen.']
    ]}
  ],
  drill: {
    conj: [{t: 'indef', v: ['ser', 'ir', 'tener', 'estar', 'hacer', 'poder', 'poner', 'saber', 'querer', 'venir', 'decir', 'traer', 'dar', 'ver']}],
    items: [
      ['s', 'Gestern war ich am Strand.', 'Ayer estuve en la playa.'],
      ['s', 'Wir sind nach Bariloche gefahren.', 'Fuimos a Bariloche.'],
      ['s', 'Was hast du gesagt?', '¿Qué dijiste?'],
      ['s', 'Ich konnte nicht schlafen.', 'No pude dormir.'],
      ['s', 'Sie haben nichts gemacht.', 'No hicieron nada.']
    ]
  }
},
{
  id: 'g10', title: 'Imperfecto', sub: 'Wie es war und was man immer tat', phase: 2,
  body: [
    {p: 'Das <b>Imperfecto</b> malt den Hintergrund: Beschreibungen, Zustände und Gewohnheiten in der Vergangenheit. Es antwortet auf „Wie war es?“ und „Was tat man früher regelmäßig?“.'},
    {conj: {t: 'imperf', v: ['hablar', 'comer', 'vivir']}},
    {p: 'Nur drei Verben sind unregelmäßig:'},
    {conj: {t: 'imperf', v: ['ser', 'ir', 'ver']}},
    {ul: [
      'yo und él haben dieselbe Form: yo hablaba, él hablaba.',
      '<b>había</b> = es gab (Vergangenheit von hay).'
    ]},
    {grid: {head: ['Signalwörter'], rows: [['siempre, todos los días, antes, de niño, cuando era joven, mientras, a menudo, normalmente']]}},
    {ex: [
      ['De niño jugaba al fútbol todos los días.', 'Als Kind habe ich jeden Tag Fußball gespielt.'],
      ['El hostal era pequeño pero limpio.', 'Das Hostel war klein, aber sauber.'],
      ['Había mucha gente en la playa.', 'Es waren viele Leute am Strand.'],
      ['Antes vivía en Berlín.', 'Früher habe ich in Berlin gewohnt.']
    ]}
  ],
  drill: {
    conj: [{t: 'imperf', v: ['hablar', 'estar', 'trabajar', 'viajar', 'jugar', 'tener', 'comer', 'hacer', 'querer', 'poder', 'vivir', 'salir', 'dormir', 'ser', 'ir', 'ver']}],
    items: [
      ['s', 'Früher habe ich in Berlin gewohnt.', 'Antes vivía en Berlín.'],
      ['s', 'Es waren viele Leute da.', 'Había mucha gente.'],
      ['s', 'Als ich Kind war, spielte ich viel.', 'Cuando era niño, jugaba mucho.']
    ]
  }
},
{
  id: 'g11', title: 'Indefinido oder Imperfecto?', sub: 'Handlung gegen Hintergrund', phase: 3,
  body: [
    {p: 'Beide sind Vergangenheit. Die Frage ist die Perspektive: Das Indefinido treibt die Geschichte voran, das Imperfecto beschreibt die Kulisse.'},
    {grid: {head: ['Indefinido', 'Imperfecto'], rows: [
      ['einmalige, abgeschlossene Handlung', 'Hintergrund, Beschreibung'],
      ['Kette von Handlungen', 'Gewohnheit, Wiederholung'],
      ['etwas setzt plötzlich ein', 'etwas lief gerade'],
      ['begrenzter Zeitraum: viví dos años', 'Alter, Uhrzeit, Wetter, Gefühl'],
      ['¿Qué pasó?', '¿Cómo era?']
    ]}},
    {ex: [
      ['Cuando llegué, llovía.', 'Als ich ankam, regnete es.'],
      ['Estaba en la playa cuando me llamaste.', 'Ich war am Strand, als du mich angerufen hast.'],
      ['Era tarde y hacía frío. De repente oí un ruido.', 'Es war spät und kalt. Plötzlich hörte ich ein Geräusch.']
    ]},
    {grid: {head: ['Verb', 'Indefinido', 'Imperfecto'], rows: [
      ['conocer', 'conocí = lernte kennen', 'conocía = kannte'],
      ['saber', 'supe = erfuhr', 'sabía = wusste'],
      ['querer', 'quise = versuchte', 'quería = wollte'],
      ['poder', 'pude = schaffte es', 'podía = war in der Lage']
    ]}}
  ],
  drill: {
    items: [
      ['c', 'Ayer ___ a la playa.', ['fui', 'iba'], 0, 'Einmalig und abgeschlossen'],
      ['c', 'De niño ___ al fútbol todos los días.', ['jugué', 'jugaba'], 1, 'Gewohnheit'],
      ['c', 'Cuando llegué al hostal, ___ mucho.', ['llovió', 'llovía'], 1, 'Hintergrund'],
      ['c', 'Yo dormía cuando ___ el teléfono.', ['sonó', 'sonaba'], 0, 'Etwas setzt plötzlich ein'],
      ['c', '___ las ocho de la noche.', ['Fueron', 'Eran'], 1, 'Uhrzeit in der Vergangenheit'],
      ['c', 'El año pasado ___ dos meses por Asia.', ['viajé', 'viajaba'], 0, 'Begrenzter, abgeschlossener Zeitraum'],
      ['c', 'Antes ___ en Berlín, ahora vivo en Múnich.', ['viví', 'vivía'], 1, 'Früherer Zustand'],
      ['c', 'El hostal ___ pequeño pero limpio.', ['fue', 'era'], 1, 'Beschreibung'],
      ['c', 'Anoche ___ una pizza.', ['comimos', 'comíamos'], 0, 'Einmalige Handlung'],
      ['c', 'Cuando ___ veinte años, vivía en Berlín.', ['tuve', 'tenía'], 1, 'Alter'],
      ['c', '___ mucho frío, por eso no salimos.', ['Hizo', 'Hacía'], 1, 'Wetter als Hintergrund'],
      ['c', 'De repente ___ a llover.', ['empezó', 'empezaba'], 0, 'Plötzlicher Beginn'],
      ['c', 'Todos los veranos ___ a la casa de mis abuelos.', ['fuimos', 'íbamos'], 1, 'Wiederholung'],
      ['c', 'Ayer ___ a Ana en el mercado.', ['conocí', 'conocía'], 0, 'kennenlernen'],
      ['c', 'No fui porque ___ cansado.', ['estuve', 'estaba'], 1, 'Zustand als Grund'],
      ['c', 'Primero desayuné, luego ___ a clase.', ['fui', 'iba'], 0, 'Kette von Handlungen'],
      ['c', 'La playa ___ vacía cuando llegamos.', ['estuvo', 'estaba'], 1, 'Kulisse'],
      ['c', '¿Qué ___ ayer?', ['hiciste', 'hacías'], 0, 'Frage nach dem, was passiert ist']
    ]
  }
},
{
  id: 'g12', title: 'Objektpronomen', sub: 'lo, la, le, se lo', phase: 3,
  body: [
    {p: 'Pronomen ersetzen ein Nomen, das schon bekannt ist. <b>Direkt</b> (wen oder was?) und <b>indirekt</b> (wem?) unterscheiden sich nur in der 3. Person.'},
    {grid: {head: ['Person', 'direkt', 'indirekt'], rows: [
      ['mich, mir', 'me', 'me'], ['dich, dir', 'te', 'te'],
      ['ihn, sie, es / ihm, ihr, Ihnen', 'lo, la', 'le'],
      ['uns', 'nos', 'nos'], ['sie, euch / ihnen, euch', 'los, las', 'les']
    ]}},
    {ul: [
      'Stellung: <b>vor</b> dem konjugierten Verb. La tengo. Te llamo.',
      'Oder angehängt an Infinitiv, Gerundio und bejahten Imperativ: Voy a comprar<b>lo</b>. Dí<b>me</b>.',
      'Zwei Pronomen: erst indirekt, dann direkt. ¿<b>Me lo</b> das?',
      'le oder les vor lo, la wird zu <b>se</b>: Se lo doy (nicht: le lo doy).'
    ]},
    {ex: [
      ['¿Tienes la llave? —Sí, la tengo.', 'Hast du den Schlüssel? – Ja, ich habe ihn.'],
      ['Te llamo mañana.', 'Ich rufe dich morgen an.'],
      ['Le doy la propina al guía.', 'Ich gebe dem Guide das Trinkgeld.'],
      ['¿Me lo puedes explicar?', 'Kannst du es mir erklären?'],
      ['Se lo dije ayer.', 'Ich habe es ihm gestern gesagt.']
    ]}
  ],
  drill: {
    items: [
      ['c', '¿Tienes el boleto? —Sí, ___ tengo.', ['lo', 'la', 'le'], 0, 'el boleto: lo'],
      ['c', '¿Ves a María? —No, no ___ veo.', ['lo', 'la', 'le'], 1, 'María, direkt: la'],
      ['c', '¿Compraste las entradas? —Sí, ___ compré ayer.', ['los', 'las', 'les'], 1, 'las entradas: las'],
      ['c', '___ doy la llave a la recepcionista.', ['Le', 'La', 'Lo'], 0, 'Wem? Indirekt: le'],
      ['c', '¿___ puedes ayudar? (mir)', ['Me', 'Mi', 'Yo'], 0, 'mir: me'],
      ['c', '¿Dónde están mis zapatos? No ___ encuentro.', ['los', 'las', 'les'], 0, 'los zapatos: los'],
      ['c', '___ llamo mañana. (dich)', ['Te', 'Tú', 'Ti'], 0, 'dich: te'],
      ['c', 'A mis padres ___ escribo cada semana.', ['los', 'les', 'las'], 1, 'Wem schreibe ich? les'],
      ['c', '¿El mapa? ___ lo doy ahora. (dir)', ['Te', 'Le', 'Se'], 0, 'dir es: te lo'],
      ['c', '¿La cuenta? ___ la traigo ahora mismo. (Ihnen)', ['Se', 'Le', 'La'], 0, 'le + la wird zu se la'],
      ['c', '¿La tabla? Quiero comprar___.', ['la', 'lo', 'le'], 0, 'la tabla: angehängtes la'],
      ['c', '¿Nos ___ explicas? (es)', ['lo', 'le', 'se'], 0, 'es, direkt: lo'],
      ['c', 'El guía ___ espera en la entrada. (uns)', ['nos', 'nosotros', 'los'], 0, 'uns: nos'],
      ['c', '¿Conoces a mis amigos? —Sí, ___ conozco.', ['los', 'les', 'las'], 0, 'Freunde, direkt: los'],
      ['s', 'Ich rufe dich morgen an.', 'Te llamo mañana.'],
      ['s', 'Kannst du es mir geben?', '¿Me lo puedes dar?'],
      ['s', 'Ich sehe ihn nicht.', 'No lo veo.']
    ]
  }
},
{
  id: 'g13', title: 'Perfecto', sub: 'he estado, has visto', phase: 3,
  body: [
    {p: 'Das <b>Perfecto</b> besteht aus haber + Partizip: <b>he comido</b>. Das Partizip endet auf <b>-ado</b> (-ar) oder <b>-ido</b> (-er, -ir) und verändert sich nicht.'},
    {grid: {head: ['Person', 'haber', '+ Partizip'], rows: [
      ['yo', 'he', 'viajado'], ['tú', 'has', 'viajado'], ['él, ella, usted', 'ha', 'viajado'],
      ['nosotros', 'hemos', 'viajado'], ['ellos, ustedes', 'han', 'viajado']
    ]}},
    {grid: {head: ['Infinitiv', 'unregelmäßiges Partizip'], rows: [
      ['hacer', 'hecho'], ['decir', 'dicho'], ['ver', 'visto'], ['poner', 'puesto'],
      ['escribir', 'escrito'], ['abrir', 'abierto'], ['volver', 'vuelto'], ['romper', 'roto'], ['morir', 'muerto']
    ]}},
    {tip: 'In Lateinamerika hörst Du das Perfecto seltener als in Spanien. Für Erlebnisse ist es aber überall üblich: ¿Has estado en…? Nunca he probado… Todavía no he comido.'},
    {ex: [
      ['¿Has estado en Argentina?', 'Warst du schon mal in Argentinien?'],
      ['Nunca he probado el mate.', 'Ich habe noch nie Mate probiert.'],
      ['Todavía no hemos comido.', 'Wir haben noch nicht gegessen.'],
      ['Ya lo he visto.', 'Ich habe es schon gesehen.']
    ]}
  ],
  drill: {
    conj: [{t: 'perf', v: ['estar', 'viajar', 'comer', 'probar', 'ver', 'hacer', 'escribir', 'decir', 'poner', 'volver', 'abrir', 'romper', 'ir', 'tener', 'conocer', 'vivir']}],
    items: [
      ['s', 'Warst du schon mal in Argentinien?', '¿Has estado en Argentina?'],
      ['s', 'Ich habe noch nie Mate probiert.', 'Nunca he probado el mate.'],
      ['s', 'Wir haben noch nicht gegessen.', 'Todavía no hemos comido.']
    ]
  }
},
{
  id: 'g14', title: 'Imperativ und höfliche Bitten', sub: 'espera, dime, ¿me puede…?', phase: 3,
  body: [
    {p: 'Der bejahte Imperativ für <b>tú</b> ist einfach: die Form von él im Präsens. habla, come, sigue. Für <b>usted</b> und <b>ustedes</b> und für jede Verneinung nimmt man den Subjuntivo.'},
    {grid: {head: ['', 'bejaht', 'verneint'], rows: [
      ['tú', 'habla · come', 'no hables · no comas'],
      ['usted', 'hable · coma', 'no hable · no coma'],
      ['ustedes', 'hablen · coman', 'no hablen · no coman']
    ]}},
    {grid: {head: ['Acht unregelmäßige tú-Formen'], rows: [['tener → ten · venir → ven · poner → pon · salir → sal · hacer → haz · decir → di · ir → ve · ser → sé']]}},
    {conj: {t: 'imp', v: ['hablar', 'tener', 'seguir']}},
    {ul: [
      'Pronomen hängen am bejahten Imperativ: Di<b>me</b>. Espéra<b>me</b>. Siénta<b>te</b>.',
      'Im Alltag klingt eine Frage höflicher: ¿Puedes…? ¿Me puede…? ¿Podría…?',
      'Wünsche äußern: <b>Quisiera</b> un café. <b>Me gustaría</b> alquilar una tabla.'
    ]},
    {ex: [
      ['¡Espera un momento!', 'Warte einen Moment!'],
      ['Siga todo recto y doble a la derecha.', 'Gehen Sie geradeaus und biegen Sie rechts ab.'],
      ['No te preocupes.', 'Mach dir keine Sorgen.'],
      ['¿Me puede traer la cuenta?', 'Können Sie mir die Rechnung bringen?']
    ]}
  ],
  drill: {
    conj: [{t: 'imp', v: ['hablar', 'esperar', 'mirar', 'tomar', 'pasar', 'comer', 'abrir', 'escribir', 'tener', 'venir', 'poner', 'salir', 'hacer', 'decir', 'ir', 'seguir', 'doblar', 'cruzar']}],
    items: [
      ['s', 'Warte einen Moment!', '¡Espera un momento!'],
      ['s', 'Sag mir die Wahrheit.', 'Dime la verdad.'],
      ['s', 'Könnten Sie mir helfen?', '¿Podría ayudarme?'],
      ['s', 'Mach dir keine Sorgen.', 'No te preocupes.'],
      ['s', 'Biegen Sie rechts ab.', 'Doble a la derecha.']
    ]
  }
},
{
  id: 'g15', title: 'por oder para?', sub: 'Grund gegen Ziel', phase: 3,
  body: [
    {p: 'Beide heißen oft „für“. <b>para</b> schaut nach vorn auf ein Ziel. <b>por</b> schaut auf Grund, Weg oder Tausch.'},
    {grid: {head: ['para', 'por'], rows: [
      ['Zweck: para aprender', 'Grund: por la lluvia'],
      ['Empfänger: para ti', 'Tausch, Preis: por diez dólares'],
      ['Richtung: salgo para Lima', 'Weg, durch: por la playa'],
      ['Frist: para mañana', 'Dauer: por dos semanas'],
      ['Meinung: para mí', 'Mittel: por teléfono'],
      ['', 'pro: por noche, por persona'],
      ['', 'ungefähr: por aquí, por la mañana']
    ]}},
    {tip: 'Feste Wendungen mit por: por favor, por fin, por eso, por supuesto, por ejemplo, gracias por.'},
    {ex: [
      ['Estudio español para viajar.', 'Ich lerne Spanisch, um zu reisen.'],
      ['Gracias por tu ayuda.', 'Danke für deine Hilfe.'],
      ['Cuesta veinte dólares por noche.', 'Es kostet zwanzig Dollar pro Nacht.'],
      ['Este café es para ti.', 'Dieser Kaffee ist für dich.']
    ]}
  ],
  drill: {
    items: [
      ['c', 'Este regalo es ___ ti.', ['por', 'para'], 1, 'Empfänger: para'],
      ['c', 'Gracias ___ tu ayuda.', ['por', 'para'], 0, 'gracias por'],
      ['c', 'Estudio español ___ viajar por Sudamérica.', ['por', 'para'], 1, 'Zweck: para'],
      ['c', 'Viajamos ___ toda Argentina.', ['por', 'para'], 0, 'durch ein Gebiet: por'],
      ['c', 'Pagué veinte dólares ___ la tabla.', ['por', 'para'], 0, 'Tausch: por'],
      ['c', 'El bus sale ___ Bariloche a las ocho.', ['por', 'para'], 1, 'Richtung: para'],
      ['c', 'Necesito el boleto ___ mañana.', ['por', 'para'], 1, 'Frist: para'],
      ['c', 'No salimos ___ la lluvia.', ['por', 'para'], 0, 'Grund: por'],
      ['c', 'Surfeo ___ la mañana.', ['por', 'para'], 0, 'Tageszeit: por'],
      ['c', '___ mí, este es el mejor hostal.', ['Por', 'Para'], 1, 'Meinung: para'],
      ['c', 'Cuesta diez dólares ___ noche.', ['por', 'para'], 0, 'pro: por'],
      ['c', '¿Hay un cajero ___ aquí?', ['por', 'para'], 0, 'ungefähr hier: por'],
      ['c', 'Una mesa ___ dos, por favor.', ['por', 'para'], 1, 'bestimmt für: para'],
      ['c', 'Te llamo ___ teléfono.', ['por', 'para'], 0, 'Mittel: por'],
      ['c', 'Me quedo ___ dos semanas.', ['por', 'para'], 0, 'Dauer: por'],
      ['c', '¿___ qué sirve esto?', ['Por', 'Para'], 1, 'Wozu? para'],
      ['c', 'Caminamos ___ la playa.', ['por', 'para'], 0, 'entlang: por'],
      ['c', 'Trabajo ___ una empresa alemana.', ['por', 'para'], 1, 'Arbeitgeber: para']
    ]
  }
},
{
  id: 'g16', title: 'Futuro und Condicional', sub: 'iré, podría, me gustaría', phase: 4,
  body: [
    {p: 'Beide Zeiten hängen ihre Endungen an den <b>ganzen Infinitiv</b>. Das Futuro sagt, was sein wird. Der Condicional sagt, was wäre, und ist Dein Werkzeug für Höflichkeit.'},
    {conj: {t: 'fut', v: ['hablar', 'tener']}},
    {conj: {t: 'cond', v: ['hablar', 'poder']}},
    {grid: {head: ['Infinitiv', 'Stamm für beide Zeiten'], rows: [
      ['tener', 'tendr-'], ['poner', 'pondr-'], ['salir', 'saldr-'], ['venir', 'vendr-'],
      ['poder', 'podr-'], ['querer', 'querr-'], ['saber', 'sabr-'], ['haber', 'habr-'],
      ['hacer', 'har-'], ['decir', 'dir-']
    ]}},
    {tip: 'Im Gespräch ersetzt ir a + Infinitiv fast immer das Futuro. Den Condicional brauchst Du dagegen täglich: Me gustaría…, ¿Podría…?, Sería mejor…'},
    {ex: [
      ['Me gustaría alquilar una tabla.', 'Ich würde gern ein Brett mieten.'],
      ['¿Podrías ayudarme?', 'Könntest du mir helfen?'],
      ['Mañana hará sol.', 'Morgen wird die Sonne scheinen.'],
      ['Sería mejor salir temprano.', 'Es wäre besser, früh loszugehen.']
    ]}
  ],
  drill: {
    conj: [
      {t: 'fut', v: ['hablar', 'comer', 'vivir', 'ir', 'ser', 'estar', 'tener', 'hacer', 'poder', 'salir', 'venir', 'decir']},
      {t: 'cond', v: ['hablar', 'comer', 'poder', 'tener', 'ser', 'hacer', 'ir', 'querer']}
    ],
    items: [
      ['s', 'Ich würde gern ein Brett mieten.', 'Me gustaría alquilar una tabla.'],
      ['s', 'Könntest du mir helfen?', '¿Podrías ayudarme?'],
      ['s', 'Es wäre besser, früh loszugehen.', 'Sería mejor salir temprano.']
    ]
  }
},
{
  id: 'g17', title: 'Subjuntivo in festen Wendungen', sub: 'que te vaya bien, ojalá', phase: 4,
  body: [
    {p: 'Der <b>Subjuntivo</b> steht, wenn etwas gewünscht, erhofft, bezweifelt oder noch nicht eingetreten ist. Bildung: yo-Form im Präsens, das -o weg, dann die „vertauschten“ Endungen: -ar bekommt <b>-e</b>, -er und -ir bekommen <b>-a</b>.'},
    {conj: {t: 'subj', v: ['hablar', 'comer', 'tener']}},
    {conj: {t: 'subj', v: ['ser', 'ir', 'estar']}},
    {grid: {head: ['Auslöser', 'Beispiel'], rows: [
      ['querer que', 'Quiero que vengas.'],
      ['esperar que', 'Espero que tengas un buen viaje.'],
      ['ojalá', 'Ojalá haga sol mañana.'],
      ['para que', 'Te lo explico para que entiendas.'],
      ['cuando (Zukunft)', 'Cuando llegue, te llamo.'],
      ['no creo que', 'No creo que esté abierto.'],
      ['es importante que', 'Es importante que lleves agua.']
    ]}},
    {tip: 'Lern die Formeln als Ganzes: <b>Que te vaya bien.</b> <b>Que tengas un buen día.</b> <b>Que descanses.</b> <b>Que te mejores.</b> Damit klingst Du sofort flüssiger.'},
    {ul: ['Nach <b>creo que</b>, <b>sé que</b> und <b>es verdad que</b> bleibt der normale Indikativ: Creo que tienes razón.']}
  ],
  drill: {
    conj: [{t: 'subj', v: ['hablar', 'comer', 'vivir', 'tener', 'venir', 'hacer', 'poder', 'ser', 'estar', 'ir', 'salir', 'decir', 'llegar', 'buscar']}],
    items: [
      ['c', 'Espero que ___ un buen viaje.', ['tienes', 'tengas'], 1, 'esperar que + Subjuntivo'],
      ['c', 'Quiero que ___ conmigo.', ['vienes', 'vengas'], 1, 'querer que + Subjuntivo'],
      ['c', 'Creo que ___ razón.', ['tienes', 'tengas'], 0, 'creo que (bejaht) + Indikativ'],
      ['c', 'Ojalá ___ sol mañana.', ['hace', 'haga'], 1, 'ojalá + Subjuntivo'],
      ['c', 'Cuando ___ a Buenos Aires, te llamo.', ['llego', 'llegue'], 1, 'cuando für Zukünftiges + Subjuntivo'],
      ['c', 'Cuando ___ tiempo, siempre cocino.', ['tengo', 'tenga'], 0, 'Gewohnheit: Indikativ'],
      ['c', 'Que te ___ bien.', ['va', 'vaya'], 1, 'Wunschformel'],
      ['c', 'No creo que ___ abierto.', ['está', 'esté'], 1, 'no creo que + Subjuntivo'],
      ['c', 'Es importante que ___ agua.', ['llevas', 'lleves'], 1, 'es importante que + Subjuntivo'],
      ['c', 'Te doy mi número para que me ___.', ['llamas', 'llames'], 1, 'para que + Subjuntivo'],
      ['c', 'Sé que ___ difícil.', ['es', 'sea'], 0, 'sé que + Indikativ'],
      ['c', 'Que ___ un buen día.', ['tienes', 'tengas'], 1, 'Wunschformel']
    ]
  }
},
{
  id: 'g18', title: 'Argentinien: vos und Aussprache', sub: 'vos tenés, vení, ¿cómo andás?', phase: 4,
  body: [
    {p: 'In Argentinien und Uruguay sagt man <b>vos</b> statt tú. Nur das Präsens und der Imperativ haben eigene Formen. Alles andere bleibt wie bei tú.'},
    {p: '<b>Präsens:</b> Infinitiv ohne -r, Akzent auf den letzten Vokal, dann -s. hablar → <b>hablás</b>, comer → <b>comés</b>, vivir → <b>vivís</b>. Es gibt keinen Stammwechsel.'},
    {grid: {head: ['tú', 'vos'], rows: [
      ['tienes', 'tenés'], ['quieres', 'querés'], ['puedes', 'podés'], ['vienes', 'venís'],
      ['dices', 'decís'], ['piensas', 'pensás'], ['eres', 'sos'], ['vas', 'vas']
    ]}},
    {p: '<b>Imperativ:</b> Infinitiv ohne -r mit Akzent. mirar → <b>mirá</b>, esperar → <b>esperá</b>, venir → <b>vení</b>, decir → <b>decí</b> (decime). Ausnahme: ir → <b>andá</b>.'},
    {grid: {head: ['Aussprache', 'Beispiel'], rows: [
      ['ll und y klingen wie „sch“', 'calle → „kasche“, yo → „scho“, playa → „plascha“'],
      ['s am Silbenende wird gehaucht', 'los amigos → „loh amigoh“'],
      ['Satzmelodie', 'gesungener, italienisch anmutend']
    ]}},
    {ex: [
      ['¿De dónde sos?', 'Woher kommst du?'],
      ['¿Querés tomar mate?', 'Möchtest du Mate trinken?'],
      ['Vení, sentate.', 'Komm, setz dich.'],
      ['¿Vos qué pensás?', 'Was denkst du?']
    ]}
  ],
  drill: {
    conj: [
      {t: 'vos', v: ['hablar', 'tomar', 'comer', 'vivir', 'tener', 'querer', 'poder', 'venir', 'ser', 'decir', 'pensar', 'volver', 'saber', 'hacer', 'salir']},
      {t: 'impvos', v: ['mirar', 'esperar', 'venir', 'decir', 'tomar', 'pasar', 'comer', 'ir']}
    ],
    items: [
      ['s', 'Woher kommst du? (vos)', '¿De dónde sos?'],
      ['s', 'Hast du Zeit? (vos)', '¿Tenés tiempo?'],
      ['s', 'Komm her! (vos)', '¡Vení acá!']
    ]
  }
}
];
