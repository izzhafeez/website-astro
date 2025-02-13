<script lang="ts">
    import GamePage from './GamePage.svelte';
    import StartPage from './StartPage.svelte';
    import Swal from 'sweetalert2';
    export let names;
    export let title;
    export let instructions;
    let seed = '';
    let uninputted = false;
    let isStart;
    let options = names;
    let N = 8;
    let chosenIndices = [];
    let assignments = [];
    let chosen = [];

    const parseSeed = () => {
        N = parseInt(seed[0], 36) * 2;
        let firstDigitsBase = parseInt(seed[1], 36);
        let secondDigits = seed.slice(2, N + 2);
        let firstDigitsAsCustomBase = seed.slice(N + 2);
        let firstDigits = parseInt(firstDigitsAsCustomBase, 36).toString(firstDigitsBase).padStart(N, '0').split('');

        assignments = [];
        chosenIndices = [];
        let acc = 0;
        for (let i = 0; i < N; i++) {
            let gap = parseInt(`${firstDigits[i]}${secondDigits[i]}`, 36);
            assignments.push(gap % 2 === 1);
            acc += gap >> 1;
            chosenIndices.push(acc);
        }
    }

    const encodeSeed = (gaps: numer[]) => {
        let firstDigits = '';
        let secondDigits = '';
        for (let i = 0; i < gaps.length; i++) {
            let gap = gaps[i];
            gap *= 2;
            if (assignments[i]) {
                gap += 1;
            }
            let rawGap = gap.toString(36).padStart(2, '0').split('');
            firstDigits += rawGap[0];
            secondDigits += rawGap[1];
        }

        let firstDigitsArray = firstDigits.split('').map(d => parseInt(d, 36));
        let firstDigitsMax = Math.max(...firstDigitsArray);
        let firstDigitsBase = Math.max(firstDigitsMax + 1, 2);
        let firstDigitsAsNewBase = parseInt(firstDigits, firstDigitsBase).toString(36);

        seed = (N/2).toString(36) + firstDigitsBase.toString(36) + secondDigits + firstDigitsAsNewBase;
    }

    function inputSeed() {
        parseSeed();
    }

    function randomiseSeed() {
        let chosen = [];
        while (chosen.length < N) {
            let index = Math.floor(Math.random() * options.length);
            if (!chosen.includes(index)) {
                chosen.push(index);
            }
        }
        chosenIndices = chosen.sort((a, b) => a - b);
        // a random array of true and false, with length of chosenIndices
        assignments = Array(chosenIndices.length).fill(0).map(() => Math.random() > 0.5);
        // gaps is [i] - [i-1] for each i in sortedChosen
        const gaps = chosenIndices.map((_, i) => i === 0 ? chosenIndices[i] : chosenIndices[i] - chosenIndices[i - 1]);
        encodeSeed(gaps);
    }

    function handleStart() {
        if (seed.length === 0) {
            randomiseSeed();
        }

        // try to assign chosen names
        try {
            chosen = chosenIndices.map(i => options[i]);
            isStart = true;
        } catch (e) {
            Swal.fire({
                title: 'Error',
                text: 'Please ensure that the seed is valid and that the number of names is correct.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
    }
</script>

{#if isStart}
    <GamePage bind:isStart={isStart} {title} {instructions} {chosen} {assignments} {seed}/>
{/if}
{#if !isStart}
    <StartPage bind:N={N} {handleStart} {title} {instructions} {randomiseSeed} bind:seed={seed} {inputSeed}/>
{/if}