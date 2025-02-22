<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import Swal from "sweetalert2";
    import seededRandom from "../../common/seededRandom";
    import party from "party-js";

    export let randomiser: () => number;
    export let randomiserSeed: number;
    export let isStart: boolean;
    export let seed: string;
    export let blurValue: number;
    export let fontSize: number;
    export let toGuess: string;
    export let encodeSeed: () => void;
    export let names: string[];
    
    let score = 0;
    let roundScore = 0;
    let round = 1;
    let maxRounds = 10;
    let guess = "";
    let isWaiting = false;

    function nextRound() {
        round++;
        isWaiting = false;
        if (round > maxRounds) {
            let imgSrc = "";
            if ((score / 2) == 500) {
                imgSrc = "perfect";
                } else if ((score / 2) >= 490) {
                // var audio = new Audio(`/sound/quizzes/fuiyoh.mp3`);
                // audio.play();
                imgSrc = "fuiyoh";
                } else if ((score / 2) >= 480) {
                imgSrc = "very-impressive";
                } else if ((score / 2) >= 460) {
                imgSrc = "pretty-impressive";
                } else if ((score / 2) >= 440) {
                imgSrc = "oh-wow";
                } else if ((score / 2) >= 420) {
                imgSrc = "practice";
                } else if ((score / 2) >= 400) {
                imgSrc = "you-fked-up";
                } else if ((score / 2) >= 370) {
                imgSrc = "where-my-slipper";
                } else if ((score / 2) >= 340) {
                // var audio = new Audio(`/sound/quizzes/oh-no.mp3`);
                // audio.play();
                imgSrc = "oh-no";
                } else if ((score / 2) >= 300) {
                imgSrc = "are-you-serious";
                } else if ((score / 2) >= 270) {
                // var audio = new Audio(`/sound/quizzes/haiya.mp3`);
                // audio.play();
                imgSrc = "haiya";
                } else if ((score / 2) >= 240) {
                imgSrc = "sacrilegious";
                } else if ((score / 2) >= 200) {
                // var audio = new Audio(`/sound/quizzes/so-weak.mp3`);
                // audio.play();
                imgSrc = "so-weak";
                } else if ((score / 2) >= 170) {
                imgSrc = "lamentable";
                } else if ((score / 2) >= 140) {
                // var audio = new Audio(`/sound/quizzes/what-da-hail.mp3`);
                // audio.play();
                imgSrc = "what-da-hail";
                } else if ((score / 2) >= 100) {
                // var audio = new Audio(`/sound/quizzes/emotional-damage.mp3`);
                // audio.play();
                imgSrc = "emotional-damage";
                } else if ((score / 2) >= 70) {
                imgSrc = "terrible";
                } else if ((score / 2) >= 50) {
                // var audio = new Audio(`/sound/quizzes/send-u-to-jesus.mp3`);
                // audio.play();
                imgSrc = "send-u-to-jesus";
                } else if ((score / 2) >= 30) {
                imgSrc = "low-iq";
                } else if ((score / 2) >= 10) {
                imgSrc = "language-failure";
                } else {
                // var audio = new Audio(`/sound/quizzes/failure.mp3`);
                // audio.play();
                imgSrc = "failure";
                }
                Swal.fire({
                    title: `Your Score: ${score}/1000`,
                    html: `<img src="/img/quizzes/${imgSrc}.gif"/>`,
                    color: "#FFF"
                }).then(() => {
                    isStart = false;
                    encodeSeed();
                    randomiser = seededRandom(randomiserSeed);
                })
        } else {
            toGuess = names[Math.floor(randomiser() * names.length)];
            guess = "";
            const guessBox = document.getElementById('guess');
            guessBox.focus();
        }
    }

    function handleGuess() {
        // use Jaccard similarity to compare guess and toGuess
        const guessSet = new Set(guess);
        const toGuessSet = new Set(toGuess);
        const intersection = new Set([...guessSet].filter(x => toGuessSet.has(x)));
        const union = new Set([...guessSet, ...toGuessSet]);
        const similarity = intersection.size / union.size;

        const lengthSimilarity = Math.min(guess.length, toGuess.length) / Math.max(guess.length, toGuess.length);
        let overallSimilarity = Math.round(Math.pow(similarity * lengthSimilarity, 0.5) * 100);
        if (overallSimilarity == 100 && guess != toGuess) {
            overallSimilarity = 95;
        }

        roundScore = overallSimilarity;

        if (roundScore > 70) {
            const winSelectElement = document.getElementById('to-guess');
            party.confetti(winSelectElement);
        }

        score += overallSimilarity;

        isWaiting = true;
    }

    function handleType() {
        // check for enter key press
        if (event.key === "Enter" && guess.length > 0) {
            handleGuess();
            const nextRoundButton = document.getElementById('action-button');
            nextRoundButton.focus();
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
        toast.fire({
            icon: 'success',
            text: 'Copied Seed',
        });
    }
</script>

<div class="top-0 h-screen w-screen grid content-center justify-center p-8 -z-10" in:fly={{ y: 200 }} out:fade>
    <h1 class="text-5xl font-black animate-text bg-gradient-to-r from-ns-500 via-ns-400 to-ns-300 bg-clip-text text-transparent">Round {round}/{maxRounds}</h1>

    <p class="my-4 max-w-3xl">You will be given 10 blurred texts. Try your best to figure out what they say and type your guess below. After submitting, you will be scored based on your accuracy. <button on:click={copySeed} class="underline hover:opacity-50">Copy the seed</button> and share with your friends! Good luck!</p>

    <span class={`dark:text-white p-2 my-4 blur-${isWaiting ? "none" : blurValue.toLowerCase()} text-[${fontSize}px] rounded-md select-none`} id="to-guess">{toGuess}</span>

    <div>
    {#if isWaiting}
        <p class="max-w-3xl">Round Score: {roundScore}</p>
    {/if}
        <p>Total Score: {score}</p>
        <label for="guess" class="">Your Guess: </label>
        <input type="text" id="guess" bind:value={guess} on:keyup={handleType} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2"/>
        <br>
        <button on:click={isWaiting ? nextRound : handleGuess} class='bg-ew-500 hover:bg-ew-300 text-white rounded-lg py-2 px-4 my-4' id="action-button">{isWaiting ? "Next Round" : "Submit"}</button>
    </div>

    <!-- fake -->
    <!-- [20, 30, 40, 60, 80, 120, 160]; -->
    <p class="text-[20px] blur-xs"></p>
    <p class="text-[30px] blur-md"></p>
    <p class="text-[40px] blur-lg"></p>
    <p class="text-[60px] blur-xl"></p>
    <p class="text-[80px] blur-2xl"></p>
    <p class="text-[120px] blur-3xl"></p>
    <p class="text-[160px] blur-none"></p>
    <p class="text-[50px]"></p>
    <p class="text-[60px]"></p>
    <p class="text-[80px]"></p>
</div>