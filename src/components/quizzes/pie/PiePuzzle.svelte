<script>
  import GamePage from './GamePage.svelte';
  import StartPage from './StartPage.svelte';
  import Swal from 'sweetalert2';
  export let title;
  export let data;
  export let instructions;
  export let key;

  let N = 4;
  let options = [];
  let answer = 0;

  let isStart = false;

  function handleNext() {
    // select N random distinct options in the data
    options = [];
    // each chosen option must not have an overlapping biword with any other chosen option
    let biwords = new Set();
    let maxPercentages = new Set();
    for (let i = 0; i < Math.min(N, data.length); i++) {
      let index = Math.floor(Math.random() * data.length);
      let count = 0;
      while (true) {
        count++;
        // check for overlapping biword
        let newBiwords = getBiwords(data[index][0]);
        let overlap = false;
        for (let biword of newBiwords) {
          if (biwords.has(biword)) {
            overlap = true;
          }
        }

        let newMaxPercentage = getMaxPercentage(data[index][1]);
        if (maxPercentages.has(newMaxPercentage)) {
          overlap = true;
        } else {
          maxPercentages.add(newMaxPercentage);
        }

        if ((overlap && count <= 100) || options.includes(data[index])) {
          index = Math.floor(Math.random() * data.length);
          continue;
        }

        for (let biword of newBiwords) {
          biwords.add(biword);
        }
        break;
      }
      options.push(data[index]);
    }
    // answer is a random index
    answer = Math.floor(Math.random() * N);
  }

  function getBiwords(text) {
    let words = text.split(' ');
    let biwords = new Set();
    for (let i = 0; i < words.length - 1; i++) {
      biwords.add(words[i] + ' ' + words[i + 1]);
    }
    return biwords;
  }

  function getMaxPercentage(pie) {
    return Math.max(Object.values(pie));
  }

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
</script>

<div class="max-w-3xl mx-auto p-2 my-8 md:my-20">
  <h1 class="text-5xl font-black animate-text bg-gradient-to-r from-ns-500 via-ns-400 to-ns-300 bg-clip-text text-transparent">{title.toUpperCase()}</h1>
  <p class="my-4">{instructions}</p>
  {#if !isStart}
    <StartPage bind:N={N} handleNext={handleNext} bind:isStart={isStart}/>
  {:else}
    <GamePage {options} bind:isStart={isStart} {answer} {handleNext} {toast}/>
  {/if}
</div>