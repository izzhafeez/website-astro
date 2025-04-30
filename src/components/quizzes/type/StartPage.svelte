<script lang="ts">
    export let N: number;
    export let handleStart: () => void;
    export let randomiseSeed: () => void;
    export let seed: any;
    export let setTodaySeed: () => void;
    export let lowerCase: boolean;
    export let space: boolean;
    let possible_N = [5, 10, 15, 20, 30, 40, 50, 75, 100];
  </script>
  
  <div>
    <label for="N" class="">Number of Names: </label>
    <div class="flex gap-2 my-2">
      {#each possible_N as n (n)}
      <button on:click={() => {N = n;}} class="border-[1px] border-gray-500/0 hover:border-ns-300 rounded-md px-2 py-1" class:bg-ns-300={N == n} class:text-white={N == n}>{n}</button>
      {/each}
    </div>
    <div class="gap-2 flex my-2">
      <label for="lowerCase" class="my-auto">Lowercase: </label>
      <input type="checkbox" id="lowerCase" bind:checked={lowerCase} class="my-auto transition duration-500 bg-gray-100 dark:bg-gray-700 text-dt-500 rounded-md" />
    </div>
    <div class="gap-2 flex my-2">
      <label for="lowerCase" class="my-auto">Ignore Space: </label>
      <input type="checkbox" id="lowerCase" bind:checked={space} class="my-auto transition duration-500 bg-gray-100 dark:bg-gray-700 text-dt-500 rounded-md" />
    </div>
    <label for="seed" class="">Seed: </label>
    <div class="flex gap-2">
      <input type="text" id="seed" bind:value={seed} class="dark:bg-gray-700 rounded-md px-2 py-1 my-2 w-24" />
      <button on:click={randomiseSeed} class='bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50 my-auto'>Random</button>
      <button on:click={setTodaySeed} class='bg-cc-300/20 py-1 px-2 rounded-md text-cc-700 dark:text-cc-300 hover:bg-cc-300/50 border-2 border-cc-500/50 my-auto'>Daily Seed</button>
    </div>
    <div class="flex py-2 gap-2">
      <button
        class="bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50"
        on:click={handleStart}
      >
        Start Quiz
      </button>
    </div>
  </div>