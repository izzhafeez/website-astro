<template>
  <form class="max-w-3xl mx-auto p-2" v-on:submit.prevent="handleSubmitPreferences">
    <h1 class="mt-12 py-2 text-6xl font-extrabold bg-gradient-to-r from-ew-500 to-ew-300 dark:from-ew-500 dark:to-ew-100 text-transparent bg-clip-text">
      {{ meetupName }}
    </h1>
    <h2 class="dark:text-white my-4">
      <div class="font-light text-xl text-ew-500 dark:text-ew-300">DATE</div> {{ new Date(date).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
            }) }}
    </h2>
    <div class="grid content-center">
      <label for="name" class="content-center rounded-lg font-light text-xl text-ew-500 dark:text-ew-300">YOUR NAME</label>
      <input v-model="name" type="text"
        id="name" name="name" class="max-w-sm p-2 border border-gray-500/50 dark:bg-da-bg rounded-md dark:text-white focus:ring-ew-300 focus:ring-2" required>
    </div>

    <div class="my-4"></div>
    <div class="grid content-center">
      <label for="time" class="text-ew-500 dark:text-ew-300 font-light text-xl">WHAT TIME ARE YOU FREE?</label>
      <input type="time"
        id="startTime"
        onfocus="this.showPicker()" name="startTime"
        v-model="startTime"
        class="dark:bg-da-bg max-w-sm dark:text-white border-gray-300 w-full rounded-md dark:border-gray-600" required>
    </div>

    <!-- selecting start location -->
    <div class="my-4"></div>
    <div class="grid" v-if="startTime">
      <label for="startLocation" class="text-ew-500 dark:text-ew-300 font-light text-xl">WHERE WILL YOU BE AT {{ startTime }}?</label>
      <div class="h-80 w-full">
        <l-map ref="map" v-model:zoom="zoom"
          :center="[1.35, 103.85]" @click="handleStartLocation">
          <l-tile-layer
            url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
          <l-marker :lat-lng="[startLat, startLng]">
            <l-icon icon-url='https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png' :icon-size="[20,30]" :icon-anchor="[10,30]"></l-icon>
            <l-tooltip ref="tooltip">({{ startLat.toFixed(4) }}, {{ startLng.toFixed(4) }})</l-tooltip>
          </l-marker>
        </l-map>
      </div>
    </div>

    <div class="my-4"></div>
    <div class="grid content-center">
      <label for="time" class="text-ew-500 dark:text-ew-300 font-light text-xl">WHAT TIME MUST YOU LEAVE?</label>
      <input type="time"
        id="endTime"
        onfocus="this.showPicker()" name="endTime"
        v-model="endTime"
        class="dark:bg-da-bg max-w-sm dark:text-white border-gray-300 w-full rounded-md dark:border-gray-600" required>
    </div>

    <!-- select end location -->
    <div class="my-4"></div>
    <div class="grid" v-if="endTime">
      <label for="endLocation" class="text-ew-500 dark:text-ew-300 font-light text-xl">WHERE WILL YOU BE AT {{ endTime }}?</label>
      <div class="h-80 w-full">
        <l-map ref="map" v-model:zoom="zoom"
          :center="[1.35, 103.85]" @click="handleEndLocation">
          <l-tile-layer
            url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
          <l-marker :lat-lng="[endLat, endLng]">
            <l-icon icon-url='https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png' :icon-size="[20,30]" :icon-anchor="[10,30]"></l-icon>
            <l-tooltip ref="tooltip">({{ endLat.toFixed(4) }}, {{ endLng.toFixed(4) }})</l-tooltip>
          </l-marker>
        </l-map>
      </div>
    </div>

    <button v-on:click="handleSubmitPreferences" class="bg-ew-500 hover:opacity-50 text-white py-2 px-4 rounded-lg my-4">Submit</button>
  </form>
  <form class="max-w-3xl mx-auto p-2" v-on:submit.prevent="handleGenerateRecommendations">
    <h2 class="text-ew-500 dark:text-ew-300 text-xl font-light">RECOMMENDATIONS</h2>
    <ul class="grid gap-2">
      <li v-for="rec in this.recommendationsData" v-on:click="handleLike(rec)" class="flex gap-2 p-4 border-[1px] border-li-alt dark:border-da-alt hover:border-ew-500 dark:hover:border-ew-300 cursor-pointer">
        <div class="w-20 text-center">
          {{ rec[0] }}
        </div>
        <div>
          {{ rec[1] }}
        </div>
        <div class="ms-auto grid content-center">
          <img src="/img/common/heart.svg" class="w-4 opacity-20" :class="{'opacity-100': selected.has(rec[0]+rec[1])}"/>
        </div>
      </li>
    </ul>
    <button v-on:click="handleGenerateRecommendations" class="bg-ew-500 hover:opacity-50 text-white py-2 px-4 rounded-lg my-4">Generate Recommendations</button>
  </form>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LIcon, LTooltip } from "@vue-leaflet/vue-leaflet";
