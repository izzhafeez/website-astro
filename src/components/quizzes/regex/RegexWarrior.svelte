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
    let N = 10;
    let chosenIndices = [];
    let assignments = [];
    let chosen = [];

    const parseSeed = () => {
        // for every 2 characters in seed, convert to number and add to gaps
        let gaps = [];
        assignments = [];
        for (let i = 0; i < seed.length; i += 3) {
            gaps.push(parseInt(seed.slice(i, i + 2), 36));
            assignments.push(seed[i + 2] === '1');
        }
        
        chosenIndices = gaps.reduce((acc, gap, i) => {
            if (i === 0) {
                return [gap];
            }
            return [...acc, acc[i - 1] + gap];
        }, []);
    }

    const encodeSeed = (gaps: numer[]) => {
        seed = '';
        for (let i = 0; i < gaps.length; i++) {
            let gap = gaps[i];
            seed += gap.toString(36).padStart(2, '0');
            if (assignments[i]) {
                seed += '1';
            } else {
                seed += '0';
            }
        }
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