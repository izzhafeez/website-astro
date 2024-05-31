<script lang="ts">
  import { fade } from "svelte/transition";

  export let isStart = false;
  export let N = 4;
  export let handleNext: () => void;
  let possible_N = [2, 3, 4, 5, 6, 7, 8];

  function handleStart() {
    handleNext();
    isStart = true;
  }
</script>

<div transition:fade={{ duration: 200 }}>
  <label for="N" class="">Number of Groups: </label>
  <div class="flex gap-2 my-2">
    {#each possible_N as n (n)}
    <button on:click={() => {N = n;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={N == n} class:text-white={N == n}>{n}</button>
    {/each}
  </div>
  <button on:click={handleStart} class='bg-ew-500 hover:bg-ew-300 text-white rounded-lg py-2 px-4 my-2'>Start</button>
</div>