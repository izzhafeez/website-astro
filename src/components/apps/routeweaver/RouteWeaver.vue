<template>
  <div class="my-4 max-w-6xl mx-auto p-2">
    <h1 class="text-6xl font-extrabold bg-gradient-to-b from-ew-300 to-ew-500 text-transparent bg-clip-text my-6">RouteWeaver</h1>
    <p class="text-lg my-6">A simple route planner that helps you find the best route to visit multiple locations.</p>
    <div class="flex gap-2 my-2">
      <input type="number" v-model="numOfRoutes" class="px-2 py-1 bg-gray-500/20 rounded-md" placeholder="Number of routes"/>
      <button @click="handleNewLocation" class="px-2 py-1 flex gap-2 bg-black hover:bg-black/80 dark:bg-white dark:hover:bg-white/80 rounded-md"><span class="invert my-auto">Add</span> <img src="/img/common/plus.svg" class="h-4 w-4 invert dark:invert-0 my-auto"/></button>
      <button @click="() => generateStartingRoute()" class="px-2 py-1 flex gap-2 bg-gray-500/20 hover:bg-gray-500/30 rounded-md"><span class="my-auto">Find Interest Points</span> <img src="/img/common/location.svg" class="h-4 w-4 dark:invert my-auto"/></button>
      <button @click="() => getBestTravellingSalesman(100)" class="px-2 py-1 flex gap-2 bg-gray-500/20 hover:bg-gray-500/30 rounded-md"><span class="my-auto">Recommend Route</span> <img src="/img/common/route.svg" class="h-4 w-4 dark:invert my-auto"/></button>
    </div>
  </div>
  <div class="h-80 w-full mt-4">
    <l-map ref="map" v-model:zoom="zoom"
      :center="[1.35, 103.85]" class="z-20">
      <l-tile-layer
        url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <l-marker v-for="(point, index) in route.slice(0, 20).filter(point => point.type != 'skip' && point.type != 'wanted')" :key="index" :lat-lng="[point.lat, point.lng]">
        <l-icon icon-url='https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png' :icon-size="[10,15]" :icon-anchor="[5,15]"></l-icon>
        <l-tooltip ref="tooltip">{{ point.name }}</l-tooltip>
      </l-marker>
      <!-- route as linestring -->
      <l-polyline v-for="miniRoute in splitRoute(route.slice(0, 22))" :lat-lngs="miniRoute.slice(0, 20).map((point) => [point.lat, point.lng])"></l-polyline>
      <l-marker v-for="(point, index) in points" :key="index" :lat-lng="[point.lat, point.lng]">
        <l-icon icon-url='https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png' :icon-size="[20,30]" :icon-anchor="[10,30]"></l-icon>
        <l-tooltip ref="tooltip">{{ point.name }}</l-tooltip>
      </l-marker>
    </l-map>
  </div>
  <!-- list to delete point -->
  <h2 class="text-2xl font-bold mx-auto max-w-6xl mt-4 px-2">Selected Points</h2>
  <div class="flex flex-wrap gap-2 mt-4 max-w-6xl mx-auto px-2">
    <div v-for="(point, index) in points" :key="index" class="bg-gray-500/20 p-2 rounded-md flex gap-2">
      <p class="my-auto">{{ point.name }}</p>
      <button @click="() => deletePoint(index)" class="p-2 bg-gray-500/30 hover:bg-gray-500/40 rounded-md my-auto">Delete</button>
    </div>
  </div>
</template>

