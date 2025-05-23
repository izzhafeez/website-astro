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
  let randomiser = seededRandom(seed);
  let locations = [];
  let cleanLocs = [];
  let lats;
  let lngs;
  let maxDist = 1;
  let latLngBound;

  let cleanData = {};

  onMount(() => {
    data.forEach(([k, v]) => {
      const name = standardiseWithoutParen(k);
      const lat = v[1];
      const lng = v[0];
      if (!cleanData[name]) cleanData[name] = [];
      cleanData[name].push([lat, lng]);
      cleanLocs.push([lat, lng]);
    })

    lats = data.map((x) => x[1][1]).sort((a,b)=>a-b);
    lngs = data.map((x) => x[1][0]).sort((a,b)=>a-b);

    latLngBound = [lats[0], lats[lats.length-1], lngs[0], lngs[lngs.length-1]];

    maxDist = Math.max(
      L.latLng(lats[lats.length-1], lngs[lngs.length-1]).distanceTo(L.latLng(lats[0], lngs[0])),
      L.latLng(lats[lats.length-1], lngs[0]).distanceTo(L.latLng(lats[0], lngs[lngs.length-1]))
    );
  });

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
  }

  let handleStart = () => {
    randomiser = seededRandom(seed);
    randomiser();
    locations = [];

    // chose 5 random locations from a random combination of lats and longs
    for (let i = 0; i < 5; i++) {
      let location = cleanLocs[Math.floor(randomiser() * cleanLocs.length)];
      locations.push(location);
    }
    isStart = true;
  }
</script>

{#if !isStart}
  <StartPage {handleStart} bind:isStart={isStart} {randomiseSeed} {setTodaySeed} bind:seed={seed}/>
{:else}
  <GamePage {latLngBound} {maxDist} {cleanData} {locations} bind:isStart={isStart} {title} {seed} {randomiseSeed}/>
{/if}