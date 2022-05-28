import logo from './logo.svg';
import './App.css';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Grid } from '@mui/material';
import Visual from './components/Visual';
import Options from './components/Options';
import Chart from './components/Chart';
import { useState } from 'react';
import { createPath, distance } from './components/Path';
import { createCities } from './components/Cities';
import { useEffect } from 'react';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#fff',
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#5f5',
    },
  },
});

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
    document.getElementById("run").style.display = "inline";
    document.getElementById("reset").style.display = "none";
  }

  useEffect(() => {
    setNewCities(cities);
  }, [cities])

  const Reset = () => {
    setPath(undefined);
    setTempPath(undefined);
    setDistanceHistory(Array());
    document.getElementById("run").style.display = "inline";
    document.getElementById("reset").style.display = "none";
  }

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const greedySolver = async (map) => {
    const getClosestCity = (cities, idx, path) => {
      let minDistance = Infinity;
      let minIdx = null;
      for (let i = 0; i < cities.length; i++) {
        if (path.includes(i))
          continue;
        let d = distance(cities[i], cities[idx]);
        if (d < minDistance) {
          minDistance = d;
          minIdx = i;
        }
      }
      return minIdx;
    }

    setDistanceHistory(Array(map.cities.length));
    let minDistance = Infinity;
    for (let i = 0; i < map.cities.length; i++) {
      let steps = Array(map.cities.length).fill(-1);
      steps[0] = i;
      for (let j = 1; j < map.cities.length; j++) {
        let closestIdx = getClosestCity(map.cities, steps[j - 1], steps);
        steps[j] = closestIdx;
      }
      let path = createPath(map.cities.length, map.cities, steps);
      setTempPath(path);
      if (path.distance < minDistance) {
        minDistance = path.distance;
        setPath(path);
      }
      let history = distanceHistory;
      history[i] = minDistance;
      setDistanceHistory(history);

      await wait(60);
    }
    setTempPath(undefined);
  }

  const randomSolver = async (map, iterations) => {
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
    document.getElementById("run").style.display = "none";
    document.getElementById("reset").style.display = "inline";
    if (algo == "random") {
      randomSolver(map, iterations);
    } else if (algo == "greedy") {
      greedySolver(map);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" className="center">
        <Box className="shadow">
          <Grid container spacing={2} padding={2}>
            <Grid item xs={12} md={6}>
              <Visual map={map} path={path} tempPath={tempPath} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Options map={map} setMap={setMap} cities={cities} setCities={setCities} setNewCities={setNewCities} iterations={iterations} setIterations={setIterations} algo={algo} setAlgo={setAlgo} run={Run} reset={Reset} />
              <Chart history={distanceHistory} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
