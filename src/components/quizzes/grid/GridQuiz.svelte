<script>
  import { onMount } from "svelte";
  import LLMap from "./LLMap.svelte";
  import InputBox from "./InputBox.svelte";
  import { standardiseWithParen, standardiseWithoutParen } from "../../../data/standardiseName";
  import { getColor } from "./colors";
  import Location from "./Location";
  import { capitalise } from "../../../utils/string";
  import L from "leaflet";

  export let data;
  export let params;
  export let title;

  let lookups = {};
  let locationDict = {};
  let locationList = [];
  let sequenceType = params.gridType || "Square";
  let sequenceDist = parseFloat(params.gridDist) || 1;
  let isFullscreen = false;
  let grids = {};
  let reverseGrid = {};

  for (let [key, value] of data) {
    // extract between brackets []
    let locationSlug = key.match(/\[(.*?)\]/);
    locationSlug = locationSlug ? locationSlug[1] : standardiseWithParen(key);

    // extract anything after |
    let spellings = key.match(/\|\w+/g);
    spellings = spellings ? spellings.map((s => s.replace("|", ""))) : [standardiseWithoutParen(key).toLowerCase().replaceAll(" ", "")];

    // before brackets
    const cleanText = key.split("[").shift().trim();

    for (let spelling of spellings) {
      if (!lookups[spelling]) lookups[spelling] = [];
      lookups[spelling].push(locationSlug); 
    }

    let filter = "";
    let filterSplitted = key.split("#");
    if (filterSplitted.length > 1) {
      filter = filterSplitted[1].trim().split("_").map(capitalise).join(" ");
    }

    let cleanName = standardiseWithoutParen(key).toLowerCase().replaceAll(" ", "");
    if (!lookups[cleanName]) lookups[cleanName] = [];
    lookups[cleanName].push(locationSlug);

    let color;
    if (value.length > 2) {
      color = getColor("city", value[2]);
    } else {
      color = getColor("mrt", cleanText);
    }

    const location = new Location({
      lat: value[1], lng: value[0], label: cleanText, slug: locationSlug, color
    });

    locationDict[locationSlug] = {
      lat: value[1],
      lng: value[0],
      id: locationList.length,
      name: cleanText,
      label: cleanText,
      color,
      filter
    };
    locationList.push(location);
  }

  $: if (sequenceType || sequenceDist) {
    grids = {};
    reverseGrid = {};
    for (let [slug, location] of Object.entries(locationDict)) {
      const latKey = Math.floor(location.lat / sequenceDist);
      const lngKey = Math.floor(location.lng / sequenceDist);
      let gridKey = `${latKey}_${lngKey}`;

      if (sequenceType === "Latitude") {
        gridKey = `${latKey}_0`;
      } else if (sequenceType === "Longitude") {
        gridKey = `0_${lngKey}`;
      }

      if (!grids[gridKey]) {
        grids[gridKey] = [];
      }
      grids[gridKey].push(location);
      reverseGrid[slug] = gridKey;
    }
  }
</script>

<div class="max-w-6xl mx-auto">
  <div class={isFullscreen ? "fixed top-0 left-1/2 -translate-x-1/2 z-[1000000] bg-white dark:bg-black p-2" : ""}>
    <InputBox answers={locationDict} {lookups} isUntimed={params.isUntimed} {title} bind:sequenceType={sequenceType} bind:sequenceDist={sequenceDist} {grids} {reverseGrid}/>
  </div>
  <LLMap locations={locationList} isUntimed={params.isUntimed} {locationDict} {sequenceType} {sequenceDist} bind:isFullscreen={isFullscreen} {grids}/>
</div>