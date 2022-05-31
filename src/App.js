import logo from './logo.svg';
import './App.css';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Grid } from '@mui/material';
import Visual from './components/Visual';
import Options from './components/Options';
import Chart from './components/Chart';
import { useState } from 'react';
import { createPath, distance, Path } from './components/Path';
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
  let [stats, setStats] = useState({ visited: 0, shortestPath: undefined })

  const setNewCities = (amount) => {
    setPath(undefined);
    setTempPath(undefined);
    setDistanceHistory(Array());
    setMap(createCities(amount));
    document.getElementById("run").style.display = "inline";
    document.getElementById("reset").style.display = "none";
    document.getElementById("run-mobile").style.display = "inline";
    document.getElementById("reset-mobile").style.display = "none";
  }

  useEffect(() => {
    setNewCities(cities);
    Reset();
  }, [cities])

  useEffect(() => {
    Reset()
  }, [iterations])

  useEffect(() => {
    if (iterations > 300 && algo != 'simulated-annealing')
      setIterations(300);
    Reset();
  }, [algo])

  const Reset = () => {
    setPath(undefined);
    setTempPath(undefined);
    setDistanceHistory(Array());
    setStats({ visited: 0, shortestPath: undefined });
    document.getElementById("run").style.display = "inline";
    document.getElementById("reset").style.display = "none";
    document.getElementById("run-mobile").style.display = "inline";
    document.getElementById("reset-mobile").style.display = "none";
  }

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const greedySolver = async () => {
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
      let s = stats;
      s['visited'] += 1;
      s['shortestPath'] = minDistance;
      setStats(s);

      await wait(60);
    }
    setTempPath(undefined);
  }

  const randomSolver = async () => {
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
      let s = stats;
      s['visited'] += 1;
      s['shortestPath'] = minDistance;
      setStats(s);
      await wait(4)
    }
    setTempPath(undefined);
  }

  const hillClimbing = async () => {
    const length = map.cities.length;
    let currentPath = createPath(length, map.cities);

    setPath(currentPath);
    for (let i = 0; i < iterations; i++) {
      let copyCurrentPath = Object.assign({}, currentPath);
      let isLocalMinimum = true;
      for (let m = 0; m < length - 1; m++) {
        for (let n = m + 1; n < length; n++) {
          let editedPath = copyCurrentPath.path.slice();
          let temp = editedPath[m];
          editedPath[m] = editedPath[n];
          editedPath[n] = temp;
          let suspectPath = createPath(length, map.cities, editedPath);
          setTempPath(suspectPath);
          if (suspectPath.distance <= currentPath.distance) {
            isLocalMinimum = false;
            currentPath = suspectPath;
            setPath(currentPath);
          }
          let s = stats;
          s['visited'] += 1;
          setStats(s);
          if ((m + n) % (cities + 5 + Math.floor(Math.random() * 10)) == 0) // just for visualization purposes
            await wait(1);
        }
        let s = stats;
        s['shortestPath'] = currentPath.distance;
        setStats(s);
        let history = distanceHistory;
        history[i] = currentPath.distance;
        setDistanceHistory(history);
      }

      if (isLocalMinimum) {
        break;
      }
    }
    setTempPath(undefined);
  }

  const simulatedAnnealing = async () => {
    const acceptProbability = (T) => {
      return 1 / T;
    }

    const length = map.cities.length;
    let currentPath = createPath(length, map.cities);
    let histDistance = currentPath.distance;
    let minDistance = Math.Infinity;

    setPath(currentPath);
    let T;
    for (let i = 0; i < iterations; i++) {
      let idx1 = Math.floor(Math.random() * cities);
      let idx2;
      do {
        idx2 = Math.floor(Math.random() * cities);
      } while (idx1 == idx2);

      let editedPath = currentPath.path.slice();
      let temp = editedPath[idx1];
      editedPath[idx1] = editedPath[idx2];
      editedPath[idx2] = temp;
      editedPath = createPath(length, map.cities, editedPath);
      setTempPath(editedPath);

      if (editedPath.distance < currentPath.distance) {
        currentPath = editedPath;
        histDistance = currentPath.distance;
        minDistance = currentPath.distance;
        setPath(currentPath);
      } else if (Math.random() < acceptProbability(i)) {
        histDistance = currentPath.distance;
        currentPath = editedPath;
        setPath(currentPath);
      }
      let history = distanceHistory;
      history[i] = histDistance;
      setDistanceHistory(history);

      let s = stats;
      s['visited'] += 1;
      s['shortestPath'] = minDistance;
      setStats(s);

      if (i % 4 == 0)
        await wait(1);
    }
    setTempPath(undefined);
  }

  const geneticAlgorithm = async () => {
    const crossOver = (p1, p2, mutateChance) => {
      let p1Path = p1.path.slice();
      let p2Path = p2.path.slice();
      let cutOff = Math.floor(Math.random() * p2Path.length);
      let newPath = Array(p1Path.length).fill(-1);
      for (let i = 0; i < cutOff; i++) {
        newPath[i] = p1Path[i];
      }
      let idx = cutOff;
      for (let i = 0; i < p2Path.length; i++) {
        if (!newPath.includes(p2Path[i])) {
          newPath[idx] = p2Path[i];
          idx++;
        }
      }
      if (Math.random() < mutateChance) {
        let idx1 = Math.floor(Math.random() * cities);
        let idx2;
        do {
          idx2 = Math.floor(Math.random() * cities);
        } while (idx1 == idx2);
        let temp = newPath[idx1];
        newPath[idx1] = newPath[idx2];
        newPath[idx2] = temp;
      }
      let offspring = createPath(cities, map.cities, newPath);
      return offspring;
    }


    const length = cities;
    // Population Initalization
    const populationSize = length * 4;
    let population = Array(populationSize);
    let bestPath = undefined
    let minDistance = Infinity;
    for (let i = 0; i < populationSize; i++) {
      let newPath = createPath(length, map.cities);
      population[i] = newPath;
      if (bestPath == undefined || bestPath.distance > newPath.distance) {
        bestPath = newPath;
        setPath(bestPath);
      }
      setTempPath(newPath);
      let s = stats;
      s['visited'] += 1;
      if (bestPath.distance < minDistance) {
        minDistance = bestPath.distance;
        s['shortestPath'] = minDistance;
      }
      setStats(s);
      if (i % 10 == 0)
        await wait(1);
    }
    // GA
    for (let i = 0; i < iterations; i++) {
      let sumDistances = 0;
      // Sorting population
      population = population.sort((a, b) => a.distance - b.distance);
      let history = distanceHistory;
      history[i] = population[0].distance;
      setDistanceHistory(history);
      setPath(population[0]);

      let s = stats;
      s['shortestPath'] = population[0].distance;
      setStats(s);

      // Offspring creation
      let parents = population.slice(0, populationSize / 2);
      let newPopulation = Array(populationSize);
      for (let j = 0; j < parents.length / 2; j++) {
        let offspring1 = crossOver(parents[j], parents[parents.length - j - 1], 0.2);
        let offspring2 = crossOver(parents[parents.length - j - 1], parents[j], 0.2);
        let offspring3 = crossOver(parents[j], parents[parents.length - j - 1], 0.2);
        let offspring4 = crossOver(parents[parents.length - j - 1], parents[j], 0.2);
        newPopulation[j * 4] = offspring1;
        newPopulation[j * 4 + 1] = offspring2;
        newPopulation[j * 4 + 2] = offspring3;
        newPopulation[j * 4 + 3] = offspring4;
        let s = stats;
        s['visited'] += 4;
        setStats(s);
        if (i % 5 == 0) {
          setTempPath(offspring1);
        }
      }
      await wait(5);
      population = newPopulation;
    }
    setTempPath(undefined);
  }

  const Run = () => {
    document.getElementById("run").style.display = "none";
    document.getElementById("reset").style.display = "inline";
    document.getElementById("run-mobile").style.display = "none";
    document.getElementById("reset-mobile").style.display = "inline";
    if (algo == "random") {
      randomSolver();
    } else if (algo == "greedy") {
      greedySolver();
    } else if (algo == "hill-climbing") {
      hillClimbing();
    } else if (algo == "simulated-annealing") {
      simulatedAnnealing();
    } else if (algo == "genetic") {
      geneticAlgorithm();
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" className="center" >
        <Box className="shadow" marginBottom={2}>
          <Grid container spacing={2} padding={2} paddingTop={0}>
            <Grid item xs={12} md={6} id="visual-grid">
              <Visual map={map} path={path} tempPath={tempPath} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Options map={map} setMap={setMap} cities={cities} setCities={setCities} setNewCities={setNewCities} iterations={iterations} setIterations={setIterations} algo={algo} setAlgo={setAlgo} run={Run} reset={Reset} />
              <Chart history={distanceHistory} stats={stats} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider >
  );
}

export default App;
