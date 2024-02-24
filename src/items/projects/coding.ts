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

  override getSize(): string {
    return 'LARGE';
  }

  override getSubtitle(): string {
    return this.date;
  }

  override getOverview(): string {
    return this.overview;
  }
}

export default Coding;