<script>
  import { onMount } from "svelte";
  import LLMap from "./LLMap.svelte";
  import InputBox from "./InputBox.svelte";
  import { standardiseWithParen, standardiseWithoutParen } from "../../../data/standardiseName";
  import { getColor } from "./colors";
  import Location from "./Location";

  export let data;
  export let params;
  export let title;

  let isLearning = params.isLearning || false;
  let isShuffle = params.isShuffle || false;
  let isPointToPoint = params.isPointToPoint || false;
  let selection = params.selection || "";
  let isMcq = params.isMcq || false;

  let filteredKeys = data;
  let pointsRegistration = {};

  $: if (selection || data) {
    filteredKeys = Object.keys(data).filter(location => {
      const name = location.toLowerCase();
      const regex = new RegExp(selection, "i");
      return name.match(regex);
    });

    if (isShuffle) {
      filteredKeys = filteredKeys.sort(() => Math.random() - 0.5);
    }

    filteredKeys.forEach(key => {
      const keyPoints = data[key];
      keyPoints.forEach(point => {
        const pointKey = `${point[0]},${point[1]}`;
        if (!pointsRegistration[pointKey]) {
          pointsRegistration[pointKey] = [];
        }
        pointsRegistration[pointKey].push(key);
      })
    })
  }

  let isFullscreen = false;
</script>

<div class="max-w-6xl mx-auto">
  <div class={isFullscreen ? "fixed top-0 left-1/2 -translate-x-1/2 z-[1000000] bg-white dark:bg-black p-2" : ""}>
    <InputBox bind:selection={selection} {filteredKeys} {pointsRegistration} bind:isLearning={isLearning} bind:isPointToPoint={isPointToPoint} bind:isShuffle={isShuffle} bind:isMcq={isMcq} {title}/>
  </div>
  <LLMap bind:isFullscreen={isFullscreen} {data} {isPointToPoint}/>
</div>