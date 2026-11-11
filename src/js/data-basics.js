// Basiswissen: Nachschlage-Themen mit kurzer Abfrage.
// pairs: [deutscher Hinweis, spanische Antwort(en)]; gen: generierte Abfrage (num, time, gender)
const BASICS = [
{
  id: 'b1', title: 'Aussprache und Betonung', sub: 'So liest Du jedes Wort richtig',
  body: [
    {p: 'Spanisch wird fast so gesprochen, wie es geschrieben wird. Diese Buchstaben weichen vom Deutschen ab:'},
    {grid: {head: ['Schreibung', 'Klang', 'Beispiel'], rows: [
      ['h', 'stumm', 'hola, hostal'],
      ['j', 'wie ch in „ach“', 'jugo, viaje'],
      ['g vor e, i', 'wie j', 'gente, página'],
      ['gue, gui', 'g wie in „gut“, u stumm', 'guía, pagué'],
      ['ll, y', 'wie j in „ja“ (Argentinien: „sch“)', 'calle, playa'],
      ['ñ', 'nj', 'mañana, año'],
      ['z, c vor e, i', 'scharfes s (Lateinamerika)', 'cerveza, zapato'],
      ['qu', 'k', 'qué, queso'],
      ['r am Anfang, rr', 'gerollt', 'río, perro'],
      ['v', 'fast wie b', 'vino, vamos'],
      ['ch', 'tsch', 'noche, leche']
    ]}},
    {p: '<b>Betonung:</b> Endet ein Wort auf Vokal, n oder s, wird die vorletzte Silbe betont: <i>pla</i>ya, <i>ha</i>blan. Endet es anders, die letzte: ho<i>tel</i>, ha<i>blar</i>. Ein Akzent zeigt jede Ausnahme: a<i>quí</i>, <i>fá</i>cil, <i>mú</i>sica.'},
    {ul: [
      'Fragewörter tragen immer einen Akzent: qué, dónde, cuándo, cómo.',
      'Fragen und Ausrufe beginnen mit ¿ und ¡.',
      'Der Akzent kann die Bedeutung ändern: sí (ja) und si (wenn), tú (du) und tu (dein), él (er) und el (der).'
    ]}
  ]
},
{
  id: 'b2', title: 'Zahlen', sub: 'Von cero bis un millón', gen: 'num',
  body: [
    {grid: {head: ['0 bis 15', '', '16 bis 29', ''], rows: [
      ['0', 'cero', '16', 'dieciséis'], ['1', 'uno', '17', 'diecisiete'], ['2', 'dos', '18', 'dieciocho'],
      ['3', 'tres', '19', 'diecinueve'], ['4', 'cuatro', '20', 'veinte'], ['5', 'cinco', '21', 'veintiuno'],
      ['6', 'seis', '22', 'veintidós'], ['7', 'siete', '23', 'veintitrés'], ['8', 'ocho', '24', 'veinticuatro'],
      ['9', 'nueve', '25', 'veinticinco'], ['10', 'diez', '26', 'veintiséis'], ['11', 'once', '27', 'veintisiete'],
      ['12', 'doce', '28', 'veintiocho'], ['13', 'trece', '29', 'veintinueve'], ['14', 'catorce', '', ''], ['15', 'quince', '', '']
    ]}},
    {grid: {head: ['Zehner', '', 'Hunderter', ''], rows: [
      ['30', 'treinta', '100', 'cien'], ['40', 'cuarenta', '101', 'ciento uno'], ['50', 'cincuenta', '200', 'doscientos'],
      ['60', 'sesenta', '300', 'trescientos'], ['70', 'setenta', '400', 'cuatrocientos'], ['80', 'ochenta', '500', 'quinientos'],
      ['90', 'noventa', '600', 'seiscientos'], ['31', 'treinta y uno', '700', 'setecientos'], ['45', 'cuarenta y cinco', '800', 'ochocientos'],
      ['99', 'noventa y nueve', '900', 'novecientos']
    ]}},
    {grid: {head: ['Große Zahlen', ''], rows: [
      ['1.000', 'mil'], ['2.000', 'dos mil'], ['1.500', 'mil quinientos'], ['10.000', 'diez mil'],
      ['21.000', 'veintiún mil'], ['100.000', 'cien mil'], ['1.000.000', 'un millón']
    ]}},
    {ul: [
      'Bis 29 schreibt man die Zahl in einem Wort, ab 31 mit <b>y</b>: treinta y uno.',
      '<b>y</b> steht nur zwischen Zehner und Einer: ciento veinte, mil doscientos (ohne y).',
      'uno wird vor männlichen Nomen zu <b>un</b>: un café, veintiún años. Weiblich: una cerveza.',
      '<b>cien</b> steht allein, <b>ciento</b> vor weiteren Zahlen: ciento veinte.',
      'Unregelmäßig: quinientos (500), setecientos (700), novecientos (900).',
      'In Argentinien stehen Preise in Tausendern: Übe mil, diez mil, cincuenta mil.'
    ]}
  ]
},
{
  id: 'b3', title: 'Uhrzeit und Tageszeiten', sub: '¿Qué hora es?', gen: 'time',
  body: [
    {grid: {head: ['Uhrzeit', 'Spanisch'], rows: [
      ['1:00', 'Es la una.'], ['2:00', 'Son las dos.'], ['3:15', 'Son las tres y cuarto.'],
      ['4:30', 'Son las cuatro y media.'], ['5:45', 'Son las seis menos cuarto.'],
      ['6:10', 'Son las seis y diez.'], ['7:50', 'Son las ocho menos diez.'],
      ['12:00', 'Es mediodía.'], ['0:00', 'Es medianoche.']
    ]}},
    {ul: [
      'Nur bei ein Uhr steht die Einzahl: <b>Es la una</b>. Sonst: <b>Son las …</b>',
      'In Lateinamerika hörst Du statt menos auch: Son las cinco y cuarenta y cinco.',
      '<b>a las ocho</b> = um acht. ¿A qué hora sale el bus? —A las ocho y media.',
      'Tageszeit dazu: de la mañana, de la tarde, de la noche. A las siete de la mañana.',
      'Ungefähr: por la mañana, por la tarde, por la noche.'
    ]},
    {ex: [
      ['¿Qué hora es?', 'Wie spät ist es?'],
      ['¿A qué hora abre el museo?', 'Um wie viel Uhr öffnet das Museum?'],
      ['El bus sale a las seis y media de la mañana.', 'Der Bus fährt um halb sieben morgens ab.']
    ]}
  ]
},
{
  id: 'b4', title: 'Wochentage, Monate, Datum', sub: 'lunes, enero, el 5 de enero',
  body: [
    {grid: {head: ['Wochentage', '', 'Monate', ''], rows: [
      ['Montag', 'lunes', 'Januar', 'enero'], ['Dienstag', 'martes', 'Februar', 'febrero'], ['Mittwoch', 'miércoles', 'März', 'marzo'],
      ['Donnerstag', 'jueves', 'April', 'abril'], ['Freitag', 'viernes', 'Mai', 'mayo'], ['Samstag', 'sábado', 'Juni', 'junio'],
      ['Sonntag', 'domingo', 'Juli', 'julio'], ['', '', 'August', 'agosto'], ['', '', 'September', 'septiembre'],
      ['', '', 'Oktober', 'octubre'], ['', '', 'November', 'noviembre'], ['', '', 'Dezember', 'diciembre']
    ]}},
    {ul: [
      'Tage und Monate schreibt man klein.',
      '<b>el lunes</b> = am Montag, <b>los lunes</b> = montags. Ohne en: Llego el martes.',
      'Datum: <b>el 5 de enero</b>. Der Erste: el primero de enero.',
      'Jahreszeiten: la primavera, el verano, el otoño, el invierno. Im Januar ist in Argentinien Sommer.'
    ]},
    {ex: [
      ['Hoy es martes, 10 de noviembre.', 'Heute ist Dienstag, der 10. November.'],
      ['Mi vuelo sale el 5 de enero.', 'Mein Flug geht am 5. Januar.'],
      ['Los domingos no hay bus.', 'Sonntags fährt kein Bus.']
    ]}
  ],
  pairs: [
    ['Montag', 'lunes'], ['Dienstag', 'martes'], ['Mittwoch', 'miércoles'], ['Donnerstag', 'jueves'], ['Freitag', 'viernes'],
    ['Samstag', 'sábado'], ['Sonntag', 'domingo'], ['Januar', 'enero'], ['Februar', 'febrero'], ['März', 'marzo'],
    ['April', 'abril'], ['Mai', 'mayo'], ['Juni', 'junio'], ['Juli', 'julio'], ['August', 'agosto'], ['September', 'septiembre'],
    ['Oktober', 'octubre'], ['November', 'noviembre'], ['Dezember', 'diciembre'], ['am Montag', 'el lunes'], ['montags', 'los lunes'],
    ['der Sommer', 'el verano'], ['der Winter', 'el invierno'], ['der Frühling', 'la primavera'], ['der Herbst', 'el otoño'],
    ['am 5. Januar', 'el 5 de enero', 'el cinco de enero']
  ]
},
{
  id: 'b5', title: 'Fragewörter', sub: 'qué, dónde, cuándo, cómo',
  body: [
    {grid: {head: ['Deutsch', 'Spanisch', 'Beispiel'], rows: [
      ['was', 'qué', '¿Qué es esto?'], ['wer', 'quién, quiénes', '¿Quién es?'], ['wo', 'dónde', '¿Dónde está el baño?'],
      ['wohin', 'adónde', '¿Adónde vas?'], ['woher', 'de dónde', '¿De dónde eres?'], ['wann', 'cuándo', '¿Cuándo sale el bus?'],
      ['wie', 'cómo', '¿Cómo llego al centro?'], ['wie viel', 'cuánto, cuánta', '¿Cuánto cuesta?'],
      ['wie viele', 'cuántos, cuántas', '¿Cuántas noches?'], ['welcher', 'cuál, cuáles', '¿Cuál prefieres?'],
      ['warum', 'por qué', '¿Por qué no vienes?'], ['wozu', 'para qué', '¿Para qué sirve?'], ['mit wem', 'con quién', '¿Con quién viajas?']
    ]}},
    {ul: [
      'Die Präposition steht vorn, nie am Satzende: ¿De dónde eres? ¿Con quién viajas?',
      '<b>qué</b> + Nomen: ¿Qué hora es? <b>cuál</b> bei Auswahl: ¿Cuál es tu mochila?',
      'por qué (warum) schreibt man getrennt, porque (weil) zusammen.'
    ]}
  ],
  pairs: [
    ['was', 'qué'], ['wer', 'quién'], ['wo', 'dónde'], ['wohin', 'adónde'], ['woher', 'de dónde'], ['wann', 'cuándo'],
    ['wie', 'cómo'], ['wie viel (kostet es)', 'cuánto'], ['wie viele (Nächte)', 'cuántas'], ['welcher', 'cuál'],
    ['warum', 'por qué'], ['wozu', 'para qué'], ['mit wem', 'con quién'], ['weil', 'porque']
  ]
},
{
  id: 'b6', title: 'Pronomen und Besitz', sub: 'yo, tú, mi, tu, nuestro',
  body: [
    {grid: {head: ['Person', 'Subjekt', 'Besitz', 'nach Präposition'], rows: [
      ['ich', 'yo', 'mi, mis', 'mí (conmigo)'], ['du', 'tú (Arg.: vos)', 'tu, tus', 'ti (contigo)'],
      ['er, sie, Sie', 'él, ella, usted', 'su, sus', 'él, ella, usted'], ['wir', 'nosotros', 'nuestro, -a, -os, -as', 'nosotros'],
      ['sie, ihr, Sie (Pl.)', 'ellos, ellas, ustedes', 'su, sus', 'ellos, ellas, ustedes']
    ]}},
    {ul: [
      'Das Besitzwort richtet sich nach dem, was besessen wird: <b>mis</b> amigos, <b>nuestra</b> habitación.',
      '<b>su</b> heißt sein, ihr und Ihr. Bei Unklarheit: la mochila de él, de ella, de usted.',
      'mit mir, mit dir: <b>conmigo</b>, <b>contigo</b>. Sonst: para mí, para ti, sin ti.',
      'Körperteile und Kleidung stehen mit Artikel statt Besitzwort: Me duele la cabeza.'
    ]}
  ],
  pairs: [
    ['mein Rucksack', 'mi mochila'], ['meine Freunde', 'mis amigos'], ['dein Name', 'tu nombre'], ['deine Schuhe', 'tus zapatos'],
    ['unser Zimmer', 'nuestra habitación'], ['unsere Tickets', 'nuestros boletos'], ['sein Hund', 'su perro'],
    ['mit mir', 'conmigo'], ['mit dir', 'contigo'], ['für mich', 'para mí'], ['für dich', 'para ti'], ['ohne uns', 'sin nosotros']
  ]
},
{
  id: 'b7', title: 'Artikel, Geschlecht, Plural', sub: 'el, la, los, las', gen: 'gender',
  body: [
    {grid: {head: ['', 'männlich', 'weiblich'], rows: [
      ['bestimmt', 'el, los', 'la, las'], ['unbestimmt', 'un, unos', 'una, unas']
    ]}},
    {grid: {head: ['Endung', 'Geschlecht', 'Beispiele'], rows: [
      ['-o', 'meist männlich', 'el vaso, el pueblo'],
      ['-a', 'meist weiblich', 'la playa, la mesa'],
      ['-ción, -sión, -dad, -tad', 'weiblich', 'la habitación, la ciudad'],
      ['-ma (griechisch)', 'männlich', 'el problema, el clima, el idioma'],
      ['-or, -aje', 'männlich', 'el dolor, el viaje, el equipaje']
    ]}},
    {ul: [
      'Ausnahmen zum Merken: <b>el</b> día, <b>el</b> mapa. <b>la</b> mano, <b>la</b> foto, <b>la</b> moto.',
      'Betontes a am Wortanfang: <b>el</b> agua, aber weiblich: el agua fría, las aguas.',
      'a + el = <b>al</b>, de + el = <b>del</b>: Voy al mercado. Vengo del hostal.',
      'Plural: Vokal + <b>s</b> (playas), Konsonant + <b>es</b> (hoteles). z wird zu c: vez, veces.',
      'Adjektive passen sich an und stehen meist hinter dem Nomen: una playa bonita, dos cervezas frías.'
    ]}
  ]
},
{
  id: 'b8', title: 'Dieser, der da, jener', sub: 'este, ese, aquel',
  body: [
    {grid: {head: ['', 'hier (bei mir)', 'da (bei dir)', 'dort drüben'], rows: [
      ['männlich', 'este, estos', 'ese, esos', 'aquel, aquellos'],
      ['weiblich', 'esta, estas', 'esa, esas', 'aquella, aquellas'],
      ['neutral', 'esto', 'eso', 'aquello']
    ]}},
    {ul: [
      'Die neutralen Formen stehen für Unbekanntes oder Ganzes: ¿Qué es <b>esto</b>? <b>Eso</b> es.',
      'Passend dazu: aquí (hier), ahí (da), allí (dort).',
      'Im Laden zeigst Du einfach: Quiero <b>este</b>. ¿Cuánto cuesta <b>ese</b>?'
    ]},
    {ex: [
      ['¿Este bus va al centro?', 'Fährt dieser Bus ins Zentrum?'],
      ['Esa tabla es muy grande.', 'Das Brett da ist sehr groß.'],
      ['¿Qué es eso?', 'Was ist das da?']
    ]}
  ],
  pairs: [
    ['dieser Strand (hier)', 'esta playa'], ['dieses Hostel (hier)', 'este hostal'], ['diese Schuhe (hier)', 'estos zapatos'],
    ['diese Wellen (hier)', 'estas olas'], ['der Bus da', 'ese bus'], ['die Jacke da', 'esa chaqueta'],
    ['jener Berg dort drüben', 'aquella montaña'], ['Was ist das hier?', '¿qué es esto?'], ['das da (unbekannt)', 'eso']
  ]
},
{
  id: 'b9', title: 'Vergleichen und Mengen', sub: 'más que, tan como, muy, mucho',
  body: [
    {grid: {head: ['Muster', 'Beispiel'], rows: [
      ['más … que', 'Es más caro que el otro.'],
      ['menos … que', 'Esta ruta es menos difícil que esa.'],
      ['tan … como', 'Es tan bonito como en las fotos.'],
      ['el, la más …', 'Es la playa más bonita del país.'],
      ['mejor, peor', 'Este hostal es mejor.'],
      ['mayor, menor', 'Mi hermana mayor.']
    ]}},
    {ul: [
      '<b>muy</b> + Adjektiv oder Adverb: muy caro, muy bien.',
      '<b>mucho</b> + Nomen (passt sich an): mucho tiempo, mucha gente, muchos buses.',
      '<b>mucho</b> nach dem Verb: Me gusta mucho. Llueve mucho.',
      'Steigerung mit -ísimo: buenísimo, carísimo, riquísimo.'
    ]}
  ],
  pairs: [
    ['teurer als', 'más caro que'], ['so groß wie', 'tan grande como'], ['weniger als', 'menos que'], ['der beste', 'el mejor'],
    ['sehr müde', 'muy cansado'], ['viel Zeit', 'mucho tiempo'], ['viele Leute', 'mucha gente'], ['sehr gut', 'muy bien'],
    ['schlechter', 'peor'], ['es gefällt mir sehr', 'me gusta mucho']
  ]
}
];
