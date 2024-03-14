<script>
  import LLMap from "./LLMap.svelte";
  import InputBox from "./InputBox.svelte";
  export let locationDict;
  export let locationList;
  export let defaultRegex;
</script>

<div>
  <InputBox answers={locationDict} defaultRegex={defaultRegex}/>
  <LLMap locations={locationList}/>
</div>