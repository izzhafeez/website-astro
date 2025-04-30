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

    // choose 3 random locations
    locations = [];
    let visited = new Set();
    while (locations.length < N+1) {
      let index = Math.floor(randomiser() * data.length);
      let name = standardiseWithoutParen(data[index][0]);
      if (!visited.has(index) && cleanData[name].length == 1) {
        visited.add(index);
        locations.push(data[index]);
      }
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
  <GamePage bind:isStart={isStart} {locations} {title} {seed} {cleanData} {N} {randomiseSeed} {handleStart} {randomiser}/>
{/if}