<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import Swal from 'sweetalert2';
  import seededRandom from "../../common/seededRandom";
  import party from 'party-js';
  import showResults from "../../common/showResults";

  export let isStart: boolean;
  export let seed;
  export let randomiser: () => number;
  export let randomiseSeed: () => void;

  let roundNumber = 0;
  let MAX_ROUNDS = 5;
  let rgb = [0, 0, 0];
  let guess = "";
  let roundScore = 0;
  let totalScore = 0;
  let isGuessing = true;
  let guesses = [];
  let isOver = false;

  let resetGame = () => {
    roundNumber = 0;
    nextRound();
  }

  $: resetGame();

  let generateColor = () => {
    for (let i = 0; i < 3; i++) {
      rgb[i] = Math.floor(randomiser() * 256);
    }
  }

  let isValidHex = (hex: string) => {
    return hex.match(/[A-Fa-f0-9]{6}/);
  }

  let renderColorAsHex = (given: string) => {
    let hex = given || rgb
    return `#${hex.map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
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
      let colorScore = Math.abs(guessedRgb[i] - rgb[i]) * 2;
      score += colorScore;
    }
    score = 100 - (score / (256 * 3)) * 100;
    score = Math.round(score * 100) / 100;
    guesses.push([[...rgb], [...guessedRgb], score]);
    return Math.max(score, 0);
  }

  let nextRound = async () => {
    if (roundNumber >= MAX_ROUNDS) {
      endGame();
    } else {
      isGuessing = true;
      roundNumber++;
      generateColor();
      roundScore = 0;
      guess = "";
      // focus on the input box after waiting 0.1
      while (true) {
        try {
          await new Promise(r => setTimeout(r, 100));
          const inputBox = document.getElementById('input-box');
          if (!!inputBox) {
            inputBox.focus();
          }
          break;
        } catch (e) {
          await new Promise(r => setTimeout(r, 100));
        }
      }
    }
  }

  let endGame = () => {
    let text = "ColorGuessr\n";
    let seedString = seed.toString();
    if (seedString.match(/20\d{2}(11|12|0\d)([0-2]\d|30|31)/)) {
        text += `Daily Challenge on ${seedString.slice(0, 4)}/${seedString.slice(4, 6)}/${seedString.slice(6)}\n`;
    }
    text += `I scored ${totalScore}/500 points!\n`;
    text += `${window.location.href.split("?")[0]}?seed=${seed}\n`;

    showResults(totalScore, 500, null, text);
    isOver = true;
  }

  let playAgain = () =>{ 
    randomiseSeed();
    isStart = false;
  }

  const submitGuess = () => {
    if (isValidHex(guess)) {
      roundScore = evaluate();
      totalScore += roundScore;
      if (roundScore > 70) {
        const actionButton = document.getElementById('action-button');
        if (!actionButton) {
          return;
        }
        party.confetti(actionButton, {
          count: party.variation.range(25, 50),
          size: party.variation.range(1, 2),
        });
      }
      totalScore = Math.round(totalScore * 100) / 100;
    } else {
      Swal.fire({
        title: 'Invalid Hexcode',
        text: 'Please enter a valid hexcode in the format #RRGGBB',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }

  const handleType = (e: any) => {
    if (e.key === "Enter" && guess.length > 0) {
      submitGuess();
      // focus on the button
      const actionButton = document.getElementById('action-button');
      if (actionButton) {
        actionButton.focus();
      }
    }
  }
</script>

<div class="my-8">
  {#if !isOver}
  <div class="max-w-3xl mx-auto">
    <h2 class="text-3xl font-extrabold text-ns-500">ROUND {roundNumber}/5</h2>
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
          #<input type="text" id="input-box" name="guess" bind:value={guess} on:keyup={handleType} class="w-30 h-10 rounded-lg dark:bg-gray-700"/>
        </div>
      {:else}
        <p class="">Round Score: {roundScore}</p>
      {/if}

      <button id="action-button" class="bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50 my-2" on:click={isGuessing ? submitGuess : nextRound}>{isGuessing ? "Submit" : "Next Round"}</button>
    </div>
  </div>
  {:else}
  <table class="border-gray-500/20 border-2 table-fixed">
    <thead class="bg-ns-500/50 text-white">
        <tr>
            <th class="py-2 px-4 w-1/3">Your Guess</th>
            <th class="py-2 px-4 w-1/3">Actual</th>
            <th class="py-2 px-4 w-1/3">Score</th>
        </tr>
    </thead>
    <tbody>
        {#each guesses as [toGuess, guess, sim], i}
            <tr class="">
                <td class="py-2 px-4 text-center" style="background-color: {`rgb(${guess.join(',')})`}">
                  <div class:text-black="{(guess.reduce((a, b) => a + b, 0) || 0) > 384}" class:text-white="{(guess.reduce((a, b) => a + b, 0) || 0) <= 384}" class="my-auto mx-auto text-center">
                    {renderColorAsHex(guess)}
                  </div>
                </td>
                <td class="py-2 px-4 text-center" style="background-color: {`rgb(${toGuess.join(',')})`}">
                  <div class:text-black="{(toGuess.reduce((a, b) => a + b, 0) || 0) > 384}" class:text-white="{(toGuess.reduce((a, b) => a + b, 0) || 0) <= 384}" class="my-auto mx-auto text-center">
                    {renderColorAsHex(toGuess)}
                  </div>
                </td>
                <td class="py-2 px-4 text-center">{sim}</td>
            </tr>
        {/each}
    </tbody>
  </table>
  <button class="bg-ew-300/30 py-1 px-2 rounded-md text-ew-700 dark:text-ew-300 hover:bg-ew-300/50 border-2 border-ew-500/50 my-2" on:click={playAgain}>Play Again</button>
  {/if}
</div>