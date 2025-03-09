<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import Leaderboard from "../Leaderboard.svelte";
  
    export let title;
    export let instructions;
    export let fontSize: number;
    export let blurValue: string;
    export let handleStart: () => void;
    export let randomiseSeed: () => void;
    export let seed: string;
    export let decodeSeed: () => void;
    export let name: string;
    export let key: string;
    let possible_fontSizes = [20, 30, 40, 60, 80, 120, 160];
    let possible_blurValues = ["XS", "SM", "MD", "LG", "XL", "2XL", "3XL"];
  </script>
  
  <div class="" in:fade={{}}>
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
      <input type="text" id="seed" bind:value={seed} on:change={decodeSeed} on:keyup={decodeSeed} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2" />
      <button on:click={randomiseSeed} class='bg-ew-300/20 my-auto py-1 px-2 rounded-md text-ew-500 dark:text-ew-300 hover:bg-ew-300/50'>Randomise</button>
    </div>
    <label for="regex" class="">Your Name (Optional):</label>
    <input name="regex" bind:value={name} class='transition duration-500 bg-white dark:bg-gray-700 my-2 border-gray-500/50 border-[1px] rounded-md p-1 w-60' placeholder=""/>
    <div class="flex py-2 gap-2">
      <Leaderboard type="blurry" key={key} params={seed} settingsLabel="Seed"/>
      <!-- link to /daily-challenge -->
      <a href={`/quizzes/blurry/${key}/daily-challenge`} class="bg-cc-300/20 py-1 px-2 rounded-md text-cc-500 dark:text-cc-300 hover:bg-cc-300/50">Daily Challenge</a>
      <button
        class="bg-ew-300/20 py-1 px-2 rounded-md text-ew-500 dark:text-ew-300 hover:bg-ew-300/50"
        on:click={handleStart}
      >
        Start Quiz
      </button>
    </div>
    <!-- <button on:click={handleStart} class='bg-ew-500 hover:bg-ew-300 text-white rounded-lg py-2 px-4 my-2 me-auto'>Start</button> -->
  </div>