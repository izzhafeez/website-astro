<script lang="ts">
    import StartPage from "./StartPage.svelte";
    import GamePage from "./GamePage.svelte";
    import seededRandom from "../../common/seededRandom";

    export let title: string;
    export const key: string = "0";
    export let instructions: string;
    export let data: {[field: string]: number};

    let isStart = false;
    let possible_N = [4, 5, 6, 8, 10, 12, 16];
    let N = 5;

    // we get fields from the first data object
    let possible_fields = Object.keys(data[Object.keys(data)[0]]);
    let field = possible_fields[0];
    let options = [];

    let randomiserSeed = Math.round(Math.random() * 1000000);
    let randomiser = seededRandom(randomiserSeed);
    let seed = `${possible_N.indexOf(N)}${possible_fields.indexOf(field)}${randomiserSeed}`;

    function decodeSeed() {
        const N_index = parseInt(seed[0]);
        N = possible_N[N_index];
        const field_id = parseInt(seed[1]);
        field = possible_fields[field_id];
        randomiserSeed = parseInt(seed.slice(2));
        randomiser = seededRandom(randomiserSeed);
    }

    function encodeSeed() {
        const N_index = possible_N.indexOf(N);
        const field_id = possible_fields.indexOf(field);
        seed = `${N_index}${field_id}${randomiserSeed}`;
    }

    const randomiseSeed = () => {
        randomiserSeed = Math.round(Math.random() * 1000000);
        randomiser = seededRandom(randomiserSeed);
        encodeSeed();
    };

    function handleStart() {
        // options is chosen randomly without replacement from the keys of the data
        options = Object.keys(data).sort(() => randomiser() - 0.5).slice(0, N);
        isStart = true;
    }
</script>

{#if isStart}
    <GamePage bind:randomiser={randomiser} {seed} {randomiserSeed} bind:isStart={isStart} {N} {encodeSeed} {field} {options} {title} {instructions} {data}/>
{:else}
    <StartPage bind:N={N} {handleStart} {title} {instructions} bind:seed={seed} {randomiseSeed} {decodeSeed} bind:field={field} {possible_fields}/>
{/if}

