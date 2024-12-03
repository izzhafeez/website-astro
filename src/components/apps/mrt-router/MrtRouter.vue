<template>
  <div class="my-4 max-w-6xl mx-auto p-2">
    <h1 class="text-6xl font-extrabold bg-gradient-to-b from-ew-300 to-ew-500 text-transparent bg-clip-text my-6">MRT Router</h1>
    <p class="text-lg">An MRT network simulator, allowing for customisation of parameters.</p>
  </div>
  <!-- select start and end stations -->
  <div class="flex flex-wrap gap-4 max-w-6xl mx-auto px-2">
    <div class="flex flex-col gap-2">
      <label for="start" class="text-lg">Start Station</label>
      <select v-model="start" id="start" class="p-2 rounded-md dark:bg-gray-800">
        <option v-for="platform in platforms" :value="platform.name">{{ platform.name }} ({{ platform.label }})</option>
      </select>
    </div>
    <div class="flex flex-col gap-2">
      <label for="end" class="text-lg">End Station</label>
      <select v-model="end" id="end" class="p-2 rounded-md dark:bg-gray-800">
        <option v-for="platform in platforms" :value="platform.name">{{ platform.name }} ({{ platform.label }})</option>
      </select>
    </div>
    <!-- year as input from 1960 to 2040 -->
    <div class="flex flex-col gap-2">
      <label for="year" class="text-lg">Year</label>
      <input v-model="year" id="year" type="number" min="1960" max="2040" class="p-2 rounded-md dark:bg-gray-800">
    </div>
    <!-- speed as input from 5 to 200 -->
    <div class="flex flex-col gap-2">
      <label for="speed" class="text-lg">Speed (km/h)</label>
      <input v-model="speed" id="speed" type="number" min="5" max="200" class="p-2 rounded-md dark:bg-gray-800">
    </div>
    <!-- waiting time at station -->
    <div class="flex flex-col gap-2">
      <label for="waiting" class="text-lg">Waiting Time (min)</label>
      <input v-model="waiting" id="waiting" type="number" min="0" class="p-2 rounded-md dark:bg-gray-800">
    </div>
    <!-- time to interchange -->
    <div class="flex flex-col gap-2">
      <label for="interchange" class="text-lg">Interchange Time (min)</label>
      <input v-model="interchange" id="interchange" type="number" min="0" class="p-2 rounded-md dark:bg-gray-800">
    </div>
  </div>
  <div class="flex gap-4 max-w-6xl mx-auto px-2 my-4">
    <button @click="() => dijkstra(this.labelMappings[start][0], this.labelMappings[end][0])" class="p-2 bg-gray-500/30 hover:bg-gray-500/40 rounded-md my-auto">Find Route</button>
    <!-- show all lines -->
    <button @click="showAllLines" class="p-2 bg-gray-500/30 hover:bg-gray-500/40 rounded-md my-auto">Show All Lines</button>
  </div>
  <div class="h-80 w-full mt-4">
    <l-map ref="map" v-model:zoom="zoom"
      :center="[1.35, 103.85]" class="z-20">
      <l-tile-layer
        url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <l-polyline v-for="(line, index) in visibleLines" :key="index" :lat-lngs="line.path.map(point => [point[1], point[0]])" :color="line.color"></l-polyline>
    </l-map>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LIcon, LTooltip, LPolyline } from "@vue-leaflet/vue-leaflet";
import Swal from "sweetalert2";
import connectionsData from "../../../data/apps/mrt-router/mrt-connections-info.json";
import yearsData from "../../../data/apps/mrt-router/mrt-connections-years.json";
import linesData from "../../../data/apps/mrt-router/mrt-lines-clean.json";
import platformsData from "../../../data/apps/mrt-router/mrt-platform-list.json";

