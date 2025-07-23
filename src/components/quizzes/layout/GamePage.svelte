<script lang="ts">
  import { capitalise } from "../../../utils/string";
  import party from 'party-js';
  import { fly, fade } from 'svelte/transition';
  import Swal from 'sweetalert2';
  import toast from "../../common/toast";
  import { Canvas, Layer } from 'svelte-canvas';
  import { shareResults } from "../../common/showResults";
  import convertSub from "../../../data/convert/convertSub";
  import { onMount, tick } from "svelte";

  export let randomData: any[];
  export let randomNames: any[];
  export let randomKey: string;
  export let keys: string[];
  export let title: string;
  export let seed: string;
  export let randomiseSeed: () => void;
  export let handleNext: () => void;
  export let isRotate: boolean;

  let isWaiting = false;
  let guessInput = '';
  let chosen = '';
  let link = '';

  let colors = ['#FF0000', '#FF2222', '#FF4444', "#FF6666", "#FF8888", '#FFAAAA', "#FFBBBB", "#FFCCCC", "#FFDDDD", "#FFFFFF"]

  const render = ({ context, width, height }) => {
    context.font = "12px sans-serif";
    context.textAlign = "center";
    context.textBaseline = "top";

    for (let i = 0; i < randomData.length; i++) {
      const lat = randomData[i][0];
      const lng = randomData[i][1];

      const y = -(lat * (height * 0.8)) + height*0.9;
      const x = (lng * (width * 0.8)) + width*0.1;

      context.beginPath();
      context.arc(x, y, 5, 0, 2 * Math.PI);
      context.fillStyle = colors[i];
      context.strokeStyle = 'black';
      // context.lineWidth = 4;
      context.stroke();
      context.fill();

      const label = (i + 1).toString();
      context.lineWidth = 2;                 // Border thickness
      context.strokeStyle = "black";         // Border color
      context.strokeText(label, x, y + 7);   // Border first
      context.fillStyle = "white";           // Text color
      context.fillText(label, x, y + 7);
    }
  };

  const handleGuess = () => {
    isWaiting = true;
    let isCorrect = chosen == randomKey;
    if (isCorrect) {
      toast.fire({
        icon: 'success',
        title: `Correct!`,
        timer: 2000,
        showConfirmButton: false,
      });
      party.confetti(document.getElementById("canvas"), {
        count: 100,
        size: 1,
      });
    } else {
      toast.fire({
        icon: 'error',
        title: `Incorrect!`,
        timer: 2000,
        showConfirmButton: false,
      });
    }

    link = `${title}\n`;
    let seedString = seed.toString();
    if (seedString.match(/20\d{2}(11|12|0\d)([0-2]\d|30|31)/)) {
        link += `Daily Challenge on ${seedString.slice(0, 4)}/${seedString.slice(4, 6)}/${seedString.slice(6)}\n`;
    }
    link += `I got it ${isCorrect ? "right!" : "wrong :("}\n`;
    link += `${window.location.href.split("?")[0]}?seed=${seed}&isRotate=${isRotate ? "y" : ""}`;
  }

  const share = () => {
    shareResults(link);
  }

  const handleAgain = () => {
    randomiseSeed();
    isWaiting = false;
    chosen = '';
    guessInput = '';
    handleNext();
  }

  $: size = Math.min(Math.max(Math.min(window.innerWidth, window.innerHeight) * 0.7, 300), 600);
  // const size = 1000
</script>

<div class="grid" id="canvas">
  <div class="mx-auto border-2 border-gray-500/50">
    <Canvas width={size} height={size}>
      <Layer {render} />
    </Canvas>
  </div>
</div>

{#if !isWaiting}
<div class="mt-4 grid z-10">
  <label class="text-lg">Search:</label>
  <input type="text" id="search-bar" disabled={isWaiting} bind:value={guessInput} placeholder="Search a Region/Country" class="border-2 border-gray-300/30 dark:bg-gray-700 rounded-md p-2 me-auto"/>
</div>

<div class="my-4 grid z-10">
  <label class="text-lg">Click to Select (type in search bar to show different results):</label>
  <div class="flex flex-wrap gap-2">
  {#each keys.filter(name => convertSub(name).toLowerCase().includes(guessInput.toLowerCase())).slice(0, 20) as name}
    <button class={`p-2 rounded-lg hover:text-white ${chosen == name ? "bg-ew-500" : "bg-ns-500/50 hover:bg-ns-500"}`} on:click={() => {chosen = name}}>{capitalise(convertSub(name))}</button>
  {/each}
  </div>
</div>
{:else}
<div class="my-4 grid">
  <div>Your Guess: {capitalise(convertSub(chosen))}</div>
  <div>Correct Answer: {capitalise(convertSub(randomKey))}</div>
  <div>Cities: {randomNames.map((name, i) => `(${i+1}) ${capitalise(name)}`).join(", ")}</div>
</div>
{/if}

<div class="flex gap-4 flex-wrap">
{#if !isWaiting}
  <button class="bg-cc-500/50 hover:bg-cc-500 p-2 rounded-lg" on:click={handleGuess}>Make Guess</button>
{:else}
  <button class="bg-dt-500/50 hover:bg-dt-500 p-2 rounded-lg" on:click={share}>Share</button>
  <button class="bg-cc-500/50 hover:bg-cc-500 p-2 rounded-lg" on:click={handleAgain}>Play Again</button>
{/if}
</div>