<script>
  import { onMount } from "svelte";
  export let title;
  export let instructions;
  export let fields;
  export let data;
  export let options;
  let answer;
  let isStart = false;
  let streak = 0;
  let bestStreak = 0;
  import { capitalise } from "../../../utils/string";

  onMount(() => {
    bestStreak = localStorage.getItem(`yes-no-${title}`) || 0;
  });

  function handleAnswer(guess) {
    if (guess === answer.answer) {
      streak++;
      bestStreak = Math.max(streak, bestStreak);
    } else {
      streak = 0;
      localStorage.setItem(`yes-no-${title}`, bestStreak);
    }
    Swal.fire({
      title: guess === answer.answer ? "Correct!" : "Incorrect",
      icon: guess === answer.answer ? "success" : "error",
      text: `The food item is ${answer.answer ? 'still edible' : 'spoilt'}. ${answer.reason}`,
      color: "#FFF"
    }).then(_ => {
      handleNext();
    });
  }

  function handleStart() {
    answer = data[Math.floor(Math.random() * data.length)];
    isStart = true;
  }

  function handleNext() {
    let prevAnswerName = answer.name;
    while (prevAnswerName === answer.name) {
      answer = data[Math.floor(Math.random() * data.length)];
    }
  }
</script>

{#if !isStart}
<div class="fixed top-0 h-screen w-screen grid content-center justify-center p-8 -z-10">
  <div class="max-w-3xl mx-auto">
    <h1 class="text-5xl font-extrabold bg-gradient-to-r from-ns-500 to-ns-300 dark:from-ns-500 dark:to-ns-100 text-transparent bg-clip-text">{title}</h1>
    <p class="dark:text-white mt-2">{instructions}</p>
    <div class="flex">
      <button
        class="mt-4 px-4 py-2 bg-hp-700 hover:bg-hp-500 text-white rounded-md"
        on:click={handleStart}
      >
        Start
      </button>
    </div>
  </div>
</div>
{:else}
<div class="fixed top-0 h-screen w-screen grid content-center justify-center p-8 -z-10">
  <p class="dark:text-white"><span class="font-bold">Streak</span>: <span class="text-ew-500">{streak}</span></p>
  <p class="dark:text-white"><span class="font-bold">Best Streak</span>: <span class="text-ew-500">{bestStreak}</span></p>
  <h2 class="text-6xl font-extrabold bg-gradient-to-r from-ns-500 to-ns-300 dark:from-ns-500 dark:to-ns-100 text-transparent bg-clip-text my-2">{answer.name}</h2>
  <ul class="dark:text-white">
    {#each fields as field}
      <li><span class="font-bold">{capitalise(field)}</span>: {answer[field]}</li>
    {/each}
  </ul>
  <div class="flex gap-4 mt-4">
    <button class="text-left bg-ew-500 hover:bg-ew-300 py-2 px-4 rounded-lg text-white" on:click={() => handleAnswer(true)}>{options[0]}</button>
    <button class="text-left bg-ns-500 hover:bg-ns-300 py-2 px-4 rounded-lg text-white" on:click={() => handleAnswer(false)}>{options[1]}</button>
  </div>
</div>
{/if}