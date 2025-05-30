<script>
  import { fullSanitise } from "../../../utils/string";
  import { toShow, toAllow } from "./featureStore";
  import { onMount } from "svelte";
  import { shareResults } from "../../common/showResults";
  import party from "party-js";
  import Swal from "sweetalert2";

  export let title;
  export let selection;
  export let isLearning;
  export let isMcq;
  export let pointsRegistration;
  export let answer;
  export let filteredKeys;

  let streak = 0;
  let bestStreak = 0;
  let isStart = false;
  let encountered = new Set();
  let isWaiting = false;
  let options = [];
  let input = "";
  let currPoints = [];
  let isValid = true;

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

    if (!filteredKeys.includes(input)) {
      return false;
    }

    let correct = answer.toLowerCase() == input.toLowerCase();

    if (correct) handleCorrect();
    else handleWrong();

    toAllow.set(answer);

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
    randomKeys.forEach(key => {
      encountered.add(key);
    });

    handleNext();
  }

  const handleNext = () => {
    if (streak > 4) {
      // add a new key to the encountered set
      const sortedKeys = [...filteredKeys].sort(() => Math.random() - 0.5);
      const randomKey = sortedKeys[0];
      encountered.add(randomKey);
    }

    let randomKey = answer;

    while (answer == randomKey) {
      if (isLearning) {
        // get a random key from the encountered set
        const randomIndex = Math.floor(Math.random() * encountered.size);
        randomKey = Array.from(encountered)[randomIndex];
      } else {
        // get a random key from the filteredKeys
        const randomIndex = Math.floor(Math.random() * filteredKeys.length);
        randomKey = filteredKeys[randomIndex];
      }
    }
    answer = randomKey;

    toShow.set(false);
    toShow.set(answer);
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
    const url = `${baseUrl}?selection=${selection || ""}&isLearning=${isLearning || ""}&isMcq=${isMcq || ""}`;
    text += url;
    return text;
  }

  const handleShare = () => {
    const text = prepareText();
    shareResults(text);
  }

  $: if (answer) {
    let optionsSet = new Set();
    optionsSet.add(answer);
    
    // add 3 more random options from filteredKeys
    while (optionsSet.size < 4) {
      const randomIndex = Math.floor(Math.random() * filteredKeys.length);
      const randomKey = filteredKeys[randomIndex];
      optionsSet.add(randomKey);
    }

    options = Array.from(optionsSet).sort(() => Math.random() - 0.5);
  }
</script>

<div class='h-30 flex items-center mb-4 mt-2'>
  {#if !isStart}
  <div class="grid">
    <div class="my-auto">
      <label for="regex" class="my-auto">Selection:</label>
      <input name="regex" bind:value={selection} class='transition duration-500 bg-gray-100 dark:bg-gray-700 border-gray-500/50 border-[1px] rounded-md p-1' placeholder=""/>
      {filteredKeys.length} items {filteredKeys.length < 4 ? "(not enough!)" : ""}
    </div>
    <div class='py-2 flex flex-wrap gap-4'>
      <div class="my-auto">
        <label for="isUntimed" class="my-auto">Learning:</label>
        <input type="checkbox" bind:checked={isLearning} name="isUntimed" class='dark:bg-gray-700 rounded-md px-2 py-2 my-auto'/>
      </div>
      <div class="my-auto">
        <label for="isUntimed" class="my-auto">MCQ:</label>
        <input type="checkbox" bind:checked={isMcq} name="isUntimed" class='dark:bg-gray-700 rounded-md px-2 py-2 my-auto'/>
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
      <div class="my-auto">You guessed: <span class:text-ns-500={input != answer} class:text-ew-500={input === answer}>{input}</span></div>
      {#if input != answer}
        <div class="my-auto">Correct answer: {answer}</div>
      {/if}
      <button id="next-button" on:click={handleNext} class='bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50'>Next</button>
    </div>
  {/if}
  </div>
  {/if}
</div>