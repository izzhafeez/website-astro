<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import Swal from 'sweetalert2';
  import seededRandom from "../../common/seededRandom";
  import party from 'party-js';

  export let isStart: boolean;
  export let randomiserSeed: string;
  export let decodeSeed: () => void;
  export let randomiser: () => number;
  export let name: string;
  export let date: string;

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
      rgb[i] = Math.floor(randomiser() * 256);
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
      let colorScore = Math.abs(guessedRgb[i] - rgb[i]) * 2;
      score += colorScore;
    }
    score = 100 - (score / (256 * 3)) * 100;
    score = Math.round(score * 100) / 100;
    return Math.max(score, 0);
  }

  let nextRound = async () => {
    if (roundNumber >= MAX_ROUNDS) {
      if (date) {
        localStorage.setItem(`color-${date}`, totalScore.toString());
      }
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
    let imgSrc: string;
    if (totalScore == 500) {
      imgSrc = "perfect";
    } else if (totalScore >= 490) {
      // var audio = new Audio(`/sound/quizzes/fuiyoh.mp3`);
      // audio.play();
      imgSrc = "fuiyoh";
    } else if (totalScore >= 480) {
      imgSrc = "very-impressive";
    } else if (totalScore >= 460) {
      imgSrc = "pretty-impressive";
    } else if (totalScore >= 440) {
      imgSrc = "oh-wow";
    } else if (totalScore >= 420) {
      imgSrc = "practice";
    } else if (totalScore >= 400) {
      imgSrc = "you-fked-up";
    } else if (totalScore >= 370) {
      imgSrc = "where-my-slipper";
    } else if (totalScore >= 340) {
      // var audio = new Audio(`/sound/quizzes/oh-no.mp3`);
      // audio.play();
      imgSrc = "oh-no";
    } else if (totalScore >= 300) {
      imgSrc = "are-you-serious";
    } else if (totalScore >= 270) {
      // var audio = new Audio(`/sound/quizzes/haiya.mp3`);
      // audio.play();
      imgSrc = "haiya";
    } else if (totalScore >= 240) {
      imgSrc = "sacrilegious";
    } else if (totalScore >= 200) {
      // var audio = new Audio(`/sound/quizzes/so-weak.mp3`);
      // audio.play();
      imgSrc = "so-weak";
    } else if (totalScore >= 170) {
      imgSrc = "lamentable";
    } else if (totalScore >= 140) {
      // var audio = new Audio(`/sound/quizzes/what-da-hail.mp3`);
      // audio.play();
      imgSrc = "what-da-hail";
    } else if (totalScore >= 100) {
      // var audio = new Audio(`/sound/quizzes/emotional-damage.mp3`);
      // audio.play();
      imgSrc = "emotional-damage";
    } else if (totalScore >= 70) {
      imgSrc = "terrible";
    } else if (totalScore >= 50) {
      // var audio = new Audio(`/sound/quizzes/send-u-to-jesus.mp3`);
      // audio.play();
      imgSrc = "send-u-to-jesus";
    } else if (totalScore >= 30) {
      imgSrc = "low-iq";
    } else if (totalScore >= 10) {
      imgSrc = "language-failure";
    } else {
      // var audio = new Audio(`/sound/quizzes/failure.mp3`);
      // audio.play();
      imgSrc = "failure";
    }
    Swal.fire({
      title: `Your Score: ${totalScore}`,
      html: `<img src="/img/quizzes/${imgSrc}.gif"/>`,
      color: "#FFF",
      showDenyButton: !!date,
      denyButtonText: "Share Results",
      denyButtonColor: "#BB0",
    }).then((result) => {
      if (result.isDenied) {
        copyResults();
      }
    });

    isStart = false;
    decodeSeed();
    const url = `https://script.google.com/macros/s/AKfycbzrruwSggCRGCwUducgQD3YiUFVLp5cKGt3IFcX7z-34QDR4XkceBhpKtQMQByZExRZjQ/exec`;
    fetch(`${url}?siteUrl=__quizzes__color__&name=${name}&score=${totalScore}&params=${randomiserSeed}`);
  }

  const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
    });

  const copySeed = () => {
      navigator.clipboard.writeText(randomiserSeed);
      toast.fire({
          icon: 'success',
          text: 'Copied Seed',
      });
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

  const copyResults = () => {
      let text = `ColorGuessr\n`;
      text += `Daily Challenge on ${date}\n`;
      text += `I scored ${totalScore}/500 points! Can you beat me?\n`;
      text += `https://izzhafeez.com/quizzes/color/daily-challenge`;
      navigator.clipboard.writeText(text);
      toast.fire({
          icon: 'success',
          text: 'Copied Results',
      });
  }
</script>

<div class="my-8" in:fade={{}}>
  <div class="max-w-3xl mx-auto">
    <h2 class="text-5xl font-black animate-text bg-gradient-to-r from-ns-500 via-ns-400 to-ns-300 bg-clip-text text-transparent">ROUND {roundNumber}/5</h2>
    <p class="mt-2">Guess the hexcode of the color in RGB format! For example, pure red would be #FF0000. Your score is based on how close your guess is to the actual hexcode.
      {#if !date && !isStart}
        <button on:click={copySeed} class="underline hover:opacity-50">Copy the seed</button> and share with your friends!
      {:else if date}
        Daily Challenge for {date}.
      {/if}
    </p>
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

      <button id="action-button" class="bg-ew-300/20 py-1 px-2 rounded-md text-ew-500 dark:text-ew-300 hover:bg-ew-300/50 my-2" on:click={isGuessing ? submitGuess : nextRound}>{isGuessing ? "Submit" : "Next Round"}</button>
    </div>
  </div>
</div>