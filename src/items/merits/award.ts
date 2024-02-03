import { Item } from "@items/item";
import type { IAward } from "../../types/item";

class Award extends Item implements IAward {
  date: string;
  level: string;
  link: string;

  constructor(iAward: IAward) {
    super(iAward);
    this.date = iAward.date;
    this.level = iAward.level;
    this.link = iAward.link;
  }
}

export default Award;