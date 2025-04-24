<script lang="ts">
    import StartPage from "./StartPage.svelte";
    import GamePage from "./GamePage.svelte";
    import Swal from "sweetalert2";
    import seededRandom from "../../common/seededRandom";
    import DailyChoice from "../DailyChoice.svelte";

    export let title: string;
    export let instructions: string;
    export let names: string[];
    export let params: any;

    let seed: string = parseInt(params.seed) || Math.floor(Math.random() * 100000000);
    let randomiser = seededRandom(seed);
    let blurValue = params.blur || "MD";
    let fontSize = parseInt(params.font) || 80;

    let isStart = false;
    let possible_blurValues = ["XS", "SM", "MD", "LG", "XL", "2XL", "3XL"];
    let possible_fontSizes = [20, 30, 40, 60, 80, 120, 160];
    let toGuess;

    let randomiseSeed = () => {
        seed = Math.floor(Math.random() * 100000000);
        randomiser = seededRandom(seed);
    }

    let setTodaySeed = () => {
        // ddmmyyyy
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();
        seed = yyyy + mm + dd;
        blurValue = "MD";
        fontSize = 60;
    }

    function handleStart() {
        if (isNaN(seed)) seed = Math.floor(Math.random() * 100000000);
        if (possible_blurValues.indexOf(blurValue) == -1) blurValue = "MD";
        if (isNaN(fontSize)) fontSize = 80;
        // find closest font size
        if (possible_fontSizes.indexOf(fontSize) == -1) {
            let closest = possible_fontSizes.reduce((prev, curr) => Math.abs(curr - fontSize) < Math.abs(prev - fontSize) ? curr : prev);
            fontSize = closest;
        }

        randomiser = seededRandom(seed);
        randomiser();
        toGuess = names[Math.floor(randomiser() * names.length)];
        isStart = true;
    }
</script>

{#if isStart}
    <GamePage bind:randomiser={randomiser} {seed} bind:isStart={isStart} {blurValue} {fontSize} bind:toGuess={toGuess} {names} {title} {randomiseSeed}/>
{:else}
    <StartPage bind:blurValue={blurValue} bind:fontSize={fontSize} {handleStart} {title} {instructions} bind:seed={seed} {randomiseSeed} {setTodaySeed}/>
{/if}

