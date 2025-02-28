<script>
  import GamePage from './GamePage.svelte';
  import StartPage from './StartPage.svelte';
  import seededRandom from '../../common/seededRandom';
  import Swal from 'sweetalert2';
  export let title;
  export let data;
  export let instructions;
  export let key;

  let N = 4;
  let possible_N = [2, 3, 4, 5, 6, 7, 8];
  let options = [];
  let answer = 0;

  let isStart = false;
  let randomiserSeed = Math.floor(Math.random() * 1000000);
  let randomiser = seededRandom(randomiserSeed);
  let encodeSeed = () => {
    return `${N}${randomiserSeed}`;
  }
  let randomiseSeed = () => {
    randomiserSeed = Math.floor(Math.random() * 1000000);
    randomiser = seededRandom(randomiserSeed);
    seed = encodeSeed();
  }
  let seed = encodeSeed();
  let decodeSeed = () => {
    N = parseInt(seed[0]);
    randomiserSeed = parseInt(seed.slice(1));
    randomiser = seededRandom(randomiserSeed);
  }

  function handleNext() {
    // select N random distinct options in the data
    options = [];
    // each chosen option must not have an overlapping biword with any other chosen option
    let biwords = new Set();
    let count = 0;
    for (let i = 0; i < N; i++) {
      let index = Math.floor(randomiser() * data.length);
      while (true) {
        count++;
        // check for overlapping biword
        let newBiwords = getBiwords(data[index][0]);
        let overlap = false;
        for (let biword of newBiwords) {
          if (biwords.has(biword)) {
            overlap = true;
            break;
          }
        }

        if ((!options.includes(data[index]) && (!overlap || count > 100))) {
          for (let biword of newBiwords) {
            biwords.add(biword);
          }
          break;
        }

        index = Math.floor(randomiser() * data.length);
      }
      options.push(data[index]);
    }
    // answer is a random index
    answer = Math.floor(randomiser() * N);
  }

  function getBiwords(text) {
    let words = text.split(' ');
    let biwords = new Set();
    for (let i = 0; i < words.length - 1; i++) {
      biwords.add(words[i] + ' ' + words[i + 1]);
    }
    return biwords;
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

  const copySeed = () => {
      navigator.clipboard.writeText(seed);
      toast.fire({
          icon: 'success',
          text: 'Copied Seed',
      });
  }
</script>

<div class="max-w-3xl mx-auto p-2 my-8 md:my-20">
  <h1 class="text-5xl font-black animate-text bg-gradient-to-r from-ns-500 via-ns-400 to-ns-300 bg-clip-text text-transparent">{title.toUpperCase()}</h1>
  <p class=" my-4">{instructions} <button on:click={copySeed} class="underline hover:opacity-50">Copy the seed</button> and share with your friends!</p>
  {#if !isStart}
    <StartPage bind:N={N} handleNext={handleNext} bind:isStart={isStart} {decodeSeed} {randomiseSeed} bind:seed={seed}/>
  {:else}
    <GamePage {options} bind:randomiser={randomiser} bind:isStart={isStart} {answer} {handleNext} {randomiserSeed} {toast}/>
  {/if}
</div>