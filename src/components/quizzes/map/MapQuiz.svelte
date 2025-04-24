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

  let lookups = {};
  let locationDict = {};
  let locationList = [];

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

    let cleanName = standardiseWithoutParen(key).toLowerCase().replaceAll(" ", "");
    if (!lookups[cleanName]) lookups[cleanName] = [];
    lookups[cleanName].push(locationSlug);

    const location = new Location({
      lat: value[1], lng: value[0], label: cleanText, color: (() => {
        if (value.length > 2) return getColor("city", value[2]);
        return getColor("mrt", cleanText);
      })()
    });

    locationDict[locationSlug] = {
      id: locationList.length,
      name: cleanText
    };
    locationList.push(location);
  }
</script>

<div class="max-w-6xl mx-auto">
  <InputBox answers={locationDict} {lookups} defaultRegex={params.selection || ""} isUntimed={params.isUntimed} {title}/>
  <LLMap locations={locationList} defaultRegex={params.selection || ""} isUntimed={params.isUntimed}/>
</div>