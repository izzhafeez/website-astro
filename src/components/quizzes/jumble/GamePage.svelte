<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    import Swal from 'sweetalert2';
    import showResults, { shareResults } from '../../common/showResults';
    export let chosen;
    export let title;
    export let isStart;
    export let scrambleFactor;
    export let mixFactor;
    export let randomiser;
    export let seed;
    export let randomiseSeed;
    export let MAX_LENGTH;
    
    let givenUp = false;
    // all the individual letters in the chosen words
    let letters = chosen
        .map((chose: string, i: number) => chose
            .split('')
            .map(letter => [letter, i])
            .map((a: any, j: number) => [a, j])
            .sort((a: any, b: any) => {
                if (isNaN(scrambleFactor)) scrambleFactor = 3;
                if (scrambleFactor < 0) scrambleFactor = 0;
                if (scrambleFactor > 5) scrambleFactor = 5;
                return (scrambleFactor/5) - Math.pow(randomiser(), 3) > 0 ? randomiser() - 0.5 : 0
            })
            .map((a: any) => a[0])
        )
        .flat()
        .sort((a: any, b: any) => {
            if (isNaN(mixFactor)) mixFactor = 3;
            if (mixFactor < 0) mixFactor = 0;
            if (mixFactor > 5) mixFactor = 5;
            return a[1] == b[1] ? 0 : (mixFactor/5) - Math.pow(randomiser(), 3) > 0 ? randomiser() - 0.5 : 0
        })
        .map((a: any) => a[0]);
    let badLetters: string[] = [];
    // same length as letters
    let used = Array(letters.length).fill(false);
    let responses = Array(chosen.length).fill('');
    let setOfResponses = new Set();
    let score = 0;

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
                    if (letters[i] === letter && !used[i]) {
                        used[i] = true;
                        isFound = true;
                        break;
                    }
                }

                // if the letter is not found, add it to badLetters
                if (!isFound) {
                    badLetters.push(letter);
                }
            }
        }

        // compare set of responses to set of chosens, regardless of order
        setOfResponses = new Set(responses);
        let setOfChosens = new Set(chosen);

        if (setOfResponses.size === setOfChosens.size && [...setOfResponses].every(response => setOfChosens.has(response))) {
            if (givenUp) {
                return;
            }

            score = chosen.length;
            
            givenUp = true;

            let text = `Jumble Master: ${title}\n`;
            let seedString = seed.toString();
            if (seedString.match(/20\d{2}(11|12|0\d)([0-2]\d|30|31)/)) {
                text += `Daily Challenge on ${seedString.slice(0, 4)}/${seedString.slice(4, 6)}/${seedString.slice(6)}\n`;
            }
            text += `I got all ${setOfResponses.size}/${setOfResponses.size}!\n`;
            text += `${window.location.href.split("?")[0]}?seed=${seed}&N=${chosen.length}&max=${MAX_LENGTH}&scramble=${scrambleFactor}&mix=${mixFactor}\n`;

            showResults(setOfResponses.size, setOfChosens.size, null, text);
            randomiseSeed();
        }
    };

    const giveUp = () => {
        // confirmation
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover your answers!',
        }).then((result) => {
            if (result.isConfirmed) {
                // all unique responses
                setOfResponses = new Set(responses);

                // calculate score
                score = 0;
                for (let c of chosen) {
                    if (setOfResponses.has(c)) {
                        score++;
                    }
                }

                // reveal all responses
                responses.forEach((response, i) => {
                    if (responses[i] != chosen[i]) {
                        responses[i] = `${chosen[i]} ${responses[i] ? "(" + responses[i] + ")" : ""}`;
                    }
                });

                givenUp = true;
                randomiseSeed();
            }
        });
    }

    const copyResults = () => {
        let text = `${title}\n`;
        let seedString = seed.toString();
        if (seedString.match(/20\d{2}(11|12|0\d)([0-2]\d|30|31)/)) {
            text += `Daily Challenge on ${seedString.slice(0, 4)}/${seedString.slice(4, 6)}/${seedString.slice(6)}\n`;
        }
        text += `I got ${score}/${chosen.length} correct!\n`;
        text += `${window.location.href.split("?")[0]}?seed=${seed}&N=${chosen.length}&max=${MAX_LENGTH}&scramble=${scrambleFactor}&mix=${mixFactor}\n`;
        shareResults(text);
    }
</script>

<div class="">
    <div class="max-w-4xl mx-auto">
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
                <input type="text" class={`border-[1px] rounded-md px-2 py-1 dark:bg-gray-700 my-1 ${givenUp ? setOfResponses.has(response) ? "border-ew-300" : "border-ns-300" : ""}`} on:keyup={handleType(i)} bind:value={responses[i]} placeholder={`Guess ${i+1}`} disabled={givenUp}/>
                {/each}
            </div>
        </div>

        <!-- give up -->
        {#if !givenUp}
            <button on:click={giveUp} class='bg-ns-300/20 hover:bg-ns-300/50 text-ns-700 dark:text-ns-300 rounded-lg py-1 px-2'>Give Up</button>
        {:else}
        <div class="flex gap-4">
            <!-- score -->
            <h2 class="my-auto">Score: {score}/{chosen.length}</h2>

            <!-- copy results -->
            <button on:click={copyResults} class='bg-cc-300/20 hover:bg-cc-300/50 text-cc-700 dark:text-cc-300 rounded-lg py-1 px-2'>Share Results</button>

            <!-- handle next -->
            <button on:click={() => {isStart = false;}} class='bg-ew-300/20 hover:bg-ew-300/50 text-ew-700 dark:text-ew-300 rounded-lg py-1 px-2'>Play Again</button>
        </div>
        {/if}
    </div>
</div>