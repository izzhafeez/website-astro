class Location {
  constructor(props) {
    this.lat = props.lat;
    this.lng = props.lng;
    this.label = props.label;
    this.color = props.color || "white";
    this.link = props.link || "";
  }
}

export default Location;