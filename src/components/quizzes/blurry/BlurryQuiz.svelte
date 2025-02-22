<script lang="ts">
    import StartPage from "./StartPage.svelte";
    import GamePage from "./GamePage.svelte";
    import seededRandom from "../../common/seededRandom";

    export let title: string;
    export let instructions: string;
    export let names: string[];

    let isStart = false;
    let possible_blurValues = ["XS", "SM", "MD", "LG", "XL", "2XL", "3XL"];
    let possible_fontSizes = [20, 30, 40, 60, 80, 120, 160];
    let blurValue = "MD";
    let fontSize = 20;
    let randomiserSeed = Math.round(Math.random() * 1000000);
    let randomiser = seededRandom(randomiserSeed);
    let seed = `${possible_fontSizes.indexOf(fontSize)}${possible_blurValues.indexOf(blurValue)}${randomiserSeed}`;
    let toGuess = names[Math.floor(randomiser() * names.length)];

    function decodeSeed() {
        const fontSizeIndex = parseInt(seed[0]);
        fontSize = possible_fontSizes[fontSizeIndex];
        const blurValueIndex = parseInt(seed[1]);
        blurValue = possible_blurValues[blurValueIndex];
    }

    function encodeSeed() {
        const fontSizeIndex = possible_fontSizes.indexOf(fontSize);
        const blurValueIndex = possible_blurValues.indexOf(blurValue);
        seed = `${fontSizeIndex}${blurValueIndex}${Math.round(Math.random() * 1000000)}`;
    }

    const randomiseSeed = () => {
        randomiserSeed = Math.round(Math.random() * 1000000);
        randomiser = seededRandom(randomiserSeed);
        encodeSeed();
    };

    function handleStart() {
        isStart = true;
    }
</script>

{#if isStart}
    <GamePage bind:randomiser={randomiser} {seed} {randomiserSeed} bind:isStart={isStart} {blurValue} {fontSize} bind:toGuess={toGuess} {encodeSeed} {names}/>
{:else}
    <StartPage bind:blurValue={blurValue} bind:fontSize={fontSize} {handleStart} {title} {instructions} bind:seed={seed} {randomiseSeed} {decodeSeed}/>
{/if}

