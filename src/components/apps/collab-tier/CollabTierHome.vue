<template>
  <div class="my-4 max-w-6xl mx-auto p-2">
    <h1 class="text-6xl font-extrabold bg-gradient-to-b from-ew-300 to-ew-500 text-transparent bg-clip-text my-6">CollabTier</h1>
    <p class="text-lg">What would you like to rate today?</p>

    <div class="grid my-8 gap-4">
      <CollabTierCategory v-for="category of categories" :title="category.title" :fields="category.fields" :id="category.key"/>
    </div>
  </div>
</template>

<script>
import CollabTierCategory from './CollabTierCategory.vue';
import collabTierCategories from '../../../data/apps/collab-tier/categories.json';

export default {
  name: 'CollabTierHome',
  data() {
    return {
      categories: collabTierCategories
    }
  },
  components: {
    CollabTierCategory
  }
}
</script>