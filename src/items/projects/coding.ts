import Item from "@items/item";
import type { ICoding } from "../../types/item";

class Coding extends Item implements ICoding {
  date: string;
  overview: string;
  repo: string;

  constructor(iCoding: ICoding) {
    super(iCoding);
    this.date = iCoding.date;
    this.overview = iCoding.overview;
    this.repo = iCoding.repo;
  }
}

export default Coding;