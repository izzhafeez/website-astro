<script lang="ts">
  import { fade } from "svelte/transition";
  import Swal from "sweetalert2";

  export let isStart = false;
  export let N = 4;
  export let isRotate: boolean;
  export let handleNext: () => void;
  export let seed: string;
  export let randomiseSeed: () => void;
  export let decodeSeed: () => void;
  let possible_N = [3, 4, 6, 8, 10, 12];

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

    // check if first digit is a valid boolean
    if (!["0", "1"].includes(seed[1])) {
      Swal.fire({
        title: "Error",
        text: "Invalid Checkbox",
        icon: "error",
      });
      return;
    }

    // check if N is valid
    if (parseInt(seed[0]) < 0 || parseInt(seed[0]) >= 6) {
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
    <button on:click={() => {N = n; seed = possible_N.indexOf(n).toString() + seed.slice(1);}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={N == n} class:text-white={N == n}>{n}</button>
    {/each}
  </div>
  <div class="flex gap-2 my-2">
    <label for="isRotate" class="">Randomly Rotate Points: </label>
    <input type="checkbox" id="isRotate" bind:checked={isRotate} on:click={() => seed = seed[0] + (isRotate ? 0 : 1) + seed.slice(2) } class="dark:bg-gray-700 rounded-md px-2 py-2 my-auto" />
  </div>
  <button on:click={handleStart} class='bg-ew-500 hover:bg-ew-300 text-white rounded-lg py-2 px-4 my-2'>Start</button>
</div>