<script>
  import LLMap from "./LLMap.svelte";
  import InputBox from "./InputBox.svelte";
  export let locationDict;
  export let locationList;
  export let defaultRegex;
  export let key;
</script>

<div>
  <InputBox answers={locationDict} defaultRegex={defaultRegex} key={key}/>
  <LLMap locations={locationList}/>
</div>