<script>
  import GamePage from './GamePage.svelte';
  import StartPage from './StartPage.svelte';
  import seededRandom, {shuffle} from '../../common/seededRandom';
  import Swal from 'sweetalert2';

  export let title;
  export let data;
  export let params;
  let seed = parseInt(params.seed) || Math.floor(Math.random() * 100000000);
  let randomiser = seededRandom(seed);
  let isRotate = !!params.isRotate;

  const randomiseSeed = () => {
    seed = Math.floor(Math.random() * 100000000);
  }

  const setTodaySeed = () => {
    // ddmmyyyy
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    seed = yyyy + mm + dd;
    N = 4;
  };

  let isStart = false;
  let randomData;
  let randomKey;
  let randomNames;
  let keys = Object.keys(data);

  function latLngToWebMercator(lat, lng) {
    const RADIUS = 6378137; // Radius of the Earth in meters (WGS84)
    const x = RADIUS * (lng * Math.PI / 180);
    const y = RADIUS * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
    return [y, x];
  }

  const handleNext = () => {
    randomiser = seededRandom(seed);
    randomiser();

    // choose random key from data
    randomKey = keys[Math.floor(randomiser() * keys.length)];
    randomData = data[randomKey];
    randomNames = randomData.map((d) => d[0]);

    // randomData = randomData.map((d) => [mercatorY(d[2]), d[1]]);
    console.log(randomData)
    randomData = randomData.map((d) => latLngToWebMercator(d[2], d[1]));
    console.log(randomData)
    if (isRotate) {
      randomData = rotate(randomData);
    }
    randomData = normalise(randomData);

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
<StartPage {randomiseSeed} bind:seed={seed} {setTodaySeed} {handleNext} bind:isRotate={isRotate}/>
{:else}
<GamePage
  {title}
  bind:randomiser={randomiser}
  {randomiseSeed}
  {handleNext}
  {keys}
  {seed}
  {isRotate}
  {randomData}
  {randomNames}
  {randomKey}/>
{/if}