<script lang="ts">
    import Swal from 'sweetalert2';
    import { onMount } from "svelte";
    import toast from "../../common/toast";
    import { shareResults } from '../../common/showResults';
    import party from 'party-js';

    export let toType;
    export let title;
    export let seed;
    export let handleStart;
    export let randomiseSeed;
    export let N;
    export let space;
    export let lowerCase;

    let time = 0;
    let currCharIndex = 0;
    let isDone = false;
    let startTime = null;

    function handleKey(e: KeyboardEvent) {
        if (isDone) return;

        if (currCharIndex === 0) {
            startTime = Date.now();
        }

        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && e.key == toType.charAt(currCharIndex)) {
            currCharIndex++;

            if (currCharIndex >= toType.length) {
                isDone = true;
                // get timer element
                const timer = document.getElementById("timer");
                party.confetti(timer as HTMLElement, {
                    count: party.variation.range(50, 100),
                    size: party.variation.range(0.5, 1.5),
                });
            }
        }
    }

    onMount(() => {
        window.addEventListener("keydown", handleKey);
    });

    // update time every 0.1s
    const interval = setInterval(() => {
        if(isDone || !startTime) return ;
        time += 100;
    }, 100);

    const handleNewSeed = () => {
        randomiseSeed();
        isDone = false;
        currCharIndex = 0;
        time = 0;
        startTime = null;
        handleStart();
    }

    const handleSameSeed = () => {
        isDone = false;
        currCharIndex = 0;
        time = 0;
        startTime = null;
        handleStart();
    }

    const share = () => {
        let text = `${title}\n`;
        let seedString = seed.toString();
        if (seedString.match(/20\d{2}(11|12|0\d)([0-2]\d|30|31)/)) {
            text += `Daily Challenge on ${seedString.slice(0, 4)}/${seedString.slice(4, 6)}/${seedString.slice(6)}\n`;
        }
        text += `I completed it in ${(time/1000).toFixed(1)}s!\n`;
        text += `${window.location.href.split("?")[0]}?seed=${seed}&N=${N}&noSpace=${space ? "y" : ""}&lowerCase=${lowerCase ? "y" : ""}\n`;
        shareResults(text);
    }
</script>

<div>
    <p id="timer" class="text-lg my-4">Timer: <span class="p-2 bg-dt-500 rounded-lg">{(time/1000).toFixed(1)}s</span></p>
    <p class="font-mono text-wrap break-words">
        <span class="text-ew-500">{toType.slice(0, currCharIndex)}</span><span class="text-cc-300 underline">{toType.charAt(currCharIndex)}</span><span class="">{toType.slice(currCharIndex+1)}</span>
    </p>

    <!-- buttons -->
    {#if isDone}
        <div class="flex flex-wrap gap-4">
            <button on:click={share} class="bg-dt-300/20 hover:bg-dt-300/50 text-dt-500 hover:text-dt-300 rounded-lg py-1 px-2 my-2">Share Results</button>
            <button on:click={handleSameSeed} class="bg-cc-300/20 hover:bg-cc-300/50 text-cc-500 hover:text-cc-300 rounded-lg py-1 px-2 my-2">Play Same Seed</button>
            <button on:click={handleNewSeed} class="bg-ew-300/20 hover:bg-ew-300/50 text-ew-500 hover:text-ew-300 rounded-lg py-1 px-2 my-2">Play Another Seed</button>
        </div>
    {/if}
</div>