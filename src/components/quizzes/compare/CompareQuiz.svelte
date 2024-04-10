<script>
import { onMount } from "svelte";
import { fullSanitise } from "../../../utils/string";
import Leaderboard from "../Leaderboard.svelte";
import axios from "axios";
export let key;
export let title;
export let data;
export let instructions;
export let decimalPlaces = 0;
export let startNumber = 0;
let name;

let dataList = Object.entries(data).map(([k, v]) => {
  const { cleanText, searchTerms } = fullSanitise(k);
  return { name: cleanText, imgPath: `/src/img/quizzes/compare/${key}/${searchTerms}.jpg`, quantity: v }
});
let left;
let right;
let rightPlaceholder = 0;
let isPlaying = false;
let isGuessing = false;
let showNextButton = false;
let streak = 0;
let bestStreak = 0;

onMount(() => {
  bestStreak = localStorage.getItem(`compare-${key}-streak`) || 0;
})

function handleStart(_event) {
  left = dataList[Math.floor(Math.random() * dataList.length)];
  right = left;
  while (right === left) right = dataList[Math.floor(Math.random() * dataList.length)];
  isPlaying = true;
  isGuessing = true;
}

async function handleNext() {
  left.quantity = right.quantity
  await changeToTarget(right.name);

  while (right.name === left.name) {
    right = dataList[Math.floor(Math.random() * dataList.length)];
  }
  isGuessing = true;
  rightPlaceholder = startNumber;
  showNextButton = false;
}

async function changeToTarget(name) {
  const delay = ms => new Promise(res => setTimeout(res, ms));

  while (left.name.length > 1) {
    left.name = left.name.slice(0, -1);
    await delay(25);
  }

  left.name = name[0];

  while (left.name.length < name.length) {
    left.name += name[left.name.length];
    await delay(25);
  }
}

function handleAnswer(isHigher) {
  if (isHigher) {
    if (left.quantity <= right.quantity) {
      streak++;
      bestStreak = Math.max(streak, bestStreak);
    } else {
      handleFail();
      streak = 0;
    }
  } else {
    if (left.quantity >= right.quantity) {
      streak++;
      bestStreak = Math.max(streak, bestStreak);
    } else {
      handleFail();
      streak = 0;
    }
  }
  handleCountUp();
}

function handleCountUp() {
  isGuessing = false;
  let i = 0;
  const intervalId = setInterval(() => {
    if (Math.abs(rightPlaceholder) >= Math.abs(right.quantity)) {
      clearInterval(intervalId);
      setTimeout(() => {showNextButton = true;}, 500);
    } else {
      rightPlaceholder = (((i/100) * right.quantity) + ((1-i/100) * startNumber)).toFixed(decimalPlaces);
      i++;
    }
  }, 10);
}

async function handleFail(_) {
  var imgSrc;
  let savedStreak = streak;
  localStorage.setItem(`compare-${key}-streak`, bestStreak);

  const truncatedName = !!name ? name.length > 20 ? name.slice(0, 20) : name : '';
  axios.post(`${import.meta.env.PUBLIC_MM}/api/quizzes/compare/${key}`, {
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
  setTimeout(
    () => {
      Swal.fire({
        title: `Your Score: ${savedStreak}`,
        html: `<img src="/img/quizzes/${imgSrc}.gif"/>`,
        color: "#FFF"
      });
    },
    1000
  );
}
</script>

<div class="fixed">
{#if !isPlaying}
<div class="grid h-screen w-screen justify-center content-center gap-2 p-4">
  <h1 class="font-extrabold text-6xl bg-gradient-to-r from-ns-500 to-ns-300 dark:from-ns-400 dark:to-ns-100 text-transparent bg-clip-text">{title}</h1>
  <p class="dark:text-white max-w-xl">{instructions}</p>
  <div class="flex content-center gap-2">
    <label for="name" class="dark:text-white my-auto">Your Name (Optional):</label>
    <input type="text" id="name" bind:value={name} class="p-2 rounded-md"/>
  </div>
  <div class="flex gap-2 py-2">
    <Leaderboard type="compare" key={key}/>
    <button on:click={handleStart} class='me-auto bg-ew-300/20 py-2 px-4 rounded-md text-ew-500 dark:text-ew-300 hover:bg-ew-300/50'>Start</button>
  </div>
</div>
{:else}
<div class='grid lg:grid-cols-2 h-screen w-screen'>
  <div class='my-auto grid gap-8 content-end lg:items-center lg:content-center text-center p-4'>
    <h2 class='p-4 dark:text-white font-extrabold text-3xl mx-auto rounded-xl'>{left.name}</h2>
    <p class='text-5xl h-20 grid items-center p-4 mx-auto text-white bg-hp-600 shadow-solid-black dark:shadow-none'>{left.quantity}</p>
  </div>
  <div class="grid absolute items-center m-auto left-0 right-0 top-0 bottom-0 -z-10">
    <div class='mx-auto flex lg:block items-center gap-8'>
      <p class='lg:text-center opacity-0'>
        Score: {streak}<br/>
        Best Score: {bestStreak}
      </p>
      <h2 class='rounded-full text-6xl m-auto text-center bg-da-alt aspect-square p-2 flex items-center text-white dark:bg-li-alt dark:text-black lg:my-4'>VS</h2>
      <p class='lg:text-center dark:text-white'>
        Score: {streak}<br/>
        Best Score: {bestStreak}
      </p>
    </div>
  </div>
  <div class='my-auto grid gap-8 content-end lg:items-center lg:content-center text-center p-4'>
    <h2 class='p-4 dark:text-white font-extrabold text-3xl mx-auto rounded-xl'>{right.name}</h2>
    {#if isGuessing}
    <div class="grid grid-cols-2 divide-x-0 mx-auto shadow-solid-black dark:shadow-none">
      <button on:click={() => handleAnswer(true)} class='p-4 h-20 bg-ew-500 text-white hover:bg-opacity-80 font-bold text-xl'>Higher</button>
      <button on:click={() => handleAnswer(false)} class='p-4 h-20 bg-ns-500 text-white hover:bg-opacity-80 font-bold text-xl'>Lower</button>
    </div>
    {:else}
    <div class='flex gap-0 mx-auto shadow-solid-black dark:shadow-none'>
      <p class="text-5xl h-20 grid items-center p-4 text-white bg-hp-600">{rightPlaceholder}</p>
      {#if showNextButton}
      <button on:click={handleNext} class='p-4 bg-cc-500 text-white hover:bg-opacity-80 font-bold text-xl'>Next</button>
      {/if}
    </div>
    {/if}
  </div>
</div>
{/if}
</div>