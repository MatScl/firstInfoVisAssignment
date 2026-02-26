# Spiegazione del Progetto — In Parole Semplici

---

## Di cosa si tratta

Ho fatto una pagina web che mostra un grafico interattivo. Sul grafico ci sono dieci omini stilizzati, ognuno rappresenta un "dato" — come se avessi dieci persone diverse, e per ognuna avessi misurato sei cose diverse (altezza, peso, età, eccetera — nel nostro caso sono variabili generiche chiamate var1, var2... var6).

Il punto del progetto è che non puoi mostrare sei dimensioni tutte insieme in un grafico normale — un grafico ha solo due assi, X e Y. Allora la soluzione è: mostri due variabili alla volta, e lasci che l'utente cambi quali due sta guardando con un click. Ogni omino è posizionato nel grafico in base a due delle sue sei variabili. Clicchi sull'omino, lui si sposta in una nuova posizione (quella determinata dalle due variabili successive), e cambia colore per dirti in che "modalità" ti trovi.

---

## Come funziona praticamente

Quando apri la pagina, il codice carica un file JSON esterno (`data/dataset.json`) che contiene i dieci data-cases con i loro valori già definiti. Per ognuno ci sono sei variabili quantitative positive. Poi posiziona ogni omino sul grafico usando i primi due numeri: il primo diventa la coordinata orizzontale (X), il secondo quella verticale (Y).

A questo punto hai dodici omini sparsi per lo schermo, ognuno nella sua posizione iniziale. Gli omini hanno la testa verde scura.

Adesso clicchi su uno. Il codice prende i numeri 3 e 4 di quell'omino, li converte in coordinate pixel, e anima lo spostamento dell'omino verso quella nuova posizione in 800 millisecondi. La testa diventa verde chiara, per farti capire che ora stai guardando le variabili 3 e 4. Clicchi di nuovo, e l'omino si sposta ancora — questa volta sulle variabili 5 e 6, e la testa diventa color terracotta. Al terzo click torna alla posizione iniziale (variabili 1 e 2) e la testa torna verde scura. E così via in loop.

C'è anche un effetto hover: quando passi il mouse sopra un omino, lui si ingrandisce leggermente. Serve solo come feedback visivo — stai dicendo all'utente "questo elemento è interattivo, puoi cliccarci".

---

## Come è fatto il codice

Il codice è diviso in tre file.

**`index.html`** è lo scheletro della pagina. Contiene la struttura visibile — la card bianca, lo spazio SVG dove vengono disegnati gli omini, e la legenda in basso che spiega i colori. Non ha nessuna logica: carica semplicemente il CSS e il JavaScript.

**`src/styles.css`** si occupa solo dell'aspetto. Lo sfondo verde a gradiente, gli angoli arrotondati della card, le ombre, il colore delle linee degli omini. È tutto estetico, niente funzionale.

**`src/app.js`** è dove succede tutto. Contiene tre funzioni:

La prima, `generateData()`, non esiste più — i dati vengono caricati da un file JSON esterno (`data/dataset.json`) tramite `d3.json()`. Questo è più corretto: i dati sono separati dalla logica, e il dataset può avere valori arbitrari senza toccare il codice. Il `clickState` non è nel JSON (è uno stato dell'interfaccia, non un dato), quindi viene aggiunto a runtime su ogni oggetto prima di disegnare.

La seconda, `createStickman()`, sa come disegnare un singolo omino. Riceve un gruppo SVG e ci appende dentro un cerchio per la testa, due cerchietti bianchi per gli occhi, una linea verticale per il corpo, una orizzontale per le braccia, e due diagonali per le gambe. Usa coordinate relative all'origine del gruppo, quindi non si preoccupa di dove si trova nel grafico — ci pensa chi la chiama.

La terza, `createVisualization()`, è quella principale che orchestra tutto. Prima chiama `generateData()` per avere i dati. Poi calcola le dimensioni — lo spazio di disegno è 800×550 pixel con 50 pixel di margine per ogni lato. Poi crea le scale: una scala è una funzione che prende un valore dati (es. 45.2) e lo trasforma in un numero di pixel (es. 312px). Crea una scala per X e una per Y — quella per Y è invertita perché in SVG l'asse verticale va al contrario rispetto alla matematica normale (zero è in alto, non in basso).

Poi fa il "data join" — il meccanismo fondamentale di D3. In pratica dice: "ho dodici dati, crea dodici gruppi SVG, uno per ciascuno, e posizionali usando var1 e var2". Per ogni gruppo chiama `createStickman()` e aggiunge l'etichetta col nome.

Infine registra gli eventi: dice al browser "quando l'utente clicca su uno di questi gruppi, esegui questa funzione" e "quando ci passa sopra con il mouse, ingrandiscilo".

---

## La parte più interessante: le scale

Il concetto di scala è quello che tiene insieme tutto. I dati sono numeri tra 10 e 90. Lo schermo è largo 800 pixel. La scala fa la conversione tra questi due mondi. Se il valore minimo del dataset è 12 e il massimo è 88, la scala fa sì che 12 diventi 0 pixel (bordo sinistro) e 88 diventi 800 pixel (bordo destro). Un valore a metà, diciamo 50, diventa circa 400 pixel — esattamente al centro.

La cosa importante è che le scale vengono calcolate usando **tutte** le sei variabili insieme, non solo le prime due. Questo è fondamentale: se costruissi la scala solo su var1 e var2, potrebbe succedere che var3 o var4 abbiano un valore fuori da quel range, e l'omino al click uscirebbe dai bordi dello schermo. Raccogliendo tutti i 60 valori (10 data-cases × 6 variabili) prima di costruire le scale, mi assicuro che qualsiasi valore, in qualsiasi stato, stia sempre dentro l'area di disegno. Questo vale per qualsiasi dataset con valori arbitrari — non solo per i valori del nostro JSON.

---

## La parte più tecnica: l'hover

L'unico punto un po' più complicato è l'effetto hover. Quando passo il mouse sopra un omino, voglio ingrandirlo aggiungendo `scale(1.2)` alla sua trasformazione SVG. Il problema è che ogni omino ha già una trasformazione del tipo `translate(312, 145)` che lo posiziona nel grafico. Se sovrascrivessi quella con solo `scale(1.2)`, l'omino salterebbe alla posizione (0,0) — l'angolo in alto a sinistra — e si ingrandirebbe lì.

Per evitarlo, il codice legge la trasformazione attuale, estrae i due numeri con un'espressione regolare (una regex), e poi ricostruisce la trasformazione combinando posizione e scala: `translate(312, 145) scale(1.2)`. Quando il mouse se ne va, fa la stessa cosa ma con `scale(1)` — che equivale a nessuna scala, cioè dimensione normale.

---

## In sintesi

Il progetto è una visualizzazione multivariata interattiva: mostra dati con molte dimensioni usando glifi (omini) su un piano cartesiano, e permette all'utente di esplorare coppie diverse di variabili cliccando. Il codice è scritto con D3.js, una libreria JavaScript specializzata per questo tipo di visualizzazioni, che gestisce il mapping dati→pixel, la creazione degli elementi SVG e le animazioni.

---

*Spiegazione discorsiva per uso personale*
