<script>
    import { onMount } from "svelte";
import { fullSanitise } from "utils/string";
export let key;
export let title;
export let data;
export let instructions;
export let decimalPlaces = 0;
export let startNumber = 0;
let dataList = Object.entries(data).map(([k, v]) => {
  const { cleanText, searchTerms } = fullSanitise(k);
  return { name: cleanText, imgPath: `/img/quizzes/compare/${key}/${searchTerms}.jpg`, quantity: v }
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

function handleNext() {
  left = right;
  while (right.name === left.name) {
    right = dataList[Math.floor(Math.random() * dataList.length)];
  }
  isGuessing = true;
  rightPlaceholder = startNumber;
  showNextButton = false;
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
    if (rightPlaceholder >= right.quantity) {
      clearInterval(intervalId);
      setTimeout(() => {showNextButton = true;}, 500);
    } else {
      rightPlaceholder = (((i/100) * right.quantity) + ((1-i/100) * startNumber)).toFixed(decimalPlaces);
      i++;
    }
  }, 10);
}

function handleFail(_) {
  var imgSrc;
  let savedStreak = streak;
  localStorage.setItem(`compare-${key}-streak`, bestStreak);
  if (streak > 200) {
    imgSrc = "perfect";
  } else if (streak > 150) {
    imgSrc = "fuiyoh";
  } else if (streak > 120) {
    imgSrc = "very-impressive";
  } else if (streak > 100) {
    imgSrc = "pretty-impressive";
  } else if (streak > 85) {
    imgSrc = "oh-wow";
  } else if (streak > 70) {
    imgSrc = "practice";
  } else if (streak > 60) {
    imgSrc = "you-fked-up";
  } else if (streak > 50) {
    imgSrc = "where-my-slipper";
  } else if (streak > 42) {
    imgSrc = "oh-no";
  } else if (streak > 36) {
    imgSrc = "are-you-serious";
  } else if (streak > 30) {
    imgSrc = "haiya";
  } else if (streak > 25) {
    imgSrc = "sacrilegious";
  } else if (streak > 20) {
    imgSrc = "so-weak";
  } else if (streak > 16) {
    imgSrc = "lamentable";
  } else if (streak > 13) {
    imgSrc = "what-da-hail";
  } else if (streak > 10) {
    imgSrc = "emotional-damage";
  } else if (streak > 7) {
    imgSrc = "terrible";
  } else if (streak > 5) {
    imgSrc = "send-u-to-jesus";
  } else if (streak > 3) {
    imgSrc = "low-iq";
  } else if (streak > 1) {
    imgSrc = "language-failure";
  } else {
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
  <h1 class="font-extrabold text-3xl dark:text-white">{title}</h1>
  <p class="text-gray-500 max-w-xl">{instructions}</p>
  <button on:click={handleStart} class='bg-ew-300/20 py-1 px-2 rounded-full text-ew-500 dark:text-ew-300 hover:bg-ew-300/50'>Start</button>
</div>
{:else}
<div class="fixed grid grid-cols-2 w-screen mt-20">
  <div class="text-right p-2"><p class="font-bold dark:text-white text-3xl">{streak}</p><p class="text-gray-500">Score</p></div>
  <div class="text-left p-2"><p class="font-bold dark:text-white text-3xl">{bestStreak}</p><p class="text-gray-500">Highscore</p></div>
</div>
<div class='grid grid-cols-2 divide-x-2 divide-hp-500 dark:divide-hp-300 h-screen w-screen'>
  <div class='grid gap-2 items-center content-center text-center p-4'>
    <div class="h-32 justify-center">
      <!-- <img src={left.imgPath} alt={left.name} class="w-32 h-32 rounded-full" /> -->
      <h2 class="font-bold dark:text-white text-xl">{left.name}</h2>
      <p class="text-5xl text-gray-500">{left.quantity}</p>
    </div>
  </div>
  <div class='grid content-center justify-items-center text-center gap-2 p-4'>
    <div class="h-32">
      <h2 class="font-bold dark:text-white text-xl">{right.name}</h2>
      {#if isGuessing}
      <div class="mt-2">
        <button on:click={() => handleAnswer(true)} class='w-20 py-2 bg-ew-300/20 text-ew-500 dark:text-ew-300 hover:bg-ew-300/50 rounded-full'>Higher</button>
        <button on:click={() => handleAnswer(false)} class='w-20 py-2 bg-ns-300/20 text-ns-500 dark:text-ns-300 hover:bg-ns-300/50 rounded-full'>Lower</button>
      </div>
      {:else}
      <p class="text-5xl text-gray-500">{rightPlaceholder}</p>
      {#if showNextButton}
      <button on:click={handleNext} class='w-20 py-2 bg-ew-300/20 text-ew-500 dark:text-ew-300 hover:bg-ew-300/50 rounded-full mt-2'>Next</button>
      {/if}
      {/if}
    </div>
  </div>
</div>
{/if}
</div>