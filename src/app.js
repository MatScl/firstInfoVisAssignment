/**
 * FUNZIONE: generateData()
 * 
 * SCOPO: Genera un dataset sintetico di 12 casi (data-cases) con 6 variabili ciascuno
 * 
 * DETTAGLI IMPLEMENTAZIONE:
 * - Ogni data-case rappresenta un'entità da visualizzare (un "omino" nel nostro caso)
 * - Le 6 variabili (var1...var6) sono raggruppate in 3 coppie:
 *   * Coppia 1: var1 (asse X), var2 (asse Y) - stato iniziale
 *   * Coppia 2: var3 (asse X), var4 (asse Y) - primo click
 *   * Coppia 3: var5 (asse X), var6 (asse Y) - secondo click
 * 
 * GENERAZIONE VALORI RANDOM:
 * - Math.random() genera un numero casuale tra 0 e 1 (es: 0.347, 0.891)
 * - Moltiplicare per 80 porta il range a [0, 80]
 * - Aggiungere 10 shifta il range finale a [10, 90]
 * - Questo evita valori troppo vicini ai bordi del grafico
 * 
 * STRUTTURA DATI:
 * - id: identificatore numerico univoco (0-11)
 * - name: etichetta testuale per visualizzazione ("Dato_1", "Dato_2", etc.)
 * - var1-6: le sei variabili quantitative
 * - clickState: variabile di stato per tracciare quale coppia è attualmente mostrata
 *   (0 = var1-2, 1 = var3-4, 2 = var5-6)
 * 
 * RETURN: Array di 12 oggetti JavaScript, ognuno rappresenta un data-case completo
 */
function generateData() {
  var dataset = []; // inizializzo array vuoto che conterrà tutti i dati
  
  // ciclo for classico per creare 12 data-cases
  for (var i = 0; i < 12; i++) {
    dataset.push({
      id: i, // id numerico progressivo (0, 1, 2, ... 11)
      name: `Dato_${i + 1}`, // template literal ES6: crea "Dato_1", "Dato_2", etc.
      
      // Genero 6 variabili random usando formula: Math.random() * 80 + 10
      // Esempio calcolo: Math.random()=0.5 → 0.5*80=40 → 40+10=50 ✓
      var1: Math.random() * 80 + 10,  // prima variabile: asse X iniziale
      var2: Math.random() * 80 + 10,  // seconda variabile: asse Y iniziale
      var3: Math.random() * 80 + 10,  // terza variabile: asse X al primo click
      var4: Math.random() * 80 + 10,  // quarta variabile: asse Y al primo click
      var5: Math.random() * 80 + 10,  // quinta variabile: asse X al secondo click
      var6: Math.random() * 80 + 10,  // sesta variabile: asse Y al secondo click
      
      // Inizializzo clickState a 0 = visualizzo var1-var2
      // Questo valore cambierà a 1 o 2 quando l'utente clicca sull'omino
      clickState: 0
    });
  }
  
  return dataset; // ritorno l'array completo di 12 oggetti
}

/**
 * FUNZIONE: createStickman(g, scale)
 * 
 * SCOPO: Disegna un singolo stick figure (omino stilizzato) usando elementi SVG
 * 
 * PARAMETRI:
 * @param {d3.selection} g - Gruppo SVG (<g>) dove disegnare l'omino
 *                          D3 appenderà tutti gli elementi (circle, line) a questo gruppo
 * @param {number} scale - Fattore di scala opzionale (default=1)
 *                        Esempio: scale=1.5 disegna omino 50% più grande
 * 
 * COORDINATE SVG:
 * - Origine (0,0) è posizionata al centro del gruppo 'g'
 * - Asse X: negativo=sinistra, positivo=destra
 * - Asse Y: negativo=sopra, positivo=sotto (sistema SVG standard!)
 * 
 * STRUTTURA ANATOMICA OMINO:
 * - Testa: cerchio sopra (cy negativo = verso l'alto)
 * - Occhi: due piccoli cerchi bianchi dentro la testa
 * - Corpo: linea verticale dal collo ai fianchi
 * - Braccia: linea orizzontale a metà corpo
 * - Gambe: due linee diagonali che partono dai fianchi
 * 
 * SISTEMA DI CLASSI CSS:
 * - .stickman-head: per la testa (fill, stroke)
 * - .stickman-body, .stickman-arms, .stickman-leg: per le linee (stroke, stroke-width)
 * 
 * PROPORZIONI (con scale=1, size=25):
 * - Raggio testa: 8.75px (35% di size)
 * - Altezza totale: ~42.5px (da -27.5 a +17.5)
 * - Larghezza braccia: 20px (2 * 0.4 * size)
 */
