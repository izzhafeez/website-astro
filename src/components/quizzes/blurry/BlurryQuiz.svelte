<script lang="ts">
    import StartPage from "./StartPage.svelte";
    import GamePage from "./GamePage.svelte";
    import Swal from "sweetalert2";
    import seededRandom from "../../common/seededRandom";
    import DailyChoice from "../DailyChoice.svelte";

    export let title: string;
    export let instructions: string;
    export let names: string[];
    export let key: string;
    export let isDaily = false;

    let date;

    let name = "";
    let isStart = false;
    let possible_blurValues = ["XS", "SM", "MD", "LG", "XL", "2XL", "3XL"];
    let possible_fontSizes = [20, 30, 40, 60, 80, 120, 160];
    let blurValue = "MD";
    let fontSize = 60;
    let randomiserSeed = Math.round(Math.random() * 1000000);
    let randomiser = seededRandom(randomiserSeed);
    let seed = encodeSeed(randomiserSeed);
    let toGuess;

    function decodeSeed() {
        if (isNaN(seed)) {
            return;
        }
        const fontSizeIndex = parseInt(seed[0]);
        fontSize = possible_fontSizes[fontSizeIndex];
        const blurValueIndex = parseInt(seed[1]);
        blurValue = possible_blurValues[blurValueIndex];
        randomiserSeed = parseInt(seed.slice(2));
        randomiser = seededRandom(randomiserSeed);
    }

    function encodeSeed(randomiserSeed: string) {
        const fontSizeIndex = possible_fontSizes.indexOf(fontSize);
        const blurValueIndex = possible_blurValues.indexOf(blurValue);
        return `${fontSizeIndex}${blurValueIndex}${randomiserSeed}`;
    }

    const randomiseSeed = () => {
        randomiserSeed = Math.round(Math.random() * 1000000);
        randomiser = seededRandom(randomiserSeed);
        seed = encodeSeed(randomiserSeed);
    };

    function handleStart() {
        randomiser = seededRandom(randomiserSeed);
        randomiser();
        toGuess = names[Math.floor(randomiser() * names.length)];
        isStart = true;
        if (isNaN(seed) || seed.length < 3 || parseInt(seed[0]) >= possible_fontSizes.length || parseInt(seed[1]) >= possible_blurValues.length) {
            Swal.fire({
                title: "Invalid Seed",
                text: "Seed is invalid! Please enter a valid seed.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }
    }
</script>

{#if isStart}
    <GamePage bind:randomiser={randomiser} {seed} {randomiserSeed} bind:isStart={isStart} {blurValue} {fontSize} bind:toGuess={toGuess} {encodeSeed} {names} {name} {key} {date} {title} {isDaily}/>
{:else}
    <div class="max-w-3xl mx-auto my-8">
        <h1 class="text-5xl font-black animate-text bg-gradient-to-r from-ns-500 via-ns-400 to-ns-300 bg-clip-text text-transparent">{title.toUpperCase()}</h1>
        <p class="my-4 max-w-3xl">{instructions}</p>
        {#if isDaily}
            <DailyChoice bind:randomiserSeed={randomiserSeed} handleStart={handleStart} bind:randomiser={randomiser} name={`BLURRYGUESSR: ${title}`} bind:date={date} fullKey={`blurry-${key}`}/>
        {:else}
            <StartPage bind:blurValue={blurValue} bind:fontSize={fontSize} {handleStart} {title} {instructions} bind:seed={seed} {randomiseSeed} {decodeSeed} bind:name={name} {key}/>
        {/if}
    </div>
{/if}

