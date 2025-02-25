<script lang="ts">
  import Swal from "sweetalert2";
  import Leaderboard from "../Leaderboard.svelte";
  import { fly } from 'svelte/transition';

  export let title: string;
  export let instructions: string;
  export let key: string;
  export let name: string;
  export let isPlaying: boolean;
  export let difficulty = 2;
  export let fields: string[];
  export let field: string;
  export let seed: string;
  export let randomiseSeed: () => void;
  export let decodeSeed: () => void;

  const possibleDifficulties = [1, 2, 3, 4, 5];

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
    if (!possibleDifficulties.includes(parseInt(seed[0]))) {
      Swal.fire({
        title: "Error",
        text: "Invalid difficulty",
        icon: "error",
      });
      return;
    }
    
    // check if fieldId is valid
    if (isNaN(parseInt(seed[1])) || parseInt(seed[1]) >= fields.length) {
      Swal.fire({
        title: "Error",
        text: "Invalid field",
        icon: "error",
      });
      return;
    }

    if (!field) {
      Swal.fire({
        title: "Error",
        text: "Please select a field",
        icon: "error",
      });
      return;
    }
    isPlaying = true;
  }
</script>

<div class="grid h-screen w-screen justify-center content-center gap-2 p-4" transition:fly={{ y: 200, duration: 500 }}>
  <h1 class="text-5xl font-black animate-text bg-gradient-to-r from-ns-500 via-ns-400 to-ns-300 bg-clip-text text-transparent">{title.toUpperCase()}</h1>
  <p class=" max-w-3xl">{instructions}</p>
  <label for="field">Field: </label>
  <div class="flex gap-2 my-2">
    {#each fields as f (f)}
    <button on:click={() => {field = f; seed = seed[0] + fields.indexOf(field).toString() + seed.slice(2);}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={
      field == f
    } class:text-white={field == f}>{f.toUpperCase()}</button>
    {/each}
  </div>
  <label for="N" class="">Difficulty: </label>
  <div class="flex gap-2 my-2">
    {#each possibleDifficulties as n (n)}
    <button on:click={() => {difficulty = n; seed = n.toString() + seed.slice(1)}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={difficulty == n} class:text-white={difficulty == n}>{n}</button>
    {/each}
  </div>
  <label for="seed" class="">Seed: </label>
  <div class="flex gap-2">
    <input type="text" id="seed" bind:value={seed} on:change={decodeSeed} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2" />
    <button on:click={randomiseSeed} class='bg-ew-500 hover:bg-ew-300 text-white rounded-lg py-2 px-4 my-2'>Randomise</button>
  </div>
  <div class="flex content-center gap-2">
    <label for="name" class="my-auto">Your Name (Optional):</label>
    <input type="text" id="name" bind:value={name} class="transition duration-500 bg-white dark:bg-gray-700 p-2 rounded-md"/>
  </div>
  <div class="flex gap-2 py-2">
    <Leaderboard type="compare" key={key} params={seed} settingsLabel="Seed"/>
    <button on:click={handleStart} class='me-auto bg-ew-300/20 py-2 px-4 rounded-md text-ew-500 dark:text-ew-300 hover:bg-ew-300/50'>Start</button>
  </div>
</div>