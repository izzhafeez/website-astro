<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import Swal from 'sweetalert2';

    export let chosen;
    export let title;
    export let instructions;
    export let seed;
    export let isStart;
    export let assignments;
    export let name: string;
    export let key: string;
    export let date;

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
        if (countCorrect === chosen.length) {
            const url = `https://script.google.com/macros/s/AKfycbzrruwSggCRGCwUducgQD3YiUFVLp5cKGt3IFcX7z-34QDR4XkceBhpKtQMQByZExRZjQ/exec`;
            fetch(`${url}?siteUrl=__quizzes__regex__${key}&name=${name}&score=${-guess.length}&params=${seed}`);

            if (date) localStorage.setItem(`regex-${key}-${date}`, guess.length.toString());
        }
    }

    const end = () => {
        isStart = false;
    }

    
    // check assignments on mount
    $: checkAssignmentsCorrect();

    const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
    });

    const copyResults = () => {
        let text = `Regex Warrior: ${title}\n`;
        text += `Daily Challenge on ${date}\n`;
        text += `I scored ${guess.length} points! Can you score lower than me?\n`;
        text += `https://izzhafeez.com/quizzes/regex/${key}/daily-challenge`;

        navigator.clipboard.writeText(text);
        toast.fire({
            icon: 'success',
            text: 'Copied Results',
        });
    }
</script>

<div in:fade={{}}>
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
        <button on:click={copyResults} disabled={countCorrect !== chosen.length} class={`${countCorrect !== chosen.length ? "bg-gray-300/20 text-gray-300" : "bg-cc-300/20 hover:bg-cc-300/50 text-cc-500 hover:text-cc-300"} rounded-lg py-1 px-2 my-2`}>Copy Results</button>
        <button on:click={end} class="bg-ns-300/20 hover:bg-ns-300/50 text-ns-500 hover:text-ns-300 rounded-lg py-1 px-2 my-2">End</button>
    </div>
</div>