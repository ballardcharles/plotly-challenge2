function showPlot(id) {

    d3.json("../data/samples.json").then((data) => {
        console.log(data)
        
        var samples = data.samples.filter(s => s.id.toString() === id)[0];

        console.log(samples)

        var topSamples = samples.sample_values.slice(0,10).reverse();

        var valueId = (samples.otu_ids.slice(0,10)).reverse();

        var otuId = valueId.map(d => "OTU " + d)

        var labels = samples.otu_labels.slice(0,10).reverse();

        var barTrace = {
            x: topSamples,
            y: otuId,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        var barData = [barTrace];

        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 50,
                t: 30,
                b: 20
            }
        };

        Plotly.newPlot("bar", barData, layout);

        var bubbleTrace = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: 'markers',
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        }

        var bubbleData = [bubbleTrace]

        var bubbleLayout = {
            title: `Belly Sample ${id}`,
            height: 600,
            width: 1300
        }

        Plotly.newPlot("bubble", bubbleData, bubbleLayout)

        var pieTrace = {
            values: topSamples,
            labels: otuId,
            type: 'pie'
        }

        var pieLayout = {
            title: "Top 10 OTU Counts"
        }

        var pieData = [pieTrace]

        Plotly.newPlot("gauge", pieData, pieLayout)
    
    });

};

function getDemoInfo (id){
    d3.json("../data/samples.json").then((data) => {

        var metaData = data.metadata;

        var demoId = metaData.filter(m => m.id.toString() === id)[0];

        var demoInfo = d3.select("#sample-metadata")

        demoInfo.html("")

        Object.entries(demoId).forEach(([key, value]) => {
            demoInfo.append("h6").text(key.charAt(0).toUpperCase() + key.slice(1) + ": " + value + "\n")
        })
    })
}

function optionChanged(id) {
    showPlot(id)
    getDemoInfo(id)
};

function init() {
    var selection = d3.select("#selDataset");

    d3.json("../data/samples.json").then((data) => {

        data.names.forEach((name) => {
            selection.append("option").text(name).property("value");
        });

        showPlot(data.names[0]);
        getDemoInfo(data.names[0]);
    });
};

const dataPromise = d3.json("../data/samples.json")

init();