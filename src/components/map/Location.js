class Location {
  constructor(props) {
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.label = props.label;
    this.color = props.color || "white";
    this.link = props.link || "";
  }
}

export default Location;