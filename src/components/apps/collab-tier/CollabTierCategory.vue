<template>
  <a class="rounded-lg p-4 border-[1px] border-gray-500 hover:border-ew-500 cursor-pointer group" :href="`/apps/collab-tier/${id}`">
    <h2 class="text-4xl font-bold group-hover:text-ew-500">{{ title }}</h2>
    <!-- title on left, description on right -->
    <table class="table-auto">
      <tbody>
        <tr v-for="field of fields">
          <td class="text-lg font-bold pe-2">{{ field.title }}</td>
          <td>{{ field.description }}</td>
        </tr>
      </tbody>
    </table>
  </a>
</template>

<script>
export default {
  name: 'CollabTierCategory',
  props: {
    title: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    fields: {
      type: Array,
      required: true
    },
  },
}
</script>