<template>
  <div class="p-3 border-[1px] border-gray-500 rounded-md">
    <a class="text-xl font-extrabold underline hover:text-ew-500 cursor-pointer" :href="`/apps/collab-tier/${title}/create?item=${item.item}`">{{ item.item }}</a>
    <!-- table with columns as field names, and rows being either Community Rating or Your Rating -->
    <div class="grid grid-cols-2 md:grid-cols-4">
      <span v-for="field of fields" class="border-0 text-center w-2 gap-2">{{ `${field[0]}:&nbsp;${item[field].toFixed(2)}` }}</span>
    </div>
  </div>
</template>

<script>
import StarScale from '../common/StarScale.vue';

export default {
  name: 'CollabTierEntry',
  components: {
    StarScale
  },
  props: {
    title: {
      type: String,
      required: true
    },
    item: {
      required: true
    },
    fields: {
      type: Array,
      required: true
    },
  },
}
</script>