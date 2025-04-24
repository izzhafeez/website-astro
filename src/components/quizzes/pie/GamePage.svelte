<script lang="ts">
  import party from 'party-js';
  import Swal from 'sweetalert2';
  import * as d3 from 'd3';
  import { shareResults } from '../../common/showResults';

  export let options: any[];
  export let isStart: boolean;
  export let answer: number;
  export let handleNext: () => void;
  export let toast;
  export let seed;
  export let randomiseSeed: () => void;
  export let title;

  let oldSeed = null;

  let isPlaying = true;
  let selectedOption: any = null;
  let streak = 0;
  let oldStreak = 0;

  $: rawValues = Object.entries(options[answer][1].pie).map(([k, v]) => ({ name: k, value: v }));
  $: sumValues = rawValues.reduce((acc, cur) => acc + (cur.value as number), 0);
  $: remainingValue = Math.max(100 - sumValues, 0);
  $: values = rawValues.concat(remainingValue > 1 ? [{ name: "Others", value: remainingValue.toFixed(1) }] : []);

  const width = 300;
  const height = 300;
  // let colors = ['green', 'red', 'purple', 'orange', 'blue', 'yellow', 'gray', 'pink']
  $: colourScale = d3.scaleOrdinal()
		.domain((values||[]).map(d => d.name))
		.range(d3.quantize((t: any) => d3.interpolateSpectral(t * 0.8 + 0.1), (values||[]).length).reverse())

  // Create the pie layout and arc generator.
  $: pie = d3.pie()
		// .sort((a: any, b: any) => d3.descending(a.name, b.name))
    .sort((a: any, b: any) => a.name == "Others" ? 1 : -a.value +b.value)
		.value((d: any) => d.value);

  $: arcPath = d3.arc()
		// control the style of the pie slices;
		// try changing the inner radius to 100 to see what happens
		.innerRadius(0)
		.outerRadius(Math.min(width, height) / 2 - 1);

  $: labelRadius = arcPath.outerRadius()() * 0.8;

  $: arcs = pie(values||[]);

  const handleSubmit = () => {
    if (selectedOption === null) {
      Swal.fire({
        title: 'Error',
        text: 'Please select an option',
        icon: 'error',
      });
      return;
    }
    isPlaying = false;

    if (selectedOption === options[answer][0]) {
      const optionsSection = document.getElementById('options-section');
      if (optionsSection) {
        party.confetti(optionsSection);
      }
      streak += 1;
    } else {
      oldStreak = streak;
      streak = 0;
      oldSeed = seed;
      randomiseSeed();
    }
  };

  const handleEnd = () => {
    isPlaying = true;
    isStart = false;
  };

  const share = () => {
    let text = `${title}\n`;
    let seedString = seed.toString();
    if (seedString.match(/20\d{2}(11|12|0\d)([0-2]\d|30|31)/)) {
        text += `Daily Challenge on ${seedString.slice(0, 4)}/${seedString.slice(4, 6)}/${seedString.slice(6)}\n`;
    }
    text += `I got a streak of ${oldStreak}!\n`;
    text += `${window.location.href.split("?")[0]}?seed=${oldSeed}&N=${options.length}\n`;

    shareResults(text);
  }

  const gameHandleNext = () => {
    isPlaying = true;
    selectedOption = null;
    handleNext();
  }

  const handleCopyData = () => {
    // from link
    const link = options[answer][1].link;
    navigator.clipboard.writeText(link);
    toast.fire({
      icon: 'success',
      title: 'Link copied to clipboard',
    });
  }
</script>

<div class="grid">
  <svg
    {width}
    {height}
    viewBox="{-width / 2}, {-height / 2}, {width}, {height}"
    style:max-width="100%"
    style:height="auto"
    class="mx-auto"
  >

    <g class="data">

      <!-- Loop through the data-slices. -->
      {#each arcs as slice}
        
        <!-- Add each pie-slice. -->
        <path 
          d={arcPath(slice)}
          fill={colourScale(slice.data.name)}
          stroke="white"
          />
      {/each}
    </g>
  </svg>
  <!-- legend -->
  <div class="mx-auto grid grid-cols-2 md:grid-cols-3 gap-x-4 my-2">
    {#each values.sort((a, b) => a.name == "Others" ? 1 : (-a.value +b.value)) as value, i}
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded-full" style="background-color: {colourScale(value.name)}"></div>
        <span>{#if !isPlaying || value.name == "Others"}{value.name}{/if} {value.value}%</span>
      </div>
    {/each}
  </div>

  <!-- options -->
  <div class="grid grid-cols-2 gap-4" id="options-section">
    {#each options as option, i}
      <button
        class="rounded-md px-2 py-1"
        class:bg-ew-500={option[0] == options[answer][0] && !isPlaying}
        class:bg-ns-500={selectedOption == option[0] && !isPlaying && option[0] != options[answer][0]}
        class:bg-opacity-50={selectedOption != option[0] && (isPlaying || option[0] != options[answer][0])}
        class:hover:bg-opacity-20={selectedOption != option[0] && isPlaying}
        class:bg-gray-300={selectedOption != option[0] && (isPlaying || option[0] != options[answer][0])}
        class:bg-black={selectedOption == option[0] && isPlaying}
        class:dark:bg-gray-100={selectedOption == option[0] && isPlaying}
        class:text-white={(selectedOption == option[0]) || (selectedOption == option[0] && !isPlaying)}
        class:dark:text-black={selectedOption == option[0] && isPlaying}
        on:click={() => {
          if (!isPlaying) return;
          selectedOption = option[0];
        }}
      >
        {option[0]}
      </button>
    {/each}
  </div>

  <!-- submit button -->
  {#if isPlaying}
  <div class="grid grid-cols-3 gap-4 my-4">
    <button
      class="bg-gray-300/20 py-1 px-2 mx-auto rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-300/50 cursor-default"
    >Seed: {seed}</button>
    <button
      class="bg-gray-300/20 py-1 px-2 mx-auto rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-300/50 cursor-default"
    >Streak: {streak}</button>
    <button
      class="bg-ew-300/20 py-1 px-2 mx-auto rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50"
      on:click={handleSubmit}
    >Submit</button>
  </div>
  {:else}
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 my-4">
    <button
      class="bg-ns-300/20 py-1 px-2 mx-auto rounded-md text-ns-700 dark:text-ns-300 hover:bg-ns-300/50 border-2 border-ns-500/50"
      on:click={handleEnd}
    >End</button>
    <button
      class="bg-cc-300/20 py-1 px-2 mx-auto rounded-md text-cc-700 dark:text-cc-300 hover:bg-cc-300/50 border-2 border-cc-500/50"
      on:click={handleCopyData}
    >See Data</button>
    {#if selectedOption != options[answer][0]}
    <button
      class="bg-dt-300/20 py-1 px-2 mx-auto rounded-md text-dt-700 dark:text-dt-300 hover:bg-dt-300/50 border-2 border-dt-500/50"
      on:click={share}
    >Share ({oldStreak})</button>
    {:else}
    <button
      class="bg-gray-300/20 py-1 px-2 mx-auto rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-300/50 cursor-default"
    >Streak: {streak}</button>
    {/if}
    <button
      class="bg-ew-300/20 py-1 px-2 mx-auto rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50"
      on:click={gameHandleNext}
    >Next</button>
  </div>
  {/if}
</div>