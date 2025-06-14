<script lang="ts">
    import Swal from 'sweetalert2';
    import { shareResults } from "../../common/showResults";
    // unidecode
    import { standardiseCanonical } from "../../../data/standardiseName";

    export let names;
    export let title;
    export let params;

    let time = params.time || 20;
    let sequenceLength = params.sequenceLength || 3;
    let remainingTime = time;

    let isStart = false;
    let isWait = false;

    let answer = "";
    let syll = "";
    let nameSet = new Set(names.map(name => name.toLowerCase().replaceAll(" ", "")));
    let dateTime = new Date();
    let lastGuess = "";

    let streak = 0;
    let bestStreak = 0;

    const handleStart = () => {
        isStart = true;
        handleNext();
    };

    // upon hitting next, the timer starts counting down
    // if the user types the correct answer, the timer resets and the next question is automatically shown

    const handleNext = async () => {
        // clear input box
        const inputBox = document.getElementById("guess");
        if (inputBox) inputBox.value = '';

        dateTime = new Date();

        // get random 3 letters from any name
        answer = names[Math.floor(Math.random() * names.length)];
        syll = answer.split(' ').sort(() => Math.random() - 0.5)[0];
        let syllIndex = Math.floor(Math.random() * (syll.length - 2));
        syll = syll.slice(syllIndex, syllIndex + sequenceLength).toLowerCase();

        remainingTime = time;
        await handleTime();
        isWait = false;
    }

    const handleTime = async () => {
        const timer = setInterval(() => {
            if (isWait) return;

            let newDateTime = new Date();
            let diff = Math.floor((newDateTime.getTime() - dateTime.getTime()) / 1000);
            remainingTime = time - diff;
            if (remainingTime <= 0) {
                clearInterval(timer);
                isWait = true;
                bestStreak = Math.max(bestStreak, streak);
                streak = 0;
                Swal.fire({
                    title: 'Time is up!',
                    text: `The answer was: ${answer}`,
                    icon: 'error',
                    confirmButtonText: 'Next',
                    showCancelButton: true,
                    cancelButtonText: 'Share Results'
                }).then(result => {
                    // only if share results
                    if (!result.isConfirmed) {
                        let resultsText = `${title}\n`;
                        resultsText += `My best streak is ${bestStreak}!\n`;
                        resultsText += `${window.location.href.split("?")[0]}?time=${time}&sequenceLength=${sequenceLength}\n`;
                        shareResults(resultsText);
                    }

                    handleNext();
                });
            }
        }, 100);
    }

    const handleType = (e) => {
        let inputValue = standardiseCanonical(e.target.value);
        // check if in nameSet and contains the syll
        if (nameSet.has(inputValue) && inputValue.includes(syll)) {
            streak++;
            lastGuess = inputValue;
            e.target.value = '';
            handleNext();
        }
    }
</script>

{#if !isStart}
<label for="N" class="">Time Interval (s): </label>
<div class="flex gap-2 my-2">
    {#each [10, 15, 20, 30, 60, 120] as n (n)}
    <button on:click={() => {time = n;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={time == n} class:text-white={time == n}>{n}</button>
    {/each}
</div>
<label for="N" class="">Sequence Length: </label>
<div class="flex gap-2 my-2">
    {#each [1, 2, 3, 4, 5] as n (n)}
    <button on:click={() => {sequenceLength = n;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={sequenceLength == n} class:text-white={sequenceLength == n}>{n}</button>
    {/each}
</div>
<button
class="bg-ew-300/20 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50 my-2"
on:click={handleStart}
>
Start Quiz
</button>
{:else}
<!-- syll -->
<p>Streak: {streak}, Best Streak: {bestStreak}</p>
<p>Time Left: {remainingTime}</p>
<h1 class="text-6xl font-bold mb-4">{syll.toUpperCase()}</h1>
<label for="guess" class="">Your Guess: </label>
<input type="text" id="guess" on:keyup={handleType} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2"/>
<p>Last Guess: {lastGuess}</p>
{/if}