<template>
  <div class="h-80 w-full mt-4">
    <l-map ref="map" v-model:zoom="zoom"
      :center="[1.35, 103.85]" class="z-20">
      <l-tile-layer
        url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <l-marker v-for="(point, index) in route.slice(0, 20)" :key="index" :lat-lng="[point.lat, point.lng]">
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
  <button @click="handleNewLocation">hello</button>
  <button @click="() => generateStartingRoute(1)">start</button>
  <button @click="() => getBestTravellingSalesman(100)">find</button>
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
      points: [
        {
          name: 'Bedok Mall',
          lat: 1.3243,
          lng: 103.9298,
          type: 'wanted'
        },
        {
          name: 'Victoria School',
          lat: 1.3155,
          lng: 103.8945,
          type: 'wanted'
        },
        {
          name: 'Zhenghua Nature Park',
          lat: 1.3715,
          lng: 103.7675,
          type: 'wanted'
        },
        {
          name: 'Dairy Farm Nature Park',
          lat: 1.3645,
          lng: 103.7715,
          type: 'wanted'
        },
        {
          name: 'Bedok Reservoir Park',
          lat: 1.3365,
          lng: 103.9305,
          type: 'wanted'
        }
      ],
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
      const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlNmVhOGY2ODU4ZWI2YmZmODc0N2I3ZWEyMGRmZjVkMSIsImlzcyI6Imh0dHA6Ly9pbnRlcm5hbC1hbGItb20tcHJkZXppdC1pdC0xMjIzNjk4OTkyLmFwLXNvdXRoZWFzdC0xLmVsYi5hbWF6b25hd3MuY29tL2FwaS92Mi91c2VyL3Bhc3N3b3JkIiwiaWF0IjoxNzE5MjI4MTQ3LCJleHAiOjE3MTk0ODczNDcsIm5iZiI6MTcxOTIyODE0NywianRpIjoiQnJsTVFxS3FpTkFtUlFNTiIsInVzZXJfaWQiOjMwMDMsImZvcmV2ZXIiOmZhbHNlfQ.ZpdLOQRuxtX-7cMNiTHPjFYSFTi_ipOQ30ng3hitkSY";
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
    generateStartingRoute(skips) {
      const nearbySafes = this.findNearbySafes();
      const nearbyInterests = this.findNearbyInterests();
      const route = [...nearbySafes, ...nearbyInterests, ...this.points, ...new Array(skips).fill({ type: 'skip', lat: 1.35, lng: 103.85 })];
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