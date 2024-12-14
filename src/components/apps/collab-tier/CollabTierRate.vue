<template>
  <h2 class="text-6xl text-ew-500 font-extrabold my-4">{{ item }}</h2>
  <p class="text-lg">Rate {{ item }} based on the following metrics:</p>
  <table class="table-auto mb-4">
    <tbody>
      <tr v-for="field of fields">
        <td class="text-lg font-bold pe-2">{{ field.title }}</td>
        <td>{{ field.description }} (<span class="cursor-pointer hover:text-ew-500 underline" @click="() => showMore(field)">Learn More</span>)</td>
      </tr>
    </tbody>
  </table>

  <h2 class="text-3xl text-ew-500 font-extrabold">CURRENT RATINGS</h2>
  <div class="grid gap-2 my-2">
    <div class="flex gap-2">
      <span class="w-24"></span>
      <span class="text-lg w-24 text-center">You</span>
      <span class="text-lg">Community</span>
    </div>
    <div v-for="field of fields" :key="field.title" class="flex gap-2">
      <span class="w-24">{{ field.title }}</span>
      <span class="text-lg w-24 text-center">{{ (ownRatings[field.title] || 0).toFixed(2) }}</span>
      <span class="text-lg w-24 text-center">{{ (communityRatings[field.title] || 0).toFixed(2) }}</span>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'CollabTierRate',
  props: {
    category: {
      required: true
    },
    item: {
      required: true
    },
    fields: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      communityRatings: {},
      ownRatings: {}
    }
  },
  mounted() {
    this.refreshRatings();
    this.getOwnRating();
  },
  methods: {
    refreshRatings() {
      const MM = import.meta.env.PUBLIC_MM;
      const url = `${MM}/api/rate/${this.category.key}/${this.item}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data) this.communityRatings = data;
        });
    },
    getOwnRating() {
      const name = localStorage.getItem('comments-name');
      const MM = import.meta.env.PUBLIC_MM;
      const url = `${MM}/api/comments/${this.category.key}+${this.item}/${name}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data) this.ownRatings = data.data;
        });
    },
    showMore(field) {
      Swal.fire({
        title: field.title,
        text: field.full,
        icon: 'info',
        confirmButtonText: 'Close'
      });
    },
  }
}
</script>