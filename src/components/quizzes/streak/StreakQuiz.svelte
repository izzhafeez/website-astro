<script>
  import InputBox from "./InputBox.svelte";
  export let answerDict;
  export let answerList;
  export let defaultRegex;
  export let key;
</script>

<div class='my-4'>
  <InputBox defaultRegex={defaultRegex} answerDict={answerDict} answerList={answerList} key={key}/>
</div>