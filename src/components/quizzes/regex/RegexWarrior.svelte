<script lang="ts">
    import GamePage from './GamePage.svelte';
    import StartPage from './StartPage.svelte';
    import Swal from 'sweetalert2';
    import seededRandom from '../../common/seededRandom';
    export let names: string[];
    export let title;
    export let instructions;
    export let key: string;
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
    }

    function handleStart() {
        decodeSeed();
        isStart = true;
    }
</script>

{#if isStart}
    <GamePage bind:isStart={isStart} {title} {instructions} {chosen} {assignments} {seed} {name} {key}/>
{/if}
{#if !isStart}
    <StartPage bind:N={N} {handleStart} {title} {instructions} {randomiseSeed} bind:seed={seed} {decodeSeed} {key} bind:name={name}/>
{/if}