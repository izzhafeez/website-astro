<template>
  <form class="max-w-xl sm:mx-auto mx-2" v-on:submit.prevent="validateForm">
    <div class="grid gap-2 my-2">
      <label for="meetupName" class="text-ew-500 dark:text-ew-300 text-xl font-light">MEETUP NAME</label>
      <input v-model="meetupName" type="text" id="meetupName" name="meetupName" class="transition duration-500 bg-white dark:bg-gray-700 border-gray-500/30 rounded-md focus:ring-ew-300 focus:ring-2" required>
    </div>

    <div class="grid gap-2 my-2">
      <label for="hostName" class="text-ew-500 dark:text-ew-300 text-xl font-light">YOUR NAME</label>
      <input v-model="hostName" type="text" id="hostName" name="hostName" class="transition duration-500 bg-white dark:bg-gray-700 border-gray-500/30 rounded-md focus:ring-ew-300 focus:ring-2" required>
    </div>

    <div class="grid gap-2 my-2">
      <label for="password" class="text-ew-500 dark:text-ew-300 text-xl font-light">PASSWORD (OPTIONAL)</label>
      <input v-model="password" type="password" id="password" name="password" class="transition duration-500 bg-white dark:bg-gray-700 border-gray-500/30 rounded-md focus:ring-ew-300 focus:ring-2">
    </div>

    <label for="date" class="text-ew-500 dark:text-ew-300 text-xl font-light">POTENTIAL DATES</label>
    <ul class="grid gap-2 my-2 mb-4">
      <li v-for="(date, index) in dates" :key="date" class="flex">
        <VueDatePicker
          :partial-flow="true"
          :auto-apply="true"
          v-model="dates[index]"
          :enable-time-picker="false"
          :min-date="new Date()"
          :prevent-min-max-navigation="true"
          input-class-name="dark:border-gray-600 rounded-md transition duration-500 bg-white dark:bg-gray-700"
          :format="format"></VueDatePicker>
        <button @click="dates.splice(index, 1)" class="content-center p-2 bg-ns-500 hover:bg-ns-300 rounded-e-md">
          <svg class="w-5 h-5 invert" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </li>
    </ul>
    <button type="button" @click="dates.push(new Date())" class="float-left bg-cc-500 hover:bg-cc-300 px-4 py-2 text-white rounded-lg">Add Date</button>
    <button type="submit" v-on:click="validateForm" class="float-right bg-ew-500 hover:bg-ew-300 px-4 py-2 text-white rounded-lg">Create Meetup</button>
  </form>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import axios from "axios";
import { stringToHash } from "../../utils/string";

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
      Swal.fire({
        title: 'Please wait...',
        didOpen: () => {
          Swal.showLoading()
        }
      });
      await axios.post(`${import.meta.env.PUBLIC_MM}/api/apps/meetupmaker/create`, {
        meetupName: this.meetupName,
        hostName: this.hostName,
        passwordHash: !!this.password ? stringToHash(this.password) : 0,
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