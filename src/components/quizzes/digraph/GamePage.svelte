<script lang="ts">
  import L from "leaflet";
  import party from 'party-js';
  import { Canvas, Layer } from 'svelte-canvas';
  import seededRandom, {shuffle} from '../../common/seededRandom';
  import { fly, fade } from 'svelte/transition';
  import Swal from 'sweetalert2';
  import toast from "../../common/toast";
  import showResults, { shareResults } from "../../common/showResults";
  import { getColor } from "../map/colors";
  import convertColor from "../../../utils/color";

  export let cleanData;
  export let digraph;
  export let isStart;
  export let title;
  export let seed;
  export let randomiseSeed;
  export let bounds;
  export let hideColor;
  export let handleStart;

  let map;
  let featureGroup = L.featureGroup();
  let markers;
  let tooltips;
  let guessInput = "";
  let hasGuessed = false;
  let filteredData;
  let isCorrect = false;

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
      <path d="M12,9 C10.343,9 9,10.343 9,12 C9,13.657 10.343,15 12,15 C13.657,15 15,13.657 15,12 C15,10.343 13.657,9 12,9 Z M12,17 C9.239,17 7,14.762 7,12 C7,9.238 9.239,7 12,7 C14.761,7 17,9.238 17,12 C17,14.762 14.761,17 12,17 Z M12,0 C5.373,0 0,5.373 0,12 C0,17.018 10.005,32.011 12,32 C13.964,32.011 24,16.95 24,12 C24,5.373 18.627,0 12,0 Z"></path>
    </g>
    <g transform="translate(-104.000000, -411.000000)" fill="#000000">
      <path d="M116,426 C114.343,426 113,424.657 113,423 C113,421.343 114.343,420 116,420 C117.657,420 119,421.343 119,423 C119,424.657 117.657,426 116,426 L116,426 Z M116,418 C113.239,418 111,420.238 111,423 C111,425.762 113.239,428 116,428 C118.761,428 121,425.762 121,423 C121,420.238 118.761,418 116,418 L116,418 Z M116,440 C114.337,440.009 106,427.181 106,423 C106,417.478 110.477,413 116,413 C121.523,413 126,417.478 126,423 C126,427.125 117.637,440.009 116,440 L116,440 Z M116,411 C109.373,411 104,416.373 104,423 C104,428.018 114.005,443.011 116,443 C117.964,443.011 128,427.95 128,423 C128,416.373 122.627,411 116,411 L116,411 Z"></path>
    </g>
  </svg>`;

  function markerIcon(color) {
    const size = 20;
    return L.divIcon({
      html: svg(size, size, color),
      className: '',
      iconAnchor: [size/2, size]
    })
  }

  function createMarker(location, color, label) {
    let icon = markerIcon(color);
    let marker = L.marker(location, {icon});
    marker.bindTooltip(label, {direction: 'top', sticky: true});
    return marker;
  }

  function createMap(container) {
    let m = L.map(container, {
      preferCanvas: true,
      fullscreen: true
    })//.setView(locations[roundNumber], 10);
    L.tileLayer(
      tileOptions.arcgis.url,
      {
        attribution: tileOptions.osm.attribution,
        maxNativeZoom: 17,
        maxZoom: 19,
      }
    ).addTo(m);
    return m;
  }

  function createFilteredMarkers() {
    markers = []
    tooltips = []

    featureGroup.clearLayers();

    filteredData = cleanData.filter(([k, name, lat, lng, pop]) => {
      return name.toLowerCase().includes(digraph);
    });

    filteredData.forEach(([k, name, lat, lng, pop]) => {
      let color;

      if (hideColor) color = "white";
      else if (pop) color = getColor("city", pop);
      else color = getColor("mrt", k);

      color = convertColor(color);

      const marker = createMarker([lat, lng], color, name);
      markers.push(marker);
      tooltips.push(marker.getTooltip());
      marker.unbindTooltip();
      featureGroup.addLayer(marker);
    });
  }

  function mapAction(container) {
    if (map) {
      map.remove();
      map = null;
    }

    map = createMap(container);

    createFilteredMarkers();
    featureGroup.addTo(map);
    map.fitBounds(bounds);

    return {
      destroy: () => {
        map.remove();
        map = null;
      }
    }
  }

  function resizeMap() {
    if (map) { map.invalidateSize(); }
  }

  const handleGuess = () => {
    if (guessInput.length !== 2) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please enter a 2-letter combination.',
      });
      return;
    }

    const guess = guessInput.toLowerCase();
    hasGuessed = true;

    // check isCorrect, as in guess and digraph filters out the same items
    isCorrect = true;
    cleanData.forEach(([k, name, lat, lng, pop]) => {
      if (name.toLowerCase().includes(guess) != name.toLowerCase().includes(digraph)) {
        isCorrect = false;
      }
    });

    if (isCorrect) {
      party.confetti(document.querySelector("#map"), { count: 200 });
      Swal.fire({
        icon: 'success',
        title: 'Correct!',
        text: `You guessed the two letters "${digraph}" correctly!`,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Incorrect!',
        text: `The correct two letters was "${digraph}", you answered "${guess}".`,
      });
    }

    // show all tooltips
    markers.forEach((marker, i) => {
      marker.bindTooltip(tooltips[i].getContent(), {direction: 'top', sticky: true});
    });
  }

  const share = () => {
    let link = `${title}\n`;
    let seedString = seed.toString();
    if (seedString.match(/20\d{2}(11|12|0\d)([0-2]\d|30|31)/)) {
        link += `Daily Challenge on ${seedString.slice(0, 4)}/${seedString.slice(4, 6)}/${seedString.slice(6)}\n`;
    }
    link += `I got it ${isCorrect ? "right!" : "wrong :("}\n`;
    link += `${window.location.href.split("?")[0]}?seed=${seed}&hideColor=${hideColor ? "true" : ""}`;
    shareResults(link);
  }

  const handleEnd = () => {
    // isStart = false;
    hasGuessed = false;

    guessInput = "";
    if (mapActionHandle) {
      mapActionHandle.destroy();
    }

    randomiseSeed();
    handleStart();

    mapActionHandle = mapAction(mapContainer);
  }

  let mapActionHandle;
  let mapContainer;
</script>

<svelte:window on:resize={resizeMap}/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
<div id="map" class="h-[30rem] w-full z-0" bind:this={mapContainer} use:mapAction={() => {
  mapActionHandle = mapAction(mapContainer);
}}></div>

{#if !hasGuessed}
<div class="my-4 gap-2 grid">
  <label for="guess" class="text-lg font-bold my-auto">2-letter combination:</label>
  <input type="text" bind:value={guessInput} placeholder="Guess" class="border-2 border-gray-300 rounded-md p-2 dark:bg-gray-700 me-auto"/>
</div>
{:else}
<div class="my-4 gap-2">
  <div><span class="font-bold">Your Guess</span>: {guessInput}</div>
  <div><span class="font-bold">Actual Answer</span>: {digraph}</div>
  <div>You may hover on the markers to see the names.</div>
</div>
{/if}

{#if !hasGuessed}
<button on:click={handleGuess} class="border-2 border-ew-300/50 bg-ew-300/20 hover:bg-ew-300/50 text-ew-700 dark:text-ew-300 rounded-lg py-2 px-2">Submit Guess</button>
{:else}
<div class="flex gap-2">
  <button on:click={share} class="border-2 border-dt-300/50 bg-dt-300/20 hover:bg-dt-300/50 text-dt-700 dark:text-dt-300 rounded-lg py-2 px-2">Share Results</button>
  <button on:click={handleEnd} class="border-2 border-ew-300/50 bg-ew-300/20 hover:bg-ew-300/50 text-ew-700 dark:text-ew-300 rounded-lg py-2 px-2">Play Again</button>
</div>
{/if}