<script lang="ts">
  import L from "leaflet";
  import party from 'party-js';
  import { Canvas, Layer } from 'svelte-canvas';
  import seededRandom, {shuffle} from '../../common/seededRandom';
  import { fly, fade } from 'svelte/transition';
  import Swal from 'sweetalert2';
  import toast from "../../common/toast";
  import showResults, { shareResults } from "../../common/showResults";

  export let cleanData;
  export let locations;
  export let isStart;
  export let title;
  export let seed;
  export let randomiseSeed;
  export let maxDist;
  export let latLngBound;

  let roundNumber = 0;
  let map;
  let featureGroup = L.featureGroup();
  let guessInput = "";
  let chosen = null;
  let score = 0;
  let isWaiting = false;
  let roundScore = 0;
  let link = "";
  let bestName = null;
  let guessDistance = Infinity;
  let bestDistance = Infinity;
  let bounds;
  let tile;
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
      <path d="M12,9 C10.343,9 9,10.343 9,12 C9,13.657 10.343,15 12,15 C13.657,15 15,13.657 15,12 C15,10.343 13.657,9 12,9 Z M12,17 C9.239,17 7,14.762 7,12 C7,9.238 9.239,7 12,7 C14.761,7 17,9.238 17,12 C17,14.762 14.761,17 12,17 Z M12,0 C5.373,0 0,5.373 0,12 C0,17.018 10.005,32.011 12,32 C13.964,32.011 24,16.95 24,12 C24,5.373 18.627,0 12,0 Z"></path>
    </g>
    <g transform="translate(-104.000000, -411.000000)" fill="#000000">
      <path d="M116,426 C114.343,426 113,424.657 113,423 C113,421.343 114.343,420 116,420 C117.657,420 119,421.343 119,423 C119,424.657 117.657,426 116,426 L116,426 Z M116,418 C113.239,418 111,420.238 111,423 C111,425.762 113.239,428 116,428 C118.761,428 121,425.762 121,423 C121,420.238 118.761,418 116,418 L116,418 Z M116,440 C114.337,440.009 106,427.181 106,423 C106,417.478 110.477,413 116,413 C121.523,413 126,417.478 126,423 C126,427.125 117.637,440.009 116,440 L116,440 Z M116,411 C109.373,411 104,416.373 104,423 C104,428.018 114.005,443.011 116,443 C117.964,443.011 128,427.95 128,423 C128,416.373 122.627,411 116,411 L116,411 Z"></path>
    </g>
  </svg>`;

  const setTile = (zoom) => {
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
        maxZoom: 19,
        minZoom: zoom || 10,
      }
    )

    tile.addTo(map);
  }

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
    let location = locations[roundNumber];
    bounds = L.latLngBounds(L.latLng(location[0]-0.5, location[1]-0.5), L.latLng(location[0]+0.5, location[1]+0.5));
    map = L.map(container, {
      preferCanvas: true,
      fullscreen: true,
      maxBounds: bounds,
      maxBoundsViscosity: 1
    }).setView(location, 10);
    setTile();
  }

  function mapAction(container) {
    createMap(container);
    featureGroup.addLayer(createMarker(locations[roundNumber], '#FA9E0D', 'Guess a nearby location!'));
    featureGroup.addTo(map);
    // map.fitBounds(bounds);

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
    if (!chosen) {
      Swal.fire({
        icon: 'error',
        title: 'Please select a location to guess!'
      });
      return;
    }

    let guessLocation;
    guessDistance = Infinity;
    for (const location of cleanData[chosen]) {
      const distance = map.distance(locations[roundNumber], location);
      if (distance < guessDistance) {
        guessDistance = distance;
        guessLocation = location;
      }
    }

    // go through all the locations in cleanData
    let bestLocation;
    bestDistance = Infinity;
    bestName = null;
    for (const key of Object.keys(cleanData)) {
      for (const location of cleanData[key]) {
        const distance = map.distance(locations[roundNumber], location);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestLocation = location;
          bestName = key;
        }
      }
    }

    if (chosen != bestName) {
      const guessMarker = createMarker(guessLocation, '#D42E12', `Your Guess: ${chosen}`);
      featureGroup.addLayer(guessMarker);
    }
    const bestMarker = createMarker(bestLocation, '#009645', chosen == bestName ? `Your Guess/Correct Answer: ${chosen}` : `Correct Answer: ${bestName}`);
    featureGroup.addLayer(bestMarker);

    let distRatio = (guessDistance-bestDistance)/maxDist;
    roundScore = Math.max(Math.round(100-distRatio*400), 0);

    if (roundScore >= 80) {
      // party on the search bar element
      const element = document.getElementById("map");
      if (element) {
        party.confetti(element, {
          count: party.variation.range(100, 200),
          size: party.variation.range(0.5, 1.5),
          spread: party.variation.range(50, 100),
          angle: party.variation.range(-90, 90)
        });
      }
    }

    score += roundScore;

    isWaiting = true;

    if (roundNumber == locations.length-1) {
      link = `Proximate Puzzle: ${title}\n`;
      let seedString = seed.toString();
      if (seedString.match(/20\d{2}(11|12|0\d)([0-2]\d|30|31)/)) {
          link += `Daily Challenge on ${seedString.slice(0, 4)}/${seedString.slice(4, 6)}/${seedString.slice(6)}\n`;
      }
      link += `I scored ${score}/500 points!\n`;
      link += `${window.location.href.split("?")[0]}?seed=${seed}`;
      showResults(score, 500, null, link);
    }

    // allow panning on map
    let correctLatLng = L.latLng(locations[roundNumber][0], locations[roundNumber][1]);
    let guessedLatLng = L.latLng(guessLocation[0], guessLocation[1]);
    let minLat = Math.min(correctLatLng.lat, guessedLatLng.lat);
    let maxLat = Math.max(correctLatLng.lat, guessedLatLng.lat);
    let minLng = Math.min(correctLatLng.lng, guessedLatLng.lng);
    let maxLng = Math.max(correctLatLng.lng, guessedLatLng.lng);
    let newBounds = L.latLngBounds(L.latLng(minLat-0.5, minLng-0.5), L.latLng(maxLat+0.5, maxLng+0.5));

    // midpoint
    let midpoint = L.latLng(
      (correctLatLng.lat + guessedLatLng.lat) / 2,
      (correctLatLng.lng + guessedLatLng.lng) / 2
    );

    setTile(1);
    map.setMaxBounds(DEFAULT_BOUNDS);
    map.fitBounds(newBounds);
    // map.setView(midpoint, 3);
  }

  const handleNext = () => {
    if (roundNumber < locations.length-1) {
      roundNumber++;
      featureGroup.clearLayers();
      let location = locations[roundNumber];
      featureGroup.addLayer(createMarker(location, '#FA9E0D', 'Guess this location!'));
      bounds = L.latLngBounds(L.latLng(location[0]-0.5, location[1]-0.5), L.latLng(location[0]+0.5, location[1]+0.5));

      isWaiting = false;
      guessInput = "";
      chosen = null;
      roundScore = 0;

      map.setView(location, 15);
      map.fitBounds(bounds);
      map.setMaxBounds(bounds);

      setTile();
    } else {
      handleEnd();
    }
  }

  const share = () => {
    shareResults(link);
  }

  const handleEnd = () => {
    isStart = false;
    randomiseSeed();
  }
</script>

<svelte:window on:resize={resizeMap}/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
<div id="map" class="h-[30rem] w-full z-0" use:mapAction></div>

<!-- all the location names that match -->
{#if !isWaiting}
<div class="mt-4 grid">
  <label class="text-lg">Search:</label>
  <input type="text" id="search-bar" disabled={isWaiting} bind:value={guessInput} placeholder="Search a Location" class="border-2 border-gray-300/30 dark:bg-gray-700 rounded-md p-2 me-auto"/>
</div>

<div class="my-4 grid">
  <label class="text-lg">Click to Select (type in search bar to show different results):</label>
  <div class="flex flex-wrap gap-2">
  {#each Object.keys(cleanData).filter(name => name.toLowerCase().includes(guessInput.toLowerCase())).slice(0, 20) as name}
    <button class={`p-2 rounded-lg hover:text-white ${chosen == name ? "bg-ew-500" : "bg-ns-500/50 hover:bg-ns-500"}`} on:click={() => {chosen = name}}>{name}</button>
  {/each}
  </div>
  <div class="mt-4">Score: {score}</div>
</div>
{:else}
<div class="my-4 grid">
  <div>Your Guess: {chosen} ({(guessDistance/1000).toFixed(2)}km)</div>
  <div>Correct Answer: {bestName} ({(bestDistance/1000).toFixed(2)}km)</div>
  <div class="my-auto">Round Score: {roundScore}</div>
  <div class="my-auto">Score: {score}</div>
</div>
{/if}

<div class="flex gap-4 flex-wrap">
{#if !isWaiting}
  <button class="bg-cc-500/50 hover:bg-cc-500 p-2 rounded-lg" on:click={handleGuess}>Make Guess</button>
{:else}
  {#if roundNumber == 4}
  <button class="bg-dt-500/50 hover:bg-dt-500 p-2 rounded-lg" on:click={share}>Share</button>
  <button class="bg-ns-500/50 hover:bg-ns-500 p-2 rounded-lg" on:click={handleEnd}>End</button>
  {:else}
  <button class="bg-cc-500/50 hover:bg-cc-500 p-2 rounded-lg" on:click={handleNext}>Next</button>
  {/if}
{/if}
</div>