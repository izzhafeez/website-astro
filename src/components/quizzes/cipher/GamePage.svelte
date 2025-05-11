<script>
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
    export let handleNext;
    export let N;

    // unique set of letters in the chosen names
    // defined inline
    let bagOfLetters = [];
    let uniqueLetters = [];
    let letterIndices = {};
    let encodedNames = [];
    let corrects = {};
    let isWaiting = false;
    let guess = {};
    let score = 0;
    let clashingNumbers = new Set();

    $: {
        bagOfLetters = chosen.join('').split('').map(l => l.toLowerCase()).filter(l => l != " ");
        uniqueLetters = [...new Set(bagOfLetters)].sort((a,b) => randomiser() - 0.5);
        letterIndices = {};
        uniqueLetters.forEach((letter, index) => {
            letterIndices[letter] = index;
        });
        encodedNames = chosen.map(name => {
            return name.split('').map(l => {
                if (l == " ") return -1;
                return letterIndices[l.toLowerCase()];
            });
        });
        corrects = {};
        isWaiting = false;

        // initialise the guess with number-number
        guess = {};
        for (let i = 0; i < bagOfLetters.length; i++) {
            guess[i] = "";
        }
    }

    const handleInput = (letter, i, j) => (e) => {
        let value = e.target.value;
        if (value.length > 1) {
            value = value.charAt(1);
        }
        guess[letter] = value;

        let numberCounts = {};
        for (let key of Object.keys(guess)) {
            let g = guess[key].toLowerCase();
            if (g.length == 0) continue;
            if (numberCounts[g]) {
                numberCounts[g]++;
            } else {
                numberCounts[g] = 1;
            }
        }
        clashingNumbers = new Set();
        for (let key of Object.keys(numberCounts)) {
            if (numberCounts[key] > 1) {
                clashingNumbers.add(key);
            }
        }

        if (value.length == 0) return;

        // focus on the next input
        navigateNext(i, j);
    }

    const handleNavigate = (i, j) => (e) => {
        // handle right arrows and left arrows
        if (e.key == "ArrowLeft") {
            navigatePrev(i, j);
        } else if (e.key == "ArrowRight") {
            navigateNext(i, j);
        }
    }

    const navigateNext = (i, j) => {
        let nextInput = document.getElementById(i + "-" + (j + 1));
        let nextNextInput = document.getElementById(i + "-" + (j + 2));
        let nextLineInput = document.getElementById((i + 1) + "-0");
        let firstInput = document.getElementById("0-0");
        if (nextInput && !nextInput.disabled) {
            nextInput.focus();
        } else if (nextNextInput) {
            nextNextInput.focus();
        } else if (nextLineInput) {
            nextLineInput.focus();
        } else if (firstInput) {
            firstInput.focus();
        }
    }

    const navigatePrev = (i, j) => {
        let prevInput = document.getElementById(i + "-" + (j - 1));
        let prevPrevInput = document.getElementById(i + "-" + (j - 2));
        let prevLineInput = document.getElementById((i - 1) + "-0");
        let lastInput = document.getElementById((encodedNames.length - 1) + "-" + (encodedNames[encodedNames.length - 1].length - 1));
        if (prevInput && !prevInput.disabled) {
            prevInput.focus();
        } else if (prevPrevInput) {
            prevPrevInput.focus();
        } else if (prevLineInput) {
            prevLineInput.focus();
        } else if (lastInput) {
            lastInput.focus();
        }
    }

    const handleGuess = () => {
        const reverseLetterIndices = {};
        Object.keys(letterIndices).forEach((key) => {
            reverseLetterIndices[letterIndices[key]] = key;
        });
        corrects = {};
        for (let key of Object.keys(reverseLetterIndices)) {
            let g = guess[key].toLowerCase();
            let l = reverseLetterIndices[key];
            corrects[key] = (g==l);
        }
        let correctCount = Object.values(corrects).filter(c => c).length;

        if (correctCount == Object.keys(letterIndices).length) {
            const element = document.getElementById("game");
            party.confetti(element);
            toast.fire({
                icon: 'success',
                title: 'You got it right!'
            })
        } else {
            toast.fire({
                icon: 'error',
                title: 'You got it wrong!'
            })
        }

        score = correctCount;

        isWaiting = true;
    }

    const handleAgain = () => {
        isWaiting = false;
        score = 0;
        
        randomiseSeed();
        handleNext();

        bagOfLetters = chosen.join('').split('').map(l => l.toLowerCase()).filter(l => l != " ");
        uniqueLetters = [...new Set(bagOfLetters)].sort((a,b) => randomiser() - 0.5);
        letterIndices = {};
        uniqueLetters.forEach((letter, index) => {
            letterIndices[letter] = index;
        });
        encodedNames = chosen.map(name => {
            return name.split('').map(l => {
                if (l == " ") return -1;
                return letterIndices[l.toLowerCase()];
            });
        });
        guess = {};
    }

    const copyResults = () => {
        let text = `${title}\n`;
        let seedString = seed.toString();
        if (seedString.match(/20\d{2}(11|12|0\d)([0-2]\d|30|31)/)) {
            text += `Daily Challenge on ${seedString.slice(0, 4)}/${seedString.slice(4, 6)}/${seedString.slice(6)}\n`;
        }
        text += `I got ${score}/${Object.keys(letterIndices).length} correct!\n`;
        text += `${window.location.href.split("?")[0]}?seed=${seed}&N=${N}\n`;
        shareResults(text);
    }

    const resetGuess = () => {
        guess = {};
        for (let i = 0; i < bagOfLetters.length; i++) {
            guess[i] = "";
        }
    }
</script>

<div class="flex flex-col gap-6 my-4" id="game">
    {#each encodedNames as name, i}
        <div class="flex flex-wrap gap-2">
            {#each name as letter, j}
                <div class="grid text-center">
                    <input
                        id={i + "-" + j}
                        maxlength="2"
                        bind:value={guess[letter]}
                        on:input={handleInput(letter, i, j)}
                        on:keydown={handleNavigate(i, j)}
                        class="w-8 h-8 text-center text-xl font-mono border-b-2 border-gray-500 dark:bg-gray-700"
                        class:opacity-0={letter == -1}
                        class:text-ew-500={corrects[letter] && isWaiting}
                        class:text-ns-500={(!corrects[letter] && isWaiting) || (clashingNumbers.has(guess[letter]) && !isWaiting)}
                        disabled={letter == -1}/>
                    <span>{!isWaiting ? (letter == -1 ? " " : letter) : (letter == -1 ? " " : chosen[i][j])}</span>
                </div>
            {/each}
        </div>
    {/each}
</div>

<div class="flex gap-2">
    {#if !isWaiting}
    <button on:click={resetGuess} class="bg-cc-300/30 py-1 px-2 rounded-md text-cc-700 dark:text-cc-300 hover:bg-cc-300/50 border-2 border-cc-500/50">Reset</button>
    <button on:click={handleGuess} class="bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50">Guess</button>
    {:else}
    <button on:click={copyResults} class="bg-dt-300/30 py-1 px-2 rounded-md text-dt-700 dark:text-dt-300 hover:bg-dt-300/50 border-2 border-dt-500/50">Share Results</button>
    <button on:click={handleAgain} class="bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50">Play Again</button>
    {/if}
</div>