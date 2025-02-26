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
    let possible_N = [4, 5, 6, 8, 10, 12, 16];
    export let possible_fields: string[];
    export let field: string;
    export let name: string;
    export let key: string;
  </script>
  
  <div class="top-0 h-screen w-screen grid content-center justify-center p-8 -z-10" in:fly={{ y: 200 }} out:fade>
    <h1 class="text-5xl font-black animate-text bg-gradient-to-r from-ns-500 via-ns-400 to-ns-300 bg-clip-text text-transparent">{title.toUpperCase()}</h1>
    <p class="my-4 max-w-3xl">In this game, you'll rank 5 items as they appear one by one. Each time an item appears, you must decide where to place it—1st, 2nd, 3rd, and so on. But beware: once an item is placed, it’s locked in!

      Without knowing the future items, you’ll need to predict, strategize, and take risks to get the most accurate ranking possible. Can you outsmart the unknown and become the Rank Master? 🚀</p>
    <label for="N" class="">How many to Rank: </label>
    <div class="flex gap-2 my-2">
      {#each possible_N as n (n)}
      <button on:click={() => {N = n; seed = (possible_N.indexOf(n)).toString() + seed.slice(1); decodeSeed();}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={N == n} class:text-white={N == n}>{n}</button>
      {/each}
    </div>
    <label for="field" class="">Basis of Comparison: </label>
    <div class="flex gap-2 my-2">
      {#each possible_fields as f (f)}
      <button on:click={() => {field = f; seed = seed[0] + (possible_fields.indexOf(f)).toString() + seed.slice(2); decodeSeed();}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={
        field == f
      } class:text-white={field == f}>{f}</button>
      {/each}
    </div>
    <label for="seed" class="">Seed: </label>
    <div class="flex gap-2">
      <input type="text" id="seed" bind:value={seed} on:change={decodeSeed} on:keyup={decodeSeed} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2" />
      <button on:click={randomiseSeed} class='bg-ew-300/20 py-1 px-2 rounded-md text-ew-500 dark:text-ew-300 hover:bg-ew-300/50 my-auto'>Randomise</button>
    </div>
    <label for="regex" class="">Your Name (Optional):</label>
    <input name="regex" bind:value={name} class='transition duration-500 bg-white dark:bg-gray-700 my-2 border-gray-500/50 border-[1px] rounded-md p-1 w-60' placeholder=""/>
    <div class="flex py-2 gap-2">
      <Leaderboard type="rank" key={key} params={seed} settingsLabel="Seed"/>
      <button
        class="bg-ew-300/20 py-1 px-2 rounded-md text-ew-500 dark:text-ew-300 hover:bg-ew-300/50"
        on:click={handleStart}
      >
        Start Quiz
      </button>
    </div>
  </div>