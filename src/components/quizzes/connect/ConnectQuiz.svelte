<script>
  export let title;
  export let data;
  export let instructions;

  let answers = [];
  let selected = {};
  let numSelected = 0;
  let tiles = [];
  let isStart = false;
  let characters = {};
  let answered = [];
  let guesses = 0;
  let canNext = false;

  function handleStart() {
    handleNext();
    isStart = true;
  }

  function handleNext() {
    // select 4 random keys from data
    let keys = Object.keys(data);
    canNext = false;
    answers = [];
    characters = {};
    tiles = [];
    // ensure the 4 keys are distinct
    while (answers.length < 4) {
      let randomKey = keys[Math.floor(Math.random() * keys.length)];

      let toContinue = false;
      for (let character of data[randomKey]) {
        if (characters[character]) {
          toContinue = true;
        }
      }
      if (toContinue) {
        continue;
      }

      if (answers.includes(randomKey)) {
        continue;
      }

      answers.push(randomKey);
      for (let character of data[randomKey]) {
        if (!characters[character]) {
          characters[character] = 0;
        }
        characters[character] += 1;
        tiles.push(character);
      }
    }

    tiles.sort((a, b) => 0.5 - Math.random());

    guesses = 4;
    answered = [];
  }

  function handleSelect(tile) {
    if (selected[tile]) {
      numSelected -= characters[tile];
      selected[tile] = false;
    } else {
      numSelected += characters[tile];
      selected[tile] = true;
    }
  }

  function handleGuess() {
    let counts = {};
    for (let answer of answers) {
      if (!counts[answer]) {
        counts[answer] = 0;
      }

      for (let tile of Object.keys(selected)) {
        if (data[answer].includes(tile) && selected[tile]) {
          counts[answer] += characters[tile];
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
    }

    selected = {};
    numSelected = 0;

    if (guesses === 0) {
      Swal.fire({
        title: 'Out of Guesses...',
        timer: 1000
      })

      for (let answer of answers) {
        if (!answered.includes(answer)) {
          answered = [...answered, answer];
        }
      }

      tiles = [];
      selected = {};
      numSelected = 0;
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
  <button on:click={handleStart} class='bg-ew-500 hover:bg-ew-400 text-white rounded-lg py-2 px-4'>Start</button>
  {:else}
  <div class="grid gap-2">
    <div class="grid gap-2">
      {#each answered as answer}
        <div class="border-[3px] border-ew-300 dark:text-white rounded-lg py-2 px-4 text-center">
          <h3 class="font-bold text-xl">{answer}</h3>
          <p>{data[answer]}</p>
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