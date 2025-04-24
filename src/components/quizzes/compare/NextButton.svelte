<script lang="ts">
  import type { Data } from "./Data";

  export let left: Data;
  export let right: Data;
  export let dataList: Data[];
  export let isGuessing: boolean;
  export let rightPlaceholder: string;
  export let startNumber: number;
  export let showNextButton: boolean;

  async function handleNext() {
    left.quantity = right.quantity
    await changeToTarget(right.name);
  
    while (right.name === left.name) {
      right = dataList[Math.floor(Math.random() * dataList.length)];
    }

    isGuessing = true;
    rightPlaceholder = startNumber.toString();
    showNextButton = false;
  }
  
  async function changeToTarget(name: string) {
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
  
    while (left.name.length > 1) {
      left.name = left.name.slice(0, -1);
      await delay(25);
    }
  
    left.name = name[0];
  
    while (left.name.length < name.length) {
      left.name += name[left.name.length];
      await delay(25);
    }
  }
</script>

<button on:click={handleNext} class='p-4 bg-cc-500 text-white hover:bg-opacity-80 font-bold text-xl'>Next</button>