import axios from "axios";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LTooltip
  },
  props: {
    date: {
      type: String,
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
    },
    recommendations: {
      type: Array,
      required: true
    }
  },
  data() {
    let storedData = JSON.parse(localStorage.getItem(this.id)) || {};
    return {
      name: storedData.name || '',
      password: '',
      startTime: storedData.startTime || '',
      endTime: storedData.endTime || '',
      startLat: storedData.startLat || 1.325,
      startLng: storedData.startLng || 103.825,
      endLat: storedData.endLat || 1.375,
      endLng: storedData.endLng || 103.875,
      zoom: 12,
      recommendationsData: this.recommendations,
      selected: new Set()
    }
  },
  methods: {
    // Add methods here
    handleStartLocation(e) {
      const latlng = e.latlng;
      this.startLat = latlng.lat;
      this.startLng = latlng.lng;
      localStorage.setItem(this.id, JSON.stringify({
        name: this.name,
        password: this.password,
        startTime: this.startTime,
        endTime: this.endTime,
        startLat: this.startLat,
        startLng: this.startLng,
        endLat: this.endLat,
        endLng: this.endLng
      }));
    },

    handleEndLocation(e) {
      const latlng = e.latlng;
      this.endLat = latlng.lat;
      this.endLng = latlng.lng;
      localStorage.setItem(this.id, JSON.stringify({
        name: this.name,
        password: this.password,
        startTime: this.startTime,
        endTime: this.endTime,
        startLat: this.startLat,
        startLng: this.startLng,
        endLat: this.endLat,
        endLng: this.endLng
      }));
    },

    async handleSubmitPreferences() {
      if (!this.name || !this.startTime || !this.endTime || !this.startLat || !this.startLng || !this.endLat || !this.endLng) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please fill in all fields!',
        })
        return;
      }

      // Add submit preferences method here
      await axios.post(`${import.meta.env.PUBLIC_MM}/api/preferences/${this.id}`, {
        name: this.name,
        startTime: this.startTime,
        endTime: this.endTime,
        startLat: this.startLat,
        startLng: this.startLng,
        endLat: this.endLat,
        endLng: this.endLng
      }).then(response => {
        return response.data;
      }).then(data => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Preferences submitted successfully!',
        });
        return data;
      });
    },

    async handleGenerateRecommendations() {
      await axios.post(`${import.meta.env.PUBLIC_MM}/api/recommend/${this.id}`, {
        name: this.name
      }).then(response => {
        return response.data;
      }).then(data => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Recommendations generated successfully!',
        });
        this.recommendationsData = data.recommendations;
      });
    },

    handleLike(recommendation) {
      if (this.selected.has(recommendation[0])) {
        this.selected.delete(recommendation[0]);
      } else {
        this.selected.add(recommendation[0]);
      }
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
input[type="time"]::-webkit-calendar-picker-indicator{
  filter: invert(50%);
}
</style>