<template>
<div class="max-w-6xl mx-auto p-2">
  <h1 class="mt-12 py-2 text-6xl font-extrabold bg-gradient-to-r from-ew-500 to-ew-300 dark:from-ew-500 dark:to-ew-100 text-transparent bg-clip-text">
    {{ meetupName }}
  </h1>
  <div class="mt-4 font-light text-xl text-ew-500 dark:text-ew-300">DATE</div> {{ new Date(date).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
            }) }}

  <h2 class="mt-4 font-light text-xl text-ew-500 dark:text-ew-300">
    HOST
  </h2>
  <p>{{ hostName }}</p>

  <h2 class="mt-4 font-light text-xl text-ew-500 dark:text-ew-300">
    TIMING
  </h2>
  <p>{{ timing }}</p>

  <h2 class="mt-4 font-light text-xl text-ew-500 dark:text-ew-300">
    LOCATION
  </h2>
  <p>{{ location.name }}</p>

  <div class="h-80 w-full mt-4">
    <l-map ref="map" v-model:zoom="zoom"
      :center="[location.lat, location.lng]" @click="handleStartLocation">
      <l-tile-layer
        url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <l-marker :lat-lng="[location.lat, location.lng]">
        <l-icon icon-url='https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png' :icon-size="[20,30]" :icon-anchor="[10,30]"></l-icon>
        <l-tooltip ref="tooltip">({{ location.lat.toFixed(4) }}, {{ location.lng.toFixed(4) }})</l-tooltip>
      </l-marker>
    </l-map>
  </div>

  <h2 class="mt-4 font-light text-xl text-ew-500 dark:text-ew-300">
    PARTICIPANTS
  </h2>
  <ul>
    <li v-for="participant in Object.keys(participants)" :key="participant" class="flex items-center gap-2 mt-4">
      <div class="bg-dt-500 text-white rounded-md px-4 py-2">{{ participant }}</div>
    </li>
  </ul>
</div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LIcon, LTooltip } from "@vue-leaflet/vue-leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LTooltip
  },
  props: {
    hostName: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    timing: {
      type: String,
      required: true
    },
    location: {
      type: Object,
      required: true
    },
    meetupName: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    participants: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      zoom: 13
    }
  }
}
</script>