// Use D3 to read the JSON file


d3.json("../samples.json").then((otudata) => {
    window.otudata = otudata;
    console.log(otudata);
    var data = otudata;
  
    // Add ID#s to dropdown menu
    var listid = data.names;
    for (var i = 0; i < listid.length; i++) {
      selectB = d3.select("#selDataset");
      selectB.append("option").text(listid[i]);
    }
  
    // Set up default plot
    updatePlots(0)
  
    // Function for updating plots   
    function updatePlots(index) {
  
  
      // Set up arrays for horizontal bar chart & gauge chart
      var OTUs = data.samples[index].otu_ids;
      console.log(OTUs);
      var values1 = data.samples[index].sample_values;
      var otulabels = data.samples[index].otu_labels;
  
     
  
  
      // Populate Demographic Data card
      var demoKeys = Object.keys(data.metadata[index]);
      var demoValues = Object.values(data.metadata[index])
      var demographicData = d3.select('#sample-metadata');
  
      // clear demographic data
      demographicData.html("");
  
      for (var i = 0; i < demoKeys.length; i++) {
  
        demographicData.append("p").text(`${demoKeys[i]}: ${demoValues[i]}`);
      };
  
  
      // Slice and reverse data for horizontal bar chart
      var toptenotu = OTUs.slice(0, 10).reverse();
      var toptenfreq = values1.slice(0, 10).reverse();
      var toptentool = data.samples[0].otu_labels.slice(0, 10).reverse();
      var toptenlabels = toptenotu.map((otu => "OTU " + otu));
      //var reverselabels = toptenlabels.reverse();
  
      // Set up trace
      var trace1 = {
        x: toptenfreq,
        y: toptenlabels,
        text: toptentool,
        name: "",
        type: "bar",
        orientation: "h"
      };
  
      
      var bardata = [trace1];
  
      //layout
      var layout1 = {
        title: "Top 10 OTUs",
        margin: {
          l: 75,
          r: 75,
          t: 75,
          b: 50
        }
      };
  
      // Render the plot to the div tag with id "bar"
      Plotly.newPlot("bar", bardata, layout1);
  
      // Set up trace
      trace2 = {
        x: OTUs,
        y: values1,
        text: otulabels,
        mode: 'markers',
        marker: {
          color: OTUs,
          opacity: [1, 0.8, 0.6, 0.4],
          size: values1
        }
      }
  
      //data
      var bubblechart = [trace2];
  
      // Apply layout
      var layout2 = {
        title: 'otu bubble chart display',
        showlegend: false,
        height: 600,
        width: 930
      }
  
      // Render the plot to the div tag with id "bubble"
      Plotly.newPlot("bubble", bubblechart, layout2)
  
      
    }
  
    // On button click, call optionchanged()
    d3.selectAll("#selDataset").on("change", optionChanged);
  
  
  
    function optionChanged() {
      var dropdownMenu = d3.select("#selDataset");
       var person = dropdownMenu.property("value");
      console.log(person);
      // Initialize an empty array for the person's data
      console.log(data)
  
      for (var i = 0; i < data.names.length; i++) {
        if (person === data.names[i]) {
          updatePlots(i);
          return
        }
      }
    }
  
  });