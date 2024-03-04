import cities from "./map/cities.json";
import mrt from "./map/mrt.json";

const mapData = {
  cities: {
    title: "Cities Quiz",
    importance: 8,
    data: cities
  },
  mrt: {
    title: "MRT Quiz",
    importance: 6,
    data: mrt
  }
}

export default mapData;