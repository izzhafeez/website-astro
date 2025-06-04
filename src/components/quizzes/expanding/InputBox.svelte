<script>
  import Timer from "../../../components/utils/Timer.svelte";
  import { fullSanitise } from "../../../utils/string";
  import { toAdd, toRemoveAll, toAddFeature, toAddAll } from "./featureStore";
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
  export let startingLocation;
  export let expansions;

  $: fullScore = Object.values(lookups).map(a => a.length).reduce((a, b)=>a+b, 0);
  let toStop = true;
  let startingLocationSearch = "";
  let startingLocationName = "";
  let answerFullNames = Object.entries(answers).map(([k, v]) => [k, `${v.name}, ${v.filter}`]);
  $: if (startingLocationSearch) {
    let lowerStartingLocationSearch = startingLocationSearch.toLowerCase();
    for (let fullName of answerFullNames) {
      let [k, v] = fullName;
      if (v.toLowerCase().includes(lowerStartingLocationSearch)) {
        startingLocation = k;
        startingLocationName = v;
        break;
      }
    }
  }
  let currExpansion = 0;
  $: totalScore = Object.keys(expansions).length;
  let score = 0;
  $: time = totalScore * 30;

  async function handleEnd(_) {
    toStop = true;
    toAddAll.set("big");

    showResults(score, totalScore, document.querySelector('.h-30'), prepareText());
  }

  function handleStart(_) {
    if (totalScore === null) {
      totalScore = 0;
      for (const value of Object.values(answers)) {
        totalScore += value.list.length;
      }
    }
    if (totalScore === 0) {
      Swal.fire({
        title: "Dude, guess a starting location!",
        icon: 'error',
        timer: 2000
      });
      return;
    };
    score = 0;
    toStop = false;
    toRemoveAll.set(Date.now());
    toAddFeature.set(currExpansion + sequenceDist);
  }

  function handleInput(e) {
    const input = e.target.value;

    if (input == "gg") {
      handleEnd();
      e.target.value = "";
      return;
    }

    // remove all non-alphanumeric characters, and lowercase
    const cleanInput = input.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (!lookups[cleanInput] && input != "skip") return;

    if (input === "skip") {
      e.target.value = "";

      // find next expansion
      for (let [i, expansion] of Object.entries(expansions)) {
        if (parseFloat(i) > currExpansion) {
          currExpansion = parseFloat(i);
          break;
        }
      }

      toAddFeature.set(currExpansion + sequenceDist);

      return;
    }

    for (let lookup of lookups[cleanInput]) {
      if (expansions[currExpansion].includes(lookup)) {
        toAdd.set(lookup);
        score++;
        e.target.value = "";

        // find next expansion
        for (let [i, expansion] of Object.entries(expansions)) {
          if (parseFloat(i) > currExpansion) {
            currExpansion = parseFloat(i);
            break;
          }
        }

        toAddFeature.set(currExpansion + sequenceDist);

        break;
      }
    }

    if (score === totalScore) handleEnd();
  }

  const prepareText = () => {
    let text = `${title}\n`;
    text += `I scored ${score}/${totalScore} points!\n`;
    const baseUrl = window.location.href.split('?')[0];
    const url = `${baseUrl}?isUntimed=${isUntimed ? "y" : ""}&expandingDist=${sequenceDist}&expandingType=${sequenceType}&startingLocation=${startingLocation}`;
    text += url;
    return text;
  }

  onMount(() => {
    toAddAll.set(Date.now());
  })
</script>

<div class='h-30 flex items-center mb-4 mt-2'>
  {#if toStop}
  <div class="grid">
    <label for="difficulty" class="">Expanding Type: </label>
    <div class="flex gap-2 my-2">
      {#each ["Circle", "Latitude", "Longitude"] as n (n)}
      <button on:click={() => {sequenceType = n;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={sequenceType == n} class:text-white={sequenceType == n}>{n}</button>
      {/each}
    </div>
    <label for="difficulty" class="">Expanding Distance (km): </label>
    <div class="flex gap-2 my-2">
      {#each [5, 10, 25, 50, 100, 200, 500] as n (n)}
      <button on:click={() => {sequenceDist = n;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={sequenceDist == n} class:text-white={sequenceDist == n}>{n}</button>
      {/each}
    </div>

    <div class="flex z-10 gap-2">
      <label class="my-auto">Starting Location:</label>
      <input type="text" id="search-bar" bind:value={startingLocationSearch} placeholder="Search a Location" class="border-2 border-gray-300/30 dark:bg-gray-700 rounded-md p-1 me-auto my-auto"/> <span class="my-auto" class:text-ns-500={!startingLocationName}>{startingLocationName || "Not Chosen"}</span>
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
      (<button type='button' class='underline cursor-pointer'>'skip' to skip, 'gg' to end</button>)</span>
  </div>
  {/if}
</div>