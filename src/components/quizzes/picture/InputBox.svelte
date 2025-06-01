<script>
  import { fullSanitise } from "../../../utils/string";
  import { onMount } from "svelte";
  import { shareResults } from "../../common/showResults";
  import party from "party-js";
  import Swal from "sweetalert2";

  export let title;
  export let isLearning;
  export let isMcq;
  export let answer;
  export let filteredKeys;
  export let dataDict;

  let streak = 0;
  let bestStreak = 0;
  let isStart = false;
  let encountered = new Set();
  let isWaiting = false;
  let options = [];
  let input = "";
  let currPoints = [];
  let isValid = true;
  let filters = new Set();
  $: pureKeys = filteredKeys ? filteredKeys.map(([n, f, v]) => n) : [];

  const handleType = (e) => {
    if (!e.target.value) return;
    isValid = true;
    if (e.key != "Enter" && e.target.value != "gg") return;
    input = e.target.value;
    isValid = handleInput(input);
    if (isValid) {
      e.target.value = "";
      isWaiting = true;
    }

    // wait for the next button to be created
    setTimeout(() => {
      const nextButton = document.getElementById("next-button");
      if (nextButton) {
        nextButton.focus();
      }
    }, 0);
  }

  const handleClick = (i) => {
    input = i;
    handleInput(i);
    isWaiting = true;
  }

  const handleInput = (input) => {
    if (input == "gg") {
      handleWrong();
      return true;
    }

    if (!pureKeys.includes(input)) {
      return false;
    }

    let correct = answer.toLowerCase() == input.toLowerCase();

    if (correct) handleCorrect();
    else handleWrong();

    // TODO

    return true;
  }

  const handleCorrect = () => {
    streak++;
    bestStreak = Math.max(streak, bestStreak);
    party.confetti(document.querySelector('.h-30'));
  }

  const handleWrong = () => {
    streak = 0;
  }

  const handleStart = () => {
    if (filteredKeys.length < 4) {
      Swal.fire({
        title: "Not enough items!",
        text: "Please use a selection that matches at least 4 items.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

    encountered.clear();
    isStart = true;

    // populate the encountered set with 4 random keys from filteredKeys
    const sortedKeys = [...filteredKeys].sort(() => Math.random() - 0.5);
    const randomKeys = sortedKeys.slice(0, 4);

    filters.clear();
    randomKeys.forEach(key => {
      filters.add(canonicalF(key[1][0]));
      encountered.add(key[0]);
    });

    if (!isLearning) {
      filteredKeys.forEach(([name, fs, v]) => {
        filters.add(canonicalF(fs[0])); // add the category of the key
      });
    }

    console.log(filters);

    handleNext();
  }

  const handleNext = () => {
    if (streak > 4) { 
      // choose a random category
      const sortedCats = [...filters].sort(() => Math.random() - 0.5);
      const randomCat = sortedCats[0];
      const catKeys = filteredKeys.filter(([name, fs, _]) => canonicalF(fs[0]) == randomCat);

      // add a new key to the encountered set
      const sortedKeys = [...catKeys].sort(() => Math.random() - 0.5);
      const randomKey = sortedKeys[0];
      encountered.add(randomKey[0]);
      filters.add(randomCat);
    }

    let randomKey = answer;

    while (answer == randomKey) {
      if (isLearning) {
        // get a random category from the encountered set
        const sortedCats = [...filters].sort(() => Math.random() - 0.5);
        const randomCat = sortedCats[0];
        const catKeys = Array.from(encountered).filter(key => {
          const f = canonicalF(dataDict[key].f[0]);
          return f && f == randomCat;
        });

        // get a random key from the encountered set
        const randomIndex = Math.floor(Math.random() * catKeys.length);
        randomKey = catKeys[randomIndex];
      } else {
        // get a random category from the encountered set
        const sortedCats = [...filters].sort(() => Math.random() - 0.5);
        const randomCat = sortedCats[0];
        const catKeys = filteredKeys.filter(([name, fs, _]) => canonicalF(fs[0]) == randomCat);

        // get a random key from the filteredKeys
        const randomIndex = Math.floor(Math.random() * catKeys.length);
        randomKey = catKeys[randomIndex][0];
      }
    }
    answer = randomKey;

    // TODO

    isWaiting = false;
    isValid = true;

    if (!isMcq) {
      // wait until the text box is created
      setTimeout(() => {
        const textbox = document.getElementById("text-box");
        if (textbox) {
          textbox.focus();
        }
      }, 0);
    }
  }

  const prepareText = () => {
    let text = `${title}\n`;
    text += `I got a streak of ${bestStreak}!\n`;
    const baseUrl = window.location.href.split('?')[0];
    const url = `${baseUrl}?isLearning=${isLearning || ""}&isMcq=${isMcq || ""}`;
    text += url;
    return text;
  }

  const handleShare = () => {
    const text = prepareText();
    shareResults(text);
  }

  const canonicalF = (f) => {
    if (!f) return "";
    f = f.split("_");
    return f[f.length - 1]; // get the last part of the category
  }

  $: if (answer) {
    let optionsSet = new Set();
    optionsSet.add(answer);

    let f = canonicalF(dataDict[answer].f[0]); // get the last part of the category
    const matched = filteredKeys.filter(([name, fs, _]) => fs.includes(f) && name != answer).sort(() => Math.random() - 0.5);
    const unmatched = filteredKeys.filter(([name, fs, _]) => !fs.includes(f) && name != answer).sort(() => Math.random() - 0.5);

    const targetCount = Math.floor(streak / 4) + 3;
    const matchedCount = Math.min(matched.length, Math.floor(targetCount / 2));

    const matchedKeys = matched.slice(0, matchedCount);
    matchedKeys.forEach(([name]) => optionsSet.add(name));
    const unmatchedCount = Math.min(unmatched.length, targetCount - matchedCount);
    const unmatchedKeys = unmatched.slice(0, unmatchedCount);
    unmatchedKeys.forEach(([name]) => optionsSet.add(name));

    options = Array.from(optionsSet).sort(() => Math.random() - 0.5);
  }
</script>

<div class='h-30 flex items-center mb-4 mt-2'>
  {#if !isStart}
  <div class="grid">
    <div class='py-2 flex flex-wrap gap-4'>
      <div class="my-auto">
        <label for="isUntimed" class="my-auto">Learning:</label>
        <input type="checkbox" bind:checked={isLearning} name="isUntimed" class='dark:bg-gray-700 rounded-md px-2 py-2 my-auto'/>
      </div>
      <div class="my-auto">
        <label for="isUntimed" class="my-auto">MCQ:</label>
        <input type="checkbox" bind:checked={isMcq} name="isUntimed" class='dark:bg-gray-700 rounded-md px-2 py-2 my-auto'/>
      </div>
      <div class="my-auto">
        <span for="isUntimed" class="my-auto">Count: {filteredKeys.length}</span>
      </div>
      <button on:click={handleStart} class='bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50'>Start Quiz</button>
    </div>
  </div>
  {:else}
  <div class="grid gap-2">
    <div class="flex flex-wrap gap-4">
      <div class="my-auto">Streak: {streak}</div>
      <div class="my-auto">Best Streak: {bestStreak} (<button on:click={handleShare} class="underline small text-jr-500">Share?</button>)</div>
    </div>
  {#if !isWaiting}
    {#if !isMcq}
    <div class="flex flex-wrap gap-2">
      <span class="my-auto">Your guess ('Enter' to submit):</span>
      <input id="text-box" class='border-gray-500/50 border-[1px] rounded-md p-1 dark:bg-gray-700' on:keypress={handleType}/>
      {#if !isValid}
        <div class="text-ns-500 my-auto">Invalid input! Type 'gg' to give up!</div>
      {/if}
    </div>
    {:else}
      <div class="flex flex-wrap gap-2">
        {#each options as option}
          <button on:click={() => handleClick(option)} class='bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50'>{option}</button>
        {/each}
      </div>
    {/if}
  {:else}
    <div class="flex flex-wrap gap-2">
      <div class="my-auto">You guessed: <span class:text-ns-500={input.toLowerCase() != answer.toLowerCase()} class:text-ew-500={input.toLowerCase() === answer.toLowerCase()}>{input}</span></div>
      {#if input.toLowerCase() != answer.toLowerCase()}
        <div class="my-auto">Correct answer: {answer}</div>
      {/if}
      <button id="next-button" on:click={handleNext} class='bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50'>Next</button>
    </div>
  {/if}
    <img src={answer ? dataDict[answer].v : ""} alt={answer} class="max-h-96 rounded-md shadow-md bg-white" />
  </div>
  {/if}
</div>