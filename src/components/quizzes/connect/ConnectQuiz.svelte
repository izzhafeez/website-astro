<script>
  import GamePage from './GamePage.svelte';
  import StartPage from './StartPage.svelte';
  import seededRandom, {shuffle} from '../../common/seededRandom';
  import Swal from 'sweetalert2';

  export let title;
  export let data;
  export let params;
  
  let N = parseInt(params.N) || 4;
  let seed = parseInt(params.seed) || Math.floor(Math.random() * 100000000);
  let randomiser = seededRandom(seed);

  const randomiseSeed = () => {
    seed = Math.floor(Math.random() * 100000000);
  }

  const setTodaySeed = () => {
    // ddmmyyyy
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    seed = yyyy + mm + dd;
    N = 4;
  };

  let isStart = false;
  let answers = {};
  let guesses = 0;
  let tiles = [];
  let canNext = false;
  let tileCounts = {};
  let answered = [];

  function handleNext() {
    randomiser = seededRandom(seed);
    randomiser();

    N = Math.min(N, Object.keys(data).length);

    // select N random keys from data
    let keys = Object.keys(data);
    canNext = false;
    answers = {};
    tileCounts = {};
    tiles = [];
    answered = [];
    // ensure the N keys are distinct
    while (Object.keys(answers).length < N) {
      let randomKey = keys[Math.floor(randomiser() * keys.length)];

      if (answers[randomKey]) {
        continue;
      }

      let tilesData = data[randomKey];

      if (tilesData.length < 4) {
        continue;
      }

      let candidateTiles = [];

      for (let tile of tilesData) {
        if (!tileCounts[tile]) {
          candidateTiles.push(tile);
        }
      }

      if (candidateTiles.length < 4) {
        continue;
      }

      // choose 4 random candidates from the candidate tiles
      let randomTiles = [];
      let indexes = {};
      while (randomTiles.length < 4) {
        let randomIndex = Math.floor(randomiser() * candidateTiles.length);
        if (indexes[randomIndex]) {
          continue;
        }
        indexes[randomIndex] = true;
        let randomTile = candidateTiles[randomIndex];
        randomTiles.push(randomTile);

        if (!tileCounts[randomTile]) {
          tileCounts[randomTile] = 0;
        }

        tileCounts[randomTile] += 1;
      }

      answers[randomKey] = randomTiles;
      tiles = [...tiles, ...randomTiles];
    }

    tiles = shuffle([...tiles], randomiser);

    guesses = N;
    answered = [];

    isStart = true;
  }
</script>

{#if !isStart}
<StartPage bind:N={N} handleNext={handleNext} bind:isStart={isStart} {randomiseSeed} bind:seed={seed} {setTodaySeed} maxN={Object.keys(data).length}/>
{:else}
<GamePage {data} {answers} {tiles} {handleNext}
  bind:guesses={guesses}
  bind:answered={answered}
  bind:tileCounts={tileCounts}
  {title}
  bind:canNext={canNext}
  {seed}
  {randomiseSeed}
  {N}/>
{/if}