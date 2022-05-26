import { Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select, Slider, Typography } from '@mui/material'
import React, { useState } from 'react'

function Options(props) {
    const { map, setMap, cities, setCities, setNewCities, iterations, setIterations, algo, setAlgo, run, stop } = props;
    return (
        <>
            <Typography variant='h3' align='center'>
                Options
            </Typography>
            <Typography>Number of cities: {cities}</Typography>
            <Slider aria-label="Cities" valueLabelDisplay="off" value={cities} min={3} max={25} onChange={(e, v) => setCities(v)} />
            <Typography>Number of iterations: {iterations}</Typography>
            <Slider aria-label="Iterations" valueLabelDisplay="off" value={iterations} min={5} max={300} onChange={(e, v) => setIterations(v)} />
            <Typography>Select algorithm</Typography>
            <Select label="Algorithm" value={algo} onChange={(e, v) => setAlgo(e.target.value)} variant="filled">
                <MenuItem value="random">Random</MenuItem>
                <MenuItem value="greedy">Greedy</MenuItem>
                <MenuItem value="hill-climbing">Hill climbing</MenuItem>
                <MenuItem value="simulated-annealing">Simulated Annealing</MenuItem>
                <MenuItem value="genetic">Genetic</MenuItem>
            </Select>
            <Button onClick={() => setNewCities(cities)}>Create cities</Button>
            <Button onClick={() => run(algo, iterations, map)}>Run</Button>
        </>
    )
}

export default Options
