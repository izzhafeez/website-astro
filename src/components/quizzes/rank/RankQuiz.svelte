<script lang="ts">
    import StartPage from "./StartPage.svelte";
    import GamePage from "./GamePage.svelte";
    import seededRandom, {shuffle} from "../../common/seededRandom";
    import DailyChoice from "../DailyChoice.svelte";
    import Swal from "sweetalert2";

    export let title: string;
    export let data: {[field: string]: number};
    export let params: any;
    let N = parseInt(params.N) || 6;
    let seed = parseInt(params.seed) || Math.round(Math.random() * 100000000);
    let randomiser;

    let isStart = false;
    let possible_N = [4, 5, 6, 8, 10, 12, 16];

    // we get fields from the first data object
    let possible_fields = Object.keys(data[Object.keys(data)[0]]);
    let field = params.field || possible_fields[0];
    let options = [];

    const randomiseSeed = () => {
        seed = Math.round(Math.random() * 100000000);
    };

    let setTodaySeed = () => {
        // ddmmyyyy
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();
        seed = yyyy + mm + dd;
        N = 8;
        field = possible_fields[0];
    }

    function handleStart() {
        // options is chosen randomly without replacement from the keys of the data
        if (isNaN(N)) N = 6;
        if (N < 4) N = 4;
        if (N > Object.keys(data).length) N = Object.keys(data).length;
        if (isNaN(seed)) seed = Math.round(Math.random() * 100000000);

        randomiser = seededRandom(seed);
        randomiser();

        options = shuffle([...Object.keys(data)], randomiser).slice(0, N);
        isStart = true;
    }
</script>

<div class="my-8 mx-auto max-w-3xl">
    {#if isStart}
        <GamePage bind:randomiser={randomiser} {seed} {randomiseSeed} bind:isStart={isStart} {N} {field} {options} {title} {data}/>
    {:else}
        <StartPage bind:N={N} {handleStart} {title} bind:seed={seed} {randomiseSeed} bind:field={field} {possible_fields} {setTodaySeed}/>
    {/if}
</div>
