import Item from "@items/item";
import type { ILanguage, TDescription } from "../../types/item";
import getStarScale from "../../components/utils/StarScale";

class Language extends Item implements ILanguage {
  proficiency: number;
  date: string;

  constructor(iLanguage: ILanguage) {
    super(iLanguage);
    this.proficiency = iLanguage.proficiency;
    this.date = iLanguage.date;
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
    return "languages";  
  }
}

export default Language;