function buildMetadata(sample) {

  d3.select("#sample-metadata").html(""); //clears html

 var mm= d3.select("#selDataset");
 console.log(mm);

  var elt = document.getElementById("selDataset"); // selects element
  var eltText = elt.options[elt.selectedIndex].text; // gets text of selected element

  //gets json data and appends to new paragraphs
  d3.json("/metadata/" + eltText).then(function (data) {

    var metaSelect = d3.select("#sample-metadata");

    Object.entries(data).forEach(([key, value]) => {

      metaSelect.append("p").text(key + " : " + value);
    });
  });


  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var elt = document.getElementById("selDataset"); // selects element
  var eltText = elt.options[elt.selectedIndex].text;
  
  // @TODO: Build a Bubble Chart using the sample data
  d3.json("/samples/" + eltText).then(function (data) {

    var metaSelect = d3.select("#sample-metadata");

    var a = data["otu_ids"]
    var b = data["sample_values"]

    var c = a.map(function (ids, i) {
      return [ids, b[i]];
    });

    var vals = c
    vals.sort(function (a, b) {
      return a[1] > b[1] ? -1 : 1;
    });

    var top = vals.slice(0, 9)

    y = []
    z = []
    var split = top.map(function (k) {

      y.push(k[0]);
      z.push(k[1]);
    });

    var trace1 = {
      values: z,
      labels: y,
      type: "pie"
    };

    var chartData = [trace1];

    var layout = {
      title: "Pie Chart",
    };

    Plotly.newPlot("pie", chartData, layout);
  

/////////////////////////////////////////////////////


var trace1 = {
  x: data["otu_ids"],
  y: data["sample_values"],
  mode: 'markers',
  marker: {
    size: data["sample_values"],
    color: data["otu_ids"]
  }
};

var data1 = [trace1];

var layout = {
  title: 'Bubble Plot',
  showlegend: false,
  // height: 600,
  // width: 600
};

Plotly.newPlot('bubble', data1, layout);


console.log(data)
})
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
