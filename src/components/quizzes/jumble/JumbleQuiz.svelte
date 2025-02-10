<script lang="ts">
    import GamePage from './GamePage.svelte';
    import StartPage from './StartPage.svelte';
    export let names;
    export let title;
    export let instructions;
    // remove contents of parantheses and brackets
    let options = names.map(name => name.replace(/[\(\[].*?[\)\]]/g, '').trim().toUpperCase());
    let N = 4;
    let MAX_LENGTH = 10;
    let isStart = false;
    let chosen = [];
    let mixFactor = 3;
    let scrambleFactor = 3;

    function handleNext() {
        // choose N random names from options
        let keys = [...options];
        chosen = [];
        let count = 0;
        while (chosen.length < N) {
            let randomKey = keys[Math.floor(Math.random() * keys.length)];
            if (randomKey.length > MAX_LENGTH) {
                continue;
            }
            if (chosen.includes(randomKey)) {
                continue;
            }
            chosen.push(randomKey);

            // fallback count stop
            count++;
            if (count > 10000) {
                break;
            }
        }
    }
</script>
{#if isStart}
    <GamePage {chosen} bind:isStart={isStart} {title} {instructions} {scrambleFactor} {mixFactor}/>
{:else}
    <StartPage bind:N={N} bind:MAX_LENGTH={MAX_LENGTH} bind:isStart={isStart} {handleNext} {title} {instructions} bind:scrambleFactor={scrambleFactor} bind:mixFactor={mixFactor}/>
{/if}