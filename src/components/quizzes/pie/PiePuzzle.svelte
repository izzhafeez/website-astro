<script>
  import GamePage from './GamePage.svelte';
  import StartPage from './StartPage.svelte';
  import Swal from 'sweetalert2';
  import seededRandom from "../../common/seededRandom";

  export let data;
  export let params;
  export let title;

  let seed = parseInt(params.seed) || Math.floor(Math.random() * 100000000);
  let N = parseInt(params.N) || 4;

  let options = [];
  let answer = 0;
  let randomiser = seededRandom(seed);

  let isStart = false;

  const randomiseSeed = () => {
    seed = Math.floor(Math.random() * 100000000);
    randomiser = seededRandom(seed);
  }

  const setTodaySeed = () => {
    // ddmmyyyy
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    seed = yyyy + mm + dd;
  }

  function handleNext() {
    randomiser();

    // select N random distinct options in the data
    options = [];
    // each chosen option must not have an overlapping biword with any other chosen option
    let biwords = new Set();
    let maxPercentages = new Set();
    for (let i = 0; i < Math.min(N, data.length); i++) {
      let index = Math.floor(randomiser() * data.length);
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
          index = Math.floor(randomiser() * data.length);
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

  function getMaxPercentage(pie) {
    return Math.max(Object.values(pie));
  }

  const toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
  });
</script>

<div class="max-w-3xl mx-auto">
  {#if !isStart}
    <StartPage bind:N={N} handleNext={handleNext} bind:isStart={isStart} bind:seed={seed} {randomiseSeed} {setTodaySeed}/>
  {:else}
    <GamePage {options} bind:isStart={isStart} {answer} {handleNext} {toast} {randomiseSeed} {seed} {title}/>
  {/if}
</div>