function createStickman(g, scale) {
  // Se non viene passato scale, uso 1 (dimensione normale)
  // Questo è un pattern difensivo: evita errori se scale è undefined
  if(!scale) scale = 1;
  
  // Calcolo dimensione base moltiplicata per la scala
  // size sarà il nostro "modulo" per tutte le proporzioni dell'omino
  var size = 25 * scale;
  
  /**
   * TESTA - Elemento: <circle>
   * 
   * Attributi SVG:
   * - cx, cy: coordinate del centro (cx=0 centra sull'asse X del gruppo)
   * - r: raggio del cerchio
   * 
   * Calcolo posizione Y testa:
   * cy = -size * 1.1 = -27.5 (con size=25)
   * Il valore negativo sposta il cerchio VERSO L'ALTO rispetto all'origine
   * Il fattore 1.1 lascia spazio tra testa e corpo
   * 
   * Calcolo raggio:
   * r = size * 0.35 = 8.75px
   * Proporzione 35% mantiene la testa in scala col corpo
   */
  g.append("circle")
    .attr("cx", 0)                    // centrato orizzontalmente
    .attr("cy", -size * 1.1)         // posizionato in alto (-27.5px)
    .attr("r", size * 0.35)          // raggio 8.75px
    .attr("class", "stickman-head"); // classe CSS per styling
  
  /**
   * OCCHIO SINISTRO - Elemento: <circle>
   * 
   * Posizionamento relativo alla testa:
   * - cx: -size * 0.1 = -2.5px (spostato a SINISTRA rispetto al centro)
   * - cy: -size * 1.15 = -28.75px (leggermente PIÙ IN ALTO della testa)
   * - r: size * 0.05 = 1.25px (molto piccolo)
   * 
   * fill="#fff" (bianco) crea contrasto con la testa colorata
   */
  g.append("circle")
    .attr("cx", -size * 0.1)    // occhio sinistro: spostato a sx
    .attr("cy", -size * 1.15)   // stessa altezza della testa, ma un po' più su
    .attr("r", size * 0.05)     // raggio piccolo (1.25px)
    .attr("fill", "#fff");      // bianco per contrasto
  
  /**
   * OCCHIO DESTRO - Elemento: <circle>
   * 
   * Speculare all'occhio sinistro:
   * cx positivo (+2.5px) lo sposta a DESTRA
   * Gli altri attributi sono identici
   */
  g.append("circle")
    .attr("cx", size * 0.1)     // occhio destro: spostato a dx
    .attr("cy", -size * 1.15)   // stessa altezza dell'altro occhio
    .attr("r", size * 0.05)     // stesso raggio
    .attr("fill", "#fff");      // stesso colore bianco

  /**
   * CORPO - Elemento: <line>
   * 
   * Attributi linea SVG:
   * - (x1, y1): punto di partenza
   * - (x2, y2): punto di arrivo
   * 
   * Calcolo corpo verticale:
   * - x1 = x2 = 0 → linea perfettamente verticale
   * - y1 = -size * 0.9 = -22.5px (appena sotto la testa)
   * - y2 = size * 0.2 = 5px (fianchi, da cui partiranno le gambe)
   * - Lunghezza totale corpo: 22.5 + 5 = 27.5px
   */
  g.append("line")
    .attr("x1", 0)                // inizio linea: centro X
    .attr("y1", -size * 0.9)      // inizio linea: appena sotto testa (-22.5px)
    .attr("x2", 0)                // fine linea: stesso X (verticale!)
    .attr("y2", size * 0.2)       // fine linea: fianchi (+5px)
    .attr("class", "stickman-body"); // classe per stroke styling

  /**
   * BRACCIA - Elemento: <line>
   * 
   * Linea orizzontale a metà corpo:
   * - y1 = y2 = -size * 0.3 = -7.5px (stesso Y = orizzontale)
   * - x1 = -size * 0.4 = -10px (braccio sinistro)
   * - x2 = size * 0.4 = +10px (braccio destro)
   * - Larghezza totale braccia: 20px
   */
  g.append("line")
    .attr("x1", -size * 0.4)     // inizio: braccio sinistro (-10px)
    .attr("y1", -size * 0.3)     // altezza braccia: metà corpo (-7.5px)
    .attr("x2", size * 0.4)      // fine: braccio destro (+10px)
    .attr("y2", -size * 0.3)     // stessa Y = linea orizzontale
    .attr("class", "stickman-arms"); // classe CSS

  /**
   * GAMBA SINISTRA - Elemento: <line>
   * 
   * Linea diagonale dai fianchi al piede sinistro:
   * - Parte da: (0, size*0.2) = fianchi al centro
   * - Arriva a: (-size*0.3, size*0.7) = piede sinistro in basso a sx
   * 
   * Diagonale: il piede è spostato a SX (-7.5px) e IN BASSO (+17.5px)
   * Questo crea l'angolo della gamba
   */
  g.append("line")
    .attr("x1", 0)               // partenza: centro fianchi
    .attr("y1", size * 0.2)      // partenza Y: fianchi (+5px)
    .attr("x2", -size * 0.3)     // arrivo: piede sinistro (-7.5px)
    .attr("y2", size * 0.7)      // arrivo Y: piede in basso (+17.5px)
    .attr("class", "stickman-leg"); // classe CSS

  /**
   * GAMBA DESTRA - Elemento: <line>
   * 
   * Speculare alla gamba sinistra:
   * - x2 positivo (+7.5px) crea il piede destro
   * - Mantiene stessa inclinazione ma riflessa
   */
  g.append("line")
    .attr("x1", 0)               // partenza: centro fianchi
    .attr("y1", size * 0.2)      // partenza Y: stessa dei fianchi
    .attr("x2", size * 0.3)      // arrivo: piede destro (+7.5px)
    .attr("y2", size * 0.7)      // arrivo Y: stesso del piede sx
    .attr("class", "stickman-leg"); // classe CSS
}

