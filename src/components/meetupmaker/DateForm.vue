<template>
<form class="max-w-3xl mx-auto p-4" v-on:submit.prevent="handleSubmit">
  <h1 class="my-12 py-2 text-6xl font-extrabold bg-gradient-to-r from-ew-500 to-ew-300 dark:from-ew-500 dark:to-ew-100 text-transparent bg-clip-text">
    {{ meetupName }}
  </h1>
  <div class="flex gap-4 content-center">
    <label for="name" class="text-lg dark:text-white content-center rounded-lg font-bold">Your Name</label>
    <input v-model="name" type="text"
      id="name" name="name" class="p-2 border border-gray-500/50 dark:bg-da-bg rounded-md dark:text-white focus:ring-ew-300 focus:ring-2" required>
  </div>
  <div class="my-4"></div>
  <label for="date" class="text-lg dark:text-white font-bold">What dates are you free?</label>
  <ul class="grid gap-2 my-2 rounded-lg">
    <li v-for="date in dates" :key="date">
      <div class="flex">
        <div class="px-2 py-4 flex content-center justify-between border-[1px] border-ew-500/30 rounded-s-lg dark:text-white w-full">
          <div class="">{{ new Date(date).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) }}</div>
        </div>
        <div class="px-4 grid content-center cursor-pointer" :class="{'bg-ew-500': free[date], 'bg-ns-500': !free[date], 'hover:bg-ew-300': free[date], 'hover:bg-ns-300': !free[date],}" v-on:click="toggleAvailability(date)">
          <img v-if="!free[date]" src="/img/common/cross.svg" class="w-8 invert"/>
          <img v-if="free[date]" src="/img/common/tick.svg" class="w-8 invert"/>
        </div>
        <div class="bg-dt-500 hover:bg-dt-300 cursor-pointer px-4 rounded-e-lg grid content-center" v-on:click="toggleShowParticipants(date)">
          <img src="/img/common/person.svg" class="w-8 invert"/>
        </div>
      </div>
      <div v-if="showParticipants[date]" class="flex gap-2 my-2 items-center">
        Who's free:
        <li v-for="participant in dateParticipants[date]" :key="participant" class="dark:text-white text-sm p-2 bg-dt-500 text-white rounded-lg">
          {{ participant }}
        </li>
      </div>
    </li>
  </ul>
  <button type="submit" v-on:click="handleSubmit" class="w-auto float-right bg-ew-400 hover:bg-ew-300 px-4 py-2 text-white rounded-lg my-8">Submit</button>
</form>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    dates: {
      type: Array,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    meetupName: {
      type: String,
      required: true
    },
    participants: {
      type: Object,
      required: true
    }
  },
  computed: {
    dateParticipants: function() {
      if (!this.participantsData) {
        return {};
      }
      const dateParticipants = {};
      for (let [name, dates] of Object.entries(this.participantsData)) {
        for (let date of dates) {
          if (!dateParticipants[date]) {
            dateParticipants[date] = [];
          }
          dateParticipants[date].push(name);
        }
      }
      return dateParticipants
    }
  },
  data() {
    let storedData = JSON.parse(localStorage.getItem(this.id)) || {};
    return {
      name: storedData.name || '',
      free: storedData.free || {},
      participantsData: this.participants,
      showParticipants: {}
    }
  },
  methods: {
    toggleAvailability(date) {
      if (this.free[date]) {
        this.free[date] = false
      } else {
        this.free[date] = true
      }
    },

    toggleShowParticipants(date) {
      if (this.showParticipants[date]) {
        this.showParticipants[date] = false
      } else {
        this.showParticipants[date] = true
      }
    },

    async handleSubmit() {
      if (!this.name) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please fill in your name!',
        })
        return;
      }

      localStorage.setItem(this.id, JSON.stringify({
        name: this.name,
        free: this.free
      }));

      await axios.post(`${import.meta.env.PUBLIC_MM}/api/dates/${this.id}`, {
        name: this.name,
        free: Object.entries(this.free).filter(f => f[1]).map(f => f[0])
      }).then(response => {
        return response.data;
      }).then(data => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your availability has been recorded!',
        });

        this.participantsData = data.participants;
      });
    }
  },
}
</script>