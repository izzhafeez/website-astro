<script>
  import { onMount } from "svelte";
  import InputBox from "./InputBox.svelte";
  import { standardiseWithParen, standardiseWithoutParen } from "../../../data/standardiseName";
  import { getColor } from "./colors";
  import Location from "./Location";

  export let data;
  export let params;
  export let title;

  let isLearning = params.isLearning || false;
  let isMcq = params.isMcq || false;

  let filteredKeys = data;
  let dataDict = {};

  $: if (data) {
    filteredKeys = data.map(([k, v]) => [standardiseWithoutParen(k), k.split("#")[1].split(", "), v]);
    filteredKeys = filteredKeys.sort(() => Math.random() - 0.5);
    dataDict = Object.fromEntries(filteredKeys.map(([k, f, v]) => [standardiseWithoutParen(k), {f, v}]));
  }

  let isFullscreen = false;
</script>

<div class="max-w-6xl mx-auto">
  <div class={isFullscreen ? "fixed top-0 left-1/2 -translate-x-1/2 z-[1000000] bg-white dark:bg-black p-2" : ""}>
    <InputBox {filteredKeys} {dataDict} bind:isLearning={isLearning} bind:isMcq={isMcq} {title}/>
  </div>
</div>