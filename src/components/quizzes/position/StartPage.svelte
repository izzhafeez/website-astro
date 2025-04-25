<script lang="ts">
  import { fly } from "svelte/transition";
  import Swal from "sweetalert2";

  export let N = 8;
  export let isRotate: boolean;
  export let handleNext: () => void;
  export let seed: string;
  export let randomiseSeed: () => void;
  export let setTodaySeed: () => void;

  let possible_N = [3, 4, 6, 8, 10, 12];

  function handleStart() {
    // check if all are numbers
    if (isNaN(N)) N = 8;
    if (isNaN(seed)) randomiseSeed();
    handleNext();
  }
</script>

<div in:fade={{}}>
  <label for="seed" class="">Seed: </label>
  <div class="flex gap-2">
    <input type="text" id="seed" bind:value={seed} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2 w-24" />
    <button on:click={randomiseSeed} class='bg-ew-300/20 text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50 rounded-lg py-2 px-4 my-2'>Random</button>
    <button on:click={setTodaySeed} class='bg-cc-300/20 text-cc-700 dark:text-cc-300 hover:bg-cc-300/50 border-2 border-cc-500/50 rounded-lg py-2 px-4 my-2'>Daily Seed</button>
  </div>
  <label for="N" class="">Number of Groups: </label>
  <div class="flex gap-2 my-2">
    {#each possible_N as n (n)}
    <button on:click={() => {N = n;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={N == n} class:text-white={N == n}>{n}</button>
    {/each}
  </div>
  <div class="flex gap-2 my-2">
    <label for="isRotate" class="">Randomly Rotate Points: </label>
    <input type="checkbox" id="isRotate" bind:checked={isRotate} class="dark:bg-gray-700 rounded-md px-2 py-2 my-auto" />
  </div>
  <div class="flex py-2 gap-2">
    <button on:click={handleStart} class="bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50">Start Quiz</button>
  </div>
</div>