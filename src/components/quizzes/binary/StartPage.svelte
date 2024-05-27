<script lang="ts">
  import Leaderboard from "../Leaderboard.svelte";
  import { fly } from 'svelte/transition';

  export let title: string;
  export let instructions: string;
  export let key: string;
  export let name: string;
  export let isStart: boolean;

  function handleStart() {
    isStart = true;
  }
</script>

<div class="fixed top-0 h-screen w-screen grid content-center justify-center p-8 -z-10" transition:fly={{ y: 200, duration: 500 }}>
  <div class="max-w-3xl mx-auto">
    <h1 class="text-5xl font-extrabold animate-linear bg-[length:200%_auto] bg-gradient-to-r from-ns-500 to-ns-300  text-transparent bg-clip-text">{title}</h1>
    <p class=" mt-2">{instructions}</p>
    <label for="regex" class="">Your Name (Optional):</label>
    <input name="regex" bind:value={name} class='transition duration-500 bg-white dark:bg-gray-700 my-2 border-gray-500/50 border-[1px] rounded-md p-1' placeholder=""/>
    <div class="flex py-2 gap-2">
      <Leaderboard type="binary" key={key}/>
      <button
        class="bg-ew-300/20 py-1 px-2 rounded-md text-ew-500 dark:text-ew-300 hover:bg-ew-300/50"
        on:click={handleStart}
      >
        Start Quiz
      </button>
    </div>
  </div>
</div>