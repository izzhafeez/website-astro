<script>
  import Timer from "@components/utils/Timer.svelte";
  import { fullSanitise } from "utils/string";
  import { toAdd, toHideTooltip, toRemove, toShowTooltip } from "./featureStore";
  import { onMount } from "svelte";

  export let answers;
  export let defaultRegex;
  $: fullScore = Object.values(answers).map(a => a.list.length).reduce((a,b)=>a+b, 0);
  let totalScore = null;
  let score = 0;
  $: time = totalScore * 4;
  let toStop = true;
  const FEATURE_LIMIT = 1000;

  onMount(() => {
    processRegex(defaultRegex);
  })

  function handleEnd(_) {
    toStop = true;
    for (let i=0; i<fullScore; i++) {
      toShowTooltip.set(i);
    }
    var imgSrc;
    const scorePercentage = score / totalScore;
    if (scorePercentage > 1) {
      imgSrc = "perfect";
    } else if (scorePercentage > 0.95) {
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
      imgSrc = "whre-my-slipper";
    } else if (scorePercentage > 0.6) {
      imgSrc = "oh-no";
    } else if (scorePercentage > 0.55) {
      imgSrc = "are-you-serious";
    } else if (scorePercentage > 0.5) {
      imgSrc = "haiya";
    } else if (scorePercentage > 0.45) {
      imgSrc = "sacrilegious";
    } else if (scorePercentage > 0.4) {
      imgSrc = "so-weak";
    } else if (scorePercentage > 0.35) {
      imgSrc = "lamentable";
    } else if (scorePercentage > 0.3) {
      imgSrc = "what-da-hail";
    } else if (scorePercentage > 0.25) {
      imgSrc = "emotional-damage";
    } else if (scorePercentage > 0.2) {
      imgSrc = "terrible";
    } else if (scorePercentage > 0.15) {
      imgSrc = "send-u-to-jesus";
    } else if (scorePercentage > 0.1) {
      imgSrc = "low-iq";
    } else if (scorePercentage > 0.05) {
      imgSrc = "language-failure";
    } else {
      imgSrc = "failure";
    }
    Swal.fire({
      title: `Your Score: ${score}/${totalScore}`,
      html: `<img src="/img/quiz/${imgSrc}.gif"/>`,
      color: "#FFF"
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
        color: "#FFF",
        timer: 2000
      })
      return;
    }
    if (totalScore === 0) {
      Swal.fire({
        title: "You have nothing to guess, LOL",
        icon: 'error',
        color: "#FFF",
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
      answers[key].isAnswered = false;
      for (let i=0; i<answers[key].toInclude[i]; i++) {
        if (answers[key].toInclude[i]) toAdd.set(answers[key].list[i]);
      }
    }
  }

  function handleInput(e) {
    const input = e.target.value;
    const { key } = fullSanitise(input);
    if (!(key in answers) || answers[key].isAnswered) return;
    var somethingChanged = false;
    for (let i=0; i<answers[key].list.length; i++) {
      if (answers[key].toInclude[i]) {
        somethingChanged = true;
        score += 1;
        toRemove.set(answers[key].list[i]);
      }
    }
    answers[key].isAnswered = true;
    if (somethingChanged) e.target.value = '';
    if (score === totalScore) handleEnd();
  }

  function handleRegexInput(e) {
    var input;
    try {
      input = new RegExp(e.target.value, 'g');
    } catch(_) {
      return;
    }
    processRegex(input);
  }

  function processRegex(regex) {
    totalScore = 0;
    for (const [_, v] of Object.entries(answers)) {
      for (let i=0; i<v.list.length; i++) {
        if (v.cleanText[i].match(regex) || v.searchTerms[i].match(regex)) {
          totalScore += 1;
          if (totalScore > FEATURE_LIMIT) continue;
          v.toInclude[i] = true;
          toAdd.set(v.list[i]);
        } else {
          v.toInclude[i] = false;
          toRemove.set(v.list[i]);
        }
      }
    }
  }
</script>

<div class='h-20 flex items-center mb-4 mt-2'>
  {#if toStop}
  <div class=''>
    <input on:input={handleRegexInput} class='border-lrt-500/50 border-[1px] rounded-md p-1' placeholder="Regex" value={defaultRegex}/>
    <button on:click={handleStart} class='bg-ew-500 py-1 px-2 rounded-md text-white hover:bg-ew-300'>Start Quiz</button>
  </div>
  {:else}
  <div class='float-left text-center h-20 w-20 place-content-center grid p-2'>
    <Timer countFrom={time} on:timesup={handleEnd} toStop={toStop}/>
  </div>
  <div class='grid h-20 content-between'>
    <b class='text-sm text-white'>Enter Answer Here:</b>
    <input class='border-lrt-500/50 border-[1px] rounded-md p-1' on:input={handleInput}/>
    <span class='text-sm text-white'>{score}/{totalScore} guessed 
      (<button type='button' class='text-ns-500 hover:text-ns-300 underline cursor-pointer' on:click={handleEnd}>Give Up?</button>)</span>
  </div>
  {/if}
</div>