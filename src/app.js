// Disegna un singolo omino SVG nel gruppo passato come parametro
function createStickman(gruppo, scale) {
  if (!scale) scale = 1;
  var size = 25 * scale;

  // testa
  gruppo.append("circle")
    .attr("cx", 0)
    .attr("cy", -size * 1.1)
    .attr("r", size * 0.35)
    .attr("class", "stickman-head");

  // occhio sinistro
  gruppo.append("circle")
    .attr("cx", -size * 0.1)
    .attr("cy", -size * 1.15)
    .attr("r", size * 0.05)
    .attr("fill", "#fff");

  // occhio destro
  gruppo.append("circle")
    .attr("cx", size * 0.1)
    .attr("cy", -size * 1.15)
    .attr("r", size * 0.05)
    .attr("fill", "#fff");

  // corpo
  gruppo.append("line")
    .attr("x1", 0).attr("y1", -size * 0.9)
    .attr("x2", 0).attr("y2", size * 0.2)
    .attr("class", "stickman-body");

  // braccia
  gruppo.append("line")
    .attr("x1", -size * 0.4).attr("y1", -size * 0.3)
    .attr("x2", size * 0.4).attr("y2", -size * 0.3)
    .attr("class", "stickman-arms");

  // gamba sinistra
  gruppo.append("line")
    .attr("x1", 0).attr("y1", size * 0.2)
    .attr("x2", -size * 0.3).attr("y2", size * 0.7)
    .attr("class", "stickman-leg");

  // gamba destra
  gruppo.append("line")
    .attr("x1", 0).attr("y1", size * 0.2)
    .attr("x2", size * 0.3).attr("y2", size * 0.7)
    .attr("class", "stickman-leg");
}

// Funzione principale: riceve i dati dal JSON e costruisce la visualizzazione
function createVisualization(data) {

  // clickState non e' nel JSON (e' stato UI), lo aggiungo a runtime
  data.forEach(function(d) {
    d.clickState = 0;
  });

  // dimensioni SVG e margini
  var w = 900, h = 650;
  var margin = { top: 50, right: 50, bottom: 50, left: 50 };
  var innerWidth  = w - margin.left - margin.right;  // 800px
  var innerHeight = h - margin.top  - margin.bottom; // 550px

  // calcolo min/max su tutte le variabili per avere scale consistenti
  // (se usassi solo var1-2, var3-6 potrebbero uscire dai bordi al click)
  var allVars = [];
  for (var i = 0; i < data.length; i++) {
    allVars.push(data[i].var1, data[i].var2, data[i].var3,
                 data[i].var4, data[i].var5, data[i].var6);
  }
  var minVal = d3.min(allVars);
  var maxVal = d3.max(allVars);

  // scale lineari: mappano valori dati in pixel
  // yScale invertita perche' in SVG y=0 e' in alto
  var xScale = d3.scaleLinear().domain([minVal, maxVal]).range([0, innerWidth]);
  var yScale = d3.scaleLinear().domain([minVal, maxVal]).range([innerHeight, 0]);

  // setup SVG
  var grafico = d3.select("#visualization");
  grafico.selectAll("*").remove();
  grafico.attr("width", w).attr("height", h);

  // gruppo principale spostato di margin (margin convention D3)
  var areaDisegno = grafico.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // titolo
  grafico.append("text")
    .attr("x", w / 2).attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    .style("font-weight", "bold")
    .style("fill", "#2c3e50")
    .text("Dataset Multivariato - Visualizzazione Interattiva");

  // istruzioni in basso
  grafico.append("text")
    .attr("x", w / 2).attr("y", h - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "#666")
    .text("Click sugli omini per ciclare tra le coppie di variabili (1-2 -> 3-4 -> 5-6)");

  // data join: crea un gruppo <g> per ogni data-case, posizionato con var1-var2
  var omini = areaDisegno.selectAll(".stickman-group")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "stickman-group")
    .attr("transform", function(d) {
      return "translate(" + xScale(d.var1) + "," + yScale(d.var2) + ")";
    })
    .style("cursor", "pointer");

  // disegna omino ed etichetta per ogni gruppo
  omini.each(function(d) {
    var gruppoOmino = d3.select(this);
    createStickman(gruppoOmino);
    gruppoOmino.append("text")
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("fill", "#333")
      .text(d.name);
  });

  // stile iniziale omini
  grafico.selectAll(".stickman-head")
    .attr("fill", "#9b59b6")
    .attr("stroke", "#6c3483")
    .attr("stroke-width", 2);

  grafico.selectAll(".stickman-body, .stickman-arms, .stickman-leg")
    .attr("stroke", "#6c3483")
    .attr("stroke-width", 3)
    .attr("stroke-linecap", "round");

  // click: cicla clickState 0->1->2->0 e sposta l'omino sulla coppia di variabili corrispondente
  omini.on("click", function(event, d) {
    event.stopPropagation();

    d.clickState = (d.clickState + 1) % 3;

    var nuovaX, nuovaY;
    if (d.clickState === 0) {
      nuovaX = xScale(d.var1); nuovaY = yScale(d.var2);
    } else if (d.clickState === 1) {
      nuovaX = xScale(d.var3); nuovaY = yScale(d.var4);
    } else {
      nuovaX = xScale(d.var5); nuovaY = yScale(d.var6);
    }

    d3.select(this)
      .transition().duration(800).ease(d3.easeCubicInOut)
      .attr("transform", "translate(" + nuovaX + "," + nuovaY + ")");
  });

  // assi semitrasparenti di riferimento
  areaDisegno.append("g")
    .attr("transform", "translate(0," + innerHeight + ")")
    .call(d3.axisBottom(xScale).ticks(5))
    .style("opacity", 0.3);

  areaDisegno.append("g")
    .call(d3.axisLeft(yScale).ticks(5))
    .style("opacity", 0.3);
}

// Carica i dati dal JSON esterno e avvia la visualizzazione
document.addEventListener('DOMContentLoaded', function() {
  d3.json("data/dataset.json")
    .then(function(data) {
      createVisualization(data);
    })
    .catch(function(err) {
      console.error("Errore nel caricamento del dataset:", err);
    });
});
