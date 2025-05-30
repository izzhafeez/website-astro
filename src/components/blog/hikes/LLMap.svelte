<script>
import L from "leaflet";
import getColor from "../../../utils/color";
import fullSvg from '../../../img/common/full.svg?raw';
import 'leaflet.fullscreen';

let map;
export let lines;
let featureList = [];
let featureGroup;
const FEATURE_LIMIT = 1000;

const tileOptions = {
  osm: { url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' },
  hot: { url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' },
  arcgis: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' },
  white: { url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
	        &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>` }
}

function createMap(container) {
  let m = L.map(container, {
    preferCanvas: true,
    fullscreen: true
  }).setView([1.35, 103.85], 13);
  L.control
    .fullscreen({
      content: fullSvg,
      position: 'topleft',
    })
    .addTo(m);
  L.tileLayer(
    tileOptions.white.url,
    {
      attribution: tileOptions.osm.attribution,
      maxNativeZoom: 17,
      maxZoom: 19,
    }
  ).addTo(m);
  return m;
}

function resizeMap() {
  if (map) { map.invalidateSize(); }
}

function createLineFeature(line) {
  let lineFeature = L.polyline(line.coords, {
    color: getColor(line.color),
    fillColor: "#000",
    weight: 3,
    smoothFactor: 1.2,
  });
  lineFeature.bindTooltip(line.label, {direction: 'top', sticky: true});
  if (!!line.link) {
    lineFeature.on('click', function() {
      window.open(line.link, '_self');
    })
  }

  lineFeature.on('mouseover', (e) => {
    e.target.setStyle({
      weight: 5,
    })
  })

  lineFeature.on('mouseout', (e) => {
    e.target.setStyle({
      weight: 3,
    })
  })
  return lineFeature;
}

function createFeatures() {
  featureGroup = L.featureGroup();
  let featureCount = 0;
  for (const line of lines) {
    if (line === null) continue;
    const feature = createLineFeature(line);
    featureList.push(feature);
    feature.addTo(map);
    if (featureCount < FEATURE_LIMIT) {
      featureGroup.addLayer(feature);
      featureCount += 1;
    }
  }
}

function mapAction(container) {
  map = createMap(container);
  createFeatures();
  map.fitBounds(featureGroup.getBounds());
  return {
    destroy: () => {
      map.remove();
      map = null;
    }
  }
}

</script>
<svelte:window on:resize={resizeMap}/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
<link rel="stylesheet" href='https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/leaflet.fullscreen.css' />
<div id="map" class="h-[30rem] w-full z-0" use:mapAction/>