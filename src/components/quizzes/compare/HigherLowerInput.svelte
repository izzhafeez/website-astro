<script lang="ts">
  import Swal from "sweetalert2";
  import type { Data } from "./Data";
  import axios from "axios";
  import party from "party-js";

  export let left: Data;
  export let right: Data;
  export let streak: number;
  export let bestStreak: number;
  export let isGuessing: boolean;
  export let showNextButton: boolean;
  export let rightPlaceholder: string;
  export let startNumber: number;
  export let decimalPlaces: number;
  export let randomiseSeed: () => void;
  export let seed: string;
  export let oldSeed: string;
  export let oldStreak: number;

  function handleAnswer(isHigher: boolean) {
    const winSelectElement = document.getElementById('hl-label');
    if (isHigher) {
      if (left.quantity <= right.quantity) {
        streak++;
        bestStreak = Math.max(streak, bestStreak);
        if (winSelectElement) party.confetti(winSelectElement);
      } else {
        handleFail();
        streak = 0;
      }
    } else {
      if (left.quantity >= right.quantity) {
        streak++;
        bestStreak = Math.max(streak, bestStreak);
        if (winSelectElement) party.confetti(winSelectElement);
      } else {
        handleFail();
        streak = 0;
      }
    }
    handleCountUp();
  }

  function handleCountUp() {
    isGuessing = false;
    let i = 0;
    const intervalId = setInterval(() => {
      if (Math.abs(parseFloat(rightPlaceholder)) >= Math.abs(right.quantity)) {
        clearInterval(intervalId);
        setTimeout(() => {showNextButton = true;}, 500);
      } else {
        rightPlaceholder = (((i/100) * right.quantity) + ((1-i/100) * startNumber)).toFixed(decimalPlaces);
        i++;
      }
    }, 10);
  }

  async function handleFail() {
    oldSeed = seed;
    oldStreak = streak;
    randomiseSeed();
  }
</script>

<div id="hl-input" class="grid grid-cols-2 divide-x-0 mx-auto shadow-solid-black dark:shadow-none">
  <button on:click={() => handleAnswer(true)} class='p-4 h-20 bg-ew-500 text-white hover:bg-opacity-80 font-bold text-xl'>Higher</button>
  <button on:click={() => handleAnswer(false)} class='p-4 h-20 bg-ns-500 text-white hover:bg-opacity-80 font-bold text-xl'>Lower</button>
</div>