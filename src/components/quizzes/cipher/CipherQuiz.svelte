<script lang="ts">
    import GamePage from './GamePage.svelte';
    import StartPage from './StartPage.svelte';
    import seededRandom from '../../common/seededRandom';
    import DailyChoice from '../DailyChoice.svelte';
    import Swal from 'sweetalert2';
    import { standardiseWithoutParen } from '../../../data/standardiseName';
    import unidecode from 'unidecode';

    export let names;
    export let title;
    export let params;

    let seed = parseInt(params.seed) || Math.floor(Math.random() * 100000000);
    let N = parseInt(params.N) || 6;

    $: namesSize = !!names ? names.length : 0;

    // remove contents of parantheses and brackets
    let isStart = false;
    let chosen = [];

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
        if (isNaN(N)) N = 6;
        if (N > namesSize) N = namesSize;
        if (N < 3) N = 3;

        // choose N random names from options
        randomiser = seededRandom(seed);
        randomiser();

        chosen = [];
        let visited = new Set();
        while (chosen.length < N) {
            let index = Math.floor(randomiser() * namesSize);
            if (!visited.has(index)) {
                chosen.push(names[index]);
                visited.add(index);
            }
        }
        chosen = chosen.map((name) => {
            // name needs to be unidecode
            return unidecode(standardiseWithoutParen(name)).replaceAll(/[^a-zA-Z ]/g, '').trim();
        });

        isStart = true;
    }
</script>

<div class="my-8 mx-auto max-w-3xl">
{#if isStart}
    <GamePage {chosen} bind:isStart={isStart} {N} {title} {randomiser} {seed} {randomiseSeed} {handleNext}/>
{:else}
    <StartPage bind:isStart={isStart} bind:seed={seed} bind:N={N} {randomiseSeed} {handleNext} {title} {setTodaySeed} {namesSize}/>
{/if}
</div>