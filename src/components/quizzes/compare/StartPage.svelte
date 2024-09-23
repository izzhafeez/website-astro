<script lang="ts">
  import Leaderboard from "../Leaderboard.svelte";
  import { fly } from 'svelte/transition';

  export let title: string;
  export let instructions: string;
  export let key: string;
  export let name: string;
  export let isPlaying: boolean;
  export let difficulty = 2;

  const possibleDifficulties = [1, 2, 3, 4, 5];

  function handleStart() {
    isPlaying = true;
  }
</script>

<div class="grid h-screen w-screen justify-center content-center gap-2 p-4" transition:fly={{ y: 200, duration: 500 }}>
  <h1 class="font-extrabold text-6xl animate-linear bg-[length:200%_auto] bg-gradient-to-r from-ns-500 to-ns-300 text-transparent bg-clip-text">{title}</h1>
  <p class=" max-w-xl">{instructions}</p>
  <div class="flex content-center gap-2">
    <label for="name" class="my-auto">Your Name (Optional):</label>
    <input type="text" id="name" bind:value={name} class="transition duration-500 bg-white dark:bg-gray-700 p-2 rounded-md"/>
  </div>
  <label for="N" class="">Difficulty: </label>
  <div class="flex gap-2 my-2">
    {#each possibleDifficulties as n (n)}
    <button on:click={() => {difficulty = n;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={difficulty == n} class:text-white={difficulty == n}>{n}</button>
    {/each}
  </div>
  <div class="flex gap-2 py-2">
    <Leaderboard type="compare" key={key}/>
    <button on:click={handleStart} class='me-auto bg-ew-300/20 py-2 px-4 rounded-md text-ew-500 dark:text-ew-300 hover:bg-ew-300/50'>Start</button>
  </div>
</div>