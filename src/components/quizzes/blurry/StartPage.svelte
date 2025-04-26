<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import Leaderboard from "../Leaderboard.svelte";

    export let fontSize: number;
    export let blurValue: string;
    export let handleStart: () => void;
    export let randomiseSeed: () => void;
    export let setTodaySeed: () => void;
    export let seed: string;

    let possible_fontSizes = [20, 30, 40, 60, 80, 120, 160];
    let possible_blurValues = ["XS", "SM", "MD", "LG", "XL", "2XL", "3XL"];
  </script>
  
  <div class="">
    <label for="N" class="">Font Size: </label>
    <div class="flex gap-2 my-2">
      {#each possible_fontSizes as n (n)}
      <button on:click={() => {fontSize = n; seed = (possible_fontSizes.indexOf(n)).toString() + seed.slice(1); decodeSeed();}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={fontSize == n} class:text-white={fontSize == n}>{n}</button>
      {/each}
    </div>
    <label for="N" class="">Blur Value: </label>
    <div class="flex gap-2 my-2">
      {#each possible_blurValues as n (n)}
      <button on:click={() => {blurValue = n; seed = seed[0] + possible_blurValues.indexOf(n).toString() + seed.slice(2); decodeSeed();}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={
        blurValue == n
      } class:text-white={
        blurValue == n
      }>{n}</button>
      {/each}
    </div>
    <label for="seed" class="">Seed: </label>
    <div class="flex gap-2">
      <input type="text" id="seed" bind:value={seed} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2 w-24" />
      <button on:click={randomiseSeed} class='bg-ew-300/20 my-auto py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50'>Random</button>
      <button on:click={setTodaySeed} class='bg-cc-300/20 my-auto py-1 px-2 rounded-md text-cc-700 dark:text-cc-300 hover:bg-cc-300/50 border-2 border-cc-500/50'>Daily Seed</button>
    </div>
    <div class="flex py-2 gap-2">
      <button
        class="bg-ew-300/20 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50"
        on:click={handleStart}
      >
        Start Quiz
      </button>
    </div>
    <!-- <button on:click={handleStart} class='bg-ew-500 hover:bg-ew-300 text-white rounded-lg py-2 px-4 my-2 me-auto'>Start</button> -->
  </div>