const COLOR_MAPPINGS = {
  EW: '#009645', CG: '#009645',
  NS: '#D42E12',
  NE: '#9900AA',
  CC: '#FA9E0D', CE: '#FA9E0D',
  DT: '#005EC4',
  TE: '#9D5B25',
  JR: '#0099AA', JS: '#0099AA', JE: '#0099AA', JW: '#0099AA',
  CR: '#97C616', CP: '#97C616',
  BP: '#748477', PE: '#748477', SE: '#748477', SW: '#748477', PW: '#748477',
}

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LTooltip,
    LPolyline
  },
  data() {
    return {
      zoom: 12,
      year: 2024,
      speed: 50,
      waiting: 1,
      interchange: 5,
      start: 'Tampines',
      end: 'Woodlands',
      labelMappings: this.getLabelMappings(),
      platforms: platformsData.sort((a,b) => a.name.localeCompare(b.name)),
      path: [],
      visibleLines: [],
    };
  },
  computed: {
    linesAsDict() {
      return this.getLinesAsDict();
    },
    transitions() {
      console.log(this.labelMappings);
      const transitions = {};
      Object.values(this.labelMappings).forEach(platforms => {
        if (platforms.length == 1) return;
        // for every pair of platforms, add an epsilon transition
        for (let i = 0; i < platforms.length; i++) {
          for (let j = i+1; j < platforms.length; j++) {
            if (!transitions[platforms[i]]) transitions[platforms[i]] = [];
            if (!transitions[platforms[j]]) transitions[platforms[j]] = [];
            transitions[platforms[i]].push({name: platforms[j], length: this.interchange});
            transitions[platforms[j]].push({name: platforms[i], length: this.interchange});
          }
        }
      });
      yearsData[this.year-1960].connections.forEach(connectionId => {
        const connection = connectionsData[connectionId];
        const start = connection.start_name;
        const end = connection.end_name;
        if (!transitions[start]) transitions[start] = [];
        if (!transitions[end]) transitions[end] = [];
        const path = this.linesAsDict[connection.line].path.slice(connection.start_id, connection.end_id+1);
        var pathLength = 0;
        for (let i = 0; i < path.length-1; i++) {
          const [lat1, lon1] = path[i];
          const [lat2, lon2] = path[i+1];
          pathLength += 111.33*Math.sqrt((lat2-lat1)**2 + (lon2-lon1)**2);
        }
        const timeTaken = (pathLength/this.speed) * 60 + this.waiting;
        transitions[start].push({name: end, length: timeTaken});
        transitions[end].push({name: start, length: timeTaken});
      });
      return transitions;
    },
  },
  methods: {
    getLinesAsDict() {
      const linesAsDict = {};
      linesData.forEach((line, index) => {
        linesAsDict[line.name] = line;
      });
      return linesAsDict;
    },
    getLabelMappings() {
      const labelMappings = {};
      platformsData.forEach(platform => {
        const label = platform.label;
        const name = platform.name;
        if (!labelMappings[name]) labelMappings[name] = [];
        labelMappings[name].push(label);
        labelMappings[label] = [name];
      });
      return labelMappings;
    },
    dijkstra(start_name, end_name) {
      const distances = {};
      const visited = {};
      const previous = {};
      const queue = [];
      // get platforms from transitions
      Object.keys(this.transitions).forEach(platform => {
        distances[platform] = Infinity;
        previous[platform] = null;
      });
      queue.push(start_name);
      distances[start_name] = 0;
      if (!this.transitions[end_name]) {
        Swal.fire({
          title: 'No route found',
          text: `${this.labelMappings[end_name]} does not exist in ${this.year}!`,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        return;
      };
      while (queue.length) {
        const current = queue.reduce((min, label) => distances[label] < distances[min] ? label : min, queue[0]);
        queue.splice(queue.indexOf(current), 1);
        visited[current] = true;
        if (current == end_name) break;
        if (!this.transitions[current]) {
          Swal.fire({
            title: 'No route found',
            text: `${this.labelMappings[current]} does not exist in ${this.year}!`,
            icon: 'error',
            confirmButtonText: 'OK'
          });
          return;
        };
        this.transitions[current].forEach(transition => {
          const neighbour = transition.name;
          const length = transition.length;
          const alt = distances[current] + length;
          if (alt < distances[neighbour]) {
            distances[neighbour] = alt;
            previous[neighbour] = current;
          }
          if (!visited[neighbour]) queue.push(neighbour);
        });
      }
      const path = [];
      let current = end_name;
      while (current) {
        path.push(current);
        current = previous[current];
      }
      this.path = path;
      this.setVisibleLines();
      return path;
    },
    setVisibleLines() {
      const visibleLines = [];
      for (let i = 0; i < this.path.length-1; i++) {
        const start_name = this.path[i];
        const end_name = this.path[i+1];
        const connectionId = yearsData[this.year-1960].connections.find(connectionId => {
          const connection = connectionsData[connectionId];
          return (connection.start_name == start_name && connection.end_name == end_name) || (connection.start_name == end_name && connection.end_name == start_name);
        });
        if (!connectionId) continue;
        const connection = connectionsData[connectionId];
        const color = COLOR_MAPPINGS[connection.line] || '#000000';
        const path = this.linesAsDict[connection.line].path.slice(connection.start_id, connection.end_id+1)
        visibleLines.push({ color, path, start_name, end_name });
      }
      this.visibleLines = visibleLines;
    },
    showAllLines() {
      // only for year
      const visibleLines = [];
      yearsData[this.year-1960].connections.forEach(connectionId => {
        const connection = connectionsData[connectionId];
        const color = COLOR_MAPPINGS[connection.line] || '#000000';
        const path = this.linesAsDict[connection.line].path.slice(connection.start_id, connection.end_id+1)
        visibleLines.push({ color, path, start_name: connection.start_name, end_name: connection.end_name });
      });
      this.visibleLines = visibleLines;
    }
  }
}
</script>