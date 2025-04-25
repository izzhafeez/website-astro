<script lang="ts">
    import { fade, fly } from "svelte/transition";
  
    export let N: number;
    export let handleStart: () => void;
    export let randomiseSeed: () => void;
    export let setTodaySeed: () => void;
    export let seed: string;
    let possible_N = [4, 5, 6, 8, 10, 12, 16];
    export let possible_fields: string[];
    export let field: string;
  </script>
  
  <div class="max-w-3xl mx-auto p-2" in:fade={{}}>
    <label for="N" class="">How many to Rank: </label>
    <div class="flex gap-2 my-2">
      {#each possible_N as n (n)}
      <button on:click={() => {N = n;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={N == n} class:text-white={N == n}>{n}</button>
      {/each}
    </div>
    <label for="field" class="">Basis of Comparison: </label>
    <div class="flex gap-2 my-2">
      {#each possible_fields as f (f)}
      <button on:click={() => {field = f;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={
        field == f
      } class:text-white={field == f}>{f}</button>
      {/each}
    </div>
    <label for="seed" class="">Seed: </label>
    <div class="flex gap-2">
      <input type="text" id="seed" bind:value={seed} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2" />
      <button on:click={randomiseSeed} class='bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50 my-auto'>Randomise</button>
      <button on:click={setTodaySeed} class='bg-cc-300/20 py-1 px-2 rounded-md text-cc-700 dark:text-cc-300 hover:bg-cc-300/50 border-2 border-cc-500/50 my-auto'>Daily Seed</button>
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