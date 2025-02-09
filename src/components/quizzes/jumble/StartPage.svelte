<script lang="ts">
    import { fade, fly } from "svelte/transition";
  
    export let title;
    export let instructions;
    export let isStart = false;
    export let N;
    export let MAX_LENGTH;
    export let handleNext: () => void;
    let possible_N = [2, 3, 4, 5, 6, 7, 8];
    let possible_max_length = [6, 8, 10, 12, 14, 16, 18, 20];
  
    function handleStart() {
      handleNext();
      isStart = true;
    }
  </script>
  
  <div class="fixed top-0 h-screen w-screen grid content-center justify-center p-8 -z-10" transition:fly={{ y: 200, duration: 500 }}>
    <h1 class="text-5xl font-extrabold animate-linear bg-[length:200%_auto] bg-gradient-to-r from-ns-500 to-ns-300  text-transparent bg-clip-text">{title}</h1>
    <p class="text-lg my-4 max-w-3xl">{instructions}</p>
    <label for="N" class="">Number of Names: </label>
    <div class="flex gap-2 my-2">
      {#each possible_N as n (n)}
      <button on:click={() => {N = n;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={N == n} class:text-white={N == n}>{n}</button>
      {/each}
    </div>
    <label for="difficulty" class="">Max Name Length: </label>
    <div class="flex gap-2 my-2">
      {#each possible_max_length as n (n)}
      <button on:click={() => {MAX_LENGTH = n;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={MAX_LENGTH == n} class:text-white={MAX_LENGTH == n}>{n}</button>
      {/each}
    </div>
    <button on:click={handleStart} class='bg-ew-500 hover:bg-ew-300 text-white rounded-lg py-2 px-4 my-2 me-auto'>Start</button>
  </div>