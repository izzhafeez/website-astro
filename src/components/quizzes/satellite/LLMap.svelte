<script>
import L from "leaflet";
import getColor from "../../../utils/color";
import { toShow, toAllow } from "./featureStore";
import 'leaflet.fullscreen';
import fullSvg from '../../../img/common/full.svg?raw';

let map;
let tile;
export let isFullscreen;
export let data;
export let latLngBound;
export let maxDist;

let DEFAULT_BOUNDS = L.latLngBounds(L.latLng(latLngBound[0]-10, latLngBound[2]-10), L.latLng(latLngBound[1]+10, latLngBound[3]+10));

const tileOptions = {
  osm: { url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' },
  hot: { url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' },
  arcgis: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' },
  white: { url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
	        &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>` },
  marble: { url: "https://maps.gnosis.earth/ogcapi/collections/blueMarble/map/tiles/WebMercatorQuad" }
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

  const setTile = (zoom) => {
    if (!map) return;

    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    tile = L.tileLayer(
      tileOptions.arcgis.url,
      {
        attribution: tileOptions.osm.attribution,
        maxNativeZoom: 17,
        maxZoom: 20,
        minZoom: zoom || 12,
      }
    )

    tile.addTo(map);
  }

function createMap(container) {
  map = L.map(container, {
    preferCanvas: true,
    fullscreen: true,
    maxBoundsViscosity: 1
  }).setView([0, 0], 2);
  L.control
    .fullscreen({
      content: fullSvg,
      position: 'bottomleft',
    })
    .addTo(map);
  setTile(2);
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
  let icon = markerIcon("dt-500");
  let marker = L.marker(location, {icon});
  return marker;
}

function mapAction(container) {
  createMap(container);
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

toShow.subscribe(answer => {
  if (!map || !data || !answer) return;

  // remove existing feature groups
  map.eachLayer(layer => {
    if (layer instanceof L.FeatureGroup) {
      map.removeLayer(layer);
    }
  });

  let answerData = [...data[answer]];
  const featureGroup = L.featureGroup();
  let isPoint = answerData.length === 1;

  answerData.forEach(location => {
    const marker = createMarker(location);
    featureGroup.addLayer(marker);
  });
  featureGroup.addTo(map);

  let bounds = featureGroup.getBounds();
  let maxBounds = bounds;
  if (isPoint) {
    let location = answerData[0];
    map.setView(location, 16);
    bounds = L.latLngBounds(L.latLng(location[0]-0.10, location[1]-0.10), L.latLng(location[0]+0.10, location[1]+0.10));
    maxBounds = L.latLngBounds(L.latLng(location[0]-0.15, location[1]-0.15), L.latLng(location[0]+0.15, location[1]+0.15));
  }

  map.fitBounds(bounds);

  if (isPoint) {
    map.setMaxBounds(maxBounds);
    setTile();
  }
})

toAllow.subscribe(answer => {
  if (!map) return;

  let isPoint = data[answer].length === 1;
  if (!isPoint) return;

  // reset tile, allowing full mobility
  map.eachLayer(layer => {
    if (layer instanceof L.TileLayer) {
      map.removeLayer(layer);
    }
  });
  map.setMaxBounds(DEFAULT_BOUNDS);

  setTile(2);

  let bounds = L.latLngBounds(L.latLng(latLngBound[0]-1, latLngBound[2]-1), L.latLng(latLngBound[1]+1, latLngBound[3]+1));
  map.fitBounds(bounds);

  // full bounds
  let fullBounds = L.latLngBounds(L.latLng(latLngBound[0]-1000, latLngBound[2]-1000), L.latLng(latLngBound[1]+1000, latLngBound[3]+1000));
  map.setMaxBounds();

  map.setView(data[answer][0], 12)
})

</script>

<svelte:window on:resize={resizeMap}/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
<link rel="stylesheet" href='https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/leaflet.fullscreen.css' />
<div id="map" class="h-[30rem] w-full z-0" use:mapAction></div>