<script>
  import { onMount } from "svelte";
  import { fullSanitise } from "../../../utils/string";
  import seededRandom from "../../common/seededRandom";
  import Leaderboard from "../Leaderboard.svelte";
  import axios from "axios";
  import party from "party-js";
  import levenshtein from "fast-levenshtein";

  export let answerDict;
  export let answerList;
  export let defaultRegex;
  export let key;
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
  let promptColorStyle = "bg-dt-500 text-white";
  let isMcq = true;
  let isWacky = true;
  let name;

  $: difficulty = 'asian';
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
        regex = new RegExp(defaultRegex, 'gi');
      } else if (!e) {
        regex = new RegExp(regexInput, 'gi');
      } else {
        regex = new RegExp(e.target.value, 'gi');
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

  // seed must be 6 digits long
  let randomiserSeed = Math.floor(Math.random() * 899999 + 100000);
  let randomiser = seededRandom(randomiserSeed);
  let encodeSeed = () => {
    const mcqEncoded = isMcq ? 2 : 1;
    const wackyEncoded = isWacky ? 1 : 0;
    const difficultyIndex = Object.keys(DIFFICULTY_MAPPING).indexOf(difficulty || 'asian');
    const encodedNumberSeed = `${mcqEncoded}${wackyEncoded}${difficultyIndex}${randomiserSeed}`;
    const encodedSeed = `${encodedNumberSeed}${regexInput}`;
    return encodedSeed;
  }
  let decodeSeed = () => {
    const encodedSeedString = seed.toString(10);
    const mcqEncoded = parseInt(encodedSeedString[0]);
    const wackyEncoded = parseInt(encodedSeedString[1]);
    const difficultyIndex = parseInt(encodedSeedString[2]);
    // decoded is 6 digits long
    const decodedSeed = parseInt(encodedSeedString.slice(3, 9));
    isMcq = mcqEncoded === 2;
    isWacky = wackyEncoded === 1;
    difficulty = Object.keys(DIFFICULTY_MAPPING)[difficultyIndex];
    regexInput = encodedSeedString.slice(9);
    handleRegex(null, true);
    return decodedSeed;
  }
  let seed = encodeSeed();
  let changeSeed = () => {
    randomiserSeed = decodeSeed();
    randomiser = seededRandom(randomiserSeed);
  }
  let randomiseSeed = () => {
    randomiserSeed = Math.floor(Math.random() * 899999 + 100000);
    randomiser = seededRandom(randomiserSeed);
    seed = encodeSeed(randomiserSeed);
  }

  function handleStart() {
    // check if seed is valid
    if (seed.toString().length < 9) {
      Swal.fire({
        title: "Invalid seed! Please try again!",
        icon: 'error',
        color: "#FFF",
        timer: 2000
      });
      return;
    }

    // check if first 9 characters are digits using regex
    // afterwards, no need
    if (!/^\d{9}/.test(seed.toString()) ) {
      Swal.fire({
        title: "Invalid seed! Please try again!",
        icon: 'error',
        color: "#FFF",
        timer: 2000
      });
      return;
    }

    // check if first digit is 2 or 1
    // check if second digit is 1 or 0
    // check if third digit is 0, 1, 2, 3 or 4
    if (!/^[1-2][0-1][0-4]/.test(seed.toString())) {
      Swal.fire({
        title: "Invalid seed! Please try again!",
        icon: 'error',
        color: "#FFF",
        timer: 2000
      });
      return;
    }

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
      activeAnswerList.sort((a,b) => randomiser() - 0.5);
    }
    toStop = false;
    windowSize = Math.min(DIFFICULTY_MAPPING[difficulty].windowSize, activeAnswerList.length);
    optionSize = Math.min(DIFFICULTY_MAPPING[difficulty].optionSize, activeAnswerList.length);
    randomiser = seededRandom(randomiserSeed);
    handleGenerate();
  }

  function handleStop() {
    // reset randomiser
    randomiser = seededRandom(randomiserSeed);
    toStop = true;
  }

  function handleGenerate() {
    let randomId;
    let prevAnswer = answer;
    while (true) {
      randomId = Math.floor(randomiser() * windowSize);
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
    options.sort((a,b) => randomiser() - 0.5);
    promptColorStyle = "bg-dt-500 text-white";
  }

  function handleCorrect(e) {
    streak += 1;
    windowSize = Math.min(windowSize + 2, activeAnswerList.length);
    if (streak % 5 === 0) optionSize = Math.min(optionSize + 1, activeAnswerList.length);
    e.target.value = '';
    isActive = false;
    promptColorStyle = "bg-ew-500 text-white";

    party.confetti(document.querySelector("#streakCount"));
  }

  async function handleWrong(e) {
    prevStreak = streak;
    windowSize = Math.min(DIFFICULTY_MAPPING[difficulty].windowSize, activeAnswerList.length);
    optionSize = Math.min(DIFFICULTY_MAPPING[difficulty].optionSize, activeAnswerList.length);
    streak = 0;
    e.target.value = '';
    isActive = false;
    promptColorStyle = "bg-ns-500 text-white";

    const truncatedName = !!name ? name.length > 20 ? name.slice(0, 20) : name : '';
    const url = `https://script.google.com/macros/s/AKfycbzrruwSggCRGCwUducgQD3YiUFVLp5cKGt3IFcX7z-34QDR4XkceBhpKtQMQByZExRZjQ/exec`;
    await fetch(`${url}?siteUrl=__quizzes__streak__${key}&name=${truncatedName}&score=${prevStreak}&params=${seed}`);
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
    const levenshteinDistance = levenshtein.get(guess, sanitisedAnswer);
    if (levenshteinDistance < sanitisedAnswer.length / 5 || (sanitisedAnswer.length > 10 && guess.length > 3 && sanitisedAnswer.includes(guess))) return handleCorrect(e);
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
  <div class="grid gap-2">
    <div class="flex items-center gap-4 h-10">
      <label for="regex" class=" font-bold">Your Name (Optional):</label>
      <input name="regex" bind:value={name} class='transition duration-500 bg-gray-100 dark:bg-gray-700 border-gray-500/50 border-[1px] rounded-md p-1' placeholder=""/>
    </div>
    <div class="flex items-center gap-4 h-10">
      <label for="seed" class="font-bold">Seed: </label>
      <input type="text" id="seed" bind:value={seed} on:keyup={changeSeed} on:change={changeSeed} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2" />
      <button on:click={randomiseSeed} class='bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50 my-auto'>Random</button>
    </div>
    <div class="flex items-center gap-4 h-10">
      <label for="mcq" class=" font-bold">Enable MCQ:</label>
      <input type="checkbox" name="mcq" bind:checked={isMcq} on:change={() => {seed = (isMcq ? '2' : '1') + seed.slice(1); changeSeed();}} class="transition duration-500 bg-gray-100 dark:bg-gray-700 text-dt-500"/>
    </div>
    <div class="flex items-center gap-4 h-10">
      <label for="regex" class=" font-bold">Difficulty:</label>
      <select name="difficulty" bind:value={difficulty} on:change={() => {seed = seed.slice(0, 2) + Object.keys(DIFFICULTY_MAPPING).indexOf(difficulty).toString() + seed.slice(3); changeSeed();}} class="transition duration-500 bg-gray-100 dark:bg-gray-700  rounded-md p-1">
        {#each Object.keys(DIFFICULTY_MAPPING) as diff}
        <option value={diff}>{diff.toUpperCase()}</option>
        {/each}
      </select>
    </div>
    <div class="flex items-center gap-4 h-10">
      <label for="regex" class=" font-bold">Regex:</label>
      <input name="regex" on:input={handleRegex} on:keyup={(e) => {seed = seed.slice(0, 9) + e.target.value;}} placeholder="" value={regexInput} class='border-gray-500/50 border-[1px] rounded-md p-1 transition duration-500 bg-gray-100 dark:bg-gray-700 '/>
    </div>
    <div class="flex items-center gap-4 h-10">
      <label for="wacky" class=" font-bold">Regex will match both the answer and its description:</label>
      <input type="checkbox" name="wacky" bind:checked={isWacky} on:change={() => {seed = seed[0] + (isWacky ? '1': '0') + seed.slice(2); changeSeed();}} class="transition duration-500 bg-gray-100 dark:bg-gray-700 text-dt-500" on:change={handleWacky}/>
    </div>
  </div>

  <p class=' my-4'>With this regex, you have <span class='text-ew-700 dark:text-ew-300'>{activeAnswerList.length}</span> possible answers{#if activeAnswerList.length < MINIMUM_ACTIVE_LENGTH}&nbsp;(<span class='text-ns-700 dark:text-ns-300'>too few!</span>){:else}, like:{/if}</p>
  <div class='grid flex-wrap gap-2 my-4'>
    {#each activeAnswerList.slice(0, MINIMUM_ACTIVE_LENGTH) as answer}
    <div class='flex gap-2 items-center'>
      <span class='bg-dt-500 text-white py-1 px-2 rounded-full'>{answer.answer}</span>
      <span class=''>{answer.prompt}</span>
    </div>
    {/each}
  </div>
  <Leaderboard type="streak" key={key} params={seed}/>
  <button on:click={handleStart} class='bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50'>Start Quiz</button>
  {:else}
  <div class="grid gap-8">
    <div class={`${promptColorStyle} h-60 w-full mx-auto rounded-3xl grid items-center text-center p-4`}>
      <div>
        <p class={`${prompt.length < 20 && 'text-3xl'}`}><span class={`font-bold`}>Prompt: </span>{prompt}</p>
        {#if !isActive && streak === 0}
        <p><span class='font-bold'>Wrong! The answer was: </span>{answer}</p>
        <p><span class='font-bold'>You answered: </span>{userInput}</p>
        <p><span class='font-bold'>Your streak ended at: </span>{prevStreak}</p>
        {:else if !isActive}
        <p><span class='font-bold'>Correct! The answer was: </span>{answer}</p>
        {#if answer !== userInput}
        <p><span class='font-bold'>You answered: </span>{userInput}, but good enough!</p>
        {/if}
        {/if}
      </div>
    </div>
    {#if isMcq}
    <div class="">
      <div class="">Streak: <span id="streakCount" class="text-ew-700 dark:text-ew-300">{streak}</span></div>
      {#if isActive}
      <label for="guess" class="">Your Guess:</label>
      <div class="flex flex-wrap gap-2 mt-2">
        {#each options as option}
        <button on:click={handleClick} class="bg-dt-500 py-1 px-2 rounded-full text-white hover:bg-hp-500">{option.answer}</button>
        {/each}
      </div>
      {:else}
      <button on:click={handleGenerate} class="bg-ew-500 py-1 px-4 rounded-full text-white hover:opacity-50 mt-2">Next</button>
      {/if}
      <button on:click={handleStop} class="bg-ns-500 py-1 px-2 my-4 rounded-full text-white hover:opacity-50">Go Back</button>
    </div>
    {:else}
    <div class="">
      <div class="">Streak: <span class="text-ew-700 dark:text-ew-300">{streak}</span></div>
      <label for="guess" class="">Your Guess (hit 'Enter' to submit):</label>
      <input name="guess" on:keydown={onKeyDown} class='transition duration-500 bg-gray-100 dark:bg-gray-700 border-[1px] border-gray-500 px-2 py-1 rounded-lg w-full'/>
      {#if !isActive}
      <button on:click={handleGenerate} class="bg-ew-500 py-1 px-4 rounded-full text-white hover:opacity-50 mt-2">Next, or hit 'Enter'</button>
      {/if}
      <button on:click={handleStop} class="bg-ns-500 py-1 px-2 my-4 rounded-full text-white hover:opacity-50">Go Back</button>
    </div>
    {/if}
  </div>
  {/if}
</div>