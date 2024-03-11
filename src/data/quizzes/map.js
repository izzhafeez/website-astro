import cities from "./cities.json";
import mrt from "./mrt.json";
import schools from "./schools.json";
import busStops from "./bus-stops.json";

const mapData = {
  cities: {
    title: "Cities Quiz",
    description: [{
      text: "How many cities can you name? As you answer, the marker will disappear. Use regex to select the cities you want included in the quiz (e.g. 'Japan' if you only want cities in Japan, '500K' if you only want cities with at least 500K people, 'ork' if you only want cities containing 'ork'). You get 4 seconds for every possible answer. Good luck!"
    }],
    data: cities,
    defaultRegex: "1M"
  },
  mrt: {
    title: "MRT Quiz",
    description: [{
      text: "How many MRT/LRT stations can you name? As you answer, the marker will disappear. Use regex to select the stations you want included in the quiz (e.g. 'EW' if you only want stations on the EW line, 'oo' if you only want stations containing 'oo'). You get 4 seconds for every possible answer. Good luck!"
    }],
    data: mrt,
    defaultRegex: ""
  },
  schools: {
    title: "Schools Quiz",
    description: [{
      text: "How many schools in Singapore can you name? As you answer, the marker will disappear. Use regex to select the schools you want included in the quiz (e.g. 'Secondary' if you only want secondary schools, 'ang' if you only want schools containing 'ang'). You get 4 seconds for every possible answer. Good luck!"
    }],
    data: schools,
    defaultRegex: ""
  },
  "bus-stops": {
    title: "Bus Stops Quiz",
    description: [{
      text: "How many bus stops in Singapore can you name? As you answer, the marker will disappear. Use regex to select the bus stops you want included in the quiz (e.g. 'BUS126' if you only want bus stops with Bus 126 passing through, 'ang' if you only want bus stops containing 'ang'). You get 4 seconds for every possible answer. Good luck!"
    }],
    data: busStops,
    defaultRegex: "Sengkang"
  }
}

export default mapData;