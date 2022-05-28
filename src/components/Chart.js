import React from 'react'
import { useState } from 'react';
import Plot from 'react-plotly.js';

function Chart(props) {
    const { history } = props;

    let [lastFirst, setLastFirst] = useState();

    let data;
    if (history != undefined) {
        data = [
            {
                x: [...Array(history.length).keys()],
                y: history,
                type: 'scatter',
                mode: 'lines',
                marker: { color: 'white' }
            }
        ]
    }

    let visGrid = document.getElementById("visual-grid");
    let gridWidth = 400;
    if (visGrid != null) {
        gridWidth = visGrid.offsetWidth + 20;
    }

    let layout = {
        width: gridWidth,
        height: 200,
        margin: {
            l: 50,
            t: 30,
            b: 40,
        },
        xaxis: {
            color: 'white',
            showgrid: false,
            title: "Iterations",
            rangemode: 'nonnegative',
            fixedrange: true
        },
        yaxis: {
            color: 'white',
            showgrid: false,
            title: "Shortest path",
            rangemode: 'nonnegative',
            fixedrange: true
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };

    return (
        <Plot
            id="plot"
            data={data}
            layout={layout}
        />
    )
}

export default Chart
