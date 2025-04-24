<script lang="ts">
  import { onMount } from "svelte";
  import Swal from "sweetalert2";
  import type { Data } from "./Data";
  import HigherLowerInput from "./HigherLowerInput.svelte";
  import NextButton from "./NextButton.svelte";
  import { fly } from "svelte/transition";
  import toast from "../../common/toast";

  export let title;
  export let data;
  export let name: string;
  export let field: string;
  export let randomiser: () => number;
  export let randomiseSeed: () => void;
  export let seed: string;
  let oldSeed = seed;

  let dataList: Data[] = Object.entries(data).map(([k, v]) => {
    // round to 6 significant figures
    return { name: k, quantity: (v as any)[field] as number }
  });
  
  // find minimum sigfigs
  let decimalPlaces = 0;
  for (let i = 0; i < dataList.length; i++) {
    const numSeparated = dataList[i].quantity.toString().split(".");
    if (numSeparated.length === 1) continue;
    const sigFigs = numSeparated[1].length;
    if (sigFigs > decimalPlaces) decimalPlaces = sigFigs;
  }

  // get start number from lowest value
  let highestNumber = Math.max(...dataList.map(d => d.quantity));
  let lowestNumber = Math.min(...dataList.map(d => d.quantity));
  let startNumber = 0;
  if (lowestNumber > 0) startNumber = lowestNumber;
  else if (highestNumber < 0) startNumber = highestNumber;

  let left = dataList[Math.floor(randomiser() * dataList.length)];
  let right = left;
  while (right === left) right = dataList[Math.floor(randomiser() * dataList.length)];
  
  let rightPlaceholder = '0';
  let isGuessing = true;
  let showNextButton = false;
  let streak: number = 0;
  let oldStreak: number = 0;
  let bestStreak: number = 0;

  const share = () => {
    let text = `${title}\n`;
    if (oldSeed.toString().match(/20\d{2}(11|12|0\d)([0-2]\d|30|31)/)) {
        text += `Daily Challenge on ${oldSeed.slice(0, 4)}/${oldSeed.slice(4, 6)}/${oldSeed.slice(6)}\n`;
    }
    text += `I got a streak of ${oldStreak}!\n`;
    text += `${window.location.href.split("?")[0]}?seed=${oldSeed}&field=${field}\n`;
    navigator.clipboard.writeText(text);
    toast.fire({
        icon: 'success',
        text: 'Copied Results',
    });
  }
</script>
  
<div class='grid'>
  <div class='my-auto grid gap-8 content-end lg:items-center lg:content-center text-center p-4'>
    <h2 class='p-4  font-extrabold text-3xl mx-auto rounded-xl'>{left.name}</h2>
    <p class='text-5xl h-20 grid items-center p-4 mx-auto transition duration-500 bg-gray-100 dark:bg-gray-700'>{parseFloat(left.quantity.toFixed(4))}</p>
  </div>
  <div class='my-auto grid gap-8 content-end lg:items-center lg:content-center text-center p-4'>
    <h2 id="hl-label" class='p-4  font-extrabold text-3xl mx-auto rounded-xl'>{right.name}</h2>
    {#if isGuessing}
    <HigherLowerInput
      {left} {right} {startNumber} decimalPlaces={decimalPlaces} {name}
      bind:streak={streak}
      bind:bestStreak={bestStreak}
      bind:isGuessing={isGuessing}
      bind:showNextButton={showNextButton}
      bind:rightPlaceholder={rightPlaceholder}
      {randomiseSeed}
      {seed}
      bind:oldSeed={oldSeed}
      bind:oldStreak={oldStreak}
      />
    {:else}
    <div class='flex gap-0 mx-auto'>
      <p class={`text-5xl h-20 grid items-center p-4 transition duration-500 bg-gray-100 dark:bg-gray-700 ${streak === 0 ? 'text-ns-500' : 'text-ew-500'}`}>{rightPlaceholder.slice(0, 8)}</p>
      {#if showNextButton}
        <NextButton
          {dataList} {startNumber}
          bind:left={left}
          bind:right={right}
          bind:isGuessing={isGuessing}
          bind:rightPlaceholder={rightPlaceholder}
          bind:showNextButton={showNextButton}
        />
        {#if streak == 0}
        <button on:click={share} class='p-4 bg-dt-500 text-white hover:bg-opacity-80 font-bold text-xl'>Share</button>
        {/if}
      {/if}
    </div>
    {/if}
  </div>
</div>
<div class="grid">
  <div class="mx-auto text-center text-lg">
    <div>Streak: {streak}</div>
    <div>Previous: {oldStreak}</div>
    <div>Best: {bestStreak}</div>
    <div>Seed: {seed}</div>
  </div>
</div>