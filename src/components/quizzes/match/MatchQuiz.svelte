<script>
  import party, { Color } from 'party-js';
  export let title;
  export let data;
  export let instructions;

  let answers = {};
  let groups = {};
  let selected = '';
  let tiles = [];
  let isStart = false;
  let answered = {};
  let time = 0;
  let canNext = false;
  let wrong = {};
  let N = 6;

  function handleStart() {
    handleNext();
    isStart = true;
  }

  function handleNext() {
    // select N random keys from data
    let keys = Object.keys(data);
    canNext = false;
    answered = {};
    tiles = [];
    answers = {};
    groups = {};
    time = 0;

    // ensure the N keys are distinct
    while (Object.keys(answers).length < N * 2) {
      let randomGroup = keys[Math.floor(Math.random() * keys.length)];
      if (groups[randomGroup]) {
        continue;
      }

      let groupItems = data[randomGroup];

      let firstChoice = groupItems[Math.floor(Math.random() * groupItems.length)];
      let secondChoice = groupItems[Math.floor(Math.random() * groupItems.length)];

      if (firstChoice === secondChoice || answers[firstChoice] || answers[secondChoice]) {
        continue;
      }

      answers[firstChoice] = randomGroup;
      answers[secondChoice] = randomGroup;
      groups[randomGroup] = true;
      tiles = [...tiles, firstChoice, secondChoice];
    }

    // shuffle the tiles
    tiles.sort(() => Math.random() - 0.5);

    setTimeout(updateTime, 10);
  }

  async function updateTime() {
    time += 0.01;
    if (Object.keys(answered).length < N * 2) {
      setTimeout(updateTime, 10);
    }
  }

  function handleSelect(tile) {
    if (answered[tile]) {
      return;
    }

    if (selected === tile) {
      selected = '';
    } else if (selected === '') {
      selected = tile;
    } else {
      handleGuess(selected, tile);
      selected = '';
    }
  }

  function handleGuess(selected, tile) {
    if (answers[selected] === answers[tile]) {
      answered[selected] = true;
      answered[tile] = true;
    } else {
      // handle wrong guess by signalling the tile red
      handleColorTransition(selected, tile);
    }

    if (Object.keys(answered).length === N * 2) {
      Swal.fire({
        title: 'Congratulations!',
        icon: 'success',
        text: `You have completed the quiz in ${time.toFixed(2)} seconds!`,
        confirmButtonText: 'Next'
      }).then(_ => {
        handleNext();
      });
    }
  }

  function handleColorTransition(selected, tile) {
    wrong[selected] = true;
    wrong[tile] = true;

    setTimeout(() => {
      wrong = {};
    }, 1000)
  }
</script>

<div class="max-w-3xl mx-auto p-2">
  {#if !isStart}
  <h1 class="font-extrabold animate-linear bg-[length:200%_auto] bg-gradient-to-r from-ns-500 to-ns-300 dark:from-ns-500 dark:to-ns-100 text-transparent bg-clip-text my-12 text-6xl">
    {title}
  </h1>
  <p class="dark:text-white my-4">{instructions}</p>
  <button on:click={handleStart} class='bg-ew-500 hover:bg-ew-400 text-white rounded-lg py-2 px-4'>Start</button>
  {:else}
  <p class='text-3xl text-center my-2 bg-hp-500 text-white px-4 py-2 rounded-md'>{time.toFixed(2)}s</p>
  <div class="grid gap-2">
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
      {#each tiles as tile}
        <button id={tile} on:click={() => handleSelect(tile)} class:bg-ns-500={wrong[tile] && selected !== tile} class:bg-cc-500={selected === tile && !answered[tile]} class:text-white={selected === tile || answered[tile] || wrong[tile]} class:bg-ew-500={answered[tile]} class="h-24 transition border-[3px] hover:border-cc-500 cursor-pointer dark:text-white rounded-lg py-2 px-4 text-center">{tile}</button>
      {/each}
    </div>
  </div>
  {/if}
</div>