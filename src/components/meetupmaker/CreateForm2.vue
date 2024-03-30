<template>
  <form class="max-w-xl sm:mx-auto mx-2" @submit.prevent="validateForm">
    <label for="date" class="dark:text-white">Date</label>
    <VueDatePicker
      name="date"
      v-model="date"
      :enable-time-picker="false"
      :min-date="new Date()"
      :prevent-min-max-navigation="true"
      input-class-name="dark:bg-da-bg dark:text-white dark:border-gray-600"
      :format="format"></VueDatePicker>
    <div class="my-4"></div>
    <label for="time" class="dark:text-white">Start Time</label>
    <input type="time"
      id="startTime"
      onfocus="this.showPicker()" name="startTime"
      v-model="startTime"
      class="dark:bg-da-bg dark:text-white border-gray-300 w-full rounded-md dark:border-gray-600" required>
    <div class="my-4"></div>
    <label for="time" class="dark:text-white">End Time</label>
    <input type="time"
      id="endTime"
      onfocus="this.showPicker()" name="endTime"
      v-model="endTime"
      class="dark:bg-da-bg dark:text-white border-gray-300 w-full rounded-md dark:border-gray-600" required>
    <button type="submit" class="bg-ew-400 hover:bg-ew-300 text-white py-2 px-4 rounded mt-6 float-right">Create</button>
  </form>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
  components: { VueDatePicker },
  data() {
    return {
      date: new Date(),
      startTime: '',
      endTime: '',
    };
  },
  methods: {
    validateForm() {
      if (!this.startTime || !this.endTime) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please fill in all fields!',
        })
        return;
      }
      if (this.startTime >= this.endTime) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'End time must be greater than start time!',
        })
        return;
      }
      this.$emit('create', {
        date: this.date,
        startTime: this.startTime,
        endTime: this.endTime,
      });
    },
  },
}
</script>

<script setup>
const format = date => {
  const day = date.getDate();
  const monthAsString = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${monthAsString} ${year}`;
}
</script>

<style>
input[type="time"]::-webkit-calendar-picker-indicator{
  filter: invert(50%);
}
</style>