<script lang="ts">
  import Swal from "sweetalert2";
  import axios from "axios";
  import party from "party-js";
  import { capitalise } from "../../../utils/string";
  import { fly } from 'svelte/transition';
  import { onMount } from "svelte";

  export let title: string;
  export let fields: string[];
  export let data: any[];
  export let options: string[];
  export let key: string;
  let answer = data[Math.floor(Math.random() * data.length)];
  let streak = 0;
  let bestStreak = 0;
  let name: string;

  onMount(() => {
    bestStreak = parseInt(localStorage.getItem(`binary-${title}`) || '0');
  });

  async function handleAnswer(guess: boolean) {
    Swal.fire({
      title: guess === answer.answer ? "Correct!" : "Incorrect",
      icon: guess === answer.answer ? "success" : "error",
      text: `The food item is ${answer.answer ? 'still edible' : 'spoilt'}. ${answer.reason}`,
    }).then(_ => {
      handleNext();
    });

    if (guess === answer.answer) {
      const inputButtons = document.getElementById("inputButtons");
      if (inputButtons) {
        party.confetti(inputButtons);
      }
      streak++;
      bestStreak = Math.max(streak, bestStreak);
    } else {
      streak = 0;
      localStorage.setItem(`binary-${title}`, bestStreak.toString());
      const truncatedName = !!name ? name.length > 20 ? name.slice(0, 20) : name : '';
      axios.post(`${import.meta.env.PUBLIC_MM}/api/quizzes/binary/${key}`, {
        name: truncatedName,
        score: bestStreak
      });
    }
  }

  function handleNext() {
    let prevAnswerName = answer.name;
    while (prevAnswerName === answer.name) {
      answer = data[Math.floor(Math.random() * data.length)];
    }
  }
</script>

<div class="fixed top-0 h-screen w-screen grid content-center justify-center p-8 -z-10" transition:fly={{ y: -200, duration: 500 }}>
  <p class=""><span class="font-bold">Streak</span>: <span class="text-ew-500">{streak}</span></p>
  <p class=""><span class="font-bold">Best Streak</span>: <span class="text-ew-500">{bestStreak}</span></p>
  <h2 class="text-6xl font-extrabold animate-linear bg-[length:200%_auto] bg-gradient-to-r from-ns-500 to-ns-300  text-transparent bg-clip-text my-2">{answer.name}</h2>
  <ul class="">
    {#each fields as field}
      <li><span class="font-bold">{capitalise(field)}</span>: {answer[field]}</li>
    {/each}
  </ul>
  <div class="flex gap-4 mt-4 w-auto" id="inputButtons">
    <button class="text-left bg-ew-500 hover:bg-ew-300 py-2 px-4 rounded-lg text-white" on:click={() => handleAnswer(true)}>{options[0]}</button>
    <button class="text-left bg-ns-500 hover:bg-ns-300 py-2 px-4 rounded-lg text-white" on:click={() => handleAnswer(false)}>{options[1]}</button>
  </div>
</div>