<script lang="ts">
    import GamePage from './GamePage.svelte';
    import StartPage from './StartPage.svelte';
    import seededRandom from '../../common/seededRandom';

    export let names: string[];
    export let title;
    export let params: any;
    let N = parseInt(params.N) || 10;
    let seed = parseInt(params.seed) || Math.floor(Math.random() * 100000000);
    let randomiser = seededRandom(seed);
    let lowerCase = !!params.lowerCase || false;
    let space = !!params.noSpace || false;
    let toType = [];

    let isStart: boolean = false;

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
        N = 10;
        lowerCase = false;
        space = false;
    };

    function handleStart() {
        if (isNaN(seed)) seed = Math.floor(Math.random() * 100000000);
        if (isNaN(N)) N = 10;
        if (N < 1) N = 1;
        if (N > names.length) N = names.length;

        // try to assign chosen names
        randomiser = seededRandom(seed);
        randomiser();
        toType = [];
        const startIndex = Math.floor(randomiser() * names.length);

        for (let i = 0; i < N; i++) {
            let name = names[(startIndex + i) % names.length];
            if (lowerCase) {
                name = name.toLowerCase();
            }
            toType.push(name);
        }
        toType = toType.join(' ');
        if (space) {
            toType = toType.replace(/ /g, '');
        }

        isStart = true;
    }
</script>

<div class="mx-auto my-8 max-w-3xl">
{#if isStart}
    <GamePage bind:isStart={isStart} {title} {toType} {seed} {handleStart} {randomiseSeed} {N} {space} {lowerCase}/>
{:else}
    <StartPage bind:N={N} {handleStart} bind:seed={seed} {randomiseSeed} {setTodaySeed} bind:lowerCase={lowerCase} bind:space={space}/>
{/if}
</div>