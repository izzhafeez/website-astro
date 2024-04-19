<template>
<form class="max-w-3xl mx-auto p-4 my-4" v-on:submit.prevent="handleSubmit">
  <h1 class="my-12 py-2 text-6xl font-extrabold bg-gradient-to-b from-ew-300 to-ew-500 text-transparent bg-clip-text">
    {{ meetupName }}
  </h1>
  <div class="flex gap-4 content-center">
    <label for="name" class="my-auto text-ew-500 dark:text-ew-300 text-xl font-light">YOUR NAME</label>
    <input v-model="name" type="text"
      id="name" name="name" class="p-2 border border-gray-500/50 transition duration-500 bg-white dark:bg-gray-700 rounded-md  focus:ring-ew-300 focus:ring-2" required>
  </div>
  <div class="my-4"></div>
  <label for="date" class="text-ew-500 dark:text-ew-300 text-xl font-light">WHAT DATES ARE YOU FREE?</label>
  <ul class="grid gap-2 my-2 rounded-lg">
    <li v-for="date in dates" :key="date">
      <div class="flex">
        <div class="px-2 py-4 flex content-center justify-between border-[1px] border-ew-500/30 rounded-s-lg  w-full">
          <div class="">{{ new Date(date).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) }}</div>
        </div>
        <div class="px-4 grid content-center cursor-pointer rounded-e-lg" :class="{'bg-ew-500': free[date], 'bg-ns-500': !free[date], 'hover:bg-ew-300': free[date], 'hover:bg-ns-300': !free[date],}" v-on:click="toggleAvailability(date)">
          <svg v-if="!free[date]" class="w-8 h-8 invert" fill="#000000" width="800px" height="800px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fill-rule="evenodd"/>
          </svg>
          <svg v-if="free[date]" class="w-8 h-8 invert" width="800px" height="800px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <rect width="16" height="16" id="icon-bound" fill="none" />
            <path d="M0,9.014L1.414,7.6L5.004,11.189L14.593,1.6L16.007,3.014L5.003,14.017L0,9.014Z" />
          </svg>
        </div>
      </div>
    </li>
  </ul>
  <button v-on:click="handleSubmit" class="w-auto bg-ew-500 hover:opacity-70 px-4 py-2 text-white rounded-lg my-2">Confirm Availability</button>
