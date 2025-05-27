<script>
  import Timer from "../../../components/utils/Timer.svelte";
  import { fullSanitise } from "../../../utils/string";
  import { toWrite, toSlug, toAddAll, toStart } from "./featureStore";
  import { onMount } from "svelte";
  import showResults from "../../common/showResults";
  import party from "party-js";
  import Swal from "sweetalert2";
  import L from "leaflet";

  export let answers;
  export let lookups;
  export let isUntimed;
  export let title;
  export let sequenceType;
  export let sequenceDist;
  export let grids;
  export let reverseGrid;

  $: totalScore = Object.keys(grids).length;
  let score = 0;
  $: time = totalScore * 30;
  let answered = new Set();

  let toStop = true;

  let handleStart = () => {
    answered.clear();
    toStart.set(new Date().getTime());
    toStop = false;
  };

  function handleInput(e) {
    const input = e.target.value;
    // remove all non-alphanumeric characters, and lowercase
    const cleanInput = input.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (!lookups[cleanInput]) return;

    let somethingHappened = false;
    for (let lookup of lookups[cleanInput]) {
      let gridKey = reverseGrid[lookup];
      let latKey = parseInt(gridKey.split("_")[0]);
      let lngKey = parseInt(gridKey.split("_")[1]);
      if (answered.has(gridKey)) continue;
      somethingHappened = true;
      toWrite.set(gridKey);
      toSlug.set(lookup);
      score++;
      answered.add(gridKey)
    }

    if (somethingHappened) {
      e.target.value = "";
    }

    if (score === totalScore) handleEnd();
  }

  async function handleEnd(_) {
    toStop = true;
    toAddAll.set("wat")

    showResults(score, totalScore, document.querySelector('.h-30'), prepareText());
  }

  const prepareText = () => {
    let text = `${title}\n`;
    text += `I scored ${score}/${totalScore} points!\n`;
    const baseUrl = window.location.href.split('?')[0];
    const url = `${baseUrl}?isUntimed=${isUntimed ? "y" : ""}&gridDist=${sequenceDist}&gridType=${sequenceType}`;
    text += url;
    return text;
  }
</script>

<div class='h-30 flex items-center mb-4 mt-2'>
  {#if toStop}
  <div class="grid">
    <label for="difficulty" class="">Grid Type: </label>
    <div class="flex gap-2 my-2">
      {#each ["Latitude", "Longitude", "Square"] as n (n)}
      <button on:click={() => {sequenceType = n;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={sequenceType == n} class:text-white={sequenceType == n}>{n}</button>
      {/each}
    </div>
    <label for="difficulty" class="">Grid Size (degrees): </label>
    <div class="flex gap-2 my-2">
      {#each [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10] as n (n)}
      <button on:click={() => {sequenceDist = n;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={sequenceDist == n} class:text-white={sequenceDist == n}>{n}</button>
      {/each}
    </div>

    <div class='py-2 flex flex-wrap gap-2'>
      <div class="my-auto">
        <label for="isUntimed" class="my-auto">Untimed:</label>
        <input type="checkbox" bind:checked={isUntimed} name="isUntimed" class='dark:bg-gray-700 rounded-md px-2 py-2 my-auto' on:change={() => {time = isUntimed ? 10000000000 : totalScore * 5}}/>
      </div>
      <button on:click={handleStart} class='bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50'>Start Quiz</button>
    </div>
  </div>
  {:else}
  <div class='float-left text-center h-20 w-20 place-content-center grid p-2'>
    <Timer countFrom={time} on:timesup={handleEnd} toStop={toStop}/>
  </div>
  <div class='grid h-30 content-between'>
    <b class='text-sm '>Enter Answer Here:</b>
    <div class="flex">
      <input class='border-gray-500/50 border-[1px] rounded-md p-1 dark:bg-gray-700' on:input={handleInput}/>
    </div>
    <span class='text-sm '>{score}/{totalScore} guessed 
      (<button type='button' class='text-ns-500 hover:text-ns-300 underline cursor-pointer' on:click={handleEnd}>Give Up?</button>)</span>
  </div>
  {/if}
</div>