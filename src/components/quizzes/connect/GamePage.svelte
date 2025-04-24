<script lang="ts">
  import { capitalise } from "../../../utils/string";
  import party from 'party-js';
  import { fly, fade } from 'svelte/transition';
  import Swal from 'sweetalert2';
  import toast from "../../common/toast";

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
  export let title: string;
  export let N: number;
  export let seed: string;
  export let randomiseSeed: () => void;

  let totalScore = 0;

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
      Swal.fire({
        title: 'No more guesses...',
        html: `<img src="/img/quizzes/haiya.gif"/>`,
      })

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

    totalScore += 1;

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

  const share = () => {
    let text = `${title}\n`;
    let seedString = seed.toString();
    if (seedString.match(/20\d{2}(11|12|0\d)([0-2]\d|30|31)/)) {
        text += `Daily Challenge on ${seedString.slice(0, 4)}/${seedString.slice(4, 6)}/${seedString.slice(6)}\n`;
    }
    text += `I got ${totalScore}/${N}!\n`;
    text += `${window.location.href.split("?")[0]}?seed=${seed}&N=${N}\n`;
    navigator.clipboard.writeText(text);
    toast.fire({
        icon: 'success',
        text: 'Copied Results',
    });
  }

  const handleRestart = () => {
    randomiseSeed();
    handleNext();
  }
</script>

<div in:fade={{}}>
  <div class="grid gap-2">
    <div class="grid gap-2">
      {#each answered as answer}
        <div class="border-[3px] border-ew-300 rounded-lg py-2 px-4 text-center">
          <h3 class="font-bold text-xl">{capitalise(answer)}</h3>
          <p>{answers[answer]}</p>
        </div>
      {/each}
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
      {#each tiles as tile}
      <button on:click={() => handleSelect(tile)}
        class:bg-opacity-20={!selected[tile]} class:dark:bg-opacity-20={!selected[tile]}
        class:text-white={selected[tile]} class:dark:text-black={selected[tile]}
        class="bg-black dark:bg-gray-100 cursor-pointer rounded-lg py-2 px-4 text-center">{tile}</button>
      {/each}
    </div>
  </div>
  {#if !canNext}
  <button on:click={handleGuess} class:bg-cc-500={numSelected === 4} class:hover:bg-cc-300={numSelected === 4} class:opacity-50={numSelected !== 4} class:bg-gray-500={numSelected !== 4} class='text-white rounded-lg py-2 px-4 mt-4'>Guess ({guesses})</button>
  {:else}
  <div class="flex gap-4 mt-4">
    <button on:click={share} class="bg-dt-300/20 py-1 px-2 rounded-md text-dt-700 dark:text-dt-300 hover:bg-dt-300/50 border-2 border-dt-500/50">Share</button>
    <button on:click={handleRestart} class="bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50">Next</button>
  </div>
  {/if}
</div>