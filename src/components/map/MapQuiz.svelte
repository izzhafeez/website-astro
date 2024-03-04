<script>
  import LLMap from "./LLMap.svelte";
  import Location from "./Location";
  export let locationDict;
  export let locationList;
  // $: locations = locationList.map(([lat, lng]) => new Location({
  //   latitude: lat,
  //   longitude: lng,
  //   label: "hello",
  //   color: "ns-500"
  // }));
  let locations = [];
</script>

<div>
  <LLMap locations={locationList} lines={[]}/>
</div>