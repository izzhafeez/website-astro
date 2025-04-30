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

  let hideColor = !!params.hideColor;
  let seed = parseInt(params.seed) || Math.floor(Math.random() * 100000000);
  let randomiser = seededRandom(seed);
  let locations = [];
  let lats;
  let lngs;
  let bounds = {};
  let digraph;

  let cleanData = [];

  onMount(() => {
    data.forEach(([k, v]) => {
      const name = standardiseWithoutParen(k);
      const lat = v[1];
      const lng = v[0];
      cleanData.push([k, name, lat, lng, v[2]]);
    })

    lats = data.map(x => x[1][1]).sort((a,b) => a - b);
    lngs = data.map(x => x[1][0]).sort((a,b) => a - b);

    bounds = L.latLngBounds([[lats[lats.length-1], lngs[lngs.length-1]], [lats[0], lngs[0]]]);
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
    digraph = null;

    // choose a random location from cleanData
    let randomIndex = Math.floor(randomiser() * cleanData.length);
    let randomLocation = cleanData[randomIndex];

    let name = randomLocation[1];
    let nameLen = name.length;
    
    // choose a random index from 0 to n-1
    let charIndex;
    let i = 0;
    while (!digraph || digraph[0] == " " || digraph[1] == " ") {
      i++;
      if (i > 100) {
        console.log("Too many iterations");
        break;
      }
      // choose a random index from 0 to n-1
      charIndex = Math.floor(randomiser() * (nameLen-1));
      digraph = name.slice(charIndex, charIndex+2).toLowerCase();
    }

    isStart = true;
  }
</script>

{#if !isStart}
  <StartPage {handleStart} bind:isStart={isStart} {randomiseSeed} {setTodaySeed} bind:seed={seed} bind:hideColor={hideColor}/>
{:else}
  <GamePage {digraph} {bounds} {cleanData} bind:isStart={isStart} {title} {seed} {randomiseSeed} {hideColor}/>
{/if}