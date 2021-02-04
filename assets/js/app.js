// @TODO: YOUR CODE HERE!


// Load data from csv
d3.csv('/assets/data/data.csv').then(function(demoData) {

    console.log(demoData);
  
    // chart data
  
    var pov = demoData.map(data => data.poverty); 
    var health = demoData.map(data => data.healthcare);
    console.log("Poverty Numbers", pov);
    console.log("Healthcare Numbers", health);
});