<script>
import StartPage from "./StartPage.svelte";
import GamePage from "./GamePage.svelte";
import seededRandom from "../../common/seededRandom";

export let title;
export let data;
export let params;
let seed = parseInt(params.seed) || Math.floor(Math.random() * 100000000);

let isPlaying = false;
let fields = Object.keys(Object.values(data)[0]).filter(k => typeof Object.values(data)[0][k] == "number");
let field = fields[0];

let randomiser;

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
  field = fields[0];
};
</script>

{#if !isPlaying}
<StartPage {title} bind:randomiser={randomiser} {randomiseSeed} {setTodaySeed} bind:isPlaying={isPlaying} bind:field={field} {fields} bind:seed={seed}/>
{:else}
<GamePage {data} {field} {seed} {randomiser} {randomiseSeed} {title}/>
{/if}