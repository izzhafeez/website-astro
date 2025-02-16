<script>
  import StartPage from "./StartPage.svelte";
  import GamePage from "./GamePage.svelte";
  import seededRandom from "../../common/seededRandom";

  export let key;
  
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
</script>

{#if !isStart}
<StartPage {key} bind:name={name} bind:isStart={isStart} bind:randomiserSeed={randomiserSeed} {decodeSeed} {randomiseSeed}/>
{:else}
<GamePage {key} bind:name={name} bind:isStart={isStart} {randomiser} {decodeSeed} {randomiserSeed}/>
{/if}