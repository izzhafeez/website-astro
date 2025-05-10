<script lang="ts">
    import { fade, fly } from "svelte/transition";

    export let seed: string;
    export let handleNext: () => void;
    export let setTodaySeed: () => void;
    export let randomiseSeed: () => void;
    export let namesSize: number;
    export let N: number;
  
    function handleStart() {
      // check seed is all numbers
      if (isNaN(Number(seed))) {
        Swal.fire({
          icon: "error",
          title: "Invalid Seed",
          text: "Please enter a valid seed.",
        });
        return;
      }

      handleNext();
    }

    $: numbers = [...Array(Math.min(10, namesSize-3)).keys()].map((n) => n + 3);
  </script>
  
  <div class="">
    <label for="seed" class="">Seed: </label>
    <div class="flex gap-2">
      <input type="text" id="seed" bind:value={seed} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2 w-24" />
      <button on:click={randomiseSeed} class='bg-ew-300/20 text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50 rounded-lg py-2 px-4 my-2'>Random</button>
      <button on:click={setTodaySeed} class='bg-cc-300/20 text-cc-700 dark:text-cc-300 hover:bg-cc-300/50 border-2 border-cc-500/50 rounded-lg py-2 px-4 my-2'>Daily Seed</button>
    </div>
    <label for="difficulty" class="">Number of Names: </label>
    <div class="flex gap-2 my-2">
      {#each numbers as n (n)}
      <button on:click={() => {N = n;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={N == n} class:text-white={N == n}>{n}</button>
      {/each}
    </div>
    <div class="flex py-2 gap-2">
      <button on:click={handleStart} class="bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50">Start</button>
    </div>
  </div>