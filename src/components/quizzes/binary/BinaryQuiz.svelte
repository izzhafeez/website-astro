<script>
  import StartPage from "./StartPage.svelte";
  import GamePage from "./GamePage.svelte";

  export let title;
  export let instructions;
  export let fields;
  export let data;
  export let options;
  export let key;
  
  let isStart = false;
  let name;
</script>

{#if !isStart}
<StartPage {title} {instructions} {key} bind:name={name} bind:isStart={isStart}/>
{:else}
<GamePage {title} {data} {options} {key} {fields} bind:name={name}/>
{/if}