import { Button, ButtonGroup, FormControl, Grid, InputLabel, MenuItem, Select, Slider, Typography } from '@mui/material'
import React, { useState } from 'react'

function Options(props) {
    const { map, setMap, cities, setCities, setNewCities, iterations, setIterations, algo, setAlgo, run, stop, reset } = props;
    return (
        <>
            <Typography variant='h3' align='center'>
                TSP Solver
            </Typography>
            <Typography>Number of cities: {cities}</Typography>
            <Slider aria-label="Cities" valueLabelDisplay="off" value={cities} min={3} max={25} onChange={(e, v) => setCities(v)} />
            <Typography>Number of iterations: {iterations}</Typography>
            <Slider disabled={algo == "greedy"} aria-label="Iterations" valueLabelDisplay="off" value={iterations} min={5} max={300} onChange={(e, v) => setIterations(v)} />
            <Typography>Select algorithm</Typography>
            <Grid container spacing={0} padding={0}>
                <Grid item xs={12} md={6}>
                    <Select label="Algorithm" value={algo} onChange={(e, v) => setAlgo(e.target.value)} variant="outlined" fullWidth>
                        <MenuItem value="random">Random</MenuItem>
                        <MenuItem value="greedy">Greedy</MenuItem>
                        <MenuItem disabled value="hill-climbing">Hill climbing</MenuItem>
                        <MenuItem disabled value="simulated-annealing">Simulated Annealing</MenuItem>
                        <MenuItem disabled value="genetic">Genetic</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Button id="run" onClick={() => run(algo, iterations, map)} variant="contained" size="small">Run</Button>
                    <Button id="reset" onClick={() => reset()} variant="contained" size="small">Reset</Button>
                </Grid>
            </Grid>

        </>
    )
}

export default Options
