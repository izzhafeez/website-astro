<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import Swal from "sweetalert2";
    import seededRandom from "../../common/seededRandom";
    import party from "party-js";

    export let randomiser: () => number;
    export let randomiserSeed: number;
    export let isStart: boolean;
    export let seed: string;
    export let N: number;
    export let field: string;
    export let toGuess: string;
    export let encodeSeed: () => void;
    export let options: string[];
    export let data: {[field: string]: number};

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
</div>