<script lang="ts">
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LIcon, LTooltip, LPolyline } from "@vue-leaflet/vue-leaflet";
import axios from "axios";
import Swal from "sweetalert2";
import parksData from "../../../data/apps/routeweaver/parks.json";
import touristData from "../../../data/apps/routeweaver/tourist-attractions.json";
import monumentsData from "../../../data/apps/routeweaver/monuments.json";
import mrtData from "../../../data/apps/routeweaver/mrt.json";

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
      numOfRoutes: 1,
      points: [],
      safePoints: [...Object.entries(mrtData)].map(([key, value]) => {
        return {
          name: key,
          lat: value[1],
          lng: value[0],
          type: 'safe'
        };
      }),
      interestPoints: [...Object.entries(parksData), ...Object.entries(touristData), ...Object.entries(monumentsData)].map(([key, value]) => {
        return {
          name: key,
          lat: value[1],
          lng: value[0],
          type: 'interest'
        };
      }),
      skipPoints: [{
        name: 'Skip',
        lat: 1.35,
        lng: 103.85,
        type: 'skip'
      }],
      route: [],
    };
  },
  methods: {
    async handleNewLocation() {
      const result = await Swal.fire({
        title: 'New Location',
        input: 'text'
      })

      if (result.isConfirmed && result.value) {
        await this.getPossibleLocations(result.value);
      }
    },
    async getPossibleLocations(name) {
      const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${name}&returnGeom=Y&getAddrDetails=Y&pageNum=1`
      const token = import.meta.env.ONEMAP_TOKEN;
      const header = {
        "Authorization": `Bearer ${token}`
      };
      const results = await axios.get(url, { headers: header })
        .then((response) => {
          console.log(response.data);
          return response.data.results;
        })
        .catch((error) => {
          console.error(error);
        });
      if (results) {
        this.selectLocation(results);
      }
    },
    selectLocation(results) {
      const searchResults = results.map((result) => {
        return {
          name: result.BUILDING,
          address: result.ADDRESS,
          lat: result.LATITUDE,
          lng: result.LONGITUDE,
          type: 'wanted'
        };
      });
      const searchOptions = searchResults.map((result, index) => {
        return result.name;
      });
      Swal.fire({
        title: 'Select Location',
        input: 'select',
        inputOptions: searchOptions,
        inputPlaceholder: 'Select a location',
        showCancelButton: true,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value) {
              resolve();
            } else {
              resolve('You need to select a location');
            }
          });
        }
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          const selected = searchResults[result.value];
          this.points.push(selected);
        }
      });
    },
    deletePoint(index) {
      this.points.splice(index, 1);
    },
    evaluate(route) {
      let totalDistance = 0;
      let totalSafety = 0;
      let totalInterest = 0;
      let totalPoints = 0;
      let totalWanted = 0;
      for (let i = 0; i < route.length - 1; i++) {
        if (totalPoints > 20) break;
        totalPoints += 1;
        const point1 = route[i];
        const point2 = route[i + 1];
        if (point1.type != 'skip' && point2.type != 'skip') {
          totalDistance += this.estimateDistance(point1.lat, point1.lng, point2.lat, point2.lng);
        }

        if (point1.type == 'safe') {
          totalSafety += 1;
        } else if (point1.type == 'interest') {
          totalInterest += 1;
        } else if (point1.type == 'wanted') {
          totalWanted += 1;
        }
      }
      return totalDistance - totalSafety - totalInterest - 100*totalWanted;
    },
    findNearbyInterests() {
      const interests = this.interestPoints;
      const nearbyInterests = new Set();
      for (let i = 0; i < this.points.length; i++) {
        const point = this.points[i];
        for (let j = 0; j < interests.length; j++) {
          const interest = interests[j];
          if (this.estimateDistance(point.lat, point.lng, interest.lat, interest.lng) < 2) {
            nearbyInterests.add(j);
          }
        }
      }
      return Array.from(nearbyInterests).map((interest) => {
        return this.interestPoints[interest];
      })
    },
    findNearbySafes() {
      const safes = this.safePoints;
      const nearbySafes = new Set();
      for (let i = 0; i < this.points.length; i++) {
        const point = this.points[i];
        for (let j = 0; j < safes.length; j++) {
          const safe = safes[j];
          if (this.estimateDistance(point.lat, point.lng, safe.lat, safe.lng) < 2) {
            nearbySafes.add(j);
          }
        }
      }
      return Array.from(nearbySafes).map((safe) => {
        return this.safePoints[safe];
      })
    },
    generateStartingRoute() {
      const nearbySafes = this.findNearbySafes();
      const nearbyInterests = this.findNearbyInterests();
      const route = [...nearbySafes, ...nearbyInterests, ...this.points, ...new Array(this.numOfRoutes-1).fill({ type: 'skip', lat: 1.35, lng: 103.85 })];
      this.route = route;
    },
    getBestTravellingSalesman(epochs) {
      let bestRoute = this.route;
      let bestScore = this.evaluate(bestRoute);
      for (let i = 0; i < epochs; i++) {
        const basisRoute = bestRoute.slice();
        for (let j = 0; j < 100; j++) {
          const route = basisRoute.slice();
          for (let k = 0; k < 10; k++) {
            const randomIndex = Math.floor(Math.random() * route.length);
            const randomPoint = route[randomIndex];
            route.splice(randomIndex, 1);
            const randomIndex2 = Math.floor(Math.random() * route.length);
            route.splice(randomIndex2, 0, randomPoint);
          }
          const score = this.evaluate(route);
          if (score < bestScore) {
            bestRoute = route;
            bestScore = score;
          }
        }
      }
      this.route = bestRoute;
    },
    estimateDistance(lat1, lng1, lat2, lng2) {
      return 111.33*((lat1-lat2)**2 + (lng1-lng2)**2)**0.5;
    },
    splitRoute(route) {
      let result = [];
      let chunk = [];

      for (let i = 0; i < route.length; i++) {
        if (route[i].type == 'skip') {
          if (chunk.length > 0) {
            result.push(chunk);
            chunk = [];
          }
        } else {
          chunk.push(route[i]);
        }
      }

      // Add the last chunk if it's not empty
      if (chunk.length > 0) {
        result.push(chunk);
      }

      return result;
    }
  }
}
</script>