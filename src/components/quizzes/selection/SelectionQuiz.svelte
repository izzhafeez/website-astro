<script>
import { onMount } from "svelte";
import Leaderboard from "../Leaderboard.svelte";
import axios, { all } from "axios";

export let title;
export let instructions;
export let data;
export let key;
export let oneChoice;
export let passingScore;

let isStart = false;
let levels = Object.keys(data);
let level;
let options;
let guessed = false;
let selected = {};
let correct = {};
let streak = 0;
let bestStreak = 0;
let name;
let accuracy;

onMount(() => {
  bestStreak = localStorage.getItem(`selection-${key}-streak`) || 0;
})

function handleStart() {
  isStart = true;
  handleNext();
}

function handleNext() {
  level = levels[Math.floor(Math.random() * levels.length)];
  options = [...data[level].yes, ...data[level].no].sort((a,b) => 0.5 - Math.random());
  selected = {};
  correct = data[level].yes.reduce((acc, curr) => {
    acc[curr] = true;
    return acc;
  }, {});
  guessed = false;
}

async function handleGuess() {
  let count = 0;
  let total = 0
  for (let yes of data[level].yes) {
    if (selected[yes]) {
      count += 1;
    }
    total += 1;
  }
  for (let no of data[level].no) {
    if (!selected[no]) {
      count += 1;
    }
    total += 1;
  }

  if (!oneChoice) {
    accuracy = `${Math.round(count / total * 100)}%`;
  }

  if (count / total >= passingScore) {
    streak += 1;
    bestStreak = Math.max(streak, bestStreak);
    guessed = true;
    return;
  }

  var imgSrc;
  let savedStreak = streak;
  localStorage.setItem(`selection-${key}-streak`, bestStreak);

  const truncatedName = !!name ? name.length > 20 ? name.slice(0, 20) : name : '';
  axios.post(`${import.meta.env.PUBLIC_MM}/api/quizzes/selection/${key}`, {
    name: truncatedName,
    score: bestStreak
  });

  if (streak >= 200) {
    imgSrc = "perfect";
  } else if (streak >= 150) {
    // var audio = new Audio(`/sound/quizzes/fuiyoh.mp3`);
    // audio.play();
    imgSrc = "fuiyoh";
  } else if (streak >= 120) {
    imgSrc = "very-impressive";
  } else if (streak >= 100) {
    imgSrc = "pretty-impressive";
  } else if (streak >= 85) {
    imgSrc = "oh-wow";
  } else if (streak >= 70) {
    imgSrc = "practice";
  } else if (streak >= 60) {
    imgSrc = "you-fked-up";
  } else if (streak >= 50) {
    imgSrc = "where-my-slipper";
  } else if (streak >= 42) {
    // var audio = new Audio(`/sound/quizzes/oh-no.mp3`);
    // audio.play();
    imgSrc = "oh-no";
  } else if (streak >= 36) {
    imgSrc = "are-you-serious";
  } else if (streak >= 30) {
    // var audio = new Audio(`/sound/quizzes/haiya.mp3`);
    // audio.play();
    imgSrc = "haiya";
  } else if (streak >= 25) {
    imgSrc = "sacrilegious";
  } else if (streak >= 20) {
    // var audio = new Audio(`/sound/quizzes/so-weak.mp3`);
    // audio.play();
    imgSrc = "so-weak";
  } else if (streak >= 16) {
    imgSrc = "lamentable";
  } else if (streak >= 13) {
    // var audio = new Audio(`/sound/quizzes/what-da-hail.mp3`);
    // audio.play();
    imgSrc = "what-da-hail";
  } else if (streak >= 10) {
    // var audio = new Audio(`/sound/quizzes/emotional-damage.mp3`);
    // audio.play();
    imgSrc = "emotional-damage";
  } else if (streak >= 7) {
    imgSrc = "terrible";
  } else if (streak >= 5) {
    // var audio = new Audio(`/sound/quizzes/send-u-to-jesus.mp3`);
    // audio.play();
    imgSrc = "send-u-to-jesus";
  } else if (streak >= 3) {
    imgSrc = "low-iq";
  } else if (streak >= 1) {
    imgSrc = "language-failure";
  } else {
    // var audio = new Audio(`/sound/quizzes/failure.mp3`);
    // audio.play();
    imgSrc = "failure";
  }
  Swal.fire({
    title: `Your Score: ${savedStreak}`,
    html: `<img src="/img/quizzes/${imgSrc}.gif"/>`,
  }).then(_ => {
    guessed = true;
  });
}

function handleSelect(option) {
  if (guessed) return;
  if (oneChoice) {
    selected = {};
  }
  if (selected[option]) {
    selected[option] = false;
  } else {
    selected[option] = true;
  }
}
</script>

{#if !isStart}
<div class="fixed top-0 h-screen w-screen grid content-center justify-center p-8 -z-10">
  <div class="max-w-3xl mx-auto">
    <h1 class="text-5xl font-black animate-text bg-gradient-to-r from-ns-500 via-ns-400 to-ns-300 bg-clip-text text-transparent">{title.toUpperCase()}</h1>
    <p class=" mt-2">{instructions}</p>
    <label for="regex" class="">Your Name (Optional):</label>
    <input name="regex" bind:value={name} class='transition duration-500 bg-white dark:bg-gray-700 my-2 border-gray-500/50 border-[1px] rounded-md p-1' placeholder=""/>
    <div class="py-2 flex gap-2">
      <Leaderboard type="selection" key={key} params=""/>
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
<div class="max-w-6xl mx-auto p-2">
  <h2 class="font-extrabold animate-linear bg-[length:200%_auto] bg-gradient-to-r from-ns-500 to-ns-300  text-transparent bg-clip-text my-12" class:text-6xl={level.length < 20} class:text-xl={level.length >= 20}>
    {level}
  </h2>
  <p class=""><span class="font-bold">Streak:</span> {streak}</p>
  <p class=""><span class="font-bold">Best Streak:</span> {bestStreak}</p>
  {#if accuracy && guessed}
  <p class=""><span class="font-bold">Accuracy:</span> {accuracy}</p>
  {/if}
  <br/>
  <div class="grid lg:grid-cols-2 gap-1 ">
    {#each options as option}
    <button class={`${selected[option] ? 'bg-ew-500 text-white hover:bg-ew-300' : 'bg-gray-500/0 hover:bg-gray-500/50'} ${guessed ? correct[option] ? 'text-white' : 'line-through text-ns-500' : ''}
     float-left px-4 py-2 rounded-md border-[1px] border-gray-500/50`} on:click={() => handleSelect(option)}>{option}</button>
    {/each}
  </div>
  {#if !guessed}
  <button on:click={handleGuess} class='bg-ew-500 hover:bg-ew-300 text-white rounded-md py-2 px-4 mt-4'>Guess</button>
  {:else}
  <button on:click={handleNext} class='bg-cc-500 hover:bg-cc-300 text-white rounded-md py-2 px-4 mt-4'>Next</button>
  {/if}
</div>
{/if}