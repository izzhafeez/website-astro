<script>
  import { onMount } from "svelte";
  import axios from "axios";
  export let title;
  export let instructions;
  export let fields;
  export let data;
  export let options;
  export let key;
  let answer;
  let isStart = false;
  let streak = 0;
  let bestStreak = 0;
  let name;
  import { capitalise } from "../../../utils/string";
  import Leaderboard from "../Leaderboard.svelte";

  onMount(() => {
    bestStreak = localStorage.getItem(`yes-no-${title}`) || 0;
  });

  async function handleAnswer(guess) {
    if (guess === answer.answer) {
      streak++;
      bestStreak = Math.max(streak, bestStreak);
    } else {
      streak = 0;
      localStorage.setItem(`yes-no-${title}`, bestStreak);
      const truncatedName = name.length > 20 ? name.slice(0, 20) : name;
      await axios.post(`${import.meta.env.PUBLIC_QUIZ}api/yes-no/${key}`, {
        name: truncatedName,
        score: streak
      });
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
    <label for="regex" class="dark:text-white">Your Name (Optional):</label>
    <input name="regex" bind:value={name} class='my-2 border-gray-500/50 border-[1px] rounded-md p-1' placeholder=""/>
    <div class="flex py-2 gap-2">
      <Leaderboard type="yes-no" key={key}/>
      <button
        class="bg-ew-300/20 py-1 px-2 rounded-md text-ew-500 dark:text-ew-300 hover:bg-ew-300/50"
        on:click={handleStart}
      >
        Start Quiz
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