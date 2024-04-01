<script>
export let title;
export let instructions;
export let data;
let isStart = false;
let levels = Object.keys(data);
let level;
let options;
let guessed = false;
let selected = {};
let correct = {};

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

function handleGuess() {
  let score = 0;
  let totalScore = data[level].yes.length + data[level].no.length;
  for (let yes of data[level].yes) {
    if (selected[yes]) {
      score++;
    }
  }
  for (let no of data[level].no) {
    if (!selected[no]) {
      score++;
    }
  }

  let imgSrc;
  if (score/totalScore === 1) {
    imgSrc = "fuiyoh";
  } else if (score/totalScore >= 0.75) {
    imgSrc = "pretty-impressive";
  } else if (score/totalScore >= 0.5) {
    imgSrc = "oh-wow";
  } else if (score/totalScore >= 0.25) {
    imgSrc = "haiya";
  } else {
    imgSrc = "failure";
  }

  Swal.fire({
    title: `Your Score: ${score}/${totalScore}`,
    html: `<img src="/src/img/quizzes/${imgSrc}.gif"/>`,
  }).then(_ => {
    guessed = true;
  });
}

function handleSelect(option) {
  if (guessed) return;
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
<div class="max-w-6xl mx-auto">
  <h1 class="text-6xl font-extrabold bg-gradient-to-r from-ns-500 to-ns-300 dark:from-ns-500 dark:to-ns-100 text-transparent bg-clip-text my-12">
    {level}
  </h1>
  <div class="grid lg:grid-cols-2 gap-1">
    {#each options as option}
    <button class={`float-left px-4 py-2 rounded-md border-[1px]
      ${selected[option] ? 'border-ew-300' : ''} ${guessed ? correct[option] ? '' : 'line-through' : ''}`} on:click={() => handleSelect(option)}>{option}</button>
    {/each}
  </div>
  {#if !guessed}
  <button on:click={handleGuess} class='bg-ew-500 hover:bg-ew-400 text-white rounded-md py-2 px-4 mt-4'>Guess</button>
  {:else}
  <button on:click={handleNext} class='bg-cc-500 hover:bg-cc-400 text-white rounded-md py-2 px-4 mt-4'>Next</button>
  {/if}
</div>
{/if}