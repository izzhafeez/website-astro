import Item from "@items/item";
import type { ITechnology, TDescription } from "../../types/item";
import getStarScale from "../../components/utils/StarScale";

class Technology extends Item implements ITechnology {
  proficiency: number;

  constructor(iTechnology: ITechnology) {
    super(iTechnology);
    this.proficiency = iTechnology.proficiency;
  }

  override getSubtitle(): string {
    return getStarScale(this.proficiency);
  }

  override getSize(): string {
    return 'SMALL';
  }

  override getFields(): TDescription {
    return [
      { title: 'proficiency', text: (this.proficiency || "").toString() }
    ]
  }

  override getPluralType(): string {
    return "technologies";  
  }
}

export default Technology;