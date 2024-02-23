import Item from "@items/item";
import type { IHike } from "../../types/item";

class Hike extends Item implements IHike {
  date: string;
  start: string;
  end: string;
  color: string;

  constructor(iHike: IHike) {
    super(iHike);
    this.date = iHike.date;
    this.start = iHike.start;
    this.end = iHike.end;
    this.color = iHike.color;
  }
}

export default Hike;