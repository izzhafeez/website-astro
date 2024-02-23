import Item from "@items/item";
import type { IModule } from "../../types/item";

class Module extends Item implements IModule {
  name: string;
  semester: string;
  grade: string;

  constructor(iModule: IModule) {
    super(iModule);
    this.name = iModule.name;
    this.semester = iModule.semester;
    this.grade = iModule.grade;
  }

  override getBracketed(): string {
    return this.grade;
  }

  override getBracketedColor(): string {
    switch (this.grade) {
      case 'A+':
      case 'A':
        return 'ew';
      case 'A-':
        return 'cc';
      case 'B+':
        return 'ns';
      default:
        return 'black';
    }
  }

  override getSubtitle(): string {
    return this.name;
  }
}

export default Module;