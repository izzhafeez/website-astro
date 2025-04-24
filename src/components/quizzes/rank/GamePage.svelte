<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import Swal from "sweetalert2";
    import seededRandom from "../../common/seededRandom";
    import party from "party-js";
    import showResults from "../../common/showResults";
    import toast from "../../common/toast";

    export const instructions: string = "";
    export let randomiser: () => number;
    export let randomiserSeed: number;
    export let isStart: boolean;
    export let seed: string;
    export let N: number;
    export let field: string;
    export let options: string[];
    export let data: {[field: string]: number};
    export let title;

    let currentOptionId = 0;
    let guesses: any[] = []
    let score: number = 0;
    let isPlaying: boolean = true;

    const COLORS = [
        "bg-ns-800 text-white", "bg-ns-700 text-white", "bg-ns-600 text-white", "bg-ns-500 text-white", "bg-ns-400 text-black", "bg-ns-300 text-black", "bg-ns-200 text-black", "bg-ns-100 text-black",
        "bg-ew-100 text-black", "bg-ew-200 text-black", "bg-ew-300 text-black", "bg-ew-400 text-black", "bg-ew-500 text-white", "bg-ew-600 text-white", "bg-ew-700 text-white", "bg-ew-800 text-white",
    ];

    const handlePlace = (i: number) => {
        guesses[i] = {
            name: options[currentOptionId],
            value: data[options[currentOptionId]][field],
        };
        currentOptionId++;

        if (currentOptionId === N) {
            isPlaying = false;
            evaluate();
        }
    }

    const endGame = () => {
        randomiser = seededRandom(randomiserSeed);
        isStart = false;
        isPlaying = true;
        currentOptionId = 0;
    }

    const evaluate = async () => {
        // count inversions in guesses
        let inversions = 0;
        for (let i = 0; i < N; i++) {
            for (let j = i+1; j < N; j++) {
                if (guesses[i].value < guesses[j].value) {
                    inversions++;
                }
            }
        }

        const totalPossibleInversions = N * (N - 1) / 2;
        score = (1 - (inversions / totalPossibleInversions)) * 100;

        // party
        if (score >= 80) {
            const rankings = document.getElementById("rankings");
            if (rankings) party.confetti(rankings);
        }

        let text = `${title}\n`;
        let seedString = seed.toString();
        if (seedString.match(/20\d{2}(11|12|0\d)([0-2]\d|30|31)/)) {
            text += `Daily Challenge on ${seedString.slice(0, 4)}/${seedString.slice(4, 6)}/${seedString.slice(6)}\n`;
        }
        text += `I scored ${score.toFixed(2)}/100 points!\n`;
        text += `${window.location.href.split("?")[0]}?seed=${seed}&N=${N}&field=${field}\n`;
        showResults(score, 100, null, text);
    }

    const copyResults = () => {
        let text = `${title}\n`;
        let seedString = seed.toString();
        if (seedString.match(/20\d{2}(11|12|0\d)([0-2]\d|30|31)/)) {
            text += `Daily Challenge on ${seedString.slice(0, 4)}/${seedString.slice(4, 6)}/${seedString.slice(6)}\n`;
        }
        text += `I scored ${score.toFixed(2)}/100 points!\n`;
        text += `${window.location.href.split("?")[0]}?seed=${seed}&N=${N}&field=${field}\n`;
        navigator.clipboard.writeText(text);
        toast.fire({
            icon: 'success',
            text: 'Copied Results',
        });
    }

    $: actualOrder = isPlaying ? [] : [...guesses].map(a => a.value).sort();
</script>

<div in:fade={{}}>
    <div class="max-w-4xl mx-auto">
        <!-- current one to rank -->
        {#if isPlaying}
            <div class="my-6">
                <h2 class="text-center font-bold">Next: {options[currentOptionId]?.split(" [")[0]}</h2>
            </div>
        {:else}
            <div class="my-6 grid gap-2">
                <h2 class="text-center font-bold">Score: {Math.round(score)}%</h2>
                <!-- button -->
                <div class="flex gap-2 mx-auto">
                    <button on:click={copyResults} class='bg-cc-300/20 py-1 px-2 rounded-md text-cc-700 dark:text-cc-300 hover:bg-cc-300/50 border-2 border-cc-500/50 my-auto'>Copy Results</button>
                    <button on:click={endGame} class='bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50 my-auto'>Play Again</button>
                </div>
            </div>
        {/if}

        <!-- there are N empty places to click -->
        <div class="grid max-w-xl gap-4 mx-auto text-center" id="rankings">
            Highest
            {#each Array(parseInt(N)) as _, i}
                <button
                    class:bg-black={!!guesses[i] && isPlaying} class:dark:bg-gray-100={!!guesses[i] && isPlaying}
                    class:text-white={!!guesses[i] && isPlaying} class:dark:text-black={!!guesses[i] && isPlaying}
                    class:border-black={!!guesses[i] && isPlaying} class:dark:border-white={!!guesses[i] && isPlaying}
                    class:hover:bg-gray-500={!guesses[i] && isPlaying}
                    class={`rounded-lg py-2 px-4 text-center border-2 ${!isPlaying && COLORS[Math.floor(actualOrder.indexOf(guesses[i]?.value)*16/actualOrder.length)]}`}
                    on:click={() => handlePlace(i)}
                    disabled={!!guesses[i]}
                >{!!guesses[i] ? `${guesses[i].name.split(" [")[0]} (${guesses[i].value})` : `Rank ${i+1}`}</button>
            {/each}
            Lowest
        </div>
    </div>
</div>