<script>
  import L from "leaflet";
  import info from "/src/img/common/info.svg";

  export let data;
  let image = data[Math.floor(Math.random() * data.length)];
  $: lat = image.lat;
  $: lng = image.lng;
  $: answer = new L.marker([lat, lng], {
    icon: new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
  }).bindTooltip("Answer");
  let guess;
  let isGuessing = true;
  let map;
  let distance = 0;
  let showNextButton = false;
  let line;
  let waiting = 1;
  
  function handleNext() {
    map.removeLayer(answer);
    image = data[Math.floor(Math.random() * data.length)];
    isGuessing = true;
    showNextButton = false;
    distance = 0;
    map.removeLayer(guess);
    map.removeLayer(line);
    guess = null;
    line = null;
    waiting++;
  }

  function handleGuess() {
    if (!guess) return;
    isGuessing = false;
    answer.addTo(map);
    line = L.polyline([guess.getLatLng(), answer.getLatLng()], {color: 'black'}).addTo(map);
    const newDistance = guess.getLatLng().distanceTo(answer.getLatLng());
    showNextButton = true;
    let i = 0;
    const intervalId = setInterval(() => {
      if (distance >= newDistance) {
        clearInterval(intervalId);
      } else {
        distance = (((i/100) * newDistance)).toFixed(0);
        i++;
      }
    }, 10);
  }

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
    }).setView([1.35, 103.85], 11);
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

  function mapAction(container) {
    map = createMap(container);
    map.on('click', e => {
      if (!isGuessing) return;
      if (guess) {
        map.removeLayer(guess);
      }
      guess = new L.marker(e.latlng, {
        icon: new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).bindTooltip("Your Guess").addTo(map);
    });
    return {
      destroy: () => {
        map.remove();
        map = null;
      }
    }
  }
  
  const onload = el => {
    el.addEventListener('load', () => {
      waiting--;
    });
  }

  const openInfo = () => {
    Swal.fire({
      title: 'GeoGuessr',
      html: `
        <p>Guess where I took these pictures</p>
        <p>Click on the map to make a guess</p>
        <p>Click on the "Guess" button to check your guess</p>
        <p>Press and hold the image to enlarge</p>
      `
    })
  }
</script>

<svelte:window on:resize={resizeMap}/>
<div class="fixed z-30 bottom-0 right-0">
  {#if showNextButton}
  <p class="text-lg">{distance}m</p>
  <button class="bg-cc-500 hover:bg-cc-300 text-white p-2 w-full" on:click={handleNext}>Next</button>
  {:else if !!guess}
  <button class="bg-ew-500 hover:bg-ew-300 text-white p-2 w-full" on:click={handleGuess}>Guess</button>
  {/if}
  <button class="bg-dt-500 hover:bg-dt-300 text-white w-full p-2 flex items-center gap-4" on:click={openInfo}><img src={info.src} alt="info" class="h-5 invert"/>Info</button>
  <img use:onload src={image.link} alt={data.id} class={`w-60 object-contain active:w-screen max-h-screen active:my-auto active:mx-auto cursor-pointer ${waiting > 0 ? 'hidden' : ''}`}/>
  {#if waiting > 0}
  <p class="text-lg w-60 h-60 bg-gray-100 grid items-center text-center">Loading...</p>
  {/if}
</div>
<div id="map" class="h-screen w-screen fixed" use:mapAction/>