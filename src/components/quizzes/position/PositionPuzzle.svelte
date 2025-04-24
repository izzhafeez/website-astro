<script>
  import GamePage from './GamePage.svelte';
  import StartPage from './StartPage.svelte';
  import seededRandom, {shuffle} from '../../common/seededRandom';
  import Swal from 'sweetalert2';
  import DailyChoice from '../DailyChoice.svelte';
  import { standardiseWithoutParen } from '../../../data/standardiseName';

  export let title;
  export let data;
  export let params;
  export let key;

  let seed = parseInt(params.seed) || Math.floor(Math.random() * 100000000);
  let randomiser = seededRandom(seed);
  let N = parseInt(params.N) || 8;

  let possible_N = [3, 4, 6, 8, 10, 12];
  let isRotate = true;
  let locations = [];
  let positions = [];

  let isStart = false;

  let randomiseSeed = () => {
    seed = Math.floor(Math.random() * 100000000);
  }

  let setTodaySeed = () => {
    // ddmmyyyy
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    seed = yyyy + mm + dd;
    N = 8;
  }

  function handleNext() {
    if (isNaN(seed)) seed = Math.floor(Math.random() * 100000000);
    if (isNaN(N)) N = 8;
    if (N < 3) N = 3;
    if (N > data.length) N = data.length;

    randomiser = seededRandom(seed);
    randomiser();
    // select N random locations from the data
    const allPositions = data.map((d) => [d[1][1], d[1][0]]);
    const maxLat = Math.max(...allPositions.map(([lat, lng]) => lat));
    const minLat = Math.min(...allPositions.map(([lat, lng]) => lat));
    const maxLng = Math.max(...allPositions.map(([lat, lng]) => lng));
    const minLng = Math.min(...allPositions.map(([lat, lng]) => lng));
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);
    const threshold = 0.01 * maxDiff;
    let chosen = shuffle([...data], randomiser).slice(0, 2*N);
    let newChosen = [];

    for (let i = 0; i < chosen.length; i++) {
      let isClose = false;
      for (let j = 0; j < newChosen.length; j++) {
        if (Math.abs(chosen[i].lat - newChosen[j].lat) < threshold && Math.abs(chosen[i].lng - newChosen[j].lng) < threshold) {
          isClose = true;
          break;
        }
      }
      if (!isClose) {
        newChosen.push(chosen[i]);
      }
      if (newChosen.length === N) {
        break;
      }
    }
    chosen = newChosen;
    locations = chosen.map((d) => standardiseWithoutParen(d[0]));
    positions = chosen.map((d) => [d[1][1], d[1][0]]);
    if (isRotate) {
      positions = rotate(positions);
    }
    positions = normalise(positions);
    isStart = true;
  }

  function rotate(positions) {
    // rotates by a random angle about the centroid of the points
    const centroid = positions.reduce((acc, [lat, lng]) => [acc[0] + lat, acc[1] + lng], [0, 0]);
    centroid[0] /= positions.length;
    centroid[1] /= positions.length;

    const angle = randomiser() * 2 * Math.PI;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return positions.map(([lat, lng]) => {
      const x = lat - centroid[0];
      const y = lng - centroid[1];
      return [x * cos - y * sin + centroid[0], x * sin + y * cos + centroid[1]];
    });
  }

  function normalise(positions) {
    // normalises the positions to be within the range [0, 1]
    let minLat = Math.min(...positions.map(([lat, lng]) => lat));
    let minLng = Math.min(...positions.map(([lat, lng]) => lng));
    let maxLat = Math.max(...positions.map(([lat, lng]) => lat));
    let maxLng = Math.max(...positions.map(([lat, lng]) => lng));
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;

    const maxDiff = Math.max(latDiff, lngDiff);

    const adjustedCoords = positions.map(([lat, lng]) => [(lat - minLat) / maxDiff, (lng - minLng) / maxDiff]);
    // based on bounding box
    minLat = Math.min(...adjustedCoords.map(([lat, lng]) => lat));
    minLng = Math.min(...adjustedCoords.map(([lat, lng]) => lng));
    maxLat = Math.max(...adjustedCoords.map(([lat, lng]) => lat));
    maxLng = Math.max(...adjustedCoords.map(([lat, lng]) => lng));

    let midLat = (maxLat + minLat) / 2;
    let midLng = (maxLng + minLng) / 2;

    return adjustedCoords.map(([lat, lng]) => [lat - midLat + 0.5, lng - midLng + 0.5]);
  }
</script>

{#if !isStart}
  <StartPage bind:N={N} bind:isRotate={isRotate} handleNext={handleNext} bind:isStart={isStart} {randomiseSeed} {setTodaySeed} bind:seed={seed} {key}/>
{:else}
  <GamePage {positions} {locations} {randomiser} bind:isStart={isStart} {title} {seed} {randomiseSeed}/>
{/if}