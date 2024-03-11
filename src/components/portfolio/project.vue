<template>
  <p class="text-gray-500">{{ duration }}</p>
  <h2 class="text-ew-500 dark:text-ew-300">{{ title }}</h2>
  <p class="text-gray-500">{{ overview }}</p>
  <img :src="imgPath" class="w-full aspect-[4/3]"/>
</template>

<script setup lang="ts">
defineProps<{
  title: string,
  duration: string,
  imgPath: string,

}>();
</script>