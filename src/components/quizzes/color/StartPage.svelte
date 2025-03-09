<script lang="ts">
  import Leaderboard from "../Leaderboard.svelte";
  import { fly, fade } from 'svelte/transition';

  export let key: string;
  export let name: string;
  export let isStart: boolean;
  export let randomiserSeed: string;
  export let randomiseSeed: () => void;
  export let decodeSeed: () => void;

  const title = "Color Quiz";
  const instructions = "Given a color, guess the hexcode in RGB format. For example, pure red would be #FF0000. Your score is based on how close your guess is to the actual hexcode. You have 5 rounds. Good luck!";

  function handleStart() {
    isStart = true;
  }
</script>

<div in:fade={{}}>
  <label for="seed" class="">Seed: </label>
  <div class="flex gap-2">
    <input type="text" id="seed" bind:value={randomiserSeed} on:change={decodeSeed} on:keyup={decodeSeed} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2" />
    <button on:click={randomiseSeed} class='bg-ew-500 hover:bg-ew-300 text-white rounded-lg py-2 px-4 my-2'>Randomise</button>
  </div>
  <label for="regex" class="">Your Name (Optional):</label>
  <input name="regex" bind:value={name} class='transition duration-500 bg-white dark:bg-gray-700 my-2 border-gray-500/50 border-[1px] rounded-md p-1' placeholder=""/>
  <div class="flex py-2 gap-2">
    <Leaderboard type="color" key="" params={randomiserSeed}/>
    <a href={`/quizzes/color/daily-challenge`} class="bg-cc-300/20 py-1 px-2 rounded-md text-cc-500 dark:text-cc-300 hover:bg-cc-300/50">Daily Challenge</a>
    <button
      class="bg-ew-300/20 py-1 px-2 rounded-md text-ew-500 dark:text-ew-300 hover:bg-ew-300/50"
      on:click={handleStart}
    >
      Start Quiz
    </button>
  </div>
</div>