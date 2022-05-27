import React from 'react'
import Plot from 'react-plotly.js';

function Chart(props) {
    const { history } = props;

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

    let layout = {
        width: 400,
        height: 200,
        margin: {
            l: 40,
            t: 20,
            b: 40,
        },
        xaxis: {
            color: 'white',
            showgrid: false,
            title: "Iterations",
            rangemode: 'nonnegative',
            autorange: true,
            fixedrange: true
        },
        yaxis: {
            color: 'white',
            showgrid: false,
            title: "Shortest path",
            rangemode: 'nonegative',
            autorange: true,
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
