<script>
  import GamePage from './GamePage.svelte';
  import StartPage from './StartPage.svelte';
  import seededRandom from '../../common/seededRandom';
  import Swal from 'sweetalert2';
  export let title;
  export let data;
  export let instructions;

  let isStart = false;
  let N = 4;
  let answers = {};
  let guesses = 0;
  let tiles = [];
  let canNext = false;
  let tileCounts = {};
  let answered = [];
  let difficulty = 3; // out of 5
  let randomiserSeed = Math.floor(Math.random() * 1000000);
  let randomiser = seededRandom(randomiserSeed);
  let encodeSeed = () => {
    return `${N}${difficulty}${randomiserSeed}`;
  }
  let randomiseSeed = () => {
    randomiserSeed = Math.floor(Math.random() * 1000000);
    randomiser = seededRandom(randomiserSeed);
    seed = encodeSeed();
  }
  let seed = encodeSeed();
  let decodeSeed = () => {
    N = parseInt(seed[0]);
    difficulty = parseInt(seed[1]);
    randomiserSeed = parseInt(seed.slice(2));
    randomiser = seededRandom(randomiserSeed);
  }

  const difficultyMappings = {
    1: 5,
    2: 15,
    3: 50,
    4: 150,
    5: 10000
  }

  function handleNext() {
    // select N random keys from data
    let keys = Object.keys(data);
    canNext = false;
    answers = {};
    tileCounts = {};
    tiles = [];
    answered = [];
    // ensure the N keys are distinct
    while (Object.keys(answers).length < N) {
      let randomKey = keys[Math.floor(randomiser() * keys.length)];

      if (answers[randomKey]) {
        continue;
      }

      let tilesData = data[randomKey];

      if (tilesData.length < 4) {
        continue;
      }

      let candidateTiles = [];

      for (let tile of tilesData) {
        if (!tileCounts[tile]) {
          candidateTiles.push(tile);
        }
      }

      if (candidateTiles.length < 4) {
        continue;
      }

      // choose 4 random candidates from the candidate tiles
      let randomTiles = [];
      let indexes = {};
      while (randomTiles.length < 4) {
        let randomIndex = Math.floor(randomiser() * Math.min(candidateTiles.length, difficultyMappings[difficulty]));
        if (indexes[randomIndex]) {
          continue;
        }
        indexes[randomIndex] = true;
        let randomTile = candidateTiles[randomIndex];
        randomTiles.push(randomTile);

        if (!tileCounts[randomTile]) {
          tileCounts[randomTile] = 0;
        }

        tileCounts[randomTile] += 1;
      }

      answers[randomKey] = randomTiles;
      tiles = [...tiles, ...randomTiles];
    }

    tiles.sort((a, b) => 0.5 - randomiser());

    guesses = N;
    answered = [];

    randomiser = seededRandom(randomiserSeed);
  }

  const toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
      }
  });

  const copySeed = () => {
      navigator.clipboard.writeText(seed);
      toast.fire({
          icon: 'success',
          text: 'Copied Seed',
      });
  }
</script>

<div class="max-w-3xl mx-auto p-2 my-8 md:my-20">
  <h1 class="text-5xl font-black animate-text bg-gradient-to-r from-ns-500 via-ns-400 to-ns-300 bg-clip-text text-transparent">{title.toUpperCase()}</h1>
  <p class=" my-4">{instructions} <button on:click={copySeed} class="underline hover:opacity-50">Copy the seed</button> and share with your friends!</p>
  {#if !isStart}
  <StartPage bind:N={N} handleNext={handleNext} bind:isStart={isStart} bind:difficulty={difficulty} {decodeSeed} {randomiseSeed} bind:seed={seed}/>
  {:else}
  <GamePage {data} {answers} {tiles} {handleNext}
    bind:guesses={guesses}
    bind:answered={answered}
    bind:tileCounts={tileCounts}
    bind:canNext={canNext}/>
  {/if}
</div>