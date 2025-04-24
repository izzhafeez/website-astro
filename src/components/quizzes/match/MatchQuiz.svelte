<script>
  import Swal from 'sweetalert2';
  import Leaderboard from "../Leaderboard.svelte";
  export let title;
  export let data;
  export let instructions;
  export let key;

  let answers = {};
  let groups = {};
  let selected = '';
  let tiles = [];
  let isStart = false;
  let answered = {};
  let time = 0;
  let canNext = false;
  let wrong = {};
  let difficulty = 3;
  let possible_difficulty = [1, 2, 3, 4, 5];
  let N = 6;
  let possible_option_counts = Array.from(Array(Object.keys(data).length).keys()).slice(2);
  let wrongCount = 0;
  let name = "";

  const difficultyMappings = {
    1: 5,
    2: 15,
    3: 50,
    4: 150,
    5: 10000
  }

  function handleStart() {
    handleNext();
    isStart = true;
    wrongCount = 0;
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

      let firstChoice = groupItems[Math.floor(Math.random() * Math.min(difficultyMappings[difficulty], groupItems.length))];
      let secondChoice = groupItems[Math.floor(Math.random() * Math.min(difficultyMappings[difficulty], groupItems.length))];

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
    // reset wrongs
    wrong = {};

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

  async function handleGuess(selected, tile) {
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
        text: `You have completed the quiz in ${time.toFixed(2)} seconds with ${wrongCount} mistakes!`,
        confirmButtonText: 'Next'
      }).then(_ => {
        handleNext();
      });

      const url = `https://script.google.com/macros/s/AKfycbzrruwSggCRGCwUducgQD3YiUFVLp5cKGt3IFcX7z-34QDR4XkceBhpKtQMQByZExRZjQ/exec`;
      await fetch(`${url}?siteUrl=__quizzes__match__${key}&name=${name}&score=${-time.toFixed(2)}&params=${difficulty}, ${N}`);
    }
  }

  function handleColorTransition(selected, tile) {
    wrongCount++;
    wrong[selected] = true;
    wrong[tile] = true;
  }

  function goBack() {
    isStart = false;
  }
</script>

<div class="max-w-3xl mx-auto p-2 my-8 md:my-20">
  <h1 class="text-5xl font-black animate-text bg-gradient-to-r from-ns-500 via-ns-400 to-ns-300 bg-clip-text text-transparent">
    {title.toUpperCase()}
  </h1>
  {#if !isStart}
  <p class=" my-4">{instructions}</p>
  <label for="difficulty" class="">Difficulty: </label>
  <div class="flex gap-2 my-2">
    {#each possible_difficulty as n (n)}
    <button on:click={() => {difficulty = n;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={difficulty == n} class:text-white={difficulty == n}>{n}</button>
    {/each}
  </div>
  <label for="difficulty" class="">Number of Groups: </label>
  <div class="flex gap-2 my-2">
    {#each possible_option_counts as n (n)}
    <button on:click={() => {N = n;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={N == n} class:text-white={N == n}>{n}</button>
    {/each}
  </div>
  <label for="regex" class="">Your Name (Optional):</label>
  <input name="regex" bind:value={name} class='transition duration-500 bg-gray-100 dark:bg-gray-700 my-2 border-gray-500/50 border-[1px] rounded-md p-1' placeholder=""/>
  <div class="flex py-2 gap-2">
    <Leaderboard type="match" key={key} params={`${difficulty}, ${N}`}/>
    <button
      class="bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50"
      on:click={handleStart}
    >
      Start Quiz
    </button>
  </div>
  {:else}
  <div class="grid grid-cols-2">
    <p class='text-3xl text-center my-2 dark:text-white px-4 py-2 rounded-md'>{time.toFixed(2)}s</p>
    <p class='text-3xl text-center my-2 dark:text-white px-4 py-2 rounded-md'>{wrongCount} Mistakes</p>
  </div>
  <div class="grid gap-2">
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
      {#each tiles as tile}
        <button id={tile}
          on:click={() => handleSelect(tile)}
          class="h-24 transition cursor-pointer rounded-lg py-2 px-4 text-center"
          class:text-white={selected === tile || answered[tile] || wrong[tile]}
          class:dark:text-black={selected === tile || answered[tile] || wrong[tile]}
          class:bg-cc-700={!answered[tile] && !wrong[tile]}
          class:dark:bg-cc-300={!answered[tile] && !wrong[tile]}
          class:bg-opacity-50={selected !== tile && !answered[tile] && !wrong[tile]}
          class:dark:bg-opacity-50={selected !== tile && !answered[tile] && !wrong[tile]}
          class:bg-ns-500={wrong[tile] && selected !== tile}
          class:dark:bg-ns-500={wrong[tile] && selected !== tile}
          class:bg-ew-500={answered[tile]}
          class:dark:bg-ew-500={answered[tile]}
          >{tile}</button>
      {/each}
    </div>
  </div>
  <div class="grid">
    <button on:click={goBack} class='bg-ns-500 hover:bg-ns-300 text-white rounded-lg py-2 px-4 my-8 ms-auto'>End</button>
  </div>
  {/if}
</div>