/**
 * FUNZIONE PRINCIPALE: createVisualization()
 * 
 * SCOPO: Orchestrare l'intera visualizzazione D3.js
 * 
 * FASI PRINCIPALI:
 * 1. Generazione dati
 * 2. Setup dimensioni e margini (margin convention)
 * 3. Calcolo scale lineari per mappare dati → pixel
 * 4. Creazione SVG e gruppi
 * 5. Data join: associare dati a elementi grafici
 * 6. Rendering stick figures
 * 7. Binding eventi interattivi (click, hover)
 * 8. Rendering assi di riferimento
 * 
 * PATTERN D3: Margin Convention
 * - Dimensioni totali SVG: w × h (900×650)
 * - Margini: creano padding interno (50px per ogni lato)
 * - Area disegno effettiva: innerWidth × innerHeight (800×550)
 * - Beneficio: spazio per assi, etichette, senza sovrapposizioni
 */
function createVisualization() {
  /**
   * STEP 1: GENERAZIONE DATASET
   * Chiamo generateData() che ritorna array di 12 oggetti
   * Ogni oggetto ha: id, name, var1-6, clickState
   */
  var data = generateData();
  
  /**
   * STEP 2: DEFINIZIONE DIMENSIONI E MARGINI
   * 
   * MARGIN CONVENTION (pattern standard D3.js):
   * - w, h: dimensioni TOTALI dell'SVG (inclusi margini)
   * - margin: oggetto con padding per ogni lato
   * - innerWidth, innerHeight: area EFFETTIVA di disegno
   * 
   * Calcoli:
   * innerWidth = 900 - 50 - 50 = 800px
   * innerHeight = 650 - 50 - 50 = 550px
   * 
   * Questo lascia 50px di spazio su ogni lato per:
   * - Assi e tick labels
   * - Titoli e annotazioni
   * - Evitare che gli omini tocchino i bordi SVG
   */
  var w = 900;  // larghezza totale SVG
  var h = 650;  // altezza totale SVG
  var margin = { top: 50, right: 50, bottom: 50, left: 50 }; // padding uniforme
  var innerWidth = w - margin.left - margin.right;   // 800px effettivi
  var innerHeight = h - margin.top - margin.bottom;  // 550px effettivi

  /**
   * STEP 3: CALCOLO DOMAIN (DOMINIO DATI)
   * 
   * PROBLEMA: Le scale D3 hanno bisogno di conoscere min/max dei dati
   * SOLUZIONE: Itero tutti i data-cases e raccolgo TUTTE le variabili
   * 
   * DETTAGLIO IMPLEMENTAZIONE:
   * - Creo array allVars vuoto
   * - Per ogni data-case (12 iterazioni)
   * - Pusho tutte e 6 le variabili nell'array
   * - Risultato: allVars contiene 72 valori (12 casi × 6 variabili)
   * - d3.min/max trovano i valori estremi per definire il domain
   * 
   * PERCHÉ QUESTO METODO:
   * - Le scale devono essere consistenti per tutte le coppie di variabili
   * - Se usassi solo var1-2 per il domain, var3-6 potrebbero uscire dal range
   * - Raccogliendo TUTTE le variabili, garantisco che ogni valore sia visualizzabile
   */
  var allVars = []; // array che conterrà tutti i 72 valori
  for (var i = 0; i < data.length; i++) {
    // Per ogni data-case, aggiungo tutte e 6 le variabili
    allVars.push(data[i].var1);
    allVars.push(data[i].var2);
    allVars.push(data[i].var3);
    allVars.push(data[i].var4);
    allVars.push(data[i].var5);
    allVars.push(data[i].var6);
  }
  
  // d3.min() trova il valore minimo nell'array (es: 12.34)
  var minVal = d3.min(allVars);
  // d3.max() trova il valore massimo nell'array (es: 88.92)
  var maxVal = d3.max(allVars);

  /**
   * STEP 4: CREAZIONE SCALE LINEARI
   * 
   * CONCETTO SCALA D3:
   * Una scala è una FUNZIONE che mappa un valore dal DOMAIN al RANGE
   * - Domain: intervallo dei dati (es: [10, 90])
   * - Range: intervallo dei pixel (es: [0, 800])
   * 
   * Esempio xScale:
   * Se domain=[10,90] e range=[0,800]
   * xScale(10) → 0px (minimo dati → minimo pixel)
   * xScale(50) → 400px (metà dati → metà pixel)
   * xScale(90) → 800px (massimo dati → massimo pixel)
   * 
   * Formula interna (mapping lineare):
   * output = (input - domainMin) / (domainMax - domainMin) * (rangeMax - rangeMin) + rangeMin
   * 
   * DIFFERENZA xScale vs yScale:
   * - xScale: domain → range [0, innerWidth]
   *   Più alto il valore, più a DESTRA (standard)
   * 
   * - yScale: domain → range [innerHeight, 0] ⚠️ INVERTITO!
   *   Più alto il valore, più in ALTO
   *   PERCHÉ: In SVG, y=0 è in ALTO, y=max è in BASSO
   *   Invertendo il range, correggiamo questo comportamento
   *   Risultato: valori alti → alto nello schermo (intuitivo)
   */
  var xScale = d3.scaleLinear()
    .domain([minVal, maxVal])      // es: [12.34, 88.92] - intervallo dati
    .range([0, innerWidth]);       // [0, 800] - intervallo pixel orizzontale

  var yScale = d3.scaleLinear()
    .domain([minVal, maxVal])      // stesso domain di xScale per consistenza
    .range([innerHeight, 0]);      // [550, 0] ⚠️ INVERTITO! Alto=0px, Basso=550px
    // Inversione range: trasforma coordinate matematiche in coordinate SVG

  /**
   * STEP 5: SELEZIONE E SETUP SVG
   * 
   * d3.select("#visualization"):
   * - Trova l'elemento HTML con id="visualization"
   * - Ritorna una D3 selection (wrapper potente su elementi DOM)
   * 
   * .selectAll("*").remove():
   * - Seleziona TUTTI gli elementi figli (*)
   * - Li rimuove dal DOM
   * - SCOPO: pulizia prima di ridisegnare
   * - Utile se createVisualization() viene chiamata più volte
   * - Evita duplicazioni di elementi grafici
   */
  var svg = d3.select("#visualization"); // selezione D3 dell'SVG
  svg.selectAll("*").remove(); // rimuovo tutto per iniziare pulito

  /**
   * Setto dimensioni SVG usando attr():
   * - .attr("width", w): imposta attributo width="900"
   * - .attr("height", h): imposta attributo height="650"
   * Questi definiscono il viewport SVG totale
   */
  svg.attr("width", w)
     .attr("height", h);

  /**
   * STEP 6: CREAZIONE GRUPPO PRINCIPALE CON TRANSFORM
   * 
   * PATTERN: Margin Convention Group
   * - Appendo un <g> (group) all'SVG
   * - Applico transform="translate(50, 50)"
   * - EFFETTO: Tutti gli elementi dentro questo gruppo partono da (50,50)
   * - Coordinate (0,0) del gruppo = coordinate (50,50) dell'SVG
   * - BENEFICIO: Posso usare coordinate (0,0) → (800,550) senza pensare ai margini
   * - Il gruppo "sposta" tutto il sistema di coordinate
   * 
   * Template literal: `translate(${margin.left},${margin.top})`
   * Risultato stringa: "translate(50,50)"
   */
  var g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
    // Ora (0,0) dentro 'g' corrisponde a (50,50) nell'SVG

  /**
   * STEP 7: TITOLO PRINCIPALE
   * 
   * Elemento <text> appeso direttamente a svg (NON al gruppo g):
   * - x: w/2 = 450px (metà larghezza SVG)
   * - y: 30px (vicino al bordo superiore)
   * - text-anchor="middle": centra il testo rispetto a x
   *   (altrimenti x sarebbe l'inizio del testo)
   * 
   * Styling inline con .style():
   * - font-size: 22px (grande per visibilità)
   * - font-weight: bold (enfasi)
   * - fill: #2c3e50 (grigio scuro professionale)
   * 
   * .text(): imposta il contenuto testuale
   */
  svg.append("text")
    .attr("x", w / 2)              // centro orizzontale SVG
    .attr("y", 30)                 // 30px dall'alto
    .attr("text-anchor", "middle") // allineamento centrale
    .style("font-size", "22px")
    .style("font-weight", "bold")
    .style("fill", "#2c3e50")
    .text("Dataset Multivariato - Visualizzazione Interattiva");

  /**
   * STEP 8: ISTRUZIONI IN BASSO
   * 
   * Testo informativo per l'utente:
   * - Posizionato in basso (y = h - 10 = 640px)
   * - Centrato orizzontalmente
   * - Font più piccolo (12px) e colore meno contrastato (#666)
   * - Spiega l'interazione: click cicla tra var1-2 → var3-4 → var5-6
   */
  svg.append("text")
    .attr("x", w / 2)
    .attr("y", h - 10)             // quasi al bordo inferiore
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "#666")         // grigio medio
    .text("Click sugli omini per ciclare tra le coppie di variabili (1-2 → 3-4 → 5-6)");

  /**
   * STEP 9: DATA JOIN - IL CUORE DI D3.js
   * 
   * CONCETTO FONDAMENTALE:
   * D3 associa DATI a ELEMENTI DOM tramite il pattern "Data Join"
   * 
   * FASI DEL DATA JOIN:
   * 1. selectAll(".stickman-group"): seleziona tutti i gruppi (anche se non esistono ancora!)
   * 2. .data(data): associa l'array di dati alla selezione
   * 3. .enter(): ritorna i "placeholder" per elementi mancanti
   * 4. .append("g"): crea effettivamente gli elementi <g>
   * 
   * RISULTATO:
   * - 12 elementi <g> creati (uno per ogni data-case)
   * - Ogni <g> ha i DATI associati (accessibili nelle funzioni via parametro 'd')
   * - Classe CSS "stickman-group" per styling e selezione futura
   * 
   * TRANSFORM INIZIALE:
   * - Funzione anonima: function(d) { ... }
   * - 'd' è il data-case corrente (uno dei 12 oggetti)
   * - Posiziono il gruppo usando var1 (asse X) e var2 (asse Y)
   * - xScale(d.var1): converte valore dati → pixel X
   * - yScale(d.var2): converte valore dati → pixel Y
   * - Template literal: "translate(350, 120)" (esempio)
   * 
   * CURSOR POINTER:
   * - Cambia cursore a "manina" quando hover
   * - Feedback visivo che l'elemento è cliccabile
   */
  var stickmen = g.selectAll(".stickman-group") // selezione (inizialmente vuota)
    .data(data)                                   // associo i 12 data-cases
    .enter()                                      // enter selection: dati senza elementi
    .append("g")                                  // creo <g> per ogni data-case
    .attr("class", "stickman-group")             // classe CSS per identificazione
    .attr("transform", function(d) {
      // d = data-case corrente (es: {id:0, name:"Dato_1", var1:45, var2:67, ...})
      // Calcolo coordinate iniziali usando VAR1 e VAR2
      return `translate(${xScale(d.var1)},${yScale(d.var2)})`;
      // Esempio: "translate(350.5, 120.8)"
      // Questo posiziona il gruppo alle coordinate calcolate
    })
    .style("cursor", "pointer"); // cursore manina = cliccabile

  /**
   * STEP 10: RENDERING STICK FIGURES
   * 
   * PATTERN: .each() iteration
   * - Itera su ogni elemento della selezione
   * - Chiama funzione callback per ciascuno
   * - 'this' dentro la funzione = elemento DOM corrente
   * 
   * DETTAGLI:
   * - d3.select(this): converte 'this' in selezione D3
   * - createStickman(group): disegna omino nel gruppo
   * - Ogni gruppo ora contiene: circle (testa+occhi) + lines (corpo/braccia/gambe)
   * 
   * ETICHETTA NOME:
   * - Appendo <text> a ogni gruppo
   * - y=25: posizionato SOTTO l'omino (coordinate gruppo!)
   * - text-anchor="middle": centra il testo
   * - .text(d.name): usa proprietà 'name' del data-case ("Dato_1", etc.)
   */
  stickmen.each(function(d) {
    // 'this' = elemento DOM <g> corrente
    var group = d3.select(this); // converto in selezione D3
    
    // Chiamo funzione che disegna cerchi e linee dell'omino
    createStickman(group);
    
    // Aggiungo etichetta col nome sotto l'omino
    group.append("text")
      .attr("y", 25)                  // sotto i piedi dell'omino
      .attr("text-anchor", "middle")  // centrato rispetto all'omino
      .style("font-size", "10px")
      .style("fill", "#333")
      .text(d.name);                  // "Dato_1", "Dato_2", etc.
  });

  /**
   * STEP 11: STYLING INIZIALE OMINI
   * 
   * PATTERN: Selezione multipla con CSS classes
   * - svg.selectAll(): seleziona TUTTI gli elementi con quella classe
   * - Indipendentemente da quale gruppo appartengano
   * - Applico stili uniformi a tutti
   * 
   * STILI TESTA (.stickman-head):
   * - fill: colore riempimento cerchio (#9b59b6 = viola medio)
   * - stroke: colore bordo (#6c3483 = viola scuro)
   * - stroke-width: spessore bordo (2px)
   * Nota: questi colori verranno sovrascritti al click (verde/terracotta)
   * 
   * STILI LINEE (.stickman-body, .stickman-arms, .stickman-leg):
   * - stroke: colore linea (#6c3483 = viola scuro, matching testa)
   * - stroke-width: 3px (più spesso per visibilità)
   * - stroke-linecap: "round" = estremità arrotondate (vs "butt" quadrate)
   *   Effetto: linee appaiono più morbide e organiche
   */
  svg.selectAll(".stickman-head")
    .attr("fill", "#9b59b6")      // viola medio - colore iniziale testa
    .attr("stroke", "#6c3483")    // viola scuro - bordo testa
    .attr("stroke-width", 2);     // bordo 2px

  svg.selectAll(".stickman-body, .stickman-arms, .stickman-leg")
    .attr("stroke", "#6c3483")       // viola scuro - colore linee
    .attr("stroke-width", 3)         // linee spesse 3px
    .attr("stroke-linecap", "round"); // punte arrotondate

  /**
   * STEP 12: EVENTO CLICK - INTERATTIVITÀ PRINCIPALE
   * 
   * BINDING EVENTO:
   * - .on("click", function) attacca listener click a OGNI gruppo stickman
   * - Quando utente clicca su un omino, questa funzione viene eseguita
   * 
   * PARAMETRI CALLBACK:
   * @param {Event} event - oggetto evento DOM (click event)
   * @param {Object} d - data-case associato all'elemento cliccato
   * 
   * LOGICA CICLO STATI:
   * - clickState può essere 0, 1, o 2
   * - Operatore modulo %: (0+1)%3=1, (1+1)%3=2, (2+1)%3=0
   * - EFFETTO: ciclo infinito 0→1→2→0→1→2...
   * 
   * MAPPING STATI → VARIABILI → COLORI:
   * ┌─────────┬──────────┬──────────┬──────────────────────┐
   * │ Stato   │ Var X    │ Var Y    │ Colore               │
   * ├─────────┼──────────┼──────────┼──────────────────────┤
   * │ 0       │ var1     │ var2     │ #2D6A4F (verde scuro)│
   * │ 1       │ var3     │ var4     │ #95D5B2 (verde chiaro│
   * │ 2       │ var5     │ var6     │ #D4A574 (terracotta) │
   * └─────────┴──────────┴──────────┴──────────────────────┘
   * 
   * ANIMAZIONI:
   * - Transizione movimento: 800ms con easing cubico
   * - Transizione colore: 400ms (metà durata = più rapida)
   * - d3.easeCubicInOut: accelera all'inizio, rallenta alla fine (fluido)
   */
  stickmen.on("click", function(event, d) {
    /**
     * event.stopPropagation():
     * Previene che il click "bolla" agli elementi genitori
     * Se clicco l'omino, solo l'omino deve reagire (non svg o g)
     */
    event.stopPropagation();
    
    /**
     * AGGIORNAMENTO STATO
     * d.clickState è una proprietà DELL'OGGETTO DATI
     * Modificandola, mantengo lo stato tra click successivi
     * Ogni omino ha il SUO clickState indipendente
     * 
     * Esempio sequenza:
     * Click 1: d.clickState = (0+1)%3 = 1
     * Click 2: d.clickState = (1+1)%3 = 2
     * Click 3: d.clickState = (2+1)%3 = 0
     */
    d.clickState = (d.clickState + 1) % 3;
    
    /**
     * DICHIARAZIONE VARIABILI DESTINAZIONE
     * newX, newY: nuove coordinate pixel dove spostare l'omino
     * color: nuovo colore per la testa
     * Verranno assegnate nel blocco if/else successivo
     */
    var newX, newY;
    var color;
    
    /**
     * SELEZIONE VARIABILI IN BASE ALLO STATO
     * 
     * STATO 0: Coppia iniziale (var1, var2)
     * - newX = xScale(d.var1): mappa var1 su asse X
     * - newY = yScale(d.var2): mappa var2 su asse Y
     * - color = #2D6A4F: verde scuro bosco
     */
    if (d.clickState === 0) {
      newX = xScale(d.var1);  // coordinate X basata su prima variabile
      newY = yScale(d.var2);  // coordinate Y basata su seconda variabile
      color = "#2D6A4F";      // verde scuro (palette terracotta-verde)
      
    /**
     * STATO 1: Seconda coppia (var3, var4)
     * - color = #95D5B2: verde chiaro menta
     * - Diverso da stato 0 per feedback visivo chiaro
     */
    } else if (d.clickState === 1) {
      newX = xScale(d.var3);  // terza variabile → X
      newY = yScale(d.var4);  // quarta variabile → Y
      color = "#95D5B2";      // verde chiaro
      
    /**
     * STATO 2: Terza coppia (var5, var6)
     * - color = #D4A574: terracotta/beige caldo
     * - Contrasto massimo con i verdi
     */
    } else {
      newX = xScale(d.var5);  // quinta variabile → X
      newY = yScale(d.var6);  // sesta variabile → Y
      color = "#D4A574";      // terracotta
    }
    
    /**
     * ANIMAZIONE MOVIMENTO
     * 
     * d3.select(this):
     * - 'this' = elemento DOM cliccato (il gruppo <g>)
     * - Converto in selezione D3 per usare metodi D3
     * 
     * .transition():
     * - Abilita interpolazione animata tra stato corrente e stato target
     * - D3 calcola automaticamente i frame intermedi
     * 
     * .duration(800):
     * - Animazione dura 800 millisecondi (0.8 secondi)
     * - Valore bilanciato: abbastanza lento da vedere, abbastanza veloce da non annoiare
     * 
     * .ease(d3.easeCubicInOut):
     * - Funzione di easing: controlla la velocità dell'animazione nel tempo
     * - Cubic: curva polinomiale cubica (x³)
     * - InOut: accelerazione iniziale + decelerazione finale
     * - EFFETTO: movimento naturale, non lineare
     *   ┌─────────────────────────────┐
     *   │ Velocità                    │
     *   │     ╱‾‾‾‾‾‾╲                │
     *   │    ╱        ╲               │
     *   │   ╱          ╲              │
     *   │  ╱            ╲             │
     *   │ ╱              ╲            │
     *   └─────────────────────────────┘
     *        Tempo →
     * 
     * .attr("transform", ...):
     * - Target finale: translate(newX, newY)
     * - D3 interpola da vecchia posizione a nuova
     * - Esempio: da (100,200) a (350,450) in 800ms
     */
    d3.select(this)
      .transition()                              // inizio transizione
      .duration(800)                             // durata 0.8 secondi
      .ease(d3.easeCubicInOut)                  // easing cubico fluido
      .attr("transform", `translate(${newX},${newY})`); // nuova posizione
    
    /**
     * ANIMAZIONE COLORE TESTA
     * 
     * Selezione specifica: .select(".stickman-head")
     * - Trova il cerchio della testa DENTRO questo gruppo
     * - Non tocca corpo/braccia/gambe
     * 
     * Durata 400ms (metà del movimento):
     * - Cambio colore più rapido del movimento
     * - Feedback visivo immediato
     * 
     * Interpolazione colore:
     * - D3 converte colori esadecimali in RGB
     * - Interpola canali R, G, B separatamente
     * - Esempio: #9b59b6 → #2D6A4F
     *   RGB(155,89,182) → RGB(45,106,79)
     *   R: 155→45, G: 89→106, B: 182→79
     */
    d3.select(this).select(".stickman-head")
      .transition()
      .duration(400)       // più veloce del movimento
      .attr("fill", color); // nuovo colore basato su clickState
  });

  /**
   * STEP 13: EVENTO MOUSEENTER - HOVER ZOOM-IN
   * 
   * TRIGGER: Mouse entra nell'area del gruppo omino
   * 
   * OBIETTIVO:
   * - Ingrandire l'omino a 120% (scale 1.2)
   * - Ingrandire la testa leggermente
   * - Fornire feedback visivo per interattività
   * 
   * SFIDA: Preservare la posizione translate durante scale
   * 
   * PROBLEMA:
   * - Ogni gruppo ha transform="translate(x,y)"
   * - Voglio aggiungere scale(1.2) SENZA perdere la posizione
   * - Non posso semplicemente sovrascrivere con "scale(1.2)"
   * 
   * SOLUZIONE: REGEX PARSING
   * - Estraggo coordinate attuali dalla stringa transform
   * - Ricostruisco transform con entrambi translate E scale
   */
  stickmen
    .on("mouseenter", function() {
      /**
       * PARSING TRANSFORM CORRENTE
       * 
       * d3.select(this).attr("transform"):
       * - Ottiene il valore corrente di transform
       * - Es: "translate(350.5, 120.8)"
       * 
       * REGEX: /translate\(([-\d.]+),([-\d.]+)\)/
       * Breakdown del pattern:
       * - translate\( : letterale "translate(" (parentesi escaped)
       * - ([-\d.]+)   : gruppo cattura 1 - numero con segno/decimali
       *   [-\d.]      : classe caratteri: -, cifre, punto decimale
       *   +           : uno o più caratteri
       * - ,           : letterale virgola
       * - ([-\d.]+)   : gruppo cattura 2 - secondo numero
       * - \)          : letterale ")" chiusura
       * 
       * .match() ritorna array:
       * - match[0]: intera stringa matchata "translate(350.5, 120.8)"
       * - match[1]: primo gruppo catturato "350.5"
       * - match[2]: secondo gruppo catturato "120.8"
       */
      d3.select(this)
        .transition()
        .duration(200)  // animazione rapida (0.2 sec) per risposta immediata
        .attr("transform", function(d) {
          // Leggo transform corrente
          var currentTransform = d3.select(this).attr("transform");
          
          // Tento il match con regex
          var match = currentTransform.match(/translate\(([-\d.]+),([-\d.]+)\)/);
          
          /**
           * CONTROLLO VALIDITÀ MATCH
           * Se match è null (nessuna corrispondenza), ritorno transform invariato
           * Se match esiste, ho le coordinate in match[1] e match[2]
           */
          if (match) {
            /**
             * RICOSTRUZIONE TRANSFORM COMBINATO
             * 
             * Template literal: `translate(${match[1]},${match[2]}) scale(1.2)`
             * Risultato esempio: "translate(350.5,120.8) scale(1.2)"
             * 
             * ORDINE IMPORTANTE:
             * - translate PRIMA, scale DOPO
             * - SVG applica trasformazioni da sinistra a destra
             * - Prima sposta, POI scala
             * - Se invertissi, scalerebbe le coordinate translate!
             * 
             * EFFETTO scale(1.2):
             * - Ingrandisce tutto del 20%
             * - Corpo, testa, braccia, gambe: tutti 1.2x
             * - Mantiene proporzioni
             * - Centro di scala: origine del gruppo (0,0)
             */
            return `translate(${match[1]},${match[2]}) scale(1.2)`;
          }
          
          // Fallback: se regex fallisce, non cambio nulla
          return currentTransform;
        });
      
      /**
       * INGRANDIMENTO TESTA AGGIUNTIVO
       * 
       * PERCHÉ SEPARATO:
       * - scale(1.2) ingrandisce tutto uniformemente
       * - Voglio enfatizzare ANCORA di più la testa
       * - Feedback visivo più marcato
       * 
       * CALCOLO RAGGIO:
       * - Raggio base testa: size * 0.35 = 25 * 0.35 = 8.75px
       * - Raggio ingrandito: 9.5px
       * - Incremento: 9.5 / 8.75 ≈ 1.086 = +8.6%
       * 
       * COMBINATO CON SCALE:
       * - scale(1.2): testa diventa 8.75 * 1.2 = 10.5px
       * - Poi r=9.5 SOVRASCRIVE: testa effettivamente 9.5px
       * - Risultato: corpo scala a 1.2x, testa resta quasi originale
       *   (crea effetto comico / cartoon)
       * 
       * ANIMAZIONE:
       * - Stessa durata 200ms per sincronia con scale
       */
      d3.select(this).select(".stickman-head")
        .transition()
        .duration(200)
        .attr("r", 9.5); // da 8.75 a 9.5 (+8.6%)
    })
    
    /**
     * STEP 14: EVENTO MOUSELEAVE - HOVER ZOOM-OUT
     * 
     * TRIGGER: Mouse esce dall'area del gruppo omino
     * 
     * OBIETTIVO:
     * - Riportare omino a dimensione normale (scale 1)
     * - Ripristinare raggio originale testa
     * - Reversibilità completa dell'hover
     * 
     * LOGICA IDENTICA A MOUSEENTER:
     * - Stessa regex per parsing
     * - Stessa ricostruzione transform
     * - DIFFERENZA: scale(1) invece di scale(1.2)
     */
    .on("mouseleave", function() {
      /**
       * RIPRISTINO SCALA NORMALE
       * 
       * Parsing identico a mouseenter
       * Cambio solo il valore finale di scale: 1.2 → 1
       * scale(1) = nessuna scala = dimensioni originali
       */
      d3.select(this)
        .transition()
        .duration(200)  // stessa durata per simmetria
        .attr("transform", function(d) {
          var currentTransform = d3.select(this).attr("transform");
          var match = currentTransform.match(/translate\(([-\d.]+),([-\d.]+)\)/);
          
          if (match) {
            // NOTA: scale(1) è tecnicamente opzionale (equivale a nessuna scala)
            // Lo includo per chiarezza e per garantire override di scale(1.2)
            return `translate(${match[1]},${match[2]}) scale(1)`;
          }
          return currentTransform;
        });
      
      /**
       * RIPRISTINO RAGGIO TESTA ORIGINALE
       * 
       * r = 8.75: valore calcolato in createStickman()
       * size * 0.35 = 25 * 0.35 = 8.75px
       * 
       * Ritorna esattamente allo stato pre-hover
       */
      d3.select(this).select(".stickman-head")
        .transition()
        .duration(200)
        .attr("r", 8.75); // ripristino dimensione originale
    });

  /**
   * STEP 15: ASSI DI RIFERIMENTO
   * 
   * SCOPO:
   * - Fornire riferimenti numerici per le coordinate
   * - Aiutare a leggere le posizioni degli omini
   * - Contestualizzare i valori delle variabili
   * 
   * GENERATORI ASSI D3:
   * D3 fornisce generatori automatici di assi che:
   * - Calcolano posizioni dei tick (tacche)
   * - Generano label numeriche
   * - Disegnano linee e testo
   * 
   * d3.axisBottom(scale):
   * - Crea asse orizzontale con tick SOTTO la linea
   * - Usa xScale per mappare valori → posizioni
   * - .ticks(5): richiede ~5 tick (D3 sceglie valori "round" vicini)
   * 
   * d3.axisLeft(scale):
   * - Crea asse verticale con tick a SINISTRA della linea
   * - Usa yScale (già invertita!)
   * - Valori crescono verso l'alto (come atteso)
   */
  var xAxis = d3.axisBottom(xScale).ticks(5); // asse X inferiore, ~5 tick
  var yAxis = d3.axisLeft(yScale).ticks(5);   // asse Y sinistro, ~5 tick

  /**
   * RENDERING ASSE X
   * 
   * g.append("g"): nuovo gruppo per contenere l'asse
   * - Necessario perché l'asse è composto da multipli elementi
   *   (path per linea, g per ogni tick, text per labels)
   * 
   * .attr("transform", `translate(0,${innerHeight})`):
   * - Sposta asse in BASSO dell'area di disegno
   * - innerHeight = 550px
   * - Coordinate gruppo g: (0, 550) relative a 'g' principale
   * - PERCHÉ: axisBottom disegna tick verso il basso, voglio asse al bordo inferiore
   * 
   * .call(xAxis):
   * - METODO MAGICO D3: passa la selezione corrente alla funzione xAxis
   * - xAxis(selection) genera tutti gli elementi dell'asse
   * - Equivalente a: xAxis(d3.select(this))
   * 
   * .style("opacity", 0.3):
   * - Rendo asse semitrasparente (30% opacità)
   * - SCOPO: non deve distrarre dagli omini (elemento principale)
   * - Visibile ma non dominante
   */
  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`) // posiziono in basso
    .call(xAxis)                                       // genero asse X
    .style("opacity", 0.3);  // semitrasparente per non disturbare

  /**
   * RENDERING ASSE Y
   * 
   * Nessun transform necessario:
   * - axisLeft disegna tick a sinistra
   * - Origine gruppo g già al bordo sinistro (grazie a margin convention)
   * - Asse si estende automaticamente da 0 a innerHeight
   * 
   * .call(yAxis): genera asse Y completo
   * 
   * Stessa opacità 0.3 per consistenza visiva
   */
  g.append("g")
    .call(yAxis)               // genero asse Y
    .style("opacity", 0.3);    // semitrasparente
}

/**
 * EVENT LISTENER: DOMContentLoaded
 * 
 * SCOPO: Eseguire codice solo quando il DOM è completamente caricato
 * 
 * PROBLEMA EVITATO:
 * - Se script esegue prima del parsing HTML completo
 * - d3.select("#visualization") non troverebbe l'elemento
 * - Causerebbe errore o visualizzazione mancante
 * 
 * SOLUZIONE:
 * - DOMContentLoaded si attiva quando HTML parsing è completo
 * - Garantisce che <svg id="visualization"> esista
 * - Script D3 può operare sicuramente sul DOM
 * 
 * ALTERNATIVA NON USATA:
 * - Mettere <script> alla FINE del body (prima di </body>)
 * - Funzionerebbe ma DOMContentLoaded è più robusto
 * 
 * CALLBACK:
 * - function() anonima eseguita all'evento
 * - Chiama createVisualization() per iniziare rendering
 */
document.addEventListener('DOMContentLoaded', function() {
  createVisualization(); // avvio rendering quando DOM è pronto
});
