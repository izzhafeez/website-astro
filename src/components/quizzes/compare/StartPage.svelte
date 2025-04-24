<script lang="ts">
  import Swal from "sweetalert2";
  import Leaderboard from "../Leaderboard.svelte";
  import { fly, fade } from 'svelte/transition';
  import seededRandom from "../../common/seededRandom";

  export let setTodaySeed: () => void;
  export let fields: string[];
  export let field: string;
  export let seed: string;
  export let randomiser: () => void;
  export let randomiseSeed: () => void;
  export let isPlaying: boolean;

  function handleStart() {
    // check if all are numbers
    randomiser = seededRandom(seed);
    randomiser();
    isPlaying = true;
  }
</script>

<div class="">
  <label for="field">Field: </label>
  <div class="flex gap-2 my-2">
    {#each fields as f (f)}
    <button on:click={() => {field = f;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={
      field == f
    } class:text-white={field == f}>{f}</button>
    {/each}
  </div>
  <label for="seed" class="">Seed: </label>
  <div class="flex gap-2">
    <input type="text" id="seed" bind:value={seed} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2" />
    <button on:click={randomiseSeed} class='bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50 my-auto'>Randomise</button>
    <button on:click={setTodaySeed} class='bg-cc-300/20 py-1 px-2 rounded-md text-cc-700 dark:text-cc-300 hover:bg-cc-300/50 border-2 border-cc-500/50 my-auto'>Today's Challenge</button>
  </div>
  <div class="flex gap-2 py-2">
    <button on:click={handleStart} class='me-auto bg-ew-300/20 py-2 px-4 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50'>Start</button>
  </div>
</div>