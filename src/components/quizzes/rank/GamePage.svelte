<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import Swal from "sweetalert2";
    import seededRandom from "../../common/seededRandom";
    import party from "party-js";

    export const instructions: string = "";
    export let randomiser: () => number;
    export let randomiserSeed: number;
    export let isStart: boolean;
    export let seed: string;
    export let N: number;
    export let field: string;
    export let encodeSeed: () => void;
    export let options: string[];
    export let data: {[field: string]: number};
    export let key: string;
    export let name: string;
    export let date;
    export let title;

    let currentOptionId = 0;
    let guesses: any[] = []
    let score: number = 0;
    let isPlaying: boolean = true;

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
        encodeSeed();
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

        let imgSrc = "";
            if ((score * 5) == 500) {
                imgSrc = "perfect";
            } else if ((score * 5) >= 490) {
                imgSrc = "fuiyoh";
            } else if ((score * 5) >= 480) {
                imgSrc = "very-impressive";
            } else if ((score * 5) >= 460) {
                imgSrc = "pretty-impressive";
            } else if ((score * 5) >= 440) {
                imgSrc = "oh-wow";
            } else if ((score * 5) >= 420) {
                imgSrc = "practice";
            } else if ((score * 5) >= 400) {
                imgSrc = "you-fked-up";
            } else if ((score * 5) >= 370) {
                imgSrc = "where-my-slipper";
            } else if ((score * 5) >= 340) {
                imgSrc = "oh-no";
            } else if ((score * 5) >= 300) {
                imgSrc = "are-you-serious";
            } else if ((score * 5) >= 270) {
                imgSrc = "haiya";
            } else if ((score * 5) >= 240) {
                imgSrc = "sacrilegious";
            } else if ((score * 5) >= 200) {
                imgSrc = "so-weak";
            } else if ((score * 5) >= 170) {
                imgSrc = "lamentable";
            } else if ((score * 5) >= 140) {
                imgSrc = "what-da-hail";
            } else if ((score * 5) >= 100) {
                imgSrc = "emotional-damage";
            } else if ((score * 5) >= 70) {
                imgSrc = "terrible";
            } else if ((score * 5) >= 50) {
                imgSrc = "send-u-to-jesus";
            } else if ((score * 5) >= 30) {
                imgSrc = "low-iq";
            } else if ((score * 5) >= 10) {
                imgSrc = "language-failure";
            } else {
                imgSrc = "failure";
            }
            Swal.fire({
                title: `Your Score: ${Math.round(score)}%`,
                html: `<img src="/img/quizzes/${imgSrc}.gif"/>`,
                color: "#FFF",
                showDenyButton: !!date,
                denyButtonText: "Share Results",
                denyButtonColor: "#BB0",
            }).then((result) => {
                if (result.isDenied) {
                    copyResults();
                }
            });

            const url = `https://script.google.com/macros/s/AKfycbzrruwSggCRGCwUducgQD3YiUFVLp5cKGt3IFcX7z-34QDR4XkceBhpKtQMQByZExRZjQ/exec`;
            await fetch(`${url}?siteUrl=__quizzes__rank__${key}&name=${name}&score=${score}&params=${seed}`);

            if (date) localStorage.setItem(`rank-${key}-${date}`, score.toString());
    }

    const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
    });

    const copyResults = () => {
        let text = `Rank Master: ${title}\n`;
        text += `Daily Challenge on ${date}\n`;
        text += `I scored ${Math.round(score)}%!\n`;
        text += `https://izzhafeez.com/quizzes/rank/${key}/daily-challenge`;
        navigator.clipboard.writeText(text);
        toast.fire({
            icon: 'success',
            text: 'Copied Results',
        });
    }
</script>

<div in:fade={{}}>
    <div class="max-w-4xl mx-auto">
        <!-- current one to rank -->
        {#if isPlaying}
            <div class="my-6">
                <h2 class="text-center font-bold">Next: {options[currentOptionId].split(" [")[0]}</h2>
            </div>
        {:else}
            <div class="my-6 grid">
                <h2 class="text-center font-bold">Score: {Math.round(score)}%</h2>
                <!-- button -->
                <button on:click={endGame} class='bg-ew-500 hover:bg-ew-300 text-white rounded-lg py-2 px-4 mt-4 mx-auto'>Play Again</button>
            </div>
        {/if}

        <!-- there are N empty places to click -->
        <div class="grid max-w-xl gap-4 mx-auto text-center" id="rankings">
            Highest
            {#each Array(N) as _, i}
                <button
                    class:bg-black={!!guesses[i]} class:dark:bg-white={!!guesses[i]}
                    class:text-white={!!guesses[i]} class:dark:text-black={!!guesses[i]}
                    class:border-black={!!guesses[i]} class:dark:border-white={!!guesses[i]}
                    class:hover:bg-gray-500={!guesses[i]}
                    class="rounded-lg py-2 px-4 text-center border-2"
                    on:click={() => handlePlace(i)}
                    disabled={!!guesses[i]}
                >{!!guesses[i] ? `${guesses[i].name.split(" [")[0]} (${guesses[i].value})` : `Rank ${i+1}`}</button>
            {/each}
            Lowest
        </div>
    </div>
</div>