import Item from "@items/item";
import type { ITechnology } from "../../types/item";

class Technology extends Item implements ITechnology {
  proficiency: number;

  constructor(iTechnology: ITechnology) {
    super(iTechnology);
    this.proficiency = iTechnology.proficiency;
  }

  override getSubtitle(): string {
    return super.getStarScale(this.proficiency);
  }

  override getSize(): string {
    return 'SMALL';
  }
}

export default Technology;