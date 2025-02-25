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
  export let key: string;
  export let name: string;
  export let seed: string;

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
    let imgSrc: string;
    let savedStreak = streak;
    localStorage.setItem(`compare-${key}-streak`, bestStreak.toString());
  
    const truncatedName = !!name ? name.length > 20 ? name.slice(0, 20) : name : '';
    axios.post(`${(import.meta as any).env.PUBLIC_MM}/api/quizzes/compare/${key}`, {
      name: truncatedName,
      score: bestStreak
    });
    const url = `https://script.google.com/macros/s/AKfycbzrruwSggCRGCwUducgQD3YiUFVLp5cKGt3IFcX7z-34QDR4XkceBhpKtQMQByZExRZjQ/exec`;
    await fetch(`${url}?siteUrl=__quizzes__compare__${key}&name=${truncatedName}&score=${bestStreak}&params=${seed}`);
  
    if (streak >= 200) {
      imgSrc = "perfect";
    } else if (streak >= 150) {
      // var audio = new Audio(`/sound/quizzes/fuiyoh.mp3`);
      // audio.play();
      imgSrc = "fuiyoh";
    } else if (streak >= 120) {
      imgSrc = "very-impressive";
    } else if (streak >= 100) {
      imgSrc = "pretty-impressive";
    } else if (streak >= 85) {
      imgSrc = "oh-wow";
    } else if (streak >= 70) {
      imgSrc = "practice";
    } else if (streak >= 60) {
      imgSrc = "you-fked-up";
    } else if (streak >= 50) {
      imgSrc = "where-my-slipper";
    } else if (streak >= 42) {
      // var audio = new Audio(`/sound/quizzes/oh-no.mp3`);
      // audio.play();
      imgSrc = "oh-no";
    } else if (streak >= 36) {
      imgSrc = "are-you-serious";
    } else if (streak >= 30) {
      // var audio = new Audio(`/sound/quizzes/haiya.mp3`);
      // audio.play();
      imgSrc = "haiya";
    } else if (streak >= 25) {
      imgSrc = "sacrilegious";
    } else if (streak >= 20) {
      // var audio = new Audio(`/sound/quizzes/so-weak.mp3`);
      // audio.play();
      imgSrc = "so-weak";
    } else if (streak >= 16) {
      imgSrc = "lamentable";
    } else if (streak >= 13) {
      // var audio = new Audio(`/sound/quizzes/what-da-hail.mp3`);
      // audio.play();
      imgSrc = "what-da-hail";
    } else if (streak >= 10) {
      // var audio = new Audio(`/sound/quizzes/emotional-damage.mp3`);
      // audio.play();
      imgSrc = "emotional-damage";
    } else if (streak >= 7) {
      imgSrc = "terrible";
    } else if (streak >= 5) {
      // var audio = new Audio(`/sound/quizzes/send-u-to-jesus.mp3`);
      // audio.play();
      imgSrc = "send-u-to-jesus";
    } else if (streak >= 3) {
      imgSrc = "low-iq";
    } else if (streak >= 1) {
      imgSrc = "language-failure";
    } else {
      // var audio = new Audio(`/sound/quizzes/failure.mp3`);
      // audio.play();
      imgSrc = "failure";
    }
    setTimeout(
      () => {
        Swal.fire({
          title: `Your Score: ${savedStreak}`,
          html: `<img src="/img/quizzes/${imgSrc}.gif"/>`,
          color: "#FFF"
        });
      },
      1000
    );
  }
</script>

<div id="hl-input" class="grid grid-cols-2 divide-x-0 mx-auto shadow-solid-black dark:shadow-none">
  <button on:click={() => handleAnswer(true)} class='p-4 h-20 bg-ew-500 text-white hover:bg-opacity-80 font-bold text-xl'>Higher</button>
  <button on:click={() => handleAnswer(false)} class='p-4 h-20 bg-ns-500 text-white hover:bg-opacity-80 font-bold text-xl'>Lower</button>
</div>