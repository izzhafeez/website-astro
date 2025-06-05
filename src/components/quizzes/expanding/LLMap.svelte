<script>
import L from "leaflet";
import getColor from "../../../utils/color";
import { toAdd, toAddAll, toRemoveAll, toAddFeature } from "./featureStore";
import 'leaflet.fullscreen';
import fullSvg from '../../../img/common/full.svg?raw';
import * as turf from '@turf/turf';

let map;
export let locations;
export let sequenceType;
export let sequenceDist;
export let startingLocation;
export let isFullscreen = false;
export let locationDict = {};
export let expansions = {};

const tileOptions = {
  osm: { url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' },
  hot: { url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' },
  arcgis: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' },
  white: { url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
	        &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>` },
  marble: { url: "https://maps.gnosis.earth/ogcapi/collections/blueMarble/map/tiles/WebMercatorQuad" },
  watercolor: { url: "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg", attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' },
}

const svg = (width, height, fill) => `<svg width="${width}px" height="${height}px" viewBox="-4 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
  <g fill="${fill}">
    <path d="M12,17 C9.239,17 7,14.762 7,12 C7,9.238 9.239,7 12,7 C14.761,7 17,9.238 17,12 C17,14.762 14.761,17 12,17 Z M12,0 C5.373,0 0,5.373 0,12 C0,17.018 10.005,32.011 12,32 C13.964,32.011 24,16.95 24,12 C24,5.373 18.627,0 12,0 Z"></path>
  </g>
  <g fill="#FFFFFF">
    <path d="M12,9 C10.343,9 9,10.343 9,12 C9,13.657 10.343,15 12,15 C13.657,15 15,13.657 15,12 C15,10.343 13.657,9 12,9 Z"></path>
  </g>
  <g transform="translate(-104.000000, -411.000000)" fill="#000000">
    <path d="M116,426 C114.343,426 113,424.657 113,423 C113,421.343 114.343,420 116,420 C117.657,420 119,421.343 119,423 C119,424.657 117.657,426 116,426 L116,426 Z M116,418 C113.239,418 111,420.238 111,423 C111,425.762 113.239,428 116,428 C118.761,428 121,425.762 121,423 C121,420.238 118.761,418 116,418 L116,418 Z M116,440 C114.337,440.009 106,427.181 106,423 C106,417.478 110.477,413 116,413 C121.523,413 126,417.478 126,423 C126,427.125 117.637,440.009 116,440 L116,440 Z M116,411 C109.373,411 104,416.373 104,423 C104,428.018 114.005,443.011 116,443 C117.964,443.011 128,427.95 128,423 C128,416.373 122.627,411 116,411 L116,411 Z"></path>
  </g>
</svg>`;


function createMap(container) {
  let m = L.map(container, {
    preferCanvas: true,
    fullscreen: true
  }).setView([0, 0], 2);
  L.tileLayer(
    tileOptions.arcgis.url,
    // tileOptions.watercolor.url,
    {
      attribution: tileOptions.osm.attribution,
      maxNativeZoom: 17,
      maxZoom: 19,
    }
  ).addTo(m);
  L.control
	    .fullscreen({
        content: fullSvg,
      })
      .addTo(m);
  return m;
}

function resizeMap() {
  if (map) { map.invalidateSize(); }
}

function markerIcon(colorCode) {
  const color = getColor(colorCode);
  const size = 12;
  return L.divIcon({
    html: svg(size, size, color),
    className: '',
    iconAnchor: [size/2, size]
  })
}

function createMarker(location) {
  let icon = markerIcon(location.color);
  let marker = L.marker([location.lat, location.lng], {icon});
  marker.bindTooltip(location.label, {direction: 'top', sticky: true});
  return marker;
}

function mapAction(container) {
  map = createMap(container);
  map._events.enterFullscreen[0].fn = () => {
    isFullscreen = true;
  }
  map._events.exitFullscreen[0].fn = () => {
    isFullscreen = false;
  }
  return {
    destroy: () => {
      map.remove();
      map = null;
    }
  }
}

toAddAll.subscribe(value => {
  if (!map) return;
  for (const exp of Object.values(expansions)) {
    // we take only the first location
    const location = locationDict[exp[0]];
    if (location) {
      const marker = createMarker(location);
      map.addLayer(marker);
    }
  }
});

toRemoveAll.subscribe(_ => {
  if (!map) return;
  map.eachLayer(layer => {
    if (layer instanceof L.Marker || layer instanceof L.Circle || layer instanceof L.Rectangle) {
      map.removeLayer(layer);
    }
  });
})

toAdd.subscribe(value => {
  if (value == null || !map) return;
  const locationId = locationDict[value]?.id;
  const location = locations[locationId];
  if (location) {
    const marker = createMarker(location);
    map.addLayer(marker);
  }
});

toAddFeature.subscribe(value => {
  if (value == null || !map) return;
  // remove all previous features
  map.eachLayer(layer => {
    if (layer instanceof L.Circle || layer instanceof L.Rectangle || layer instanceof L.Polygon) {
      map.removeLayer(layer);
    }
  });

  // create a ring around the starting location with the radius being value+sequenceDist
  const location = startingLocation ? locationDict[startingLocation] : null;
  if (location) {
    const radius = value;
    if (sequenceType == "Circle") {
      let circleGeoJSON = turf.circle([location.lng, location.lat], radius, {steps: 256, units: 'kilometers'});
      L.geoJSON(circleGeoJSON, {color: 'red', fillOpacity: 0}).addTo(map);
      circleGeoJSON = turf.circle([location.lng, location.lat], radius-sequenceDist, {steps: 256, units: 'kilometers'});
      L.geoJSON(circleGeoJSON, {color: 'red', fillOpacity: 0}).addTo(map);
    } else if (sequenceType == "Latitude") {
      let latLine = L.rectangle([[location.lat - radius / 111.31949079327357, -180], [location.lat - (radius-sequenceDist) / 111.31949079327357, 180]], {color: 'red', fillOpacity: 0.2});
      latLine.addTo(map);
      latLine = L.rectangle([[location.lat + radius / 111.31949079327357, -180], [location.lat + (radius-sequenceDist) / 111.31949079327357, 180]], {color: 'red', fillOpacity: 0.2});
      latLine.addTo(map);
    } else if (sequenceType == "Longitude") {
      let lngLine = L.rectangle([[-90, location.lng - radius / (111.31949079327357 * Math.cos(location.lat * Math.PI / 180))], [90, location.lng - (radius-sequenceDist) / (111.31949079327357 * Math.cos(location.lat * Math.PI / 180))]], {color: 'red', fillOpacity: 0.2});
      lngLine.addTo(map);
      lngLine = L.rectangle([[-90, location.lng + radius / (111.31949079327357 * Math.cos(location.lat * Math.PI / 180))], [90, location.lng + (radius-sequenceDist) / (111.31949079327357 * Math.cos(location.lat * Math.PI / 180))]], {color: 'red', fillOpacity: 0.2});
      lngLine.addTo(map);
    }
  }
})

$: if (startingLocation && map) {
  const location = locationDict[startingLocation];
  if (location) {
    map.setView([location.lat, location.lng], 9);
    map.setZoom(9);
    map.flyTo([location.lat, location.lng], 9, {duration: 1});
    map.setZoom(9);
  }
}

</script>
<svelte:window on:resize={resizeMap}/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
<link rel="stylesheet" href='https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/leaflet.fullscreen.css' />
<div id="map" class="h-[30rem] w-full z-0" use:mapAction></div>