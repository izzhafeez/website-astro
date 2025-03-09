<script lang="ts">
    import seededRandom from '../common/seededRandom';
    import { fade, fly, blur } from 'svelte/transition';

    export let randomiserSeed;
    export let randomiser;
    export let date;
    export let handleStart;
    export let name;

    const START_DATE = new Date('2025-01-01');
    const TODAY = new Date();
    // options are days from START_DATE to today
    const options = [];
    for (let date = new Date(START_DATE); date <= TODAY; date.setDate(date.getDate() + 1)) {
        options.push(new Date(date));
    }

    const parseDate = (newDate) => {
        date = newDate.toDateString();
        const isoString = newDate.toISOString();
        randomiserSeed = parseInt(isoString.slice(0, 4) + isoString.slice(5, 7) + isoString.slice(8, 10));
        randomiser = seededRandom(randomiserSeed);
        handleStart();
    }
</script>

<div in:fade={{}}>
    <h1 class="my-8 mx-auto max-w-3xl text-5xl font-black animate-text bg-gradient-to-r from-ns-500 via-ns-400 to-ns-300 bg-clip-text text-transparent">DAILY CHALLENGE LINKS</h1>

    <!-- options from START_DATE to today -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 max-w-3xl mx-auto my-8">
        {#each options.reverse() as option, i}
            <button on:click={() => parseDate(option)} class="p-2 bg-white dark:bg-black hover:bg-ns-300 dark:hover:bg-ns-300 rounded-md">#{options.length - i} {option.toDateString().slice(4)}</button>
        {/each}
    </div>
</div>