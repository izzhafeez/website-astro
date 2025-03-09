<script>
  import StartPage from "./StartPage.svelte";
  import GamePage from "./GamePage.svelte";
  import seededRandom from "../../common/seededRandom";
  import DailyChoice from "../DailyChoice.svelte";

  export let key;
  export let isDaily = false;

  let date;
  
  let isStart = false;
  let name;
  let randomiserSeed = Math.round(Math.random() * 1000000);
  let randomiser = seededRandom(randomiserSeed);
  let randomiseSeed = () => {
    randomiserSeed = Math.round(Math.random() * 1000000);
    randomiser = seededRandom(randomiserSeed);
  }
  let decodeSeed = () => {
    if (isNaN(randomiserSeed)) {
      randomiserSeed = 0;
    }
    randomiser = seededRandom(randomiserSeed);
  }

  let handleStart = () => {
    isStart = true;
  }
</script>

{#if !isStart}
  <div class="max-w-3xl mx-auto my-8">
    <h1 class="text-5xl font-black animate-text bg-gradient-to-r from-ns-500 via-ns-400 to-ns-300 bg-clip-text text-transparent">COLOR GUESSR</h1>
    <p class="my-2">Given a color, guess the hexcode in RGB format. For example, pure red would be #FF0000. Your score is based on how close your guess is to the actual hexcode. You have 5 rounds. Good luck!</p>
    {#if !isDaily}
      <StartPage {key} bind:name={name} bind:isStart={isStart} bind:randomiserSeed={randomiserSeed} {decodeSeed} {randomiseSeed}/>
    {:else}
      <DailyChoice {key} name="COLOR QUIZ" bind:date={date} bind:isStart={isStart} bind:randomiserSeed={randomiserSeed} bind:randomiser={randomiser} {handleStart} fullKey={`color`}/>
    {/if}
  </div>
{:else}
  <GamePage {key} bind:name={name} bind:isStart={isStart} {randomiser} {decodeSeed} {randomiserSeed} {date}/>
{/if}