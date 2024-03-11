<script>
  import { readable } from 'svelte/store';
  import { createEventDispatcher } from 'svelte';

  // Props
  export let countFrom = 0;
  export let toStop = false;

  const dispatch = createEventDispatcher();

  // Reactive to account for changes in countFrom:
  $: endDate = (function(secs) {
    const e = Date.now() + secs * 1000;
    return new Date(e);
  })(countFrom, toStop);

  const remaining = readable(countFrom, function start(set) {
    const interval = setInterval(() => {
      let r = Math.round((endDate - new Date()) / 1000);
      r = Math.max(r, 0);
      set(r);
      if (r <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return function stop() {
      clearInterval(interval);
    };
  });

  $: mm = Math.floor(($remaining) / 60);
  $: ss = $remaining - mm * 60;

  $: if ($remaining === 0) {
    dispatch('timesup');
  }

  function f(value) {
    if (value < 10) {
      return `0${value}`;
    }
    return value.toString();
  }
</script>

<span class="text-ew-500 text-2xl">
  {f(mm)}:{f(ss)}
</span>