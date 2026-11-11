// Wochenrhythmus, Ressourcen, Sprechanlässe.
const SPOTIFY = q => 'https://open.spotify.com/search/' + encodeURIComponent(q);

// Minuten je Block nach Tagesbudget
const BUDGET = {
  30: {cards: 10, gr: 10, lt: 10, li: 15, sp: 5, liSat: 20, mix: 0, sp2: 0},
  45: {cards: 15, gr: 12, lt: 18, li: 20, sp: 10, liSat: 22, mix: 8, sp2: 0},
  60: {cards: 18, gr: 15, lt: 22, li: 30, sp: 12, liSat: 32, mix: 10, sp2: 5}
};

const PHASES = [
  {n: 1, name: 'Reaktivieren', weeks: 'Woche 1 und 2', focus: 'Präsens, ser und estar, Kernwortschatz'},
  {n: 2, name: 'Vergangenheit', weeks: 'Woche 3 und 4', focus: 'Indefinido, Imperfecto, unterwegs und essen'},
  {n: 3, name: 'Reisealltag', weeks: 'Woche 5 und 6', focus: 'Pronomen, Imperativ, Surfen, Natur, Notfälle'},
  {n: 4, name: 'Feinschliff', weeks: 'Woche 7 und 8', focus: 'Höflichkeit, Smalltalk, Argentinien'}
];

const RES = {
  lt: {
    name: 'Language Transfer: Complete Spanish',
    note: '90 Audiolektionen auf Englisch. Drück auf Pause und antworte laut, bevor der Schüler im Kurs antwortet. Genau dieses Selbst-Bilden macht den Kurs so wirksam.',
    total: 90,
    links: [
      ['YouTube', 'https://www.youtube.com/playlist?list=PLeA5t3dWTWvvwf5fw0Nl7mVk0OUjP1Ln2'],
      ['SoundCloud', 'https://soundcloud.com/languagetransfer/sets/complete-spanish'],
      ['App', 'https://www.languagetransfer.org/app']
    ]
  },
  levels: [
    {
      name: 'Einstieg', hint: 'Langsam, mit Bildern und Gesten. Du solltest fast alles verstehen.',
      video: [
        ['Dreaming Spanish: Superbeginner', 'https://www.youtube.com/playlist?list=PLlpPf-YgbU7GbOHc3siOGQ5KmVSngZucl', 'YouTube-Playlist'],
        ['Dreaming Spanish: alle Videos nach Niveau', 'https://www.dreaming.com/spanish', 'Filter: Superbeginner']
      ],
      pod: [
        ['Dreaming Spanish Podcast', SPOTIFY('Dreaming Spanish Podcast'), 'Langsame Gespräche'],
        ['Simple Stories in Spanish', SPOTIFY('Simple Stories in Spanish'), 'Kurze Geschichten']
      ]
    },
    {
      name: 'Aufbau', hint: 'Klares Spanisch in normalem Tempo für Lernende. Ziel: den roten Faden halten.',
      video: [
        ['Dreaming Spanish: alle Videos nach Niveau', 'https://www.dreaming.com/spanish', 'Filter: Beginner'],
        ['Dreaming Spanish auf YouTube', 'https://www.youtube.com/@DreamingSpanish', 'Kanal'],
        ['Easy Spanish', 'https://www.youtube.com/channel/UCAL4AMMMXKxHDu3FqZV6CbQ', 'Straßeninterviews mit Untertiteln']
      ],
      pod: [
        ['Duolingo Spanish Podcast', 'https://podcast.duolingo.com/', 'Wahre Geschichten aus Lateinamerika, mit Transkript'],
        ['Duolingo Spanish Podcast auf Spotify', SPOTIFY('Duolingo Spanish Podcast'), '170 Folgen'],
        ['Simple Stories in Spanish', SPOTIFY('Simple Stories in Spanish'), 'Kurze Geschichten']
      ]
    },
    {
      name: 'Mittelstufe', hint: 'Natürliches Tempo, echte Themen. Wähle bei Dreaming Spanish das Land Argentina für den Akzent.',
      video: [
        ['Dreaming Spanish: alle Videos nach Niveau', 'https://www.dreaming.com/spanish', 'Filter: Intermediate, Land: Argentina'],
        ['Easy Spanish', 'https://www.youtube.com/channel/UCAL4AMMMXKxHDu3FqZV6CbQ', 'Straßeninterviews']
      ],
      pod: [
        ['Españolistos', SPOTIFY('Españolistos'), 'Gespräche aus Kolumbien'],
        ['How to Spanish Podcast', SPOTIFY('How to Spanish Podcast'), 'Mexikanisches Spanisch'],
        ['Duolingo Spanish Podcast', 'https://podcast.duolingo.com/', 'Zum entspannten Hören']
      ]
    }
  ]
};

