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
  let sequenceType = params.expandingType || "Circle";
  let sequenceDist = parseFloat(params.expandingDist) || 50;
  let isFullscreen = false;
  let startingLocation = params.startingLocation || null;
  let expansions = {};

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

  $: if (startingLocation) {
    let sequence = [];
    let lat = locationDict[startingLocation].lat;
    let lng = locationDict[startingLocation].lng;
    Object.entries(locationDict).forEach(([key, value]) => {
      let dist;

      // calculate dist using leaflet
      if (sequenceType === "Circle") {
        dist = L.latLng(lat, lng).distanceTo(L.latLng(value.lat, value.lng))/1000;
      } else if (sequenceType === "Latitude") {
        dist = L.latLng(lat, lng).distanceTo(L.latLng(value.lat, lng))/1000;
      } else if (sequenceType === "Longitude") {
        dist = L.latLng(lat, lng).distanceTo(L.latLng(lat, value.lng))/1000;
      }

      dist = Math.floor(dist / sequenceDist) * sequenceDist;

      sequence.push({
        id: value.id,
        key,
        name: value.name,
        dist
      });
    });
    sequence.sort((a, b) => a.dist - b.dist);
    expansions = {};
    
    for (let s of sequence) {
      if (!expansions[s.dist]) expansions[s.dist] = [];
      expansions[s.dist].push(s.key);
    }
  }
</script>

<div class="max-w-6xl mx-auto">
  <div class={isFullscreen ? "fixed top-0 left-1/2 -translate-x-1/2 z-[1000000] bg-white dark:bg-black p-2" : ""}>
    <InputBox answers={locationDict} {lookups} isUntimed={params.isUntimed} {title} bind:sequenceType={sequenceType} bind:sequenceDist={sequenceDist} bind:startingLocation={startingLocation} {expansions}/>
  </div>
  <LLMap locations={locationList} isUntimed={params.isUntimed} {locationDict} {sequenceType} {sequenceDist} {startingLocation} bind:isFullscreen={isFullscreen} {expansions}/>
</div>