// genero i dati random per i 12 omini
function generateData() {
  var dataset = [];
  for (var i = 0; i < 12; i++) {
    dataset.push({
      id: i,
      name: `Dato_${i + 1}`,
      var1: Math.random() * 80 + 10,  // valori tra 10 e 90
      var2: Math.random() * 80 + 10,
      var3: Math.random() * 80 + 10,
      var4: Math.random() * 80 + 10,
      var5: Math.random() * 80 + 10,
      var6: Math.random() * 80 + 10,
      clickState: 0  // serve per sapere su quale coppia di variabili siamo
    });
  }
  return dataset;
}

// funzione per disegnare un omino
function createStickman(g, scale) {
  if(!scale) scale = 1;
  var size = 25 * scale;
  
  // testa (un cerchio)
  g.append("circle")
    .attr("cx", 0)
    .attr("cy", -size * 1.1)
    .attr("r", size * 0.35)
    .attr("class", "stickman-head");
  
  // occhi
  g.append("circle")
    .attr("cx", -size * 0.1)
    .attr("cy", -size * 1.15)
    .attr("r", size * 0.05)
    .attr("fill", "#fff");
  
  g.append("circle")
    .attr("cx", size * 0.1)
    .attr("cy", -size * 1.15)
    .attr("r", size * 0.05)
    .attr("fill", "#fff");

  // corpo (linea verticale)
  g.append("line")
    .attr("x1", 0)
    .attr("y1", -size * 0.9)
    .attr("x2", 0)
    .attr("y2", size * 0.2)
    .attr("class", "stickman-body");

  // braccia (linea orizzontale)
  g.append("line")
    .attr("x1", -size * 0.4)
    .attr("y1", -size * 0.3)
    .attr("x2", size * 0.4)
    .attr("y2", -size * 0.3)
    .attr("class", "stickman-arms");

  // gamba sx
  g.append("line")
    .attr("x1", 0)
    .attr("y1", size * 0.2)
    .attr("x2", -size * 0.3)
    .attr("y2", size * 0.7)
    .attr("class", "stickman-leg");

  // gamba dx
  g.append("line")
    .attr("x1", 0)
    .attr("y1", size * 0.2)
    .attr("x2", size * 0.3)
    .attr("y2", size * 0.7)
    .attr("class", "stickman-leg");
}

