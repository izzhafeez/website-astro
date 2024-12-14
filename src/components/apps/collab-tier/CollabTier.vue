<template>
  <div class="my-4 max-w-6xl mx-auto p-2">
    <h1 class="text-6xl font-extrabold bg-gradient-to-b from-ew-300 to-ew-500 text-transparent bg-clip-text my-6">{{ title }}</h1>
    <p class="text-lg">Rate your {{ title }} based on the following metrics:</p>
    <table class="table-auto">
      <tbody>
        <tr v-for="field of fields">
          <td class="text-lg font-bold pe-2">{{ field.title }}</td>
          <td>{{ field.description }} (<span class="cursor-pointer hover:text-ew-500 underline" @click="() => showMore(field)">Learn More</span>)</td>
        </tr>
      </tbody>
    </table>

    <h2 class="text-2xl mt-4">Ratings</h2>
    <!-- Search bar -->
    <div class="flex flex-wrap gap-2 my-6">
      <div class="grid">
        <label for="search_term" class="my-auto">Search Term</label>
        <input type="text" class="border-[1px] border-gray-500 rounded-lg p-2 dark:bg-gray-700" placeholder="Search" v-model="search_term"/>
      </div>

      <div class="grid">
        <label for="field" class="my-auto">Sort by:</label>
        <select class="border-[1px] border-gray-500 rounded-lg p-2 dark:bg-gray-700" v-model="field">
          <option v-for="field of fields" :value="field.title">{{ field.title }}</option>
        </select>
      </div>

      <div class="grid">
        <label for="is_asc" class="my-auto">Order:</label>
        <select class="border-[1px] border-gray-500 rounded-lg p-2 dark:bg-gray-700" v-model="is_asc">
          <option value="true" selected>Ascending</option>
          <option value="false">Descending</option>
        </select>
      </div>
      
      <!-- page, min value=1 -->
      <div class="grid">
        <label for="page" class="my-auto">Page:</label>
        <input type="number" class="border-[1px] border-gray-500 rounded-lg p-2 dark:bg-gray-700 w-12" placeholder="Page" v-model="page" min="1"/>
      </div>
      
      <button class="bg-ew-500 text-white font-bold py-2 px-4 rounded-lg" @click="loadRatings">Search</button>
    </div>
    <div class="grid gap-2 my-2">
      <CollabTierEntry v-for="rating in ratings" :title="this.id" :key="rating.id" :item="rating" :fields="fields.map(field => field.title)"/>
    </div>

    <input type="text" class="border-[1px] border-gray-500 rounded-lg p-2 mt-4 dark:bg-gray-700" placeholder="Enter a new item" v-model="newItem"/>
    <a class="bg-ew-500 text-white font-bold py-2 px-4 rounded-lg mt-4 ms-2" :href="`/apps/collab-tier/${id}/create?item=${newItem}`">Add New Item</a>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import CollabTierEntry from './CollabTierEntry.vue';
const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

export default {
  name: 'CollabTier',
  components: {
    CollabTierEntry
  },
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
  data() {
    return {
      newItem: '',
      field: this.fields[0].title,
      is_asc: true,
      search_term: '',
      page: 1,
      ratings: []
    }
  },
  mounted() {
    // Call loadRatings when the component is mounted
    this.loadRatings();
  },
  methods: {
    showMore(field) {
      Swal.fire({
        title: field.title,
        text: field.full,
        icon: 'info',
        confirmButtonText: 'Close'
      });
    },
    loadRatings() {
      const apiUrl = `${import.meta.env.PUBLIC_MM}/api/rate/many`;
      const data = {
        category: this.id,
        field: this.field,
        is_asc: this.is_asc ? 1 : 0,
        search_term: this.search_term,
        page: this.page
      };
      fetch(apiUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      ).then(response => {
        if (response.ok) {
          return response.json();
        } else {
          toast.fire({
            icon: 'error',
            title: 'An error occurred'
          });
        }
      }).then(data => {
        this.ratings = data;
      }).catch(() => {
        toast.fire({
          icon: 'error',
          title: 'An error occurred'
        });
      });
    },
  }
}
</script>