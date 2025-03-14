<script lang="ts">
  import party from 'party-js';
  import { Canvas, Layer } from 'svelte-canvas';
  import seededRandom, {shuffle} from '../../common/seededRandom';
  import { fly, fade } from 'svelte/transition';
  import Swal from 'sweetalert2';

  export let locations: string[];
  export let positions: { lat: number, lng: number }[];
  export let randomiser: () => number;
  export let isStart: boolean;
  export let key: string;
  export let date: string;
  export let title: string;

  let isEnd = false;
  let colorId = 0;
  let score = 0;
  let N = locations.length;
  let correctAnswers = {};
  for (let i = 0; i < N; i++) {
    correctAnswers[locations[i]] = i;
  }
  let showHint = false;

  let colors = ['#00BB45', '#D42E12', '#FA9E0D', "#005EC4", "#9D5B25", '#9900AA', "#005500", "#FF88FF", "#10C8FA", "#C9C9C9", "#748477", "#B9E935"]
  let assignments = {};

  const render = ({ context, width, height }) => {
    for (let i = 0; i < positions.length; i++) {
      const lat = positions[i][0];
      const lng = positions[i][1];
      const y = -(lat * (height * 0.8)) + height*0.9;
      const x = (lng * (width * 0.8)) + width*0.1;
      context.beginPath();
      context.arc(x, y, 5, 0, 2 * Math.PI);
      context.fillStyle = colors[i];
      context.strokeStyle = 'black';
      // context.lineWidth = 4;
      context.stroke();
      context.fill();
    }
  };

  const handleClick = (location: string) => {
    // remove all with colorId
    for (let key in assignments) {
      if (assignments[key] == colorId) {
        delete assignments[key];
      }
    }
    assignments[location] = colorId;
    colorId = (colorId + 1) % N;
  }

  const handleSubmit = () => {
    isEnd = true;
    score = 0;
    for (let key in assignments) {
      if (assignments[key] == correctAnswers[key]) {
        score++;
      }
    }

    if (score == N) {
      const actionButton = document.getElementById('action-button');
      party.confetti(actionButton);
    }
  }

  const handleEnd = () => {
    if (date) localStorage.setItem(`position-${key}-${date}`, score.toString());
    isEnd = false;
    isStart = false;
    assignments = {};
  }

  const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
    });

  const copyResults = () => {
    let text = `Position Puzzle: ${title}\n`;
    text += `Daily Challenge on ${date}\n`;
    text += `I scored ${score}/${N} points!\n`;
    text += `https://izzhafeez.com/quizzes/position/${key}/daily-challenge\n`;
    navigator.clipboard.writeText(text);

    toast.fire({
      icon: 'success',
      title: 'Copied to clipboard'
    });
  }
</script>

<div in:fade={{}}>
  <div class="grid">
    <div class="mx-auto border-2 border-gray-500/50">
      <Canvas width=300 height=300>
        <Layer {render} />
      </Canvas>
    </div>
  </div>
  <div class="grid" id="action-button">
  {#if !isEnd}
    <div class="flex gap-2 mt-2">
      Select to assign: 
      {#each colors.slice(0, N) as color, i}
        <button aria-label="wah" class={`border-2 ${colorId == i ? "border-opacity-100 dark:border-opacity-100" : "border-opacity-0 dark:border-opacity-0"} border-black dark:border-white w-4 h-4 grid bg-[${color}] my-auto`} on:click={() => {colorId = i}}></button>
      {/each}
    </div>
  {:else}
    <div class="flex mx-auto">
      <p class="my-2 text-center">Score: {score}/{N}</p>
    </div>
  {/if}
  </div>
  <div class="grid grid-cols-2 gap-2 my-2">
    {#each shuffle(locations, randomiser) as location, i (location)}
      <button class={`border-2 p-2 grid border-${isEnd ? "["+colors[correctAnswers[location]]+"]" : "gray-500/50"}`} on:click={() => {handleClick(location)}}>
        <div class="flex mx-auto">
          {showHint ? location : location.split(" (")[0]}
          {#if assignments[location] != undefined}
            &nbsp;
            <span class={`bg-[${colors[assignments[location]]}] w-4 h-4 my-auto`}></span>
          {/if}
        </div>
      </button>
    {/each}
  </div>
  <!-- submit -->
  <div class="grid">
    {#if !isEnd}
    <div class="flex mx-auto gap-2">
      {#if locations[0].includes("(")}
        <button class="text-white bg-cc-500 hover:bg-cc-300 rounded-lg py-1 px-2 my-auto mx-auto"
          on:click={() => {showHint = !showHint}}>{showHint ? "Hide" : "Show"} Hint</button>
      {/if}
      <button class="text-white rounded-lg px-2 py-1 mx-auto"
        on:click={handleSubmit}
        disabled={Object.keys(assignments).length < N}
        class:bg-gray-500={Object.keys(assignments).length < N}
        class:bg-ew-500={Object.keys(assignments).length == N}
        class:hover:bg-ew-300={Object.keys(assignments).length == N}>Submit</button>
    </div>
    {:else}
    <div class="flex mx-auto gap-2">
      {#if date}
      <button class="text-white bg-cc-500 hover:bg-cc-300 rounded-lg py-1 px-2 my-auto mx-auto"
        on:click={copyResults}>Copy Results</button>
      {/if}
      <button class="text-white bg-ew-500 hover:bg-ew-300 rounded-lg py-1 px-2 my-auto mx-auto"
        on:click={handleEnd}>Restart</button>
    </div>
    {/if}
  </div>

  <span class="border-[#00BB45] bg-[#00BB45]"></span>
  <span class="border-[#D42E12] bg-[#D42E12]"></span>
  <span class="border-[#9900AA] bg-[#9900AA]"></span>
  <span class="border-[#FA9E0D] bg-[#FA9E0D]"></span>
  <span class="border-[#005EC4] bg-[#005EC4]"></span>
  <span class="border-[#9D5B25] bg-[#9D5B25]"></span>
  <span class="border-[#005500] bg-[#005500]"></span>
  <span class="border-[#B9E935] bg-[#B9E935]"></span>
  <span class="border-[#FF88FF] bg-[#FF88FF]"></span>
  <span class="border-[#10C8FA] bg-[#10C8FA]"></span>
  <span class="border-[#C9C9C9] bg-[#C9C9C9]"></span>
  <span class="border-[#748477] bg-[#748477]"></span>
</div>