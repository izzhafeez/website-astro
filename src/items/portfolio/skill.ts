import Item from "@items/item";
import type { ISkill, TDescription } from "../../types/item";
import getStarScale from "../../components/utils/StarScale";

class Skill extends Item implements ISkill {
  proficiency: number;

  constructor(iSkill: ISkill) {
    super(iSkill);
    this.proficiency = iSkill.proficiency;
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
    return "skills";  
  }
}

export default Skill;