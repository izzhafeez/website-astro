<script>
import StartPage from "./StartPage.svelte";
import GamePage from "./GamePage.svelte";

export let key;
export let title;
export let data;
export let instructions;
export let difficulty = 2;

const difficultyMappings = {
  1: 5,
  2: 15,
  3: 50,
  4: 150,
  5: 10000
}

let name;
let isPlaying = false;
let fields = Object.keys(Object.values(data)[0]);
let field = fields[0];
</script>

<div class="fixed">
{#if !isPlaying}
<StartPage {title} {instructions} {key} bind:name={name} bind:isPlaying={isPlaying} bind:difficulty={difficulty} bind:field={field} {fields}/>
{:else}
<GamePage {key} {data} {name} count={difficultyMappings[difficulty]} {field}/>
{/if}
</div>