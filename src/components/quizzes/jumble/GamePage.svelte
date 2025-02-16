<script lang="ts">
    import { fly } from 'svelte/transition';
    import Swal from 'sweetalert2';
    export let chosen;
    export let title;
    export let instructions;
    export let isStart;
    export let scrambleFactor;
    export let mixFactor;
    export let randomiser;
    export let changeSeed;
    export let seed;
    let givenUp = false;
    // all the individual letters in the chosen words
    let letters = chosen
        .map((chose: string, i: number) => chose
            .split('')
            .map(letter => [letter, i])
            .map((a: any, j: number) => [a, j])
            .sort((a: any, b: any) => (scrambleFactor/5) - Math.pow(randomiser(), 2) > 0 ? randomiser() - 0.5 : 0)
            .map((a: any) => a[0])
        )
        .flat()
        .sort((a: any, b: any) => a[1] == b[1] ? 0 : (mixFactor/5) - Math.pow(randomiser(), 2) > 0 ? randomiser() - 0.5 : 0)
        .map((a: any) => a[0]);
    let badLetters: string[] = [];
    // same length as letters
    let used = Array(letters.length).fill(false);
    let responses = Array(chosen.length).fill('');

    const handleType = (responseId: number) => (event: any) => {
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
        let setOfChosens = new Set(chosen.map((chosen: string) => chosen.toUpperCase()));

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
        toast.fire({
            icon: 'success',
            text: 'Copied Seed',
        });
    }

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
                changeSeed();
            }
        });
    }
</script>

<div class="top-0 h-screen w-screen grid content-center justify-center p-2 -z-10" transition:fly={{ y: -200, duration: 500 }}>
    <div class="max-w-4xl mx-auto">
        <h1 class="text-5xl font-extrabold animate-linear bg-[length:200%_auto] bg-gradient-to-r from-ns-500 to-ns-300  text-transparent bg-clip-text">{title}</h1>
        <p class="my-4">{instructions} <button on:click={copySeed} class="underline hover:opacity-50">Copy the seed</button> and share with your friends!</p>
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
        <div class="grid my-4 max-w-xl">
            <div class="grid grid-cols-2 place-content-center gap-2">
                {#each responses as response, i}
                <input type="text" class="border-[1px] rounded-md px-2 py-1 dark:bg-gray-700 my-1" on:keyup={handleType(i)} bind:value={responses[i]} placeholder={`Guess ${i+1}`}/>
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