<script>
  import party from 'party-js';
  export let title;
  export let data;
  export let instructions;

  let answers = {};
  let selected = {};
  let numSelected = 0;
  let tiles = [];
  let isStart = false;
  let tileCounts = {};
  let answered = [];
  let guesses = 0;
  let canNext = false;
  let N = 4;

  function handleStart() {
    handleNext();
    isStart = true;
  }

  function handleNext() {
    // select N random keys from data
    let keys = Object.keys(data);
    canNext = false;
    answers = {};
    tileCounts = {};
    tiles = [];
    // ensure the N keys are distinct
    while (Object.keys(answers).length < N) {
      let randomKey = keys[Math.floor(Math.random() * keys.length)];
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

  function handleSelect(tile) {
    if (selected[tile]) {
      numSelected -= tileCounts[tile];
      selected[tile] = false;
    } else {
      numSelected += tileCounts[tile];
      selected[tile] = true;
    }
  }

  function handleGuess(e) {
    if (numSelected !== 4) {
      return;
    }

    let counts = {};
    for (let answer of Object.keys(answers)) {
      if (!counts[answer]) {
        counts[answer] = 0;
      }

      for (let tile of Object.keys(selected)) {
        if (data[answer].includes(tile) && selected[tile]) {
          counts[answer] += tileCounts[tile];
        }
      }
    }

    let [best, score] = Object.entries(counts).reduce((a, b) => a[1] > b[1] ? a : b);

    if (score < 3) {
      Swal.fire({
        title: 'Try Again...',
        timer: 1000
      })
      guesses -= 1;
    } else if (score === 3) {
      Swal.fire({
        title: 'One Away...',
        timer: 1000
      })
      guesses -= 1;
    } else {
      let newTiles = [];
      for (let tile of tiles) {
        if (!selected[tile]) {
          newTiles.push(tile);
        }
      }

      answered = [...answered, best];
      tiles = newTiles;

      if (tiles.length > 0) {
        party.confetti(e.target);
      }
    }

    selected = {};
    numSelected = 0;

    if (guesses === 0) {
      Swal.fire({
        title: 'No more guesses...',
        html: `<img src="/img/quizzes/haiya.gif"/>`,
      })

      var audio = new Audio(`/sound/quizzes/haiya.mp3`);
      audio.play();

      for (let answer of Object.keys(answers)) {
        if (!answered.includes(answer)) {
          answered = [...answered, answer];
        }
      }

      tiles = [];
      selected = {};
      numSelected = 0;
    }

    if (tiles.length === 0 && guesses > 0) {
      Swal.fire({
        html: `<img src="/img/quizzes/fuiyoh.gif"/>`,
      })

      var audio = new Audio(`/sound/quizzes/fuiyoh.mp3`);
      audio.play();
    }

    if (tiles.length === 0) {
      canNext = true;
    }
  }
</script>

<div class="max-w-3xl mx-auto">
  <h1 class="font-extrabold bg-gradient-to-r from-ns-500 to-ns-300 dark:from-ns-500 dark:to-ns-100 text-transparent bg-clip-text my-12 text-6xl">
    {title}
  </h1>
  <p class="dark:text-white my-4">{instructions}</p>
  {#if !isStart}
  <label for="N" class="dark:text-white">Number of Groups: </label>
  <select name="N" id="N" class="rounded-lg border-gray-500/50 px-4" bind:value={N}>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4" selected="selected">4</option>
    <option value="5">5</option>
    <option value="6">6</option>
    <option value="7">7</option>
    <option value="8">8</option>
  </select>
  <button on:click={handleStart} class='bg-ew-500 hover:bg-ew-400 text-white rounded-lg py-2 px-4 mx-2'>Start</button>
  {:else}
  <div class="grid gap-2">
    <div class="grid gap-2">
      {#each answered as answer}
        <div class="border-[3px] border-ew-300 dark:text-white rounded-lg py-2 px-4 text-center">
          <h3 class="font-bold text-xl">{answer}</h3>
          <p>{answers[answer]}</p>
        </div>
      {/each}
    </div>
    <div class="grid grid-cols-4 gap-2">
      {#each tiles as tile}
        <button on:click={() => handleSelect(tile)} class:border-ew-300={!!selected[tile]} class="border-[3px] hover:border-ew-500 cursor-pointer dark:text-white rounded-lg py-2 px-4 text-center">{tile}</button>
      {/each}
    </div>
  </div>
  {#if !canNext}
  <button on:click={handleGuess} class:bg-cc-500={numSelected === 4} class:hover:bg-cc-400={numSelected === 4} class:opacity-50={numSelected !== 4} class:bg-gray-500={numSelected !== 4} class='text-white rounded-lg py-2 px-4 mt-4'>Guess ({guesses})</button>
  {:else}
  <button on:click={handleNext} class='bg-ew-500 hover:bg-ew-400 text-white rounded-lg py-2 px-4 mt-4'>Next</button>
  {/if}
  {/if}
</div>