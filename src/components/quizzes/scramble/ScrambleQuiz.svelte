<script lang="ts">
    import GamePage from './GamePage.svelte';
    import StartPage from './StartPage.svelte';
    import seededRandom from '../../common/seededRandom';
    import DailyChoice from '../DailyChoice.svelte';
    import Swal from 'sweetalert2';

    export let names;
    export let title;
    export let params;

    let seed = parseInt(params.seed) || Math.floor(Math.random() * 100000000);

    // remove contents of parantheses and brackets
    let isStart = false;
    let chosen: string;
    let isSmall = !!params.isSmall;

    let randomiser;
    let randomiseSeed = () => {
        seed = Math.floor(Math.random() * 100000000);
    }

    let setTodaySeed = () => {
        // ddmmyyyy
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();
        seed = yyyy + mm + dd;
    }

    function handleNext() {
        if (isNaN(seed)) seed = Math.floor(Math.random() * 100000000);

        // choose N random names from options
        randomiser = seededRandom(seed);
        randomiser();

        chosen = names[Math.floor(randomiser() * names.length)];
        if (isSmall) chosen = chosen.toLowerCase();
        isStart = true;
    }
</script>

<div class="my-8 mx-auto max-w-3xl">
{#if isStart}
    <GamePage {chosen} bind:isStart={isStart} {title} {randomiser} {seed} {randomiseSeed} {isSmall} {handleNext}/>
{:else}
    <StartPage bind:isStart={isStart} bind:seed={seed} bind:isSmall={isSmall} {randomiseSeed} {handleNext} {title} {setTodaySeed}/>
{/if}
</div>