<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import Swal from 'sweetalert2';
    import toast from "../../common/toast";
    import { shareResults } from '../../common/showResults';

    export let chosen;
    export let title;
    export let seed;
    export let isStart;
    export let assignments;

    let guess = '';
    let isValidRegex = true;
    let regex = new RegExp(guess);
    let countCorrect = -1;
    const handleGuess = () => {
        // check if guess is valid regex
        try {
            regex = new RegExp(guess);
            isValidRegex = true;
            checkAssignmentsCorrect();
        } catch (e) {
            regex = new RegExp('');
            isValidRegex = false;
        }
    }

    const checkAssignmentsCorrect = () => {
        countCorrect = 0;
        for (let i = 0; i < chosen.length; i++) {
            if ((chosen[i].match(regex) && assignments[i]) || (!chosen[i].match(regex) && !assignments[i])) {
                countCorrect++;   
            }
        }
        return countCorrect === chosen.length;
    }

    const prepareResults = () => {
        if (checkAssignmentsCorrect()) {
            let text = `${title}\n`;
            let seedString = seed.toString();
            if (seedString.match(/20\d{2}(11|12|0\d)([0-2]\d|30|31)/)) {
                text += `Daily Challenge on ${seedString.slice(0, 4)}/${seedString.slice(4, 6)}/${seedString.slice(6)}\n`;
            }
            text += `I scored ${guess.length} points with ${guess}! Can you do better?\n`;
            text += `${window.location.href.split("?")[0]}?seed=${seed}&N=${chosen.length}\n`;
            shareResults(text);
        } else {
            toast.fire({
                icon: 'error',
                title: 'Not Complete!',
                text: 'Please try again.',
                showCloseButton: true,
                confirmButtonText: 'OK',
            });
        }
    }

    const end = () => {
        isStart = false;
    }

    
    // check assignments on mount
    $: checkAssignmentsCorrect();
</script>

<div>
    <div class="max-w-4xl mx-auto">
        <!-- give one tile per chosen name -->
        <!-- color is based on assignments -->
        <div class="flex flex-wrap gap-2 mb-4">
            {#each chosen.sort() as name, i (name)}
                <div class="flex gap-2">
                    <div class:border-ew-500="{assignments[i]}" class:border-ns-500="{!assignments[i]}" class:text-ew-500="{name.match(regex)}" class:text-ns-500="{!name.match(regex)}" class="border-2 rounded-lg py-2 px-4 font-bold">{name}</div>
                </div>
            {/each}
        </div>

        <label for="guess">Guess: </label>
        <div class="flex">
            <input type="text" bind:value={guess} on:keyup={handleGuess} class:border-ns-500="{!isValidRegex}" class="dark:bg-gray-700 rounded-md px-2 py-1 my-2" />
            {#if !isValidRegex}
                <p class="text-ns-500 my-auto ms-2">Invalid Regex</p>
            {:else if countCorrect === chosen.length}
                <p class="text-ew-500 my-auto ms-2">Success! Score: {guess.length}</p>
            {:else}
                <p class="text-cc-500 my-auto ms-2">{countCorrect >= 0 ? countCorrect : '?'}/{chosen.length} correct</p>
            {/if}
        </div>

        <!-- end buttonn -->
        <button on:click={() => {prepareResults()}} disabled={countCorrect !== chosen.length} class={`${countCorrect !== chosen.length ? "bg-gray-300/20 text-gray-300" : "bg-cc-300/20 hover:bg-cc-300/50 text-cc-500 hover:text-cc-300"} rounded-lg py-1 px-2 my-2`}>Share Results</button>
        <button on:click={end} class="bg-ns-300/20 hover:bg-ns-300/50 text-ns-500 hover:text-ns-300 rounded-lg py-1 px-2 my-2">End</button>
    </div>
</div>