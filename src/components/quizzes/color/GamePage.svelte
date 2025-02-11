<script lang="ts">
  import { fly } from 'svelte/transition';
  import Swal from 'sweetalert2';

  export let isStart: boolean;
  let roundNumber = 0;
  let MAX_ROUNDS = 5;
  let rgb = [0, 0, 0];
  let guess = "";
  let roundScore = 0;
  let totalScore = 0;
  let isGuessing = true;

  let resetGame = () => {
    roundNumber = 0;
    nextRound();
  }

  $: resetGame();

  let generateColor = () => {
    for (let i = 0; i < 3; i++) {
      rgb[i] = Math.floor(Math.random() * 256);
    }
  }

  let isValidHex = (hex: string) => {
    return hex.match(/[A-Fa-f0-9]{6}/);
  }

  let renderColorAsHex = () => {
    return `#${rgb.map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
  }

  let parseHexAsRGB = (hex: string) => {
    return hex.match(/[A-Za-z0-9]{2}/g)?.map((c: string) => parseInt(c, 16));
  }

  let evaluate = () => {
    let guessedRgb = parseHexAsRGB(`${guess}`);
    if (!guessedRgb) {
      return 0;
    }
    isGuessing = false;
    let score = 0;
    for (let i = 0; i < 3; i++) {
      let colorScore = Math.pow(guessedRgb[i] - rgb[i], 2);
      score += colorScore;
    }
    score = Math.pow(score, 0.5);
    score = 100 - (score / (256 * Math.pow(3, 0.5))) * 100;
    score = Math.round(score * 100) / 100;
    return score;
  }

  let nextRound = () => {
    if (roundNumber >= MAX_ROUNDS) {
      endGame();
    } else {
      isGuessing = true;
      roundNumber++;
      generateColor();
      roundScore = 0;
      guess = "";
    }
  }

  let endGame = () => {
    Swal.fire({
      title: 'Game Over',
      text: `You scored ${totalScore} points!`,
      icon: 'success',
      confirmButtonText: 'OK'
    })
    isStart = false;
  }
</script>

<div class="fixed top-0 h-screen w-screen grid content-center justify-center p-8 -z-10" transition:fly={{ y: -200, duration: 500 }}>
  <div class="max-w-3xl mx-auto">
    <h2 class="text-ns-500 font-bold text-3xl mb-2">Round {roundNumber}/5</h2>
    <p class="mt-2">Guess the hexcode of the color in RGB format! For example, pure red would be #FF0000. Your score is based on how close your guess is to the actual hexcode.</p>
    <!--  -->
    <div class="my-4 mx-auto">
      <div class="flex gap-2 my-4">
        <div class="w-40 h-40 rounded-md grid" style="background-color: {`rgb(${rgb.join(',')})`}">
          {#if !isGuessing}
            <div class:text-black="{rgb.reduce((a, b) => a + b, 0) > 384}" class:text-white="{rgb.reduce((a, b) => a + b, 0) <= 384}" class="my-auto mx-auto text-center">
              Answer:<br/>
              {renderColorAsHex()}
            </div>
          {/if}
        </div>
        {#if !isGuessing}
          <div class="w-40 h-40 rounded-md grid" style="background-color: {`rgb(${parseHexAsRGB(guess)?.join(',')})`}">
            <div class:text-black="{(parseHexAsRGB(guess)?.reduce((a, b) => a + b, 0) || 0) > 384}" class:text-white="{(parseHexAsRGB(guess)?.reduce((a, b) => a + b, 0) || 0) <= 384}" class="my-auto mx-auto text-center">
              Your Guess:<br/>
              #{guess.toUpperCase()}
            </div>
          </div>
        {/if}
      </div>
      <p class="">Total Score: {totalScore}</p>
      {#if isGuessing}
        <div class="gap-2">
          <label for="guess" class="my-auto">Your Guess: </label>
          #<input type="text" name="guess" bind:value={guess} class="w-30 h-10 rounded-lg dark:bg-gray-700"/>
        </div>
        <button class="bg-ew-300/20 py-1 px-2 rounded-md text-ew-500 dark:text-ew-300 hover:bg-ew-300/50" on:click={() => {
          if (isValidHex(guess)) {
            roundScore = evaluate();
            totalScore += roundScore;
            totalScore = Math.round(totalScore * 100) / 100;
          } else {
            Swal.fire({
              title: 'Invalid Hexcode',
              text: 'Please enter a valid hexcode in the format #RRGGBB',
              icon: 'error',
              confirmButtonText: 'OK'
            })
          }
        }}>Submit</button>
      {:else}
        <p class="">Round Score: {roundScore}</p>
        <button class="bg-ew-300/20 py-1 px-2 rounded-md text-ew-500 dark:text-ew-300 hover:bg-ew-300/50 my-2" on:click={nextRound}>Next Round</button>
      {/if}
    </div>
  </div>
</div>