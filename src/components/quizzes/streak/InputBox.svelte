<script>
  import { onMount } from "svelte";
  import { fullSanitise } from "../../../utils/string";
  export let answerDict;
  export let answerList;
  export let defaultRegex;
  let regexInput = defaultRegex;
  let activeAnswerList = answerList;
  let options = [];
  let toStop = true;
  let prompt = '';
  let answer = '';
  let sanitisedAnswer = '';
  let userInput = '';
  let streak = 0;
  let prevStreak = 0;
  let isActive = true;
  let promptColorStyle = "bg-hp-500/30 text-hp-700 dark:text-hp-300";
  let isMcq = false;
  let isWacky = false;
  let difficulty = 'easy';
  const MINIMUM_ACTIVE_LENGTH = 5;
  const DIFFICULTY_MAPPING = {
    easy: { optionSize: 2, windowSize: 8, toRandomise: true },
    medium: { optionSize: 4, windowSize: 32, toRandomise: true },
    hard: { optionSize: 6, windowSize: 128, toRandomise: true },
    asian: { optionSize: 8, windowSize: 10000, toRandomise: true },
    clustered: { optionSize: 10, windowSize: 10000, toRandomise: false }
  };
  let windowSize;
  let optionSize;

  onMount(() => handleRegex(null));

  function handleRegex(e, skipDefault=false) {
    let regex;
    try {
      if (!e && !skipDefault) {
        regex = new RegExp(defaultRegex, 'g');
      } else if (!e) {
        regex = new RegExp(regexInput, 'g');
      } else {
        regex = new RegExp(e.target.value, 'g');
        regexInput = e.target.value;
      };
    } catch(_) {
      return;
    }
    activeAnswerList = [];
    for (const v of Object.values(answerDict)) {
      for (const answer of v) {
        if (answer.fullTerm.match(regex)) {
          activeAnswerList.push(answerList[answer.id]);
        } else if (isWacky && answer.prompt.match(regex)) {
          activeAnswerList.push(answerList[answer.id]);
        }
      }
    }
  }

  function handleStart() {
    if (activeAnswerList.length < MINIMUM_ACTIVE_LENGTH) {
      Swal.fire({
        title: "Not enough options! Please choose a different regex!",
        icon: 'error',
        color: "#FFF",
        timer: 2000
      });
      return;
    }
    if (DIFFICULTY_MAPPING[difficulty].toRandomise) {
      activeAnswerList.sort((a,b) => Math.random() - 0.5);
    }
    toStop = false;
    windowSize = Math.min(DIFFICULTY_MAPPING[difficulty].windowSize, activeAnswerList.length);
    optionSize = Math.min(DIFFICULTY_MAPPING[difficulty].optionSize, activeAnswerList.length);
    handleGenerate();
  }

  function handleGenerate() {
    let randomId;
    let prevAnswer = answer;
    while (true) {
      randomId = Math.floor(Math.random() * windowSize);
      answer = activeAnswerList[randomId].answer;
      if (answer !== prevAnswer) break;
    }
    sanitisedAnswer = fullSanitise(answer).key;
    prompt = activeAnswerList[randomId].prompt;
    isActive = true;
    options = [];
    for (let i=0; i<optionSize; i++) {
      options.push(activeAnswerList[(randomId+i) % activeAnswerList.length]);
    }
    options.sort((a,b) => Math.random() - 0.5);
    promptColorStyle = "bg-hp-500/30 text-hp-700 dark:text-hp-300";
  }

  function handleCorrect(e) {
    streak += 1;
    windowSize = Math.min(windowSize + 2, activeAnswerList.length);
    if (streak % 5 === 0) optionSize = Math.min(optionSize + 1, activeAnswerList.length);
    e.target.value = '';
    isActive = false;
    promptColorStyle = "bg-ew-500/30 text-ew-700 dark:text-ew-300";
  }

  function handleWrong(e) {
    prevStreak = streak;
    windowSize = Math.min(DIFFICULTY_MAPPING[difficulty].windowSize, activeAnswerList.length);
    optionSize = Math.min(DIFFICULTY_MAPPING[difficulty].optionSize, activeAnswerList.length);
    streak = 0;
    e.target.value = '';
    isActive = false;
    promptColorStyle = "bg-ns-500/30 text-ns-700 dark:text-ns-300"
  }

  function onKeyDown(e) {
    if (e.key !== 'Enter') return;
    if (!isActive) {
      e.target.value = '';
      return handleGenerate()
    };
    if (!e.target.value) return;
    userInput = e.target.value;
    const guess = fullSanitise(userInput).key;
    if (guess === sanitisedAnswer) return handleCorrect(e);
    if (!(guess in answerDict)) return handleWrong(e);
    for (const possibleAnswer of answerDict[guess]) {
      if (possibleAnswer.prompt === prompt) return handleCorrect(e);
    }
    return handleWrong(e);
  }

  function handleClick(e) {
    userInput = e.target.textContent;
    const guess = fullSanitise(userInput).key;
    if (guess === sanitisedAnswer) return handleCorrect(e);
    if (!(guess in answerDict)) return handleWrong(e);
    for (const possibleAnswer of answerDict[guess]) {
      if (possibleAnswer.prompt === prompt) return handleCorrect(e);
    }
    return handleWrong(e);
  }

  function handleWacky() {
    handleRegex(null, true);
  }
