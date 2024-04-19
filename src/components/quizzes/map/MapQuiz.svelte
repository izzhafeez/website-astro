<script>
  import LLMap from "./LLMap.svelte";
  import InputBox from "./InputBox.svelte";
  export let locationDict;
  export let locationList;
  export let defaultRegex;
  export let key;
</script>

<div class="max-w-3xl mx-auto p-2">
  <InputBox answers={locationDict} defaultRegex={defaultRegex} key={key}/>
  <LLMap locations={locationList}/>
</div>