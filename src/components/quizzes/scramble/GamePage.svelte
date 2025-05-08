<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    import Swal from 'sweetalert2';
    import { shareResults } from '../../common/showResults';
    import party from 'party-js';
    import toast from '../../common/toast';

    export let chosen;
    export let title;
    export let randomiser;
    export let seed;
    export let randomiseSeed;
    export let isSmall;
    export let handleNext;

    let guess = '';
    let accepted = [];
    let extra = [];
    let isWaiting = false;

    $: scrambled = chosen.split('').sort(() => randomiser() - 0.5);

    $: isValid = guess.length == scrambled.length && accepted.every(c => c) && extra.length === 0;

    const copyResults = () => {
        let text = `${title}\n`;
        let seedString = seed.toString();
        if (seedString.match(/20\d{2}(11|12|0\d)([0-2]\d|30|31)/)) {
            text += `Daily Challenge on ${seedString.slice(0, 4)}/${seedString.slice(4, 6)}/${seedString.slice(6)}\n`;
        }
        text += `I got it ${guess.toLowerCase() === chosen.toLowerCase() ? 'correct!' : 'wrong :('}\n`;
        text += `${window.location.href.split("?")[0]}?seed=${seed}&isSmall=${isSmall ? "y" : ""}\n`;
        shareResults(text);
    }

    const handleInput = (e) => {
        // check for enter
        if (e.inputType === 'insertLineBreak' || e.key === 'Enter') {
            handleGuess();
            return;
        }

        // letter counts in guess
        let letterCounds = {};
        for (let i = 0; i < guess.length; i++) {
            letterCounds[guess[i]] = (letterCounds[guess[i]] || 0) + 1;
        }

        // go through scrambled and check if letter is in guess
        accepted = [];
        for (let i = 0; i < scrambled.length; i++) {
            if (letterCounds[scrambled[i]] > 0) {
                accepted.push(true);
                letterCounds[scrambled[i]]--;
            } else {
                accepted.push(false);
            }
        }

        // any excess in guess goes to extra
        extra = [];
        for (let i = 0; i < guess.length; i++) {
            if (letterCounds[guess[i]] > 0) {
                extra.push(guess[i]);
                letterCounds[guess[i]]--;
            }
        }
    }

    const handleGuess = () => {
        // if (!isValid) {
        //     toast.fire({
        //         icon: 'error',
        //         title: 'Invalid Guess',
        //         text: "Please don't miss any letters, and don't add additional ones!",
        //     });
        //     return;
        // }

        if (guess.toLowerCase() === chosen.toLowerCase()) {
            const element = document.getElementById('to-guess');
            party.confetti(element);
            toast.fire({
                icon: 'success',
                title: "Correct!"
            })
        } else {
            toast.fire({
                icon: 'error',
                title: "Incorrect!",
                text: `The correct answer was ${chosen}.`,
            });
        }
        isWaiting = true;

        // after a while, the play again button should be focussed
        setTimeout(() => {
            const button = document.getElementById('play-again');
            if (button) {
                button.focus();
            }
        }, 250);
    }

    const playAgain = () => {
        isWaiting = false;
        randomiseSeed();

        handleNext();
        accepted = [];
        extra = [];
        guess = '';

        // after a while, the input should be focussed
        setTimeout(() => {
            const input = document.getElementById('guess-input');
            // if the input is not disabled, focus it
            if (input && !input.disabled) {
                input.focus();
            }
        }, 250);
    }
</script>

<!-- each letter in scrambled should have an underline -->
<div class="my-4" id="to-guess">
    <h3>To guess:</h3>
    <div class="flex gap-2">
    {#each scrambled as c, i}
        <span
            class={`text-2xl font-bold text-center border-b-2 ${accepted[i] ? "border-ew-500 dark:border-ew-300 text-ew-500 dark:text-ew-300" : "border-gray-500 dark:border-gray-300"} font-mono`}
            transition:fade>{c === ' ' ? '\u00A0' : c}</span>
    {/each}
    {#each extra as c}
        <span class="text-2xl font-bold text-center border-b-2 text-ns-500 dark:text-ns-300 border-ns-500 dark:border-ns-300 font-mono" transition:fade>{c === ' ' ? '\u00A0' : c}</span>
    {/each}
    </div>
</div>

<div class="my-4">
    <h3>Your guess:</h3>
    {#if !isWaiting}
    <input type="text" 
        id="guess-input"
        disabled={isWaiting}
        bind:value={guess} on:keyup={handleInput} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2 w-80" />
    {:else}
    {guess}
    {/if}
</div>

{#if isWaiting}
<div class="my-4">
    <h3>Correct answer:</h3>
    {chosen}
</div>
{/if}



<div class="my-4">
    {#if !isWaiting}
    <button on:click={handleGuess}
        class="bg-ew-300/30 text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-ew-500/50 py-1 px-2 rounded-md border-2">Submit</button>
    {:else}
    <button on:click={copyResults}
        id="copy"
        class="bg-dt-300/30 text-dt-700 dark:text-dt-300 hover:bg-dt-300/50 border-dt-500/50 py-1 px-2 rounded-md border-2">Share Results</button>
    <button on:click={playAgain}
        id="play-again"
        class="bg-ew-300/30 text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-ew-500/50 py-1 px-2 rounded-md border-2">Play Again</button>
    {/if}
</div>