</script>

<div class="p-2 mt-4">
  {#if toStop}
  <form class="grid gap-2">
    <div class="flex items-center gap-4">
      <label for="regex" class="dark:text-white font-bold">Difficulty:</label>
      <select name="difficulty" on:change={(e) => difficulty = e.target.value} class="dark:bg-da-glow dark:text-white rounded-md p-1">
        {#each Object.keys(DIFFICULTY_MAPPING) as diff}
        <option value={diff}>{diff.toUpperCase()}</option>
        {/each}
      </select>
    </div>
    <div class="flex items-center gap-4">
      <label for="mcq" class="dark:text-white font-bold">Enable MCQ:</label>
      <input type="checkbox" name="mcq" bind:checked={isMcq} class="dark:bg-da-glow text-hp-700"/>
    </div>
    <div class="flex items-center gap-4">
      <label for="wacky" class="dark:text-white font-bold">Include prompt in regex:</label>
      <input type="checkbox" name="wacky" bind:checked={isWacky} class="dark:bg-da-glow text-hp-700" on:change={handleWacky}/>
    </div>
    <div class="flex items-center gap-4">
      <label for="regex" class="dark:text-white font-bold">Regex:</label>
      <input name="regex" on:input={handleRegex} placeholder="" value={regexInput} class='border-gray-500/50 border-[1px] rounded-md p-1 dark:bg-da-glow dark:text-white'/>
    </div>
  </form>

  <p class='dark:text-white my-2'>With this regex, you have <span class='text-ew-500 dark:text-ew-300'>{activeAnswerList.length}</span> possible answers{#if activeAnswerList.length < MINIMUM_ACTIVE_LENGTH}&nbsp;(<span class='text-ns-500 dark:text-ns-300'>too few!</span>){:else}, like:{/if}</p>
  <div class='flex flex-wrap gap-1 my-2'>
    {#each activeAnswerList.slice(0, MINIMUM_ACTIVE_LENGTH) as answer}
    <span class='bg-hp-500/30 text-hp-700 dark:text-hp-300 py-1 px-2 rounded-full'>{answer.answer}</span>
    {/each}
  </div>
  <button on:click={handleStart} class='bg-ew-300/20 py-1 px-2 rounded-full text-ew-500 dark:text-ew-300 hover:bg-ew-300/50'>Start Quiz</button>
  {:else}
  <div class="grid xl:grid-cols-2 gap-8">
    <div class={`${promptColorStyle} h-60 w-full mx-auto rounded-3xl grid items-center text-center p-4`}>
      <div>
        <p><span class='font-bold'>Prompt: </span>{prompt}</p>
        {#if !isActive && streak === 0}
        <p><span class='font-bold'>Wrong! The answer was: </span>{answer}</p>
        <p><span class='font-bold'>You answered: </span>{userInput}</p>
        <p><span class='font-bold'>Your streak ended at: </span>{prevStreak}</p>
        {:else if !isActive}
        <p><span class='font-bold'>Correct! The answer was: </span>{answer}</p>
        {/if}
      </div>
    </div>
    {#if isMcq}
    <div class="">
      <div class="dark:text-white">Streak: <span class="text-ew-500 dark:text-ew-300">{streak}</span></div>
      {#if isActive}
      <label for="guess" class="dark:text-white">Your Guess:</label>
      <div class="flex flex-wrap gap-2 mt-2">
        {#each options as option}
        <button on:click={handleClick} class="bg-hp-300/20 py-1 px-2 rounded-full text-hp-700 dark:text-hp-300 hover:bg-hp-300/50">{option.answer}</button>
        {/each}
      </div>
      {:else}
      <button on:click={handleGenerate} class="bg-ew-300/20 py-1 px-2 rounded-full text-ew-500 dark:text-ew-300 hover:bg-ew-300/50 mt-2">Next</button>
      {/if}
    </div>
    {:else}
    <div class="">
      <label for="guess" class="dark:text-white">Your Guess:</label>
      <input name="guess" on:keydown={onKeyDown} class='border-[1px] border-gray-500 px-2 py-1 rounded-lg dark:bg-da-glow w-full'/>
      <div class="dark:text-white">Streak: <span class="text-ew-500 dark:text-ew-300">{streak}</span></div>
      {#if !isActive}
      <button on:click={handleGenerate} class="bg-ew-300/20 py-1 px-2 rounded-full text-ew-500 dark:text-ew-300 hover:bg-ew-300/50">Next, or hit 'Enter'</button>
      {/if}
    </div>
    {/if}
  </div>
  {/if}
</div>