// questa è la funzione principale che disegna tutto
function createVisualization() {
  var data = generateData();
  
  // dimensioni svg
  var w = 900;
  var h = 650;
  var margin = { top: 50, right: 50, bottom: 50, left: 50 };
  var innerWidth = w - margin.left - margin.right;
  var innerHeight = h - margin.top - margin.bottom;

  // trovo il minimo e massimo di tutte le variabili
  var allVars = [];
  for (var i = 0; i < data.length; i++) {
    allVars.push(data[i].var1);
    allVars.push(data[i].var2);
    allVars.push(data[i].var3);
    allVars.push(data[i].var4);
    allVars.push(data[i].var5);
    allVars.push(data[i].var6);
  }
  var minVal = d3.min(allVars);
  var maxVal = d3.max(allVars);

  // scale per mappare i valori sulle coordinate
  var xScale = d3.scaleLinear()
    .domain([minVal, maxVal])
    .range([0, innerWidth]);

  var yScale = d3.scaleLinear()
    .domain([minVal, maxVal])
    .range([innerHeight, 0]); // range invertito perche in svg y=0 è in alto

  // seleziono l'svg e pulisco tutto
  var svg = d3.select("#visualization");
  svg.selectAll("*").remove();

  svg.attr("width", w)
     .attr("height", h);

  // creo gruppo principale e sposto per i margini
  var g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // titolo
  svg.append("text")
    .attr("x", w / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    .style("font-weight", "bold")
    .style("fill", "#2c3e50")
    .text("Dataset Multivariato - Visualizzazione Interattiva");

  // istruzioni in basso
  svg.append("text")
    .attr("x", w / 2)
    .attr("y", h - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "#666")
    .text("Click sugli omini per ciclare tra le coppie di variabili (1-2 → 3-4 → 5-6)");

  // adesso creo i gruppi per gli omini
  var stickmen = g.selectAll(".stickman-group")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "stickman-group")
    .attr("transform", function(d) {
      return `translate(${xScale(d.var1)},${yScale(d.var2)})`;
    })
    .style("cursor", "pointer");

  // per ogni omino chiamo la funzione che lo disegna
  stickmen.each(function(d) {
    var group = d3.select(this);
    createStickman(group);
    
    // metto anche il nome sotto
    group.append("text")
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("fill", "#333")
      .text(d.name);
  });

  // stili per gli omini
  svg.selectAll(".stickman-head")
    .attr("fill", "#9b59b6")
    .attr("stroke", "#6c3483")
    .attr("stroke-width", 2);

  svg.selectAll(".stickman-body, .stickman-arms, .stickman-leg")
    .attr("stroke", "#6c3483")
    .attr("stroke-width", 3)
    .attr("stroke-linecap", "round");

  // gestione del click
  stickmen.on("click", function(event, d) {
    event.stopPropagation();
    
    // cambio stato (0 -> 1 -> 2 -> 0)
    d.clickState = (d.clickState + 1) % 3;
    
    // scelgo le coordinate in base allo stato corrente
    var newX, newY;
    var color;
    
    if (d.clickState === 0) {
      // stato 0: uso var1 e var2
      newX = xScale(d.var1);
      newY = yScale(d.var2);
      color = "#2D6A4F";  // verde scuro
    } else if (d.clickState === 1) {
      // stato 1: uso var3 e var4
      newX = xScale(d.var3);
      newY = yScale(d.var4);
      color = "#95D5B2";  // verde chiaro
    } else {
      // stato 2: uso var5 e var6
      newX = xScale(d.var5);
      newY = yScale(d.var6);
      color = "#D4A574";  // terracotta
    }
    
    // faccio l'animazione per spostare l'omino
    d3.select(this)
      .transition()
      .duration(800)
      .ease(d3.easeCubicInOut)
      .attr("transform", `translate(${newX},${newY})`);
    
    // cambio anche il colore della testa
    d3.select(this).select(".stickman-head")
      .transition()
      .duration(400)
      .attr("fill", color);
  });

  // effetto quando passo col mouse sopra
  stickmen
    .on("mouseenter", function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("transform", function(d) {
          var currentTransform = d3.select(this).attr("transform");
          var match = currentTransform.match(/translate\(([-\d.]+),([-\d.]+)\)/);
          if (match) {
            return `translate(${match[1]},${match[2]}) scale(1.2)`;
          }
          return currentTransform;
        });
      
      // ingrandisco un po la testa
      d3.select(this).select(".stickman-head")
        .transition()
        .duration(200)
        .attr("r", 9.5);
    })
    .on("mouseleave", function() {
      // quando tolgo il mouse torno normale
      d3.select(this)
        .transition()
        .duration(200)
        .attr("transform", function(d) {
          var currentTransform = d3.select(this).attr("transform");
          var match = currentTransform.match(/translate\(([-\d.]+),([-\d.]+)\)/);
          if (match) {
            return `translate(${match[1]},${match[2]}) scale(1)`;
          }
          return currentTransform;
        });
      
      d3.select(this).select(".stickman-head")
        .transition()
        .duration(200)
        .attr("r", 8.75);
    });

  // metto anche gli assi per riferimento
  var xAxis = d3.axisBottom(xScale).ticks(5);
  var yAxis = d3.axisLeft(yScale).ticks(5);

  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(xAxis)
    .style("opacity", 0.3);  // li metto trasparenti per non disturbare

  g.append("g")
    .call(yAxis)
    .style("opacity", 0.3);
}

// avvio tutto quando la pagina è caricata
document.addEventListener('DOMContentLoaded', function() {
  createVisualization();
});
