<script>
  import StartPage from "./StartPage.svelte";
  import GamePage from "./GamePage.svelte";
  import seededRandom from "../../common/seededRandom";
  import DailyChoice from "../DailyChoice.svelte";

  export let params;
  
  let isStart = false;
  let seed = parseInt(params.seed) || Math.floor(Math.random() * 100000000);

  let randomiser;

  let handleStart = () => {
    randomiser = seededRandom(seed);
    randomiser();
    isStart = true;
  }

  const randomiseSeed = () => {
    seed = Math.floor(Math.random() * 100000000);
  }

  const setTodaySeed = () => {
    // ddmmyyyy
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    seed = yyyy + mm + dd;
  };
</script>

{#if !isStart}
  <StartPage bind:isStart={isStart} bind:seed={seed} {randomiseSeed} {setTodaySeed} {handleStart}/>
{:else}
  <GamePage bind:isStart={isStart} {handleStart} {randomiser} {seed} {randomiseSeed}/>
{/if}