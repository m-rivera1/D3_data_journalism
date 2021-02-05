// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv('/assets/data/data.csv').then(function(demoData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    demoData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.abbr = data.abbr;
        data.state = data.state;
        console.log(data.poverty, data.healthcare);
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(demoData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(demoData, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(demoData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "purple")
    .attr("opacity", ".5");

////trying to add text labels to circles
    // var circleLabels = chartGroup.selectAll('text')
    //   g.append('text')
    //   .text()


    // .data(demoData)
    // .enter()
    // .append('text')
    // .text((data) => d)
    // .attr("x", (d,i) => d.poverty)
    // .attr("x", (d,i) => d.healthcare)
    // .attr("r", 5);



    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>In Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
  
        // Event listeners with transitions
  circlesGroup.on("mouseover", function() {
    d3.select(this)
      .transition()
      .duration(1000)
      .attr("r", 20) // Enlarges circle due to mouse hover
      .attr("fill", "lightpurple");
  })
.on("mouseout", function() {
  d3.select(this)
    .transition()
    .duration(1000)
    .attr("r", 10) // Shrinkage due to mouse departure
    .attr("fill", "red");
});


      

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em") // NOTE 'em' is 10px units and 'd'  is like a 'delta' up the y-axis in this case
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);

  });


