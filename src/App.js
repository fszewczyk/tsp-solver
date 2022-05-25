import logo from './logo.svg';
import './App.css';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Grid } from '@mui/material';
import Visual from './components/Visual';
import Options from './components/Options';
import { createCities, createPath } from './components/Solver';
import { useState } from 'react';
import { Path } from './components/Path';


function App() {
  const defaultCities = 8;
  const defaultAlgo = "random";
  const defaultIterations = 25;

  let [cities, setCities] = useState(defaultCities);
  let [algo, setAlgo] = useState(defaultAlgo);
  let [iterations, setIterations] = useState(defaultIterations);
  let [map, setMap] = useState();
  let [path, setPath] = useState();

  const setNewCities = (amount) => {
    setPath(undefined);
    setMap(createCities(amount));
  }
  const setRandomPath = (amount, cityMap) => {
    setPath(createPath(amount, cityMap.cities));
  }

  function Run() {
    setPath(createPath(cities, map.cities));
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ bgcolor: '#7000ab' }}>
        <Grid container spacing={2} padding={2}>
          <Grid item xs={12} md={6}>
            <Visual map={map} path={path} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Options map={map} setMap={setMap} cities={cities} setCities={setCities} setNewCities={setNewCities} iterations={iterations} setIterations={setIterations} algo={algo} setAlgo={setAlgo} run={Run} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
