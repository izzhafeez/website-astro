class Line {
  constructor(props) {
    this.coords = props.coords.map(innerList => [innerList[1], innerList[0]]);
    this.color = props.color;
    this.label = props.label;
    this.link = props.link || "";
  }
}

export default Line;