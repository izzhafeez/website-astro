<script>
  import Timer from "../../../components/utils/Timer.svelte";
  import { fullSanitise } from "../../../utils/string";
  import { toAdd, toHideTooltip, toRemove, toShowTooltip } from "./featureStore";
  import { onMount } from "svelte";
  import axios from "axios";
  import Leaderboard from "../Leaderboard.svelte";
  import party from "party-js";

  export let answers;
  export let defaultRegex;
  export let key;

  let name;
  $: fullScore = Object.values(answers).map(a => a.length).reduce((a,b)=>a+b, 0);
  let totalScore = null;
  let score = 0;
  $: time = totalScore * 5;
  let toStop = true;
  const FEATURE_LIMIT = 1000;
  let answeredDict = {};
  let regexInput = defaultRegex;

  onMount(() => {
    handleRegex(null);
  })

  async function handleEnd(_) {
    toStop = true;
    for (let i=0; i<fullScore; i++) {
      toShowTooltip.set(i);
    }

    const truncatedName = !!name ? name.length > 20 ? name.slice(0, 20) : name : '';
    axios.post(`${import.meta.env.PUBLIC_MM}/api/quizzes/map/${key}`, {
      name: truncatedName,
      score: score
    });

    var imgSrc;
    const scorePercentage = score / totalScore;
    if (scorePercentage > 1) {
      imgSrc = "perfect";
    } else if (scorePercentage > 0.95) {
      // var audio = new Audio(`/sound/quizzes/fuiyoh.mp3`);
      // audio.play();
      imgSrc = "fuiyoh";
    } else if (scorePercentage > 0.9) {
      imgSrc = "very-impressive";
    } else if (scorePercentage > 0.85) {
      imgSrc = "pretty-impressive";
    } else if (scorePercentage > 0.8) {
      imgSrc = "oh-wow";
    } else if (scorePercentage > 0.75) {
      imgSrc = "practice";
    } else if (scorePercentage > 0.7) {
      imgSrc = "you-fked-up";
    } else if (scorePercentage > 0.65) {
      imgSrc = "where-my-slipper";
    } else if (scorePercentage > 0.6) {
      // var audio = new Audio(`/sound/quizzes/oh-no.mp3`);
      // audio.play();
      imgSrc = "oh-no";
    } else if (scorePercentage > 0.55) {
      imgSrc = "are-you-serious";
    } else if (scorePercentage > 0.5) {
      // var audio = new Audio(`/sound/quizzes/haiya.mp3`);
      // audio.play();
      imgSrc = "haiya";
    } else if (scorePercentage > 0.45) {
      imgSrc = "sacrilegious";
    } else if (scorePercentage > 0.4) {
      // var audio = new Audio(`/sound/quizzes/so-weak.mp3`);
      // audio.play();
      imgSrc = "so-weak";
    } else if (scorePercentage > 0.35) {
      imgSrc = "lamentable";
    } else if (scorePercentage > 0.3) {
      // var audio = new Audio(`/sound/quizzes/what-da-hail.mp3`);
      // audio.play();
      imgSrc = "what-da-hail";
    } else if (scorePercentage > 0.25) {
      // var audio = new Audio(`/sound/quizzes/emotional-damage.mp3`);
      // audio.play();
      imgSrc = "emotional-damage";
    } else if (scorePercentage > 0.2) {
      imgSrc = "terrible";
    } else if (scorePercentage > 0.15) {
      // var audio = new Audio(`/sound/quizzes/send-u-to-jesus.mp3`);
      // audio.play();
      imgSrc = "send-u-to-jesus";
    } else if (scorePercentage > 0.1) {
      imgSrc = "low-iq";
    } else if (scorePercentage > 0.05) {
      imgSrc = "language-failure";
    } else {
      // var audio = new Audio(`/sound/quizzes/failure.mp3`);
      // audio.play();
      imgSrc = "failure";
    }

    if (score === totalScore) {
      party.confetti(document.querySelector('.h-30'));
    }

    Swal.fire({
      title: `Your Score: ${score}/${totalScore}`,
      html: `<img src="/img/quizzes/${imgSrc}.gif"/>`,
    })
  }

  function handleStart(_) {
    if (totalScore === null) {
      totalScore = 0;
      for (const value of Object.values(answers)) {
        totalScore += value.list.length;
      }
    }
    if (totalScore > FEATURE_LIMIT) {
      Swal.fire({
        title: "There are too many locations in the quiz. Try using a different regex.",
        icon: 'error',
        timer: 2000
      })
      return;
    }
    if (totalScore === 0) {
      Swal.fire({
        title: "You have nothing to guess, LOL",
        icon: 'error',
        timer: 2000
      });
      return;
    };
    score = 0;
    toStop = false;
    for (let i=0; i<fullScore; i++) {
      toHideTooltip.set(i);
    }
    for (const key of Object.keys(answers)) {
      answeredDict[key] = false;
      for (const answer of answers[key]) {
        if (answer.toInclude) toAdd.set(answer.id);
      }
    }
  }

  function handleInput(e) {
    const input = e.target.value;
    const { key } = fullSanitise(input);
    if (!(key in answers) || answeredDict[key]) return;
    var somethingChanged = false;
    for (const answer of answers[key]) {
      if (answer.toInclude) {
        somethingChanged = true;
        score += 1;
        toRemove.set(answer.id);
      }
    }
    if (somethingChanged) {
      answeredDict[key] = true;
      e.target.value = '';
    };
    if (score === totalScore) handleEnd();
  }

  function handleRegex(e) {
    let regex;
    try {
      if (!e) {
        regex = new RegExp(defaultRegex, 'g');
      } else {
        regex = new RegExp(e.target.value, 'g');
        regexInput = e.target.value;
      };
    } catch(_) {
      return;
    }
    totalScore = 0;
    for (const v of Object.values(answers)) {
      for (let i=0; i<v.length; i++) {
        if (v[i].cleanText.match(regex) || v[i].searchTerms.match(regex)) {
          totalScore += 1;
          if (totalScore > FEATURE_LIMIT) continue;
          v[i].toInclude = true;
          toAdd.set(v[i].id);
        } else {
          v[i].toInclude = false;
          toRemove.set(v[i].id);
        }
      }
    }
  }
