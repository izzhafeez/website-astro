import Item from "@items/item";
import type { ILanguage } from "../../types/item";

class Language extends Item implements ILanguage {
  proficiency: number;
  date: string;

  constructor(iLanguage: ILanguage) {
    super(iLanguage);
    this.proficiency = iLanguage.proficiency;
    this.date = iLanguage.date;
  }

  override getSubtitle(): string {
    return super.getStarScale(this.proficiency);
  }

  override getSize(): string {
    return 'SMALL';
  }
}

export default Language;