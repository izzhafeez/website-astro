<script>
  import GamePage from './GamePage.svelte';
  import StartPage from './StartPage.svelte';
  import seededRandom, {shuffle} from '../../common/seededRandom';
  import Swal from 'sweetalert2';
  import DailyChoice from '../DailyChoice.svelte';

  export let title;
  export let data;
  export let instructions;
  export let key;
  export let isDaily = false;

  let date;

  let N = 8;
  let possible_N = [3, 4, 6, 8, 10, 12];
  let isRotate = true;
  let locations = [];
  let positions = [];

  let isStart = false;
  let randomiserSeed = Math.floor(Math.random() * 1000000);
  let randomiser = seededRandom(randomiserSeed);
  let encodeSeed = () => {
    return `${possible_N.indexOf(N)}${isRotate ? 1 : 0}${randomiserSeed}`;
  }
  let randomiseSeed = () => {
    randomiserSeed = Math.floor(Math.random() * 1000000);
    randomiser = seededRandom(randomiserSeed);
    seed = encodeSeed();
  }
  let seed = encodeSeed();
  let decodeSeed = () => {
    N = possible_N[parseInt(seed[0])];
    isRotate = parseInt(seed[1]) === 1;
    randomiserSeed = parseInt(seed.slice(2));
    randomiser = seededRandom(randomiserSeed);
  }

  function handleNext() {
    randomiser = seededRandom(randomiserSeed);
    // select N random locations from the data
    const allPositions = data.map((d) => [d.lat, d.lng]);
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
    locations = chosen.map((d) => d.name);
    positions = chosen.map((d) => [d.lat, d.lng]);
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

  const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
    });

  const copySeed = () => {
      navigator.clipboard.writeText(seed);
      toast.fire({
          icon: 'success',
          text: 'Copied Seed',
      });
  }
</script>

<div class="max-w-3xl mx-auto p-2 my-8">
  <h1 class="text-5xl font-black animate-text bg-gradient-to-r from-ns-500 via-ns-400 to-ns-300 bg-clip-text text-transparent">{title.toUpperCase()}</h1>
  <p class=" my-4">{instructions}
    {#if !isDaily}
      <button on:click={copySeed} class="underline hover:opacity-50">Copy the seed</button> and share with your friends!
    {:else if date}
      Daily Challenge for {date}.
    {/if}
  </p>
  {#if !isStart}
    {#if isDaily}
      <DailyChoice bind:randomiserSeed={randomiserSeed} handleStart={handleNext} bind:randomiser={randomiser} name={`POSITION PUZZLE: ${title}`} bind:date={date} fullKey={`position-${key}`}/>
    {:else}
      <StartPage bind:N={N} bind:isRotate={isRotate} handleNext={handleNext} bind:isStart={isStart} {decodeSeed} {randomiseSeed} bind:seed={seed} {key}/>
    {/if}
  {:else}
    <GamePage {positions} {locations} {randomiser} bind:isStart={isStart} {key} {date} {title}/>
  {/if}
</div>