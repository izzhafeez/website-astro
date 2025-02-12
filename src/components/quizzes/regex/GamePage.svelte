<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import Swal from 'sweetalert2';

    export let chosen;
    export let title;
    export let instructions;
    export let seed;
    export let isStart;
    export let assignments;

    let guess = '';
    let isValidRegex = true;
    let regex = new RegExp(guess);
    let countCorrect = '?';
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
    }

    const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    const copySeed = () => {
        navigator.clipboard.writeText(seed);
        console.log('copied');
        toast.fire({
            icon: 'success',
            text: 'Copied Seed',
        });
    }

    const end = () => {
        isStart = false;
    }
</script>

<div class="top-0 h-screen w-screen grid content-center justify-center p-2 -z-10" in:fly={{ y: 200 }} out:fade>
    <div class="max-w-4xl mx-auto">
        <h1 class="text-5xl font-extrabold animate-linear bg-[length:200%_auto] bg-gradient-to-r from-ns-500 to-ns-300  text-transparent bg-clip-text">{title}</h1>
        <p class="my-4">{instructions} <button on:click={copySeed} class="underline hover:opacity-50">Copy the seed</button> and share with your friends!</p>
        
        <!-- give one tile per chosen name -->
        <!-- color is based on assignments -->
        <div class="flex flex-wrap gap-2 mb-4">
            {#each chosen as name, i (name)}
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
                <p class="text-cc-500 my-auto ms-2">{countCorrect}/{chosen.length} correct</p>
            {/if}
        </div>

        <!-- end buttonn -->
        <button on:click={end} class="bg-ns-500 hover:bg-ns-300 text-white rounded-lg py-2 px-4 my-2">End</button>
    </div>
</div>