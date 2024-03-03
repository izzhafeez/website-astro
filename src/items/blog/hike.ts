import Item from "@items/item";
import type { IHike, Stop, TDescription } from "../../types/item";
import Line from "@components/map/Line";
import processedHikes from "../../data/blog/hikes/processed.json";
import Location from "@components/map/Location";

interface ProcessedHikes {
  [key: string]: {
      route: number[][];
      length: number;
  };
}

class Hike extends Item implements IHike {
  date: string;
  start: string;
  end: string;
  color: string;
  line: Line;
  length: number;
  stops: Stop[];
  stopLocations: Location[];

  constructor(iHike: IHike) {
    super(iHike);
    this.date = iHike.date;
    this.start = iHike.start;
    this.end = iHike.end;
    this.color = iHike.color;
    this.stops = iHike.stops;
    const coords: number[][] = (processedHikes as ProcessedHikes)[this.key].route;
    const length: number = (processedHikes as ProcessedHikes)[this.key].length;
    this.length = length;
    const label = `<b>${this.title}</b><br/>Length: ${length.toFixed(2)}km`
    this.line = new Line({
      coords: coords,
      color: this.color,
      label,
      link: `/${this.category}/${this.type}/${this.key}`
    });
    this.stopLocations = iHike.stops.map((stop, index) => new Location({
      latitude: stop.lat,
      longitude: stop.lng,
      label: `<b>Stop ${index+1}</b><br/>${stop.name}`,
      color: this.color,
    }))
    const start = new Location({
      latitude: coords[0][1],
      longitude: coords[0][0],
      label: `<b>Start</b><br/>${this.start}`,
      color: this.color
    })
    const end = new Location({
      latitude: coords[coords.length-1][1],
      longitude: coords[coords.length-1][0],
      label: `<b>End</b><br/>${this.end}`,
      color: this.color
    })
    this.stopLocations = [start, ...this.stopLocations, end];
  }

  override hasMap(): boolean {
    return true;
  }

  override getLocations(): Location[] {
    return this.stopLocations; 
  }

  override getLines(): Line[] {
    return [this.line];
  }

  override getFields(): TDescription {
    return [
      { title: 'date', text: this.date }
    ]
  }
  
  override getPluralType(): string {
    return "hikes";   
  }
}

export default Hike;