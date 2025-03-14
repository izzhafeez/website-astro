<script lang="ts">
    import StartPage from "./StartPage.svelte";
    import GamePage from "./GamePage.svelte";
    import seededRandom from "../../common/seededRandom";
    import DailyChoice from "../DailyChoice.svelte";
    import Swal from "sweetalert2";

    export let title: string;
    export let key: string;
    export let instructions: string;
    export let data: {[field: string]: number};
    export let isDaily = false;

    let date;

    let isStart = false;
    let possible_N = [4, 5, 6, 8, 10, 12, 16];
    let N = 8;

    // we get fields from the first data object
    let possible_fields = Object.keys(data[Object.keys(data)[0]]);
    let field = possible_fields[0];
    let options = [];

    let randomiserSeed = Math.round(Math.random() * 1000000);
    let randomiser = seededRandom(randomiserSeed);
    let seed = `${possible_N.indexOf(N)}${possible_fields.indexOf(field)}${randomiserSeed}`;

    let name = "";

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
        if (isDaily) {
            randomiser = seededRandom(randomiserSeed);
            randomiser();
            const randomFieldIndex = Math.floor(randomiser() * possible_fields.length);
            field = possible_fields[randomFieldIndex];
            console.log(field)
        }
        options = Object.keys(data).sort(() => randomiser() - 0.5).slice(0, N);
        isStart = true;
    }

    const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
    });

    const copySeed = () => {
        navigator.clipboard.writeText(seed);
        toast.fire({
            icon: 'success',
            text: 'Copied Seed',
        });
    }
</script>

<div class="my-8 mx-auto max-w-3xl">
    <h1 class="text-5xl font-black animate-text bg-gradient-to-r from-ns-500 via-ns-400 to-ns-300 bg-clip-text text-transparent">{isStart ? (field == '0' ? "LONGITUDE" : field == '1' ? "LATITUDE" : field.toUpperCase()) : title.toUpperCase()}</h1>
    <p class="my-4">In this game, you'll rank {N} items as they appear one by one. Each time an item appears, you must decide where to place it—1st, 2nd, 3rd, and so on. But beware: once an item is placed, it’s locked in!

        Without knowing the future items, you’ll need to predict, strategize, and take risks to get the most accurate ranking possible. Can you outsmart the unknown and become the Rank Master? 🚀 
        {#if !isDaily}
            <button on:click={copySeed} class="underline hover:opacity-50">Copy the seed</button> and share with your friends!
        {:else if date}
            Daily Challenge for {date}.
        {/if}
    </p>
    {#if isStart}
        <GamePage bind:randomiser={randomiser} {seed} {randomiserSeed} bind:isStart={isStart} {N} {encodeSeed} {field} {options} {title} {instructions} {data} {key} {name} {date}/>
    {:else}
        {#if isDaily}
            <DailyChoice bind:randomiserSeed={randomiserSeed} {handleStart} bind:randomiser={randomiser} name={`RANK MASTER: ${title}`} bind:date={date} fullKey={`rank-${key}`}/>
        {:else}
            <StartPage bind:N={N} {handleStart} {title} {instructions} bind:seed={seed} {randomiseSeed} {decodeSeed} bind:field={field} {possible_fields} bind:name={name} {key}/>
        {/if}
    {/if}
</div>
