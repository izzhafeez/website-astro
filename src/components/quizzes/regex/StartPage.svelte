<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import Leaderboard from "../Leaderboard.svelte";
  
    export let title;
    export let instructions;
    export let N: number;
    export let handleStart: () => void;
    export let randomiseSeed: () => void;
    export let seed: string;
    export let decodeSeed: () => void;
    export let key: string;
    export let name: string;
    let possible_N = [6, 8, 12, 16, 20, 24, 30, 40, 50];
  </script>
  
  <div class="top-0 h-screen w-screen grid content-center justify-center p-8 -z-10" in:fly={{ y: 200 }} out:fade>
    <h1 class="text-5xl font-black animate-text bg-gradient-to-r from-ns-500 via-ns-400 to-ns-300 bg-clip-text text-transparent">{title.toUpperCase()}</h1>
    <p class="my-4 max-w-3xl">{instructions}</p>
    <label for="N" class="">Number of Names: </label>
    <div class="flex gap-2 my-2">
      {#each possible_N as n (n)}
      <button on:click={() => {N = n; seed = possible_N.indexOf(N).toString() + seed.slice(1); decodeSeed();}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={N == n} class:text-white={N == n}>{n}</button>
      {/each}
    </div>
    <label for="seed" class="">Seed: </label>
    <div class="flex gap-2">
      <input type="text" id="seed" bind:value={seed} on:change={decodeSeed} on:keyup={decodeSeed} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2" />
      <button on:click={randomiseSeed} class='bg-ew-300/20 py-1 px-2 rounded-md text-ew-500 dark:text-ew-300 hover:bg-ew-300/50 my-auto'>Randomise</button>
    </div>
    <label for="regex" class="">Your Name (Optional):</label>
    <input name="regex" bind:value={name} class='w-60 transition duration-500 bg-white dark:bg-gray-700 my-2 border-gray-500/50 border-[1px] rounded-md p-1' placeholder=""/>
    <div class="flex py-2 gap-2">
      <Leaderboard type="regex" key={key} params={seed} settingsLabel="Seed"/>
      <button
        class="bg-ew-300/20 py-1 px-2 rounded-md text-ew-500 dark:text-ew-300 hover:bg-ew-300/50"
        on:click={handleStart}
      >
        Start Quiz
      </button>
    </div>
  </div>