</script>

<div class='h-30 flex items-center mb-4 mt-2'>
  {#if toStop}
  <div class='p-2'>
    <label for="regex" class="">Your Name (Optional):</label>
    <input name="regex" bind:value={name} class='transition duration-500 bg-white dark:bg-gray-700 border-gray-500/50 border-[1px] rounded-md p-1' placeholder=""/>
    <br/><br/>
    <label for="regex" class="">Regex:</label>
    <input name="regex" on:input={handleRegex} class='transition duration-500 bg-white dark:bg-gray-700 border-gray-500/50 border-[1px] rounded-md p-1' placeholder="" value={regexInput}/>
    <br/><br/>
    <Leaderboard type="map" key={key}/>
    <button on:click={handleStart} class='bg-ew-300/20 py-1 px-2 rounded-md text-ew-500 dark:text-ew-300 hover:bg-ew-300/50'>Start Quiz</button>
  </div>
  {:else}
  <div class='float-left text-center h-20 w-20 place-content-center grid p-2'>
    <Timer countFrom={time} on:timesup={handleEnd} toStop={toStop}/>
  </div>
  <div class='grid h-30 content-between'>
    <b class='text-sm '>Enter Answer Here:</b>
    <input class='border-gray-500/50 border-[1px] rounded-md p-1 dark:bg-gray-700' on:input={handleInput}/>
    <span class='text-sm '>{score}/{totalScore} guessed 
      (<button type='button' class='text-ns-500 hover:text-ns-300 underline cursor-pointer' on:click={handleEnd}>Give Up?</button>)</span>
  </div>
  {/if}
</div>