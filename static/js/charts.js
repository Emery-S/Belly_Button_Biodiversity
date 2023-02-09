

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("./static/resources/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("./static/resources/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("./static/resources/samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var gaugeSample = metadata.filter(metaObj => metaObj.id == sample);

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var results = resultArray[0];

    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var gaugeArray = gaugeSample[0];

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = results.otu_ids;
    var labels = results.out_labels;
    var values = results.sample_values;

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var wfreq = gaugeArray.wfreq;
    console.log(wfreq)


    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks =  ids.map(sampleObj => "OTU" + sampleObj).slice(0,10).reverse();
    console.log(yticks);

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barTrace = [{
      type: 'bar',
      x: values.slice(0,10).reverse(),
      y: yticks,
      marker: {
        color: "LightBlue"
      },
      orientation: "h",
      text: labels
    }];


    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures</b>",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" },
      width: 600,
      height: 600
    };
    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barTrace, barLayout);

    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubTrace = [{
      x: ids,
      y: values,
      text: labels,
      mode: 'markers',
      marker: {
        size: values,
        color: ids,
        colorscale: "Portland",
        sizemin: 6
    }
    }];
    
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubLayout = {
      title: "<b>Bacteria Cultures: Complete Individual Data Set</b>",
      xaxis: { title: "OTU IDs" },
      width: 900,
      height: 500,
      hovermode:'closest',
    }

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubTrace, bubLayout)
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeTrace = [{
      value: wfreq,
      type: "indicator",
      mode: "gauge+number",
      title: {text:"<b>Frequency of Belly Button Washes</b><br>per week</br>"},
      gauge: {
        axis: {range: [null,10], dtick: "2"},
        bar: {color: "MidnightBlue"},
        steps:[
          {range: [0, 2], color: "#b280b2"},
          {range: [2, 4], color: "thistle"},
          {range: [4, 6], color: "lavender"},
          {range: [6, 8], color: "lavenderblush"},
          {range: [8, 10], color: "papayawhip"}
        ],
        dtick: 2,
      }
    }];

    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      height: 550,
      width: 550, 
      automargin: true
    };
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeTrace, gaugeLayout);

  });
}
