<script lang="ts">
    import { fly } from 'svelte/transition';
    import Swal from 'sweetalert2';
    export let chosen;
    export let title;
    export let instructions;
    export let isStart;
    let givenUp = false;
    // all the individual letters in the chosen words
    let letters = chosen.join('').split('').sort((a, b) => 0.5 - Math.random());
    let badLetters = [];
    // same length as letters
    let used = Array(letters.length).fill(false);
    let responses = Array(chosen.length).fill('');

    const handleType = (responseId) => (event) => {
        responses[responseId] = event.target.value;

        // refresh used
        used = Array(letters.length).fill(false);
        badLetters = [];

        // for response in responses, consume a letter if it matches
        for (let response of responses) {
            for (let letter of response.split('')) {
                let isFound = false;
                for (let i = 0; i < letters.length; i++) {
                    if (letters[i].toUpperCase() === letter.toUpperCase() && !used[i]) {
                        used[i] = true;
                        isFound = true;
                        break;
                    }
                }

                // if the letter is not found, add it to badLetters
                if (!isFound) {
                    badLetters.push(letter.toUpperCase());
                }
            }
        }

        // compare set of responses to set of chosens, regardless of order
        let setOfResponses = new Set(responses.map(response => response.toUpperCase()));
        let setOfChosens = new Set(chosen.map(chosen => chosen.toUpperCase()));

        if (setOfResponses.size === setOfChosens.size && [...setOfResponses].every(response => setOfChosens.has(response))) {
            if (givenUp) {
                return;
            }
            Swal.fire({
                html: `<img src="/img/quizzes/fuiyoh.gif"/>`,
            });
            givenUp = true;
        }
    };

    const giveUp = () => {
        // confirmation
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover your answers!',
        }).then((result) => {
            if (result.isConfirmed) {
                // reveal all responses
                responses.forEach((response, i) => {
                    responses[i] = chosen[i];
                });
                givenUp = true;
            }
        });
    }
</script>

<div class="top-0 h-screen w-screen grid content-center justify-center p-2 -z-10" transition:fly={{ y: -200, duration: 500 }}>
    <div class="max-w-4xl mx-auto">
        <h1 class="text-5xl font-extrabold animate-linear bg-[length:200%_auto] bg-gradient-to-r from-ns-500 to-ns-300  text-transparent bg-clip-text">{title}</h1>
        <p class="my-4">{instructions}</p>
        <!-- letters as tiles in a grid -->
        <div class="flex flex-wrap gap-2">
            {#each letters as letter, i}
            <div class:bg-cc-500="{!used[i]}" class:hover:bg-cc-300="{!used[i]}" class:bg-ew-500="{used[i]}" class:hover:bg-ew-300="{used[i]}" class="text-black rounded-lg py-2 w-10 text-center">{letter}</div>
            {/each}

            {#each badLetters as letter}
            <div class="text-white rounded-lg py-2 w-10 text-center bg-ns-500">{letter}</div>
            {/each}
        </div>

        <!-- one text field per N -->
        <div class="grid my-4">
            <div class="grid grid-cols-2 me-auto place-content-center gap-2">
                {#each responses as response, i}
                <div class="flex my-1 mx-auto">
                    <input type="text" class="border-[1px] rounded-md px-2 py-1 dark:bg-gray-700" on:keyup={handleType(i)} bind:value={responses[i]} placeholder={`Guess ${i+1}`}/>
                </div>
                {/each}
            </div>
        </div>

        <!-- give up -->
        {#if !givenUp}
            <button on:click={giveUp} class='bg-ns-500 hover:bg-ns-300 text-white rounded-lg py-2 px-4 my-2'>Give Up</button>
        {:else}
            <!-- handle next -->
            <button on:click={() => {isStart = false;}} class='bg-ew-500 hover:bg-ew-300 text-white rounded-lg py-2 px-4 my-2'>Next</button>
        {/if}
    </div>
</div>