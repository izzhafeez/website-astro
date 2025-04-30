<script lang="ts">
  import L from "leaflet";
  import party from 'party-js';
  import { Canvas, Layer } from 'svelte-canvas';
  import seededRandom, {shuffle} from '../../common/seededRandom';
  import { fly, fade } from 'svelte/transition';
  import Swal from 'sweetalert2';
  import toast from "../../common/toast";
  import showResults, { shareResults } from "../../common/showResults";
  import { standardiseWithoutParen } from "../../../data/standardiseName";

  export let isStart: boolean;
  export let title: string;
  export let locations: any;
  export let seed: number;
  export let cleanData: any;
  export let N: number;
  export let randomiseSeed: () => void;
  export let handleStart: () => void;

  let toGuess = locations[0];
  let isWaiting = false;
  let guessInput = "";
  let chosen = null;
  let link = "";
  let bestScore = Infinity;
  let bestChosen = null;
  let bestYourDistances = [];
  let bestYourScores = [];

  let getDistance = (loc1, loc2) => {
    const lat1 = loc1[1];
    const lng1 = loc1[0];
    const lat2 = loc2[1];
    const lng2 = loc2[0];

    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ in radians
    const φ2 = lat2 * Math.PI/180; // φ in radians
    const Δφ = (lat2-lat1) * Math.PI/180; // difference in latitude
    const Δλ = (lng2-lng1) * Math.PI/180; // difference in longitude

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c/1000;
  }

  let otherDistances = locations.slice(1).map((loc) => {
    return getDistance(loc[1], toGuess[1]);
  });

  let share = () => {
    link = `${title}\n`;
    let seedString = seed.toString();
    if (seedString.match(/20\d{2}(11|12|0\d)([0-2]\d|30|31)/)) {
        link += `Daily Challenge on ${seedString.slice(0, 4)}/${seedString.slice(4, 6)}/${seedString.slice(6)}\n`;
    }
    link += `I scored ${bestScore}%!\n`;
    link += `${window.location.href.split("?")[0]}?seed=${seed}&N=${N}`;
    shareResults(link);
  }

  let handleGuess = () => {
    if (!chosen) {
      toast.fire({
        icon: "error",
        title: "Please select a location",
      });
      return;
    }

    bestChosen = null;
    bestScore = 0;
    bestYourDistances = [];
    let options = cleanData[chosen];
    for (let i = 0; i < options.length; i++) {
      let option = options[i];
      let optionScore = 0;
      let yourDistances = [];
      let yourScores = [];
      for (let j = 0; j < locations.slice(1).length; j++) {
        let otherLoc = locations.slice(1)[j];
        let distance = getDistance([option[1], option[0]], otherLoc[1]);
        yourDistances.push(distance);
        let distanceRound = parseFloat(distance.toFixed(1));
        let otherRound = parseFloat(otherDistances[j].toFixed(1));
        let optionLocScore = 100*Math.min(distanceRound/otherRound, otherRound/distanceRound);
        yourScores.push(optionLocScore);
        optionScore += optionLocScore;
      }

      optionScore /= locations.slice(1).length;

      if (optionScore > bestScore) {
        bestScore = optionScore;
        bestChosen = option;
        bestYourDistances = [...yourDistances];
        bestYourScores = [...yourScores];
      }
    }

    if (bestScore >= 75) {
      const tableElement = document.getElementById("table");
      party.confetti(tableElement);
    }

    isWaiting = true;
  }

  let playAgain = () => {
    isStart = false;
    randomiseSeed();
    handleStart();

    isWaiting = false;
    guessInput = "";
    chosen = null;
    bestScore = Infinity;
    bestChosen = null;
    bestYourDistances = [];
    bestYourScores = [];
  }
</script>

<table class="table-auto border-collapse" id="table">
  <thead>
    <tr class="bg-ns-500/50">
      <th class="text-left p-2">Location</th>
      <th class="text-left p-2">Distance</th>
      {#if isWaiting}
      <th class="text-left p-2">Your Distance</th>
      <th class="text-left p-2">Score</th>
      {/if}
    </tr>
  </thead>
  <tbody>
    {#each locations.slice(1) as loc, i}
    <tr>
      <td class="p-2">{loc[0]}</td>
      <td class="p-2">{otherDistances[i].toFixed(1)} km</td>
      {#if isWaiting}
      <th class="p-2">{bestYourDistances[i].toFixed(1)} km</th>
      <th class="p-2">{(bestYourScores[i]).toFixed()}%</th>
      {/if}
    </tr>
    {/each}
  </tbody>
</table>

{#if !isWaiting}
<div class="mt-4 grid">
  <label class="text-lg">Search:</label>
  <input type="text" id="search-bar" disabled={isWaiting} bind:value={guessInput} placeholder="Search a Location" class="border-2 border-gray-300/30 dark:bg-gray-700 rounded-md p-2 me-auto"/>
</div>

<div class="my-4 grid">
  <label class="text-lg">Click to Select (type in search bar to show different results):</label>
  <div class="flex flex-wrap gap-2">
  {#each Object.keys(cleanData).filter(name => name.toLowerCase().includes(guessInput.toLowerCase())).slice(0, 20) as name}
    <button class={`p-2 rounded-lg hover:text-white ${chosen == name ? "bg-ew-500" : "bg-ns-500/50 hover:bg-ns-500"}`} on:click={() => {chosen = name}}>{name}</button>
  {/each}
  </div>
</div>
{:else}
<div class="my-4 grid">
  <label class="">You Guessed: {chosen}</label>
  <label class="">Correct Answer: {standardiseWithoutParen(toGuess[0])}</label>
  <label class="">Your Score: {bestScore.toFixed()}%</label>
</div>
{/if}

<div class="flex gap-4 flex-wrap">
  {#if !isWaiting}
    <button class="bg-cc-500/50 hover:bg-cc-500 p-2 rounded-lg" on:click={handleGuess}>Make Guess</button>
  {:else}
    <button class="bg-dt-500/50 hover:bg-dt-500 p-2 rounded-lg" on:click={share}>Share</button>
    <button class="bg-cc-500/50 hover:bg-cc-500 p-2 rounded-lg" on:click={playAgain}>Play Again</button>
  {/if}
</div>