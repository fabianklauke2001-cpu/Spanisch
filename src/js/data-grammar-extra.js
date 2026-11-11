// Lückensätze im Stil klassischer Lehrbuch-Übungen: Verb in Klammern, richtige Form eintippen.
// Werden beim Start an die Lektionen angehängt.
const GRAMMAR_FILL = {
  g01: [
    ['Nosotros ___ (vivir) en Múnich.', 'vivimos'], ['¿Tú ___ (hablar) inglés?', 'hablas'],
    ['Mi hermana ___ (trabajar) en un banco.', 'trabaja'], ['Los turistas ___ (comprar) recuerdos.', 'compran'],
    ['Yo ___ (leer) mucho en el bus.', 'leo'], ['¿Ustedes ___ (comer) carne?', 'comen'],
    ['Ana y yo ___ (viajar) juntos.', 'viajamos'], ['¿Dónde ___ (vivir) tus padres?', 'viven'],
    ['El mesero ___ (abrir) la puerta.', 'abre'], ['Yo no ___ (beber) café.', 'bebo']
  ],
  g03: [
    ['Yo ___ (ir) a la playa todos los días.', 'voy'], ['¿Qué ___ (hacer, tú) esta noche?', 'haces'],
    ['Yo no ___ (saber) dónde está la terminal.', 'sé'], ['Nosotros ___ (tener) hambre.', 'tenemos'],
    ['Yo ___ (salir) del hostal a las siete.', 'salgo'], ['¿De dónde ___ (venir) ustedes?', 'vienen'],
    ['Yo te ___ (dar) mi número.', 'doy'], ['Ella siempre ___ (decir) la verdad.', 'dice'],
    ['Yo no ___ (conocer) Argentina.', 'conozco'], ['Yo ___ (poner) la mochila en el casillero.', 'pongo'],
    ['¿___ (ver, tú) la montaña?', 'ves'], ['Yo ___ (traer) las cervezas.', 'traigo']
  ],
  g04: [
    ['¿A qué hora ___ (empezar) la clase de surf?', 'empieza'], ['Yo no ___ (entender) al conductor.', 'entiendo'],
    ['¿___ (poder, tú) repetir, por favor?', 'puedes'], ['Nosotros ___ (querer) dos cafés.', 'queremos'],
    ['¿Cuánto ___ (costar) los boletos?', 'cuestan'], ['Yo ___ (dormir) en un hostal.', 'duermo'],
    ['Ellos ___ (pedir) la cuenta.', 'piden'], ['El museo ___ (cerrar) a las seis.', 'cierra'],
    ['¿___ (volver, ustedes) mañana?', 'vuelven'], ['Yo ___ (preferir) el bus.', 'prefiero'],
    ['Los niños ___ (jugar) en la playa.', 'juegan'], ['Nosotros ___ (pensar) viajar a Bariloche.', 'pensamos']
  ],
  g05: [
    ['Nahe Zukunft: Esta tarde ___ (descansar, yo).', 'voy a descansar'],
    ['Nahe Zukunft: ¿Qué ___ (hacer, tú) mañana?', 'vas a hacer'],
    ['Nahe Zukunft: El sábado ___ (llover).', 'va a llover'],
    ['Nahe Zukunft: Nosotros ___ (alquilar) una tabla.', 'vamos a alquilar'],
    ['Gerade jetzt: Ella ___ (hablar) por teléfono.', 'está hablando'],
    ['Gerade jetzt: ¿Qué ___ (leer, tú)?', 'estás leyendo'],
    ['Gerade jetzt: Los chicos ___ (dormir) todavía.', 'están durmiendo'],
    ['Gerade jetzt: Yo ___ (esperar) el bus.', 'estoy esperando']
  ],
  g06: [
    ['A mí ___ (gustar) los perros.', 'me gustan'], ['A ti ___ (encantar) viajar.', 'te encanta'],
    ['A Juan ___ (doler) la cabeza.', 'le duele'], ['A nosotros ___ (gustar) la comida.', 'nos gusta'],
    ['A mis amigos ___ (interesar) los volcanes.', 'les interesan'], ['¿A usted ___ (gustar) el vino?', 'le gusta']
  ],
  g07: [
    ['Yo ___ (levantarse) a las seis.', 'me levanto'], ['¿Cómo ___ (llamarse) tu amigo?', 'se llama'],
    ['Nosotros ___ (quedarse) en un hostal.', 'nos quedamos'], ['¿A qué hora ___ (acostarse, tú)?', 'te acuestas'],
    ['Ellos ___ (irse) mañana.', 'se van'], ['Yo ___ (ducharse) por la noche.', 'me ducho'],
    ['¿___ (sentirse, tú) bien?', 'te sientes'], ['Los niños ___ (divertirse) en la playa.', 'se divierten']
  ],
  g08: [
    ['Ayer yo ___ (comprar) un boleto a León.', 'compré'], ['¿A qué hora ___ (llegar, tú) anoche?', 'llegaste'],
    ['El bus ___ (salir) a las ocho.', 'salió'], ['Nosotros ___ (comer) en el mercado.', 'comimos'],
    ['Ellos ___ (viajar) por Perú el año pasado.', 'viajaron'], ['Yo ___ (pagar) la cuenta.', 'pagué'],
    ['Yo ___ (buscar) un cajero por todo el centro.', 'busqué'], ['Mi amigo ___ (perder) su pasaporte.', 'perdió'],
    ['¿___ (leer, ustedes) las reglas del hostal?', 'leyeron'], ['Anoche ella ___ (dormir) diez horas.', 'durmió'],
    ['Yo ___ (empezar) a surfear hace una semana.', 'empecé'], ['Ellos ___ (pedir) dos cervezas.', 'pidieron']
  ],
  g09: [
    ['Ayer nosotros ___ (ir) a la playa.', 'fuimos'], ['¿Qué ___ (hacer, tú) el fin de semana?', 'hiciste'],
    ['Yo ___ (estar) dos semanas en Costa Rica.', 'estuve'], ['Ella no ___ (poder) venir.', 'pudo'],
    ['Ellos ___ (decir) que no.', 'dijeron'], ['Yo ___ (tener) un problema con la reserva.', 'tuve'],
    ['¿Quién ___ (venir) a la fiesta?', 'vino'], ['El viaje ___ (ser) increíble.', 'fue'],
    ['Yo le ___ (dar) la propina al guía.', 'di'], ['Nosotros ___ (ver) un glaciar enorme.', 'vimos'],
    ['¿Dónde ___ (poner, tú) las llaves?', 'pusiste'], ['Mis amigos ___ (traer) comida.', 'trajeron']
  ],
  g10: [
    ['De niño yo ___ (jugar) al fútbol todos los días.', 'jugaba'], ['Antes nosotros ___ (vivir) en Berlín.', 'vivíamos'],
    ['El hostal ___ (ser) pequeño.', 'era'], ['___ (haber) mucha gente en la playa.', 'había'],
    ['Mis abuelos ___ (tener) un perro.', 'tenían'], ['Cuando era estudiante, yo ___ (ir) a clase en bicicleta.', 'iba'],
    ['Ella siempre ___ (comer) en el mismo restaurante.', 'comía'], ['¿Qué ___ (hacer, tú) cuando te llamé?', 'hacías']
  ],
  g12: [
    ['Compro el boleto. → ___ compro.', 'lo'], ['Veo a mis amigas. → ___ veo.', 'las'],
    ['Doy la llave a Ana. → ___ doy la llave.', 'le'], ['Le doy la llave a Ana. → ___ doy.', 'se la'],
    ['¿Me das el mapa? → ¿___ das?', 'me lo'], ['Busco mis zapatos. → ___ busco.', 'los']
  ],
  g13: [
    ['¿___ (estar, tú) alguna vez en Perú?', 'has estado'], ['Nunca ___ (ver, yo) un glaciar.', 'he visto'],
    ['Todavía no ___ (comer, nosotros).', 'hemos comido'], ['Ellos ya ___ (volver).', 'han vuelto'],
    ['¿Qué ___ (hacer, ustedes) hoy?', 'han hecho'], ['Yo ya ___ (escribir) el mensaje.', 'he escrito'],
    ['Ella ___ (romper) su celular.', 'ha roto'], ['¿___ (probar, tú) el ceviche?', 'has probado']
  ],
  g14: [
    ['___ (esperar, tú) un momento, por favor.', 'espera'], ['___ (venir, tú) aquí.', 'ven'],
    ['___ (seguir, usted) todo recto.', 'siga'], ['No ___ (preocuparse, tú).', 'te preocupes'],
    ['___ (decir, tú) la verdad.', 'di'], ['___ (tener, tú) cuidado.', 'ten'],
    ['___ (doblar, usted) a la izquierda.', 'doble'], ['No ___ (hablar, tú) tan rápido.', 'hables'],
    ['___ (poner, tú) la mochila aquí.', 'pon'], ['___ (pasar, ustedes), por favor.', 'pasen']
  ],
  g16: [
    ['Me ___ (gustar) alquilar una tabla.', 'gustaría'], ['¿___ (poder, tú) ayudarme?', 'podrías'],
    ['Mañana ___ (hacer) sol.', 'hará'], ['En tu lugar, yo ___ (ir) en bus.', 'iría'],
    ['El año que viene ___ (viajar, nosotros) a Chile.', 'viajaremos'], ['¿___ (tener, usted) una habitación libre?', 'tendría'],
    ['Yo ___ (decir) que sí.', 'diría']
  ],
  g18: [
    ['¿Vos ___ (tener) hambre?', 'tenés'], ['¿De dónde ___ (ser) vos?', 'sos'],
    ['___ (venir, vos) acá.', 'vení'], ['¿Qué ___ (querer) hacer vos?', 'querés'],
    ['___ (mirar, vos) qué lindo.', 'mirá'], ['¿Vos ___ (poder) ayudarme?', 'podés']
  ]
};
GRAMMAR.forEach(l => { (GRAMMAR_FILL[l.id] || []).forEach(x => { l.drill.items = l.drill.items || []; l.drill.items.push(['f', x[0], [].concat(x[1])]); }); });
