<script lang="ts">
    import { fade, fly } from "svelte/transition";
  
    export let title;
    export let instructions;
    export let isStart = false;
    export let N: number;
    export let MAX_LENGTH: number;
    export let mixFactor: number;
    export let scrambleFactor: number;
    export let seed: string;
    export let handleNext: () => void;
    export let changeSeed: () => void;
    export let randomiseSeed: () => void;
    export let possible_N;
    export let possible_max_length;
    export let possible_mixFactor;
    export let possible_scrambleFactor;
    export let key: string;
  
    function handleStart() {
      // check valid seed
      if (seed.length < 5) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Seed',
          text: 'Seed must be at least 5 characters long',
        });
        return;
      }

      // check if all digits
      if (!/^\d+$/.test(seed)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Seed',
          text: 'Seed must be all digits',
        });
        return;
      }

      // check if first digit less than 7
      // check if second digit less than 8
      // check if third digit less than 6
      // check if fourth digit less than 6
      if (parseInt(seed[0]) >= possible_N.length+1 || parseInt(seed[1]) >= possible_max_length.length || parseInt(seed[2]) >= possible_mixFactor.length || parseInt(seed[3]) >= possible_scrambleFactor.length) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Seed',
          text: 'Seed must be valid',
        });
        return;
      }

      handleNext();
    }
  </script>
  
  <div class="" in:fade={{}}>
    <label for="N" class="">Number of Names: </label>
    <div class="flex gap-2 my-2">
      {#each possible_N as n (n)}
      <button on:click={() => {N = n; randomiseSeed()}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={N == n} class:text-white={N == n}>{n}</button>
      {/each}
    </div>
    <label for="difficulty" class="">Max Name Length: </label>
    <div class="flex gap-2 my-2">
      {#each possible_max_length as n (n)}
      <button on:click={() => {MAX_LENGTH = n; randomiseSeed()}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={MAX_LENGTH == n} class:text-white={MAX_LENGTH == n}>{n}</button>
      {/each}
    </div>
    <label for="mixFactor" class="">Mix Factor: </label>
    <div class="flex gap-2 my-2">
      {#each possible_mixFactor as n (n)}
      <button on:click={() => {mixFactor = n; randomiseSeed()}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={mixFactor == n} class:text-white={mixFactor == n}>{n}</button>
      {/each}
    </div>
    <label for="scrambleFactor" class="">Scramble Factor: </label>
    <div class="flex gap-2 my-2">
      {#each possible_scrambleFactor as n (n)}
      <button on:click={() => {scrambleFactor = n; randomiseSeed()}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={
        scrambleFactor == n
      } class:text-white={scrambleFactor == n}>{n}</button>
      {/each}
    </div>
    <label for="seed" class="">Seed: </label>
    <div class="flex gap-2">
      <input type="text" id="seed" bind:value={seed} on:keyup={changeSeed} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2" />
      <button on:click={randomiseSeed} class='bg-ew-500 hover:bg-ew-300 text-white rounded-lg py-2 px-4 my-2'>Randomise</button>
    </div>
    <div class="flex py-2 gap-2">
      <a href={`/quizzes/jumble/${key}/daily-challenge`} class="bg-cc-300/20 py-1 px-2 rounded-md text-cc-500 dark:text-cc-300 hover:bg-cc-300/50">Daily Challenge</a>
      <button on:click={handleStart} class="bg-ew-300/20 py-1 px-2 rounded-md text-ew-500 dark:text-ew-300 hover:bg-ew-300/50">Start</button>
    </div>
  </div>