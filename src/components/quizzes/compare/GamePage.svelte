<script lang="ts">
  import { onMount } from "svelte";
  import { fullSanitise } from "../../../utils/string";
  import type { Data } from "./Data";
  import HigherLowerInput from "./HigherLowerInput.svelte";
  import NextButton from "./NextButton.svelte";
  import { fly } from "svelte/transition";

  export let key: string;
  export let data;
  export let decimalPlaces = 0;
  export let startNumber = 0;
  export let name: string;
  export let count: number;
  
  let dataList: Data[] = Object.entries(data).map(([k, v]) => {
    const { cleanText, searchTerms } = fullSanitise(k);
    return { name: cleanText, imgPath: `/src/img/quizzes/compare/${key}/${searchTerms}.jpg`, quantity: v as number }
  });
  
  let left = dataList[Math.floor(Math.random() * Math.min(count, dataList.length))];
  let right = left;
  while (right === left) right = dataList[Math.floor(Math.random() * Math.min(count, dataList.length))];
  
  let rightPlaceholder = '0';
  let isGuessing = true;
  let showNextButton = false;
  let streak: number = 0;
  let bestStreak: number = 0;
  
  onMount(() => {
    bestStreak = parseInt(localStorage.getItem(`compare-${key}-streak`) || '0');
  })
  </script>
  
  <div class='grid lg:grid-cols-2 h-screen w-screen' transition:fly={{ y: 200, duration: 500 }}>
    <div class='my-auto grid gap-8 content-end lg:items-center lg:content-center text-center p-4'>
      <h2 class='p-4  font-extrabold text-3xl mx-auto rounded-xl'>{left.name}</h2>
      <p class='text-5xl h-20 grid items-center p-4 mx-auto transition duration-500 bg-white dark:bg-gray-700'>{left.quantity}</p>
    </div>
    <div class="grid absolute items-center m-auto left-0 right-0 top-0 bottom-0 -z-10">
      <div class='mx-auto flex lg:block items-center gap-8'>
        <p class='lg:text-center opacity-0'>
          Score: {streak}<br/>
          Best Score: {bestStreak}
        </p>
        <h2 class='rounded-full text-6xl text-center lg:mb-4'>VS</h2>
        <p class='lg:text-center'>
          Score: {streak}<br/>
          Best Score: {bestStreak}
        </p>
      </div>
    </div>
    <div class='my-auto grid gap-8 content-end lg:items-center lg:content-center text-center p-4'>
      <h2 class='p-4  font-extrabold text-3xl mx-auto rounded-xl'>{right.name}</h2>
      {#if isGuessing}
      <HigherLowerInput
        {left} {right} {startNumber} {decimalPlaces} {key} {name}
        bind:streak={streak}
        bind:bestStreak={bestStreak}
        bind:isGuessing={isGuessing}
        bind:showNextButton={showNextButton}
        bind:rightPlaceholder={rightPlaceholder}/>
      {:else}
      <div class='flex gap-0 mx-auto'>
        <p class="text-5xl h-20 grid items-center p-4 transition duration-500 bg-white dark:bg-gray-700">{rightPlaceholder}</p>
        {#if showNextButton}
        <NextButton
          {dataList} {startNumber}
          bind:left={left}
          bind:right={right}
          bind:isGuessing={isGuessing}
          bind:rightPlaceholder={rightPlaceholder}
          bind:showNextButton={showNextButton}
          {count}
        />
        {/if}
      </div>
      {/if}
    </div>
  </div>