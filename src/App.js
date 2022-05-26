import logo from './logo.svg';
import './App.css';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Grid } from '@mui/material';
import Visual from './components/Visual';
import Options from './components/Options';
import Chart from './components/Chart';
import { useState } from 'react';
import { createPath } from './components/Path';
import { createCities } from './components/Cities';

function App() {
  const defaultCities = 8;
  const defaultAlgo = "random";
  const defaultIterations = 100;

  let [cities, setCities] = useState(defaultCities);
  let [algo, setAlgo] = useState(defaultAlgo);
  let [iterations, setIterations] = useState(defaultIterations);
  let [map, setMap] = useState(createCities(defaultCities));
  let [path, setPath] = useState();
  let [tempPath, setTempPath] = useState();
  let [distanceHistory, setDistanceHistory] = useState(Array());

  const setNewCities = (amount) => {
    setPath(undefined);
    setTempPath(undefined);
    setDistanceHistory(Array());
    setMap(createCities(amount));
  }

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const randomSolver = async (map, iterations) => {
    setDistanceHistory(Array(iterations));
    let length = map.cities.length;
    let minDistance = Infinity;
    for (let i = 0; i < iterations; i++) {
      path = createPath(length, map.cities);
      if (path.distance < minDistance) {
        minDistance = path.distance;
        setPath(path);
      }

      let history = distanceHistory;
      history[i] = minDistance;
      setDistanceHistory(history);

      setTempPath(path);
      await wait(10)
    }
    setTempPath(undefined);
  }

  const Run = (algo, iterations, map) => {
    if (algo == "random") {
      randomSolver(map, iterations);
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ bgcolor: '#7000ab' }}>
        <Grid container spacing={2} padding={2}>
          <Grid item xs={12} md={6}>
            <Visual map={map} path={path} tempPath={tempPath} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Options map={map} setMap={setMap} cities={cities} setCities={setCities} setNewCities={setNewCities} iterations={iterations} setIterations={setIterations} algo={algo} setAlgo={setAlgo} run={Run} />
            <Chart history={distanceHistory} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
