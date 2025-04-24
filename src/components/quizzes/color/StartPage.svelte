<script lang="ts">
  import Leaderboard from "../Leaderboard.svelte";
  import { fly, fade } from 'svelte/transition';

  export let isStart: boolean;
  export let seed: string;
  export let randomiseSeed: () => void;
  export let setTodaySeed: () => void;
  export let handleStart: () => void;

  const title = "Color Quiz";
  const instructions = "Given a color, guess the hexcode in RGB format. For example, pure red would be #FF0000. Your score is based on how close your guess is to the actual hexcode. You have 5 rounds. Good luck!";
</script>

<div in:fade={{}}>
  <label for="seed" class="">Seed: </label>
  <div class="flex gap-2">
    <input type="text" id="seed" bind:value={seed} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2" />
    <button on:click={randomiseSeed} class='bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50 my-auto'>Randomise</button>
    <button on:click={setTodaySeed} class='bg-cc-300/20 py-1 px-2 rounded-md text-cc-700 dark:text-cc-300 hover:bg-cc-300/50 border-2 border-cc-500/50 my-auto'>Today's Challenge</button>
  </div>
  <div class="flex py-2 gap-2">
    <button
      class="bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50"
      on:click={handleStart}
    >
      Start Quiz
    </button>
  </div>
</div>