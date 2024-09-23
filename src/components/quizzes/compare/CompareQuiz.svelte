<script>
import StartPage from "./StartPage.svelte";
import GamePage from "./GamePage.svelte";

export let key;
export let title;
export let data;
export let instructions;
export let decimalPlaces = 0;
export let startNumber = 0;
export let difficulty = 2;

const difficultyMappings = {
  1: 8,
  2: 16,
  3: 32,
  4: 64,
  5: 128
}

let name;
let isPlaying = false;
</script>

<div class="fixed">
{#if !isPlaying}
<StartPage {title} {instructions} {key} bind:name={name} bind:isPlaying={isPlaying} bind:difficulty={difficulty}/>
{:else}
<GamePage {key} {data} {decimalPlaces} {startNumber} {name} count={difficultyMappings[difficulty]}/>
{/if}
</div>