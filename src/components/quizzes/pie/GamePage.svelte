<script lang="ts">
  import party from 'party-js';
  import Swal from 'sweetalert2';
  import * as d3 from 'd3';

  export let options: any[];
  export let isStart: boolean;
  export let answer: number;
  export let handleNext: () => void;
  export let toast;

  let isPlaying = true;
  let selectedOption: any = null;

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
    }
  };

  const handleEnd = () => {
    isPlaying = true;
    isStart = false;
  };

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
        class:dark:bg-white={selectedOption == option[0] && isPlaying}
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
  <button
    class="bg-ew-500 hover:bg-ew-300 text-white rounded-lg py-2 px-4 my-4 mx-auto"
    on:click={handleSubmit}
  >Submit</button>
  {:else}
  <div class="flex gap-4">
    <button
      class="bg-ns-500 hover:bg-ns-300 text-white rounded-lg py-2 px-4 my-4 mx-auto"
      on:click={handleEnd}
    >End</button>
    <button
      class="bg-cc-500 hover:bg-cc-300 text-white rounded-lg py-2 px-4 my-4 mx-auto"
      on:click={handleCopyData}
    >See Data</button>
    <button
      class="bg-ew-500 hover:bg-ew-300 text-white rounded-lg py-2 px-4 my-4 mx-auto"
      on:click={gameHandleNext}
    >Next</button>
  </div>
  {/if}
</div>