<script lang="ts">
  import { fade } from "svelte/transition";

  export let isStart = false;
  export let N = 4;
  export let difficulty = 3;
  export let handleNext: () => void;
  export let seed: string;
  export let randomiseSeed: () => void;
  export let decodeSeed: () => void;
  let possible_N = [2, 3, 4, 5, 6, 7, 8];
  let possible_difficulty = [1, 2, 3, 4, 5];

  function handleStart() {
    // check if all are numbers
    if (seed.length < 3 || isNaN(parseInt(seed))) {
      Swal.fire({
        title: "Error",
        text: "Seed is too short / not a number",
        icon: "error",
      });
      return;
    }

    // check if first digit is a valid difficulty
    if (!possible_difficulty.includes(parseInt(seed[1]))) {
      Swal.fire({
        title: "Error",
        text: "Invalid difficulty",
        icon: "error",
      });
      return;
    }

    // check if N is valid
    if (!possible_N.includes(parseInt(seed[0]))) {
      Swal.fire({
        title: "Error",
        text: "Invalid N",
        icon: "error",
      });
      return;
    }

    handleNext();
    isStart = true;
  }
</script>

<div transition:fade={{ duration: 200 }}>
  <label for="seed" class="">Seed: </label>
  <div class="flex gap-2">
    <input type="text" id="seed" bind:value={seed} on:change={decodeSeed} on:keyup={decodeSeed} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2" />
    <button on:click={randomiseSeed} class='bg-ew-500 hover:bg-ew-300 text-white rounded-lg py-2 px-4 my-2'>Randomise</button>
  </div>
  <label for="N" class="">Number of Groups: </label>
  <div class="flex gap-2 my-2">
    {#each possible_N as n (n)}
    <button on:click={() => {N = n; seed = n.toString() + seed.slice(1);}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={N == n} class:text-white={N == n}>{n}</button>
    {/each}
  </div>
  <label for="difficulty" class="">Difficulty: </label>
  <div class="flex gap-2 my-2">
    {#each possible_difficulty as n (n)}
    <button on:click={() => {difficulty = n; seed = seed[0] + n.toString() + seed.slice(2);}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={difficulty == n} class:text-white={difficulty == n}>{n}</button>
    {/each}
  </div>
  <button on:click={handleStart} class='bg-ew-500 hover:bg-ew-300 text-white rounded-lg py-2 px-4 my-2'>Start</button>
</div>