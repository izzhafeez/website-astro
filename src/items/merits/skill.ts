import Item from "@items/item";
import type { ISkill } from "../../types/item";

class Skill extends Item implements ISkill {
  proficiency: number;

  constructor(iSkill: ISkill) {
    super(iSkill);
    this.proficiency = iSkill.proficiency;
  }

  override getSubtitle(): string {
    return super.getStarScale(this.proficiency);
  }

  override getSize(): string {
    return 'SMALL';
  }
}

export default Skill;