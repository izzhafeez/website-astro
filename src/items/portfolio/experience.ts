import Item from "@items/item";
import type { IExperience } from "../../types/item";

class Experience extends Item implements IExperience {
  startDate: string;
  endDate: string;
  organisation: string;
  overview: string;

  constructor(iExperience: IExperience) {
    super(iExperience);
    this.startDate = iExperience.startDate;
    this.endDate = iExperience.endDate;
    this.organisation = iExperience.organisation;
    this.overview = iExperience.overview;
  }

  override getSubtitle(): string {
    return this.organisation;
  }

  override getOverview(): string {
    return this.overview;
  }

  override getSize(): string {
    return 'LARGE';
  }
}

export default Experience;