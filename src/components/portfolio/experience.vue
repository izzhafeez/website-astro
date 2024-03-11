<template>
  <p class="text-gray-500">{{ duration }}</p>
  <h2 class="text-ew-500 dark:text-ew-300">{{ title }}</h2>
  <p class="text-gray-500">{{ organisation }}</p>
  <p class="text-gray-500">{{ overview }}</p>
</template>

<script setup lang="ts">
defineProps<{
  title: string,
  organisation: string,
  duration: string,
  overview: string,
  related: string[]
}>();
</script>