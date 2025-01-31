<script>
  import StartPage from "./StartPage.svelte";
  import GamePage from "./GamePage.svelte";

  export let key;
  
  let isStart = false;
  let name;
</script>

{#if !isStart}
<StartPage {key} bind:name={name} bind:isStart={isStart}/>
{:else}
<GamePage {key} bind:name={name} bind:isStart={isStart}/>
{/if}