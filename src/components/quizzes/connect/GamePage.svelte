<script lang="ts">
  import party from 'party-js';
  import { fly, fade } from 'svelte/transition';
  import Swal from 'sweetalert2';

  export let data: Record<string, string[]> = {};
  export let answers: Record<string, string> = {};
  export let handleNext: () => void;
  export let guesses: number = 0;
  export let tiles: string[] = [];
  let selected: Record<string, boolean> = {};
  export let canNext: boolean = false;
  export let answered: string[] = [];
  let numSelected = 0;
  export let tileCounts: Record<string, number> = {};
  export let key: string;
  export let date: string;

  function handleSelect(tile: string) {
    if (selected[tile]) {
      numSelected -= tileCounts[tile];
      selected[tile] = false;
    } else {
      numSelected += tileCounts[tile];
      selected[tile] = true;
    }
  }

  function handleGuess(e: MouseEvent) {
    if (numSelected !== 4) {
      return;
    }

    let counts = getCounts();
    let [best, score] = Object.entries(counts).reduce((a: [string, number], b: [string, number]) => a[1] > b[1] ? a : b);

    handleScore(score, best, e);

    selected = {};
    numSelected = 0;

    if (guesses === 0) {
      if (date) {
        localStorage.setItem(`connect-${key}-${date}`, "✗");
      }

      Swal.fire({
        title: 'No more guesses...',
        html: `<img src="/img/quizzes/haiya.gif"/>`,
      })

      // var audio = new Audio(`/sound/quizzes/haiya.mp3`);
      // audio.play();

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
      if (date) {
        localStorage.setItem(`connect-${key}-${date}`, "✓");
      }

      Swal.fire({
        html: `<img src="/img/quizzes/fuiyoh.gif"/>`,
      })

      // var audio = new Audio(`/sound/quizzes/fuiyoh.mp3`);
      // audio.play();
    }

    if (tiles.length === 0) {
      canNext = true;
    }
  }

  function getCounts() {
    let counts: Record<string, number> = {};
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

    return counts;
  }

  function handleScore(score: number, best: string, e: MouseEvent) {
    if (score as number < 3) {
      Swal.fire({
        title: 'Try Again...',
        timer: 1000
      })
      guesses -= 1;
      return;
    }
    
    if (score as number === 3) {
      Swal.fire({
        title: 'One Away...',
        timer: 1000
      })
      guesses -= 1;
      return;
    }

    let newTiles = [];
    for (let tile of tiles) {
      if (!selected[tile]) {
        newTiles.push(tile);
      }
    }

    answered = [...answered, best];
    tiles = newTiles;

    if (tiles.length > 0 && e.target) {
      party.confetti(e.target as HTMLElement);
    }
  }
</script>

<div in:fade={{}}>
  <div class="grid gap-2">
    <div class="grid gap-2">
      {#each answered as answer}
        <div class="border-[3px] border-ew-300 rounded-lg py-2 px-4 text-center">
          <h3 class="font-bold text-xl">{answer}</h3>
          <p>{answers[answer]}</p>
        </div>
      {/each}
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
      {#each tiles as tile}
      <button on:click={() => handleSelect(tile)}
        class:bg-opacity-20={!selected[tile]} class:dark:bg-opacity-20={!selected[tile]}
        class:text-white={selected[tile]} class:dark:text-black={selected[tile]}
        class="bg-black dark:bg-white cursor-pointer rounded-lg py-2 px-4 text-center">{tile}</button>
      {/each}
    </div>
  </div>
  {#if !canNext}
  <button on:click={handleGuess} class:bg-cc-500={numSelected === 4} class:hover:bg-cc-300={numSelected === 4} class:opacity-50={numSelected !== 4} class:bg-gray-500={numSelected !== 4} class='text-white rounded-lg py-2 px-4 mt-4'>Guess ({guesses})</button>
  {:else}
  <button on:click={handleNext} class='bg-ew-500 hover:bg-ew-300 text-white rounded-lg py-2 px-4 mt-4'>Next</button>
  {/if}
</div>