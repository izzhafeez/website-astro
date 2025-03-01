<script lang="ts">
  import party from 'party-js';
  import { Canvas, Layer } from 'svelte-canvas';

  export let locations: string[];
  export let positions: { lat: number, lng: number }[];
  export let randomiser: () => number;
  export let isStart: boolean;

  let isEnd = false;
  let colorId = 0;
  let score = 0;
  let N = locations.length;
  let correctAnswers = {};
  for (let i = 0; i < N; i++) {
    correctAnswers[locations[i]] = i;
  }

  let colors = ['#009645', '#D42E12', '#9900AA', '#FA9E0D', "#005EC4", "#DDDD55", "#0099AA", "#777777"]
  let assignments = {};
  // let colors = ['green', 'red', 'purple', 'orange', 'blue', 'yellow', 'gray', 'pink']

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
    isEnd = false;
    isStart = false;
    assignments = {};
  }
</script>

<div>
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
        <button aria-label="wah" class={`border-4 ${colorId == i ? "border-opacity-100" : "border-opacity-0"} border-black dark:border-white w-4 h-4 grid bg-[${color}] my-auto`} on:click={() => {colorId = i}}></button>
      {/each}
    </div>
  {:else}
    <div class="flex mx-auto">
      <p class="my-2 text-center">Score: {score}/{N}</p>
    </div>
  {/if}
  </div>
  <div class="grid grid-cols-2 gap-2 my-2">
    {#each locations.sort((a, b) => randomiser()-0.5) as location, i (location)}
      <button class={`border-2 p-2 grid border-${isEnd ? "["+colors[correctAnswers[location]]+"]" : "gray-500/50"}`} on:click={() => {handleClick(location)}}>
        <div class="flex mx-auto">
          {location}
          {#if assignments[location] != undefined}
            &nbsp;
            <span class={`bg-[${colors[assignments[location]]}] w-2 h-2 rounded-full my-auto`}></span>
          {/if}
        </div>
      </button>
    {/each}
  </div>
  <!-- submit -->
  <div class="grid">
    {#if !isEnd}
    <button class="text-white rounded-lg py-2 px-4 my-2 mx-auto"
      on:click={handleSubmit}
      disabled={Object.keys(assignments).length < N}
      class:bg-gray-500={Object.keys(assignments).length < N}
      class:bg-ew-500={Object.keys(assignments).length == N}
      class:hover:bg-ew-300={Object.keys(assignments).length == N}>Submit</button>
    {:else}
    <button class="text-white bg-ew-500 hover:bg-ew-300 rounded-lg py-2 px-4 my-2 mx-auto"
      on:click={handleEnd}>Restart</button>
    {/if}
  </div>
  <span class="bg-[#009645] border-[#009645]"></span>
  <span class="bg-[#D42E12] border-[#D42E12]"></span>
  <span class="bg-[#9900AA] border-[#9900AA]"></span>
  <span class="bg-[#FA9E0D] border-[#FA9E0D]"></span>
  <span class="bg-[#005EC4] border-[#005EC4]"></span>
  <span class="bg-[#DDDD55] border-[#DDDD55]"></span>
  <span class="bg-[#0099AA] border-[#0099AA]"></span>
  <span class="bg-[#777777] border-[#777777]"></span>
</div>