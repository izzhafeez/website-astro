<script>
  import Timer from "../../../components/utils/Timer.svelte";
  import { toAdd, toHideTooltip, toRemove, toShowTooltip, toAddFeature } from "./featureStore";
  import { onMount } from "svelte";
  import showResults from "../../common/showResults";
  import party from "party-js";
  import Swal from "sweetalert2";
  import L from "leaflet";

  export let answers;
  export let lookups;
  export let defaultRegex;
  export let isUntimed;
  export let title;
  export let coverageDist = 100;
  export let coverageType = "Circle";
  export let isFullscreen = false;

  $: fullScore = Object.values(lookups).map(a => a.length).reduce((a, b)=>a+b, 0);
  let totalScore = null;
  let score = 0;
  $: time = totalScore * 10;
  let toStop = true;
  let answeredDict = {};
  let regexInput = defaultRegex;
  let completions = {};

  onMount(() => {
    handleRegex(null);
  })

  async function handleEnd(_) {
    toStop = true;
    for (let i=0; i<totalScore; i++) {
      toAddFeature.set(i);
      toShowTooltip.set(i);
    }

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
        title: "You have nothing to guess, LOL",
        icon: 'error',
        timer: 2000
      });
      return;
    };
    score = 0;
    toStop = false;

    for (const [k, v] of Object.entries(answers)) {
      for (const f of v.filters) {
        if (!completions[f]) completions[f] = 0;
        completions[f] += 1;
      }

      answeredDict[v.id] = 0;
      if (v.toInclude) {
        toRemove.set(v.id)
        toHideTooltip.set(v.id);
      };
    }
  }

  function handleInput(e) {
    const input = e.target.value;

    if (input === "gg") {
      handleEnd();
      return;
    }

    // remove all non-alphanumeric characters, and lowercase
    const cleanInput = input.replaceAll(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (!lookups[cleanInput]) return;
    const targetSlugs = lookups[cleanInput];
    let somethingChanged = false;
    for (const targetSlug of targetSlugs) {
      const target = answers[targetSlug]
      if (target.toInclude && (answeredDict[target.id] < 2 || !answeredDict[target.id])) {
        somethingChanged = true;

        if (answeredDict[target.id] == 0) score += 1;

        toAdd.set(target.id);
        answeredDict[target.id] = 2;

        for (const f of target.filters) {
          if (completions[f]) completions[f] -= 1;
        }

        let lat = target.lat;
        let lng = target.lng;
        for (const [k, v] of Object.entries(answers)) {
          if (v.toInclude && !answeredDict[v.id]) {

            let distance = Infinity;
            if (coverageType == "Circle") {
              distance = L.latLng(lat, lng).distanceTo(L.latLng(v.lat, v.lng));
            } else if (coverageType == "Square") {
              distance = Math.max(Math.abs(lat - v.lat), Math.abs(lng - v.lng)) * 100000;
            } else if (coverageType == "Latitude") {
              distance = Math.abs(lat - v.lat) * 100000;
            } else if (coverageType == "Longitude") {
              distance = Math.abs(lng - v.lng) * 100000;
            }
            
            if (distance < coverageDist*1000) {
              for (const f of v.filters) {
                if (completions[f]) completions[f] -= 1;
              }
              toAddFeature.set(v.id);
              answeredDict[v.id] = 1;
              score += 1;
            }
          }
        }
      }
    }

    if (somethingChanged) {
      e.target.value = '';
    }
    if (score === totalScore) handleEnd();
  }

  function handleRegex(e) {
    let regex;
    try {
      if (!e) {
        regex = new RegExp(defaultRegex, 'gi');
      } else if (e === "from-input") {
        regex = new RegExp(regexInput, 'gi');
      } else {
        regex = new RegExp(e.target.value, 'gi');
        regexInput = e.target.value;
      }

      totalScore = 0;
      for (const [k, v] of Object.entries(answers)) {
        if (v.name.match(regex)) {
          totalScore += 1;
          v.toInclude = true;
          toAddFeature.set(v.id);
        } else {
          v.toInclude = false;
          toRemove.set(v.id);
        }
      }
    } catch(err) {
      console.log(err);
      return;
    }
  }

  const showProgress = () => {
    // swal that shows completions
    let text = Object.entries(completions).map(([k, v]) => `${k}: ${v}`).join('\n');
    Swal.fire({
      title: "Remaining",
      text: text,
      icon: 'info',
      confirmButtonText: 'Ok',
    });
  }

  const prepareText = () => {
    let text = `${title}\n`;
    text += `I scored ${score}/${totalScore} points!\n`;
    const baseUrl = window.location.href.split('?')[0];
    const url = `${baseUrl}?selection=${regexInput || ""}&isUntimed=${isUntimed ? "y" : ""}&coverageDist=${coverageDist}&coverageType=${coverageType}`;
    text += url;
    return text;
  }
</script>

<div class='h-30 flex items-center mb-4 mt-2'>
  {#if toStop}
  <div class="grid">
    <label for="difficulty" class="">Coverage Distance: </label>
    <div class="flex gap-2 my-2">
      {#each [1, 2, 5, 10, 20, 50, 100, 200, 500] as n (n)}
      <button on:click={() => {coverageDist = n;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={coverageDist == n} class:text-white={coverageDist == n}>{n}</button>
      {/each}
    </div>
    <label for="difficulty" class="">Coverage Type: </label>
    <div class="flex gap-2 my-2">
      {#each ["Circle", "Latitude", "Longitude", "Square"] as n (n)}
      <button on:click={() => {coverageType = n;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={coverageType == n} class:text-white={coverageType == n}>{n}</button>
      {/each}
    </div>
    <div class='py-2 flex flex-wrap gap-2'>
      <div class="my-auto">
        <label for="isUntimed" class="my-auto">Untimed:</label>
        <input type="checkbox" bind:checked={isUntimed} name="isUntimed" class='dark:bg-gray-700 rounded-md px-2 py-2 my-auto' on:change={() => {time = isUntimed ? 10000000000 : totalScore * 5}}/>
      </div>
      <div class="my-auto">
        <label for="regex" class="my-auto">Selection:</label>
        <input name="regex" on:input={handleRegex} class='transition duration-500 bg-gray-100 dark:bg-gray-700 border-gray-500/50 border-[1px] rounded-md p-1' placeholder="" value={regexInput}/>
      </div>
      <button on:click={handleStart} class='bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50'>Start Quiz</button>
    </div>
  </div>
  {:else}
  <div class='float-left text-center h-20 w-20 place-content-center grid p-2'>
    <Timer countFrom={time} on:timesup={handleEnd} toStop={toStop}/>
  </div>
  <div class='grid h-30 content-between'>
    <b class='text-sm '>{regexInput ? `Enter Answers Containing "${regexInput}" here` : "Enter Answer Here"}:</b>
    <div class="flex">
      <input class='border-gray-500/50 border-[1px] rounded-md p-1 dark:bg-gray-700' on:input={handleInput}/>
    </div>
    <span class='text-sm '>{score}/{totalScore} guessed 
      ('gg' to give up)</span>
      {#if !isFullscreen}
      <button class='underline hover:text-ew-500 text-sm text-left' on:click={showProgress}>Show Remaining</button>
      {/if}
  </div>
  {/if}
</div>