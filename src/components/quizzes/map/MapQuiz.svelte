<script>
  import LLMap from "./LLMap.svelte";
  import InputBox from "./InputBox.svelte";
  export let locationDict;
  export let locationList;
  export let defaultRegex;
  export let key;

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
</script>

<div class="max-w-3xl mx-auto p-2">
  <InputBox answers={locationDict} defaultRegex={params.regex || defaultRegex} key={key}/>
  <LLMap locations={locationList} defaultRegex={params.regex || defaultRegex}/>
</div>