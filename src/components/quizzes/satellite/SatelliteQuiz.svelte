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
  let selection = params.selection || "";
  let isMcq = params.isMcq || false;

  let filteredKeys = data;
  let pointsRegistration = {};

  let maxDist = 1;
  let latLngBound = [0, 0, 0, 0];

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

  onMount(() => {
    let unnestedPoints = [];

    Object.entries(data).forEach(([k, v]) => {
      const name = standardiseWithoutParen(k);
      for (let i = 0; i < v.length; i++) {
        unnestedPoints.push(v[i]);
      }
    })

    let lats = unnestedPoints.map((x) => x[0]).sort((a,b)=>a-b);
    let lngs = unnestedPoints.map((x) => x[1]).sort((a,b)=>a-b);

    latLngBound = [lats[0], lats[lats.length-1], lngs[0], lngs[lngs.length-1]];

    maxDist = Math.max(
      L.latLng(lats[lats.length-1], lngs[lngs.length-1]).distanceTo(L.latLng(lats[0], lngs[0])),
      L.latLng(lats[lats.length-1], lngs[0]).distanceTo(L.latLng(lats[0], lngs[lngs.length-1]))
    );
  });

  let isFullscreen = false;
</script>

<div class="max-w-6xl mx-auto">
  <div class={isFullscreen ? "fixed top-0 left-1/2 -translate-x-1/2 z-[1000000] bg-white dark:bg-black p-2" : ""}>
    <InputBox bind:selection={selection} {filteredKeys} {pointsRegistration} bind:isLearning={isLearning} bind:isMcq={isMcq} {title}/>
  </div>
  <LLMap bind:isFullscreen={isFullscreen} {data} {latLngBound} {maxDist}/>
</div>