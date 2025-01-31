<script lang="ts">
  import { fly } from 'svelte/transition';
  import Swal from 'sweetalert2';

  export let isStart: boolean;
  let roundNumber = 0;
  let MAX_ROUNDS = 10;
  let rgb = [0, 0, 0];
  let guessedRgb = "";
  let roundScore = 0;
  let totalScore = 0;

  let resetGame = () => {
    console.log(isStart);
    roundNumber = 0;
    nextRound();
  }

  $: resetGame();

  let generateColor = () => {
    for (let i = 0; i < 3; i++) {
      rgb[i] = Math.floor(Math.random() * 256);
    }
  }

  let isValidHex = (hex) => {
    return hex.match(/[A-Za-z0-9]{6}/);
  }

  let renderColorAsHex = () => {
    return `#${rgb.map(c => c.toString(16).padStart(2, '0')).join('')}`;
  }

  let parseHexAsRGB = (hex) => {
    return hex.match(/[A-Za-z0-9]{2}/g).map(c => parseInt(c, 16));
  }

  let evaluate = () => {
    let score = 0;
    for (let i = 0; i < 3; i++) {
      score += Math.abs(rgb[i] - guessedRgb[i]);
    }
    return score;
  }

  let nextRound = () => {
    if (roundNumber >= MAX_ROUNDS) {
      endGame();
    } else {
      roundNumber++;
      generateColor();
      roundScore = 0;
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
    <h2 class="text-6xl font-extrabold animate-linear bg-[length:200%_auto] bg-gradient-to-r from-ns-500 to-ns-300  text-transparent bg-clip-text my-2">Color Quiz</h2>
    <p class="mt-2">Given a color, guess the hexcode in RGB format. For example, pure red would be #FF0000. Your score is based on how close your guess is to the actual hexcode. You have 10 rounds. Good luck!</p>
    <!--  -->
    <div class="my-4">
      <h3 class="text-ns-500 dark:text-ns-300 font-bold text-xl mb-2">Round {roundNumber}/10</h3>
      <div class="flex gap-2">
        <div class="w-20 h-20 rounded-md" style="background-color: {`rgb(${rgb.join(',')})`}"></div>
        <div class="flex flex-col gap-2">
          <div class="flex">
            <label for="guess" class="my-auto">Your Guess: #</label>
            <input type="text" name="guess" bind:value={guessedRgb} class="w-30 rounded-lg"/>
          </div>
          <button class="bg-ew-300/20 py-1 px-2 rounded-md text-ew-500 dark:text-ew-300 hover:bg-ew-300/50" on:click={() => {
            if (isValidHex(guessedRgb)) {
              roundScore = evaluate();
              totalScore += roundScore;
              nextRound();
            } else {
              Swal.fire({
                title: 'Invalid Hexcode',
                text: 'Please enter a valid hexcode in the format #RRGGBB',
                icon: 'error',
                confirmButtonText: 'OK'
              })
            }
          }}>Submit</button>
        </div>
      </div>
    </div>
  </div>
</div>