</form>
<form class="max-w-3xl mx-auto p-4 my-4" v-on:submit.prevent="handleConfirm">
  <h2 class="my-4 text-3xl py-2 font-extrabold bg-gradient-to-b from-ew-300 to-ew-500 text-transparent bg-clip-text">
    Finalise Date
  </h2>
  <div class="flex gap-4 content-center" v-if="passwordHash">
    <label for="name" class="my-auto text-ew-500 dark:text-ew-300 text-xl font-light">PASSWORD</label>
    <input v-model="password" type="password"
      id="password" name="password" class="p-2 border border-gray-500/50 transition duration-500 bg-white dark:bg-gray-700 rounded-md  focus:ring-ew-300 focus:ring-2" required>
  </div>
  <div v-if="validPassword">
    <div class="my-4"></div>
    <label for="date" class="text-ew-500 dark:text-ew-300 text-xl font-light">WHEN WOULD YOU LIKE THE FINAL MEETUP TO BE?</label>
    <ul class="grid gap-2 my-2 rounded-lg">
      <li v-for="date in dates" :key="date">
        <div class="flex">
          <div class="px-2 py-4 flex content-center justify-between border-[1px] border-ew-500/30 rounded-s-lg  w-full">
            <div class="">{{ new Date(date).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) }}</div>
          </div>
          <div class="bg-dt-500 hover:opacity-70 cursor-pointer px-4 grid content-center" v-on:click="toggleShowParticipants(date)">
            <svg class="w-8 h-8 invert" height="800px" width="800px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                viewBox="0 0 512 512"  xml:space="preserve">
              <g>
                <path class="st0" d="M256,0C114.613,0,0,114.616,0,255.996C0,397.382,114.613,512,256,512c141.386,0,256-114.617,256-256.004
                  C512,114.616,397.387,0,256,0z M255.996,401.912c-69.247-0.03-118.719-9.438-117.564-18.058
                  c6.291-47.108,44.279-51.638,68.402-70.94c10.832-8.666,16.097-6.5,16.097-20.945c0-5.053,0-14.446,0-23.111
                  c-6.503-7.219-8.867-6.317-14.366-34.663c-11.112,0-10.396-14.446-15.638-27.255c-4.09-9.984-0.988-14.294,2.443-16.165
                  c-1.852-9.87-0.682-43.01,13.532-60.259l-2.242-15.649c0,0,4.47,1.121,15.646-1.122c11.181-2.227,38.004-8.93,53.654,4.477
                  c37.557,5.522,47.53,36.368,40.204,72.326c3.598,1.727,7.178,5.962,2.901,16.392c-5.238,12.809-4.522,27.255-15.634,27.255
                  c-5.496,28.346-7.863,27.444-14.366,34.663c0,8.666,0,18.058,0,23.111c0,14.445,5.261,12.279,16.093,20.945
                  c24.126,19.301,62.111,23.831,68.406,70.94C374.715,392.474,325.246,401.882,255.996,401.912z"/>
              </g>
              </svg>
          </div>
          <div class="px-4 grid content-center cursor-pointer rounded-e-lg" :class="{'bg-ew-500': date === chosenDate, 'bg-ns-500': date !== chosenDate, 'hover:bg-ew-300': date === chosenDate, 'hover:bg-ns-300': date !== chosenDate,}" v-on:click="handleChooseDate(date)">
            <svg v-if="date !== chosenDate" class="w-8 h-8 invert" fill="#000000" width="800px" height="800px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fill-rule="evenodd"/>
            </svg>
            <svg v-if="date === chosenDate" class="w-8 h-8 invert" width="800px" height="800px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <rect width="16" height="16" id="icon-bound" fill="none" />
              <path d="M0,9.014L1.414,7.6L5.004,11.189L14.593,1.6L16.007,3.014L5.003,14.017L0,9.014Z" />
            </svg>
          </div>
        </div>
        <div v-if="showParticipants[date]" class="flex gap-2 my-2 h-8 items-center ">
          <span class="font-medium">Who's free:</span>
          <li v-for="participant in dateParticipants[date]" :key="participant" class=" text-sm p-2 bg-dt-500 text-white rounded-lg">
            {{ participant }}
          </li>
        </div>
      </li>
    </ul>
    <button v-on:click="handleConfirm" class="w-auto bg-ew-500 hover:opacity-70 px-4 py-2 text-white rounded-lg my-2">Finalise Date</button>
  </div>
  <div v-else class="my-4 ">
    You need to enter the correct password to finalise the date.
  </div>
</form>
</template>

<script>
import axios from 'axios';
import { stringToHash } from '../../utils/string';

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
    },
    passwordHash: {
      type: Number,
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
    },
    validPassword: function() {
      return stringToHash(this.password) === this.passwordHash || !this.passwordHash;
    }
  },
  data() {
    let storedData = JSON.parse(localStorage.getItem(this.id)) || {};
    return {
      name: storedData.name || '',
      free: storedData.free || {},
      participantsData: this.participants,
      showParticipants: {},
      password: '',
      chosenDate: ''
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

    handleChooseDate(date) {
      this.chosenDate = date;
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

      Swal.fire({
        title: 'Please wait...',
        didOpen: () => {
          Swal.showLoading()
        }
      });
      await axios.post(`${import.meta.env.PUBLIC_MM}/api/apps/meetupmaker/dates/${this.id}`, {
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
    },

    async handleConfirm() {
      if (!this.chosenDate) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please choose a date!',
        })
        return;
      }
      
      Swal.fire({
        title: 'Please wait...',
        didOpen: () => {
          Swal.showLoading()
        }
      });
      await axios.post(`${import.meta.env.PUBLIC_MM}/api/apps/meetupmaker/confirm_date/${this.id}`, {
        date: this.chosenDate
      }).then(_ => {
        window.location.href = `/apps/meetupmaker/meetup/?id=${this.id}`
      });
    }
  },
}
</script>