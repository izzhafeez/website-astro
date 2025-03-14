<script lang="ts">
    import GamePage from './GamePage.svelte';
    import StartPage from './StartPage.svelte';
    import seededRandom from '../../common/seededRandom';
    import DailyChoice from '../DailyChoice.svelte';
    import Swal from 'sweetalert2';

    export let names;
    export let title;
    export let instructions;
    export let isDaily = false;
    export let key;

    let possible_N = [2, 3, 4, 5, 6, 7, 8];
    let possible_max_length = [6, 8, 10, 12, 14, 16, 18, 20];
    let possible_mixFactor = [0, 1, 2, 3, 4, 5];
    let possible_scrambleFactor = [0, 1, 2, 3, 4, 5];

    let date;

    // remove contents of parantheses and brackets
    let options = names;
    let N = 4;
    let MAX_LENGTH = 10;
    let isStart = false;
    let chosen: string[] = [];
    let mixFactor = 4;
    let scrambleFactor = 4;

    let randomiserSeed: number = Math.floor(Math.random() * 1000000);
    let randomiser = seededRandom(randomiserSeed);
    let seed = encodeSeed(randomiserSeed);
    let changeSeed = () => {
        randomiserSeed = decodeSeed(seed);
        randomiser = seededRandom(randomiserSeed);
    };
    let randomiseSeed = () => {
        randomiserSeed = Math.floor(Math.random() * 1000000);
        randomiser = seededRandom(randomiserSeed);
        seed = encodeSeed(randomiserSeed);
    }

    function encodeSeed(decodedSeed: number) {
        const N_index = possible_N.indexOf(N)+1;
        const MAX_LENGTH_index = possible_max_length.indexOf(MAX_LENGTH);
        const mixFactor_index = possible_mixFactor.indexOf(mixFactor);
        const scrambleFactor_index = possible_scrambleFactor.indexOf(scrambleFactor);
        const encodedSeed = `${N_index}${MAX_LENGTH_index}${mixFactor_index}${scrambleFactor_index}${decodedSeed}`;
        return parseInt(encodedSeed, 10);
    }

    function decodeSeed(encodedSeed: number) {
        const encodedSeedString = encodedSeed.toString(10);
        const N_index = parseInt(encodedSeedString[0])-1;
        const MAX_LENGTH_index = parseInt(encodedSeedString[1]);
        const mixFactor_index = parseInt(encodedSeedString[2]);
        const scrambleFactor_index = parseInt(encodedSeedString[3]);
        const seed = parseInt(encodedSeedString.slice(4));
        N = possible_N[N_index];
        MAX_LENGTH = possible_max_length[MAX_LENGTH_index];
        mixFactor = possible_mixFactor[mixFactor_index];
        scrambleFactor = possible_scrambleFactor[scrambleFactor_index];
        return seed;
    }

    function handleNext() {
        // choose N random names from options
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

    const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
        }
    });

    const copySeed = () => {
        navigator.clipboard.writeText(seed);
        toast.fire({
            icon: 'success',
            text: 'Copied Seed',
        });
    }
</script>

<div class="my-8 mx-auto max-w-3xl px-2">
    <h1 class="text-5xl font-black animate-text bg-gradient-to-r from-ns-500 via-ns-400 to-ns-300 bg-clip-text text-transparent">{title.toUpperCase()}</h1>
    <p class="my-4">{instructions} 
        {#if date}
            Daily Challenge for {date}.
        {:else if !isDaily}
            <button on:click={copySeed} class="underline hover:opacity-50">Copy the seed</button> and share with your friends!
        {/if}
    </p>
{#if isStart}
    <GamePage {chosen} bind:isStart={isStart} {title} {instructions} {scrambleFactor} {mixFactor} {randomiser} {changeSeed} {seed} {date} {key}/>
{:else}
    {#if isDaily}
        <DailyChoice bind:randomiserSeed={randomiserSeed} handleStart={handleNext} bind:randomiser={randomiser} name={`JUMBLE QUIZ: ${title}`} bind:date={date} fullKey={`jumble-${key}`}/>
    {:else}
        <StartPage bind:N={N} bind:MAX_LENGTH={MAX_LENGTH} bind:isStart={isStart} bind:seed={seed} {handleNext} {title} {instructions} bind:scrambleFactor={scrambleFactor} bind:mixFactor={mixFactor} {changeSeed} {possible_max_length} {possible_mixFactor} {possible_N} {possible_scrambleFactor} {randomiseSeed} {key}/>
    {/if}
{/if}
</div>