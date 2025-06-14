<script>
  import Timer from "../../../components/utils/Timer.svelte";
  import { fullSanitise } from "../../../utils/string";
  import { toAdd, toHideTooltip, toRemove, toShowTooltip } from "./featureStore";
  import { onMount } from "svelte";
  import showResults from "../../common/showResults";
  import party from "party-js";
  import Swal from "sweetalert2";

  export let answers;
  export let lookups;
  export let defaultRegex;
  export let isUntimed;
  export let title;

  $: fullScore = Object.values(lookups).map(a => a.length).reduce((a, b)=>a+b, 0);
  let totalScore = null;
  let score = 0;
  $: time = totalScore * 10;
  let toStop = true;
  let answeredDict = {};
  let regexInput = defaultRegex;

  onMount(() => {
    handleRegex(null);
  })

  async function handleEnd(_) {
    toStop = true;
    for (let i=0; i<totalScore; i++) {
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
      answeredDict[v.id] = false;
      if (v.toInclude) {
        toAdd.set(v.id)
        toHideTooltip.set(v.id);
      };
    }
  }

  function handleInput(e) {
    const input = e.target.value;
    // remove all non-alphanumeric characters, and lowercase
    const cleanInput = input.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (!lookups[cleanInput]) return;
    const targetSlugs = lookups[cleanInput];
    let somethingChanged = false;
    for (const targetSlug of targetSlugs) {
      const target = answers[targetSlug]
      if (target.toInclude && !answeredDict[target.id]) {
        somethingChanged = true;
        score += 1;
        toRemove.set(target.id);
        answeredDict[target.id] = true;
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
          toAdd.set(v.id);
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

  function addRemoveTag(tag) {
    currentActiveTags = regexInput.split("|");
    if (currentActiveTags.includes(tag)) {
      currentActiveTags = currentActiveTags.filter(t => t !== tag);
      regexInput = currentActiveTags.filter(t => t).join("|");
    } else {
      currentActiveTags.push(tag);
      regexInput = currentActiveTags.filter(t => t).join("|");
    }
    handleRegex("from-input");
  }

  const prepareText = () => {
    let text = `${title}\n`;
    text += `I scored ${score}/${totalScore} points!\n`;
    const baseUrl = window.location.href.split('?')[0];
    const url = `${baseUrl}?selection=${regexInput || ""}&isUntimed=${isUntimed ? "y" : ""}`;
    text += url;
    return text;
  }
</script>

<div class='h-30 flex items-center mb-4 mt-2'>
  {#if toStop}
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
      (<button type='button' class='text-ns-500 hover:text-ns-300 underline cursor-pointer' on:click={handleEnd}>Give Up?</button>)</span>
  </div>
  {/if}
</div>