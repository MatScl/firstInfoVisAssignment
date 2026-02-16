# Visualizzazione Multivariata Interattiva

Progetto per il corso di Visualizzazione delle Informazioni - rappresentazione interattiva di dataset multivariati.

## Struttura

```
progetto intermedio/
├── index.html          # pagina principale
├── src/
│   ├── app.js         # codice javascript con D3
│   └── styles.css     # stili
└── docs/
    └── progettointermedio.txt   # spiegazione del codice
```

## Come usare

Basta aprire `index.html` in un browser (Chrome, Firefox, ecc).

Non serve installare nulla perché D3.js viene caricato da internet.

## Funzionalità

- Dataset con 10 casi e 6 variabili per caso
- Click sugli omini per cambiare le variabili visualizzate (3 coppie possibili)
- Animazioni fluide quando si muovono
- Cambio colore per capire in che stato sono

## Stati

- Blu = variabili 1 e 2
- Arancione = variabili 3 e 4  
- Verde = variabili 5 e 6

## Tecnologie

- D3.js v7 per le visualizzazioni
- HTML/CSS/JavaScript

## Note

Per testare in locale con un server:

```bash
python3 -m http.server 8080
```

Poi aprire http://localhost:8080
