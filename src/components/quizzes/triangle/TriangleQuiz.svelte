<script>
  import L from 'leaflet';
  import GamePage from './GamePage.svelte';
  import StartPage from './StartPage.svelte';
  import seededRandom, {shuffle} from '../../common/seededRandom';
  import Swal from 'sweetalert2';
  import DailyChoice from '../DailyChoice.svelte';
  import { standardiseWithoutParen } from '../../../data/standardiseName';
  import { onMount } from 'svelte';

  export let title;
  export let data;
  export let params;

  let seed = parseInt(params.seed) || Math.floor(Math.random() * 100000000);
  let N = parseInt(params.N) || 5;
  let isStart = false;
  let locations = [];
  let cleanData = {};
  let randomiser = seededRandom(seed);

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
    N = 5;
  }

  let handleStart = () => {
    if (isNaN(N) || N < 3 || N > 8) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Number of Hints',
        text: 'Please choose a number between 3 and 8.',
      });
      return;
    }

    randomiser = seededRandom(seed);
    randomiser();

    isStart = true;

    // choose first location
    let location = data[Math.floor(randomiser() * data.length)];

    // choose N nearest locations
    locations = [location];
    let dataByDistance = [];
    let visited = new Set(); // based on name
    for (let i = 0; i < data.length; i++) {
      let lat = data[i][1][1];
      let lng = data[i][1][0];
      let distance = L.latLng(location[1][1], location[1][0]).distanceTo(L.latLng(lat, lng));
      let name = standardiseWithoutParen(data[i][0]);
      if (visited.has(name)) continue; // skip if already visited
      visited.add(name);
      dataByDistance.push([data[i], distance]);
    }
    dataByDistance.sort((a, b) => a[1] - b[1]);

    for (let i = 0; i < N; i++) {
      locations.push(dataByDistance[i + 1][0]);
    }
  }

  onMount(() => {
    data.forEach(([k, v]) => {
      const name = standardiseWithoutParen(k);
      const lat = v[1];
      const lng = v[0];
      if (!cleanData[name]) cleanData[name] = [];
      cleanData[name].push([lat, lng]);
    })
  });
</script>

{#if !isStart}
  <StartPage {handleStart} {randomiseSeed} {setTodaySeed} bind:seed={seed} bind:N={N}/>
{:else}
  <GamePage bind:isStart={isStart} bind:locations={locations} {title} {seed} {cleanData} {N} {randomiseSeed} {handleStart} {randomiser}/>
{/if}