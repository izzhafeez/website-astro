<script>
import StartPage from "./StartPage.svelte";
import GamePage from "./GamePage.svelte";

export let key;
export let title;
export let data;
export let instructions;
export let decimalPlaces = 0;
export let startNumber = 0;

let name;
let isPlaying = false;
</script>

<div class="fixed">
{#if !isPlaying}
<StartPage {title} {instructions} {key} bind:name={name} bind:isPlaying={isPlaying}/>
{:else}
<GamePage {key} {data} {decimalPlaces} {startNumber} {name}/>
{/if}
</div>