// Sprechanlässe je Phase: laut beantworten, 2 bis 5 Minuten
const PROMPTS = [
  [
    'Stell Dich vor: Name, Alter, Herkunft, Wohnort, Arbeit.',
    'Beschreib Deine Familie und Deine Freunde.',
    'Was machst Du an einem normalen Tag? Erzähl im Präsens.',
    'Beschreib Deine Wohnung: Was gibt es, wo steht was?',
    'Was magst Du, was magst Du nicht? Nutze me gusta und no me gusta.',
    'Was hast Du heute und morgen vor? Nutze voy a.',
    'Du kommst im Hostel an. Was sagst Du an der Rezeption?',
    'Beschreib, was Du gerade um Dich herum siehst. Nutze hay, está und es.',
    'Erklär, warum Du Spanisch lernst und wohin Du reist.',
    'Stell fünf Fragen, die Du einer neuen Bekanntschaft im Hostel stellen würdest.'
  ],
  [
    'Was hast Du gestern gemacht? Erzähl im Indefinido.',
    'Erzähl von Deiner letzten Reise.',
    'Bestell ein komplettes Essen, von der Begrüßung bis zur Rechnung.',
    'Kauf ein Busticket: Ziel, Uhrzeit, Preis, Sitzplatz.',
    'Beschreib den Weg von Deiner Wohnung zum nächsten Supermarkt.',
    'Wie war Dein Wochenende?',
    'Wie warst Du als Kind und was hast Du gern gemacht? Nutze das Imperfecto.',
    'Beschreib Dein Lieblingsessen und wie man es zubereitet.',
    'Du bist auf dem Markt. Frag nach Preisen und handle.',
    'Erzähl von einem Tag, an dem etwas schiefging.'
  ],
  [
    'Buch eine Surfstunde: Level, Uhrzeit, Preis, Ausrüstung.',
    'Beschreib das Wetter heute und die Vorhersage für morgen.',
    'Erklär in der Apotheke, was Dir fehlt.',
    'Deine Buchung ist verschwunden. Lös das Problem an der Rezeption.',
    'Erzähl von einer Wanderung oder einem Tag in der Natur.',
    'Wo warst Du schon überall? Nutze he estado und he visto.',
    'Gib jemandem Tipps für München. Nutze den Imperativ: visita, prueba, no olvides.',
    'Dein Handy wurde gestohlen. Erklär es der Polizei.',
    'Vergleich zwei Orte, die Du kennst. Nutze más que, mejor und peor.',
    'Erzähl eine kurze Geschichte: Was passierte und wie war die Situation?'
  ],
  [
    'Smalltalk im Hostel: Wie lange bist Du unterwegs, wohin geht es als Nächstes?',
    'Sag Deine Meinung zu einem Thema und begründe sie. Nutze creo que und me parece que.',
    'Was würdest Du mit einem freien Jahr machen? Nutze den Condicional.',
    'Erzähl von Deinen Plänen für die Zeit nach der Reise.',
    'Was erhoffst Du Dir von der Reise? Nutze espero que und ojalá.',
    'Stell Dich einem Argentinier vor und frag ihn aus. Nutze vos.',
    'Empfiehl einen Film, ein Buch oder eine Serie.',
    'Beschreib einen der besten Tage Deines Lebens.',
    'Erklär, wie Weihnachten in Deutschland abläuft.',
    'Verabschiede Dich von Reisefreunden: bedanken, Kontakt tauschen, Gutes wünschen.'
  ]
];

const RP_HEAD = 'Hablemos solo en español. Soy un viajero alemán y mi nivel es A2. Usa frases cortas y vocabulario sencillo. Di una sola cosa por turno y espera mi respuesta. Si cometo un error importante, corrígeme en una frase corta entre paréntesis y sigue con la conversación. Cuando yo diga «fin», dame en alemán tres consejos concretos para mejorar. ';

const ROLEPLAYS = [
  ['Freies Gespräch', RP_HEAD + 'Eres mi compañero de conversación. Pregúntame por mi día, mis planes y mi viaje a Centroamérica y Argentina.'],
  ['Hostel: Check-in', RP_HEAD + 'Situación: eres el recepcionista de un hostal en Costa Rica. Yo llego con una reserva para tres noches. Pregúntame por mis datos y explícame las reglas, el desayuno y el wifi.'],
  ['Busbahnhof', RP_HEAD + 'Situación: trabajas en la boletería de una terminal de buses. Quiero viajar mañana a otra ciudad. Dime horarios, precios y duración, y véndeme el boleto.'],
  ['Restaurant', RP_HEAD + 'Situación: eres mesero en un restaurante local. Tráeme la carta, recomiéndame platos, toma mi pedido y al final tráeme la cuenta.'],
  ['Surfstunde buchen', RP_HEAD + 'Situación: trabajas en una escuela de surf. Quiero una clase para principiantes. Pregúntame por mi nivel y explícame horarios, precios, la marea y el equipo.'],
  ['Nach dem Weg fragen', RP_HEAD + 'Situación: eres una persona en la calle. Estoy perdido y busco la terminal de buses. Explícame el camino paso a paso y contesta mis preguntas.'],
  ['Apotheke', RP_HEAD + 'Situación: eres farmacéutico. No me siento bien. Pregúntame por mis síntomas y recomiéndame algo.'],
  ['Problem lösen', RP_HEAD + 'Situación: eres el recepcionista de un hostal y no encuentras mi reserva. El hostal está casi lleno. Busquemos juntos una solución.'],
  ['Smalltalk unter Reisenden', RP_HEAD + 'Situación: eres otro viajero en la cocina de un hostal. Charlemos sobre de dónde somos, nuestros viajes y qué recomendamos.'],
  ['Argentinien mit vos', RP_HEAD + 'Situación: sos un argentino de Bariloche y me hablás con voseo (vos tenés, vení, mirá). Charlemos sobre la Patagonia, el mate y qué hacer en la zona. Explícame brevemente las palabras argentinas que uses.']
];

const FRIEND_Q = [
  '¿De qué parte de Perú es tu familia?',
  '¿Qué comida peruana tengo que probar?',
  '¿Qué palabras se usan en Perú que no se usan en otros países?',
  '¿Cómo es un día normal para ti?',
  '¿Qué lugares de Sudamérica me recomiendas?',
  '¿Me cuentas algo de tu infancia?',
  '¿Qué planes tienes para este año?',
  '¿Cuál es tu película o serie favorita en español?',
  '¿Qué errores cometo cuando hablo? Corrígeme, por favor.',
  '¿Cómo se dice eso de forma más natural?'
];
