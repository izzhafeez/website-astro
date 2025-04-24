<script lang="ts">
    import GamePage from './GamePage.svelte';
    import StartPage from './StartPage.svelte';
    import Swal from 'sweetalert2';
    import seededRandom from '../../common/seededRandom';
    import DailyChoice from '../DailyChoice.svelte';

    export let names: string[];
    export let title;
    export let instructions;
    export let params: any;
    let N = parseInt(params.N) || 16;
    let seed = parseInt(params.seed) || Math.floor(Math.random() * 100000000);
    let randomiser = seededRandom(seed);

    let name: string;
    let isStart: boolean = false;
    let assignments: boolean[] = [];
    let chosen: string[] = [];
    let possible_N = [6, 8, 12, 16, 20, 24, 30, 40, 50];

    const randomiseSeed = () => {
        seed = Math.floor(Math.random() * 100000000);
    };

    const setTodaySeed = () => {
        // ddmmyyyy
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();
        seed = yyyy + mm + dd;
        N = 16;
    };

    function handleStart() {
        if (isNaN(seed)) seed = Math.floor(Math.random() * 100000000);
        if (isNaN(N)) N = 16;
        if (N < 6) N = 6;
        if (N > names.length) N = names.length;

        // try to assign chosen names
        randomiser = seededRandom(seed);
        randomiser();
        chosen = [];
        assignments = [];

        // use randomiser to choose N names
        while (chosen.length < N) {
            const index = Math.floor(randomiser() * names.length);
            const name = names[index];
            if (!chosen.includes(name)) {
                chosen.push(name);
            }
            // assign true or false randomly
            assignments.push(randomiser() > 0.5);
        }
        isStart = true;
    }
</script>

<div class="mx-auto my-8 max-w-3xl">
{#if isStart}
    <GamePage bind:isStart={isStart} {title} {instructions} {chosen} {assignments} {seed}/>
{:else}
    <StartPage bind:N={N} {handleStart} {title} {instructions} bind:seed={seed} {randomiseSeed} {setTodaySeed}/>
{/if}
</div>