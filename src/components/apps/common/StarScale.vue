<!-- Star Scale, that can either be interactive or static -->
<!-- out of 5, and can have half stars -->
<template>
  <div class="flex items-center space-x-1">
    <template v-for="i in 5">
      <span v-if="i < value" class="text-white">★</span>
      <span v-else-if="i - 0.5 == value" class="text-gray-500">★</span>
      <span v-else class="text-gray-500">☆</span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'StarScale',
  props: {
    value: {
      type: Number,
      required: true
    }
  }
}
</script>
