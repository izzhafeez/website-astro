<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import Swal from "sweetalert2";
    import seededRandom from "../../common/seededRandom";
    import levenshtein from "fast-levenshtein";
    import party from "party-js";
    import axios from "axios";
    import showResults, { shareResults } from "../../common/showResults";
    import {standardiseCanonical} from "../../../data/standardiseName";

    export let randomiser: () => number;
    export let randomiseSeed: () => void;
    export let seed: string;
    export let blurValue: string;
    export let fontSize: number;
    export let toGuess: string;
    export let names: string[];
    export let title: string;
    export let isStart: boolean;
    
    let score = 0;
    let roundScore = 0;
    let round = 1;
    let maxRounds = 5;
    let guess = "";
    let isWaiting = false;
    let guesses = [];
    let resultsText;

    function nextRound() {
        round++;
        isWaiting = false;
        if (round > maxRounds) {
            resultsText = `${title}\n`;
            let seedString = seed.toString();
            if (seedString.match(/20\d{2}(11|12|0\d)([0-2]\d|30|31)/)) {
                resultsText += `Daily Challenge on ${seedString.slice(0, 4)}/${seedString.slice(4, 6)}/${seedString.slice(6)}\n`;
            }
            resultsText += `I scored ${score}/500 points!\n`;
            resultsText += `${window.location.href.split("?")[0]}?seed=${seed}&blur=${blurValue}&font=${fontSize}\n`;
            showResults(score, 500, null, resultsText)
        } else {
            toGuess = names[Math.floor(randomiser() * names.length)];
            guess = "";
            const guessBox = document.getElementById('guess');
            guessBox?.focus();
        }
    }

    function handleGuess() {
        // use Jaccard similarity to compare guess and toGuess
        const levenshteinDistance = levenshtein.get(standardiseCanonical(guess), standardiseCanonical(toGuess));
        const overallSimilarity = Math.ceil(100 - (levenshteinDistance / toGuess.length) * 100);

        roundScore = overallSimilarity;

        if (roundScore > 70) {
            const winSelectElement = document.getElementById('to-guess');
            if (winSelectElement) party.confetti(winSelectElement);
        }

        guesses.push([guess, toGuess, overallSimilarity]);

        score += overallSimilarity;

        isWaiting = true;
    }

    function handleType(event: any) {
        // check for enter key press
        if (event.key === "Enter" && guess.length > 0) {
            handleGuess();
            const nextRoundButton = document.getElementById('action-button');
            if (nextRoundButton) nextRoundButton.focus();
        }
    }
</script>


{#if round <= maxRounds}
<h1 class="">ROUND {round}/{maxRounds}</h1>

<span class={`dark:text-white p-2 my-4 blur-${isWaiting ? "none" : blurValue.toLowerCase()} text-[${fontSize}px] rounded-md select-none`} id="to-guess">{toGuess}</span>

<div>
{#if isWaiting}
    <p class="max-w-3xl">Round Score: {roundScore}</p>
{/if}
    <p>Total Score: {score}</p>
    <label for="guess" class="">Your Guess: </label>
    <input type="text" id="guess" bind:value={guess} on:keyup={handleType} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2"/>
    <br>
    <div class="flex gap-2">
        <button on:click={isWaiting ? nextRound : handleGuess} class='bg-ew-500/20 hover:bg-ew-300/50 text-ew-700 dark:text-ew-300 rounded-lg py-1 px-2' id="action-button">{isWaiting ? "Next Round" : "Submit"}</button>
    </div>
</div>
{:else}
<div class="grid mx-auto my-4">
    <p class="text-lg my-2 text-center">Final Score: {score}/500</p>
    <!-- show guesses -->
    <table class="border-gray-500/20 border-2 table-fixed">
        <thead class="bg-ns-500/50 text-white">
            <tr>
                <th class="py-2 px-4 w-1/3">Your Guess</th>
                <th class="py-2 px-4 w-1/3">Actual</th>
                <th class="py-2 px-4 w-1/3">Score</th>
            </tr>
        </thead>
        <tbody>
            {#each guesses as [guess, toGuess, sim], i}
                <tr class="">
                    <td class="py-2 px-4 text-center">{guess}</td>
                    <td class="py-2 px-4 text-center">{toGuess}</td>
                    <td class="py-2 px-4 text-center">{sim}</td>
                </tr>
            {/each}
        </tbody>
    </table>
    <div class="flex gap-2">
        <button class="bg-cc-500/20 hover:bg-cc-300/50 text-cc-700 dark:text-cc-300 rounded-lg py-1 px-2 my-4 mx-auto" on:click={() => shareResults(resultsText)}>Share Results</button>
        <button class="bg-ew-500/20 hover:bg-ew-300/50 text-ew-700 dark:text-ew-300 rounded-lg py-1 px-2 my-4 mx-auto" on:click={() => {isStart=false; randomiseSeed();}}>Play Again</button>
    </div>
</div>
{/if}

<!-- fake -->
<!-- [20, 30, 40, 60, 80, 120, 160]; -->
<p class="text-[20px] blur-xs"></p>
<p class="text-[30px] blur-md"></p>
<p class="text-[40px] blur-lg"></p>
<p class="text-[60px] blur-xl"></p>
<p class="text-[80px] blur-2xl"></p>
<p class="text-[120px] blur-3xl"></p>
<p class="text-[160px] blur-none"></p>
<p class="text-[50px]"></p>
<p class="text-[60px]"></p>
<p class="text-[80px]"></p>