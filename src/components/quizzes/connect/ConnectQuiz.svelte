<script>
  import GamePage from './GamePage.svelte';
  import StartPage from './StartPage.svelte';
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
      let randomKey = keys[Math.floor(Math.random() * keys.length)];

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
        let randomIndex = Math.floor(Math.random() * candidateTiles.length);
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

    tiles.sort((a, b) => 0.5 - Math.random());

    guesses = N;
    answered = [];
  }
</script>

<div class="max-w-3xl mx-auto p-2">
  <h1 class="font-extrabold animate-linear bg-[length:200%_auto] bg-gradient-to-r from-ns-500 to-ns-300  text-transparent bg-clip-text my-12 text-6xl">
    {title}
  </h1>
  <p class=" my-4">{instructions}</p>
  {#if !isStart}
  <StartPage N={N} handleNext={handleNext} bind:isStart={isStart}/>
  {:else}
  <GamePage {data} {answers} {tiles} {handleNext}
    bind:guesses={guesses}
    bind:answered={answered}
    bind:tileCounts={tileCounts}
    bind:canNext={canNext}/>
  {/if}
</div>