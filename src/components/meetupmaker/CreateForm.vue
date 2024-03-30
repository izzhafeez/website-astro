<template>
  <form class="max-w-xl sm:mx-auto mx-2" v-on:submit.prevent="validateForm">
    <div class="grid gap-2 my-2">
      <label for="meetupName" class="dark:text-white text-xl font-medium my-auto">Meetup Name</label>
      <input v-model="meetupName" type="text" id="meetupName" name="meetupName" class="dark:bg-da-bg dark:text-white border-gray-500/30 rounded-md focus:ring-ew-300 focus:ring-2" required>
    </div>

    <div class="grid gap-2 my-2">
      <label for="hostName" class="dark:text-white text-xl font-medium my-auto">Your Name</label>
      <input v-model="hostName" type="text" id="hostName" name="hostName" class="dark:bg-da-bg dark:text-white border-gray-500/30 rounded-md focus:ring-ew-300 focus:ring-2" required>
    </div>

    <div class="grid gap-2 my-2">
      <label for="password" class="dark:text-white text-xl font-medium my-auto">Password (optional)</label>
      <input v-model="password" type="password" id="password" name="password" class="dark:bg-da-bg dark:text-white border-gray-500/30 rounded-md focus:ring-ew-300 focus:ring-2">
    </div>

    <label for="date" class="dark:text-white text-xl font-medium">Potential Dates</label>
    <ul class="grid gap-2 my-2 mb-4">
      <li v-for="(date, index) in dates" :key="date" class="flex">
        <VueDatePicker
          v-model="dates[index]"
          :enable-time-picker="false"
          :min-date="new Date()"
          :prevent-min-max-navigation="true"
          input-class-name="dark:bg-da-bg dark:text-white dark:border-gray-600 rounded-none"
          :format="format"></VueDatePicker>
        <button @click="dates.splice(index, 1)" class="content-center p-2 bg-ns-500 hover:bg-ns-400 rounded-e-md">
          <img src="/img/common/trash.svg" class="w-5 invert"/>
        </button>
      </li>
    </ul>
    <button type="button" @click="dates.push(new Date())" class="float-left bg-cc-400 hover:bg-cc-300 px-4 py-2 text-white rounded-lg">Add Date</button>
    <button type="submit" v-on:click="validateForm" class="float-right bg-ew-400 hover:bg-ew-300 px-4 py-2 text-white rounded-lg">Create Meetup</button>
  </form>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import axios from "axios";

export default {
  components: { VueDatePicker },
  data() {
    return {
      dates: [new Date()],
      meetupName: '',
      hostName: '',
      password: ''
    }
  },
  methods: {
    validateForm() {
      if (this.dates.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please add at least one date!',
        })
        return;
      }

      if (this.dates.some(date => !date)) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please fill in all fields!',
        })
        return;
      }
      this.handleSubmit();
    },
    async handleSubmit() {
      await axios.post(`${import.meta.env.PUBLIC_MM}/api/create`, {
        meetupName: this.meetupName,
        hostName: this.hostName,
        passwordHash: this.password.hashCode(),
        dates: this.dates.sort((a, b) => a - b),
      }).then(response => {
        return response.data;
      }).then(data => {
        localStorage.setItem(data.id, JSON.stringify({
          name: this.hostName,
        }));
        window.location.href = `/apps/meetupmaker/meetup/?id=${data.id}`
      });
    },
    format(date) {
      return date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
}
</script>