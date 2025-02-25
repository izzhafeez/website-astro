<script>
import StartPage from "./StartPage.svelte";
import GamePage from "./GamePage.svelte";
import seededRandom from "../../common/seededRandom";

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

let randomiserSeed = Math.floor(Math.random() * 1000000);
let randomiser = seededRandom(randomiserSeed);
let encodeSeed = () => {
  let fieldIndex = fields.indexOf(field);
  return `${difficulty}${fieldIndex}${randomiserSeed}`;
}
let seed = encodeSeed();
let randomiseSeed = () => {
  randomiserSeed = Math.floor(Math.random() * 1000000);
  randomiser = seededRandom(randomiserSeed);
  seed = encodeSeed();
}
let decodeSeed = () => {
  field = fields[parseInt(seed[1])];
  difficulty = parseInt(seed[0]);
  randomiserSeed = parseInt(seed.slice(2));
  randomiser = seededRandom(randomiserSeed);
}
</script>

<div class="">
{#if !isPlaying}
<StartPage {title} {instructions} {key} bind:name={name} bind:isPlaying={isPlaying} bind:difficulty={difficulty} bind:field={field} {fields} bind:seed={seed} {randomiseSeed} {decodeSeed}/>
{:else}
<GamePage {key} {data} {name} count={difficultyMappings[difficulty]} {field} {seed} {randomiser} {difficulty}/>
{/if}
</div>