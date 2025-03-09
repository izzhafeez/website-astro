<script lang="ts">
    import GamePage from './GamePage.svelte';
    import StartPage from './StartPage.svelte';
    import Swal from 'sweetalert2';
    import seededRandom from '../../common/seededRandom';
    import DailyChoice from '../DailyChoice.svelte';

    export let names: string[];
    export let title;
    export let instructions;
    export let key: string;
    export let isDaily = false;

    let date;

    let name: string;
    let isStart: boolean = false;
    let N = 8;
    let assignments: boolean[] = [];
    let chosen: string[] = [];
    let possible_N = [6, 8, 12, 16, 20, 24, 30, 40, 50];
    let randomiserSeed = Math.round(Math.random() * 1000000);
    let randomiser = seededRandom(randomiserSeed);
    let seed = `${possible_N.indexOf(N)}${randomiserSeed}`;
    const randomiseSeed = () => {
        randomiserSeed = Math.round(Math.random() * 1000000);
        randomiser = seededRandom(randomiserSeed);
        encodeSeed();
    };

    const encodeSeed = () => {
        const N_index = possible_N.indexOf(N);
        seed = `${N_index}${randomiserSeed}`;
    }

    const decodeSeed = () => {
        const N_index = parseInt(seed[0]);
        N = possible_N[N_index];
        randomiserSeed = parseInt(seed.slice(1));
        randomiser = seededRandom(randomiserSeed);
        randomiser();
    }

    function handleStart() {
        // try to assign chosen names
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

    const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
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

<div class="mx-auto my-8 max-w-3xl">
    <h1 class="text-5xl font-black animate-text bg-gradient-to-r from-ns-500 via-ns-400 to-ns-300 bg-clip-text text-transparent">{title.toUpperCase()}</h1>
    <p class="my-4">{instructions}
        {#if !date && isStart}
            <button on:click={copySeed} class="underline hover:opacity-50">Copy the seed</button> and share with your friends!
        {:else if date}
            Daily Challenge for {date}.
        {/if}
    </p>
{#if isStart}
    <GamePage bind:isStart={isStart} {title} {instructions} {chosen} {assignments} {seed} {name} {key} {date}/>
{:else}
    {#if isDaily}
        <DailyChoice bind:randomiserSeed={randomiserSeed} {handleStart} bind:randomiser={randomiser} name={`REGEX WARRIOR: ${title}`} bind:date={date} fullKey={`regex-${key}`}/>
    {:else}
        <StartPage bind:N={N} {handleStart} {title} {instructions} {randomiseSeed} bind:seed={seed} {decodeSeed} {key} bind:name={name}/>
    {/if}
{/if}
</div>