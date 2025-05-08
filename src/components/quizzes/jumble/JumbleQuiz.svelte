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
    let N = parseInt(params.N) || 4;
    let MAX_LENGTH = parseInt(params.max) || 10;
    let mixFactor = parseInt(params.mix) || 3;
    let scrambleFactor = parseInt(params.scramble) || 3;

    let possible_N = [2, 3, 4, 5, 6, 7, 8];
    let possible_max_length = [8, 10, 12, 14, 16, 18, 100];
    let possible_mixFactor = [0, 1, 2, 3, 4, 5];
    let possible_scrambleFactor = [0, 1, 2, 3, 4, 5];

    // remove contents of parantheses and brackets
    let options = names;
    let isStart = false;
    let chosen: string[] = [];

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
        N = 4;
        MAX_LENGTH = 10;
        mixFactor = 3;
        scrambleFactor = 3;
    }

    function handleNext() {
        if (isNaN(MAX_LENGTH)) MAX_LENGTH = 10;
        if (MAX_LENGTH < 8) MAX_LENGTH = 8;
        if (MAX_LENGTH > 100) MAX_LENGTH = 100;
        if (isNaN(seed)) seed = Math.floor(Math.random() * 100000000);

        // choose N random names from options
        randomiser = seededRandom(seed);
        randomiser();
        let keys = [...options];
        chosen = [];
        let count = 0;

        while (chosen.length < N) {
            let randomKey = keys[Math.floor(randomiser() * keys.length)];
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
        isStart = true;
    }
</script>

<div class="my-8 mx-auto max-w-3xl">
{#if isStart}
    <GamePage {chosen} bind:isStart={isStart} {title} {MAX_LENGTH} {scrambleFactor} {mixFactor} {randomiser} {seed} {randomiseSeed}/>
{:else}
    <StartPage bind:N={N} bind:MAX_LENGTH={MAX_LENGTH} bind:isStart={isStart} bind:seed={seed} {randomiseSeed} {handleNext} {title} bind:scrambleFactor={scrambleFactor} bind:mixFactor={mixFactor} {possible_max_length} {possible_mixFactor} {possible_N} {possible_scrambleFactor} {setTodaySeed}/>
{/if}
</div>