// @TODO: YOUR CODE HERE!
function makeResponsive() {
  var svgArea = d3.select("body").select("svg");

  if(!svgArea.empty()) {
    svgArea.remove();
  }

}
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

  d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

  // Import Data
  d3.csv('/assets/data/data.csv').then(function(demoData) {

      // Step 1: Parse Data/Cast as numbers
      // ==============================
      demoData.forEach(function(data) {
          data.poverty = +data.poverty
          data.healthcare = +data.healthcare
          data.abbr = data.abbr
          data.state = data.state
          console.log(data.poverty, data.healthcare, data.abbr, data.state)
          });

      // Step 2: Create scale functions
      // ==============================
      var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(demoData, d => d.poverty)])
        .range([0, width]);

      var yLinearScale = d3.scaleLinear()
        .domain([2, d3.max(demoData, d => d.healthcare)])
        .range([height, 26]);

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
      .style("stroke-width", 2)
      .style("stroke", "black")
      .attr("fill", "purple")
      .attr("opacity", ".90")


      //add state abbr's to all circles   //including "selectAll("circle") by accident prevented my abbr text from displaying..took too long figure this out"
      var circlesGroup = chartGroup.selectAll()
      .data(demoData)
      .enter()
      .append('text')
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare))
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      // .style("font", "")
      .style("fill", "white")
      .text(d => (d.abbr))
      //console.log(d.abbr);
      

      // Step 6: Initialize tool tip
      // ==============================
      var toolTip = d3.tip()    
        .attr("class", "tooltip")
        .offset([80, -60])
        .style("font", "Ariel")
        // .style("display", "block")
        .html(function(d) {
          return (`${d.state}<hr>In Poverty: ${d.poverty}%<br>Lacks Healthcare: ${d.healthcare}%<br>`);

        });

        
      // Step 7: Create tooltip in the chart
      // ==============================
      chartGroup.call(toolTip);


      // Step 8: Create event listeners to display and hide the tooltip
      // ==============================
      circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
        
        })
        // hide tooltip when mouse leaves circle
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
            // d3.select(this)
            // .transition()
            // .duration(1000)
            // .attr("r", 15) // Shrinkage due to mouse departure
            // .attr("fill", "purple");
          });
    
          // Event listeners with transitions
      // circlesGroup.on("mouseover", function() {
      //   d3.select(this)
      //     .transition()
      //     .duration(1000)
      //     .attr("r", 20) // Enlarges circle due to mouse hover
      //     .attr("fill", "lightpurple");
  
              

      // Create axes labels    (***update font, bold, or size for these)
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

    
  
  // When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
});


