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
    this.imgPath = "nus.png";
  }

  override getTitle(): string {
    return `${this.key.toUpperCase()} (${this.grade})`;
  }

  override getSubtitle(): string {
    return this.name;
  }

  override getPluralType(): string {
    return "modules";  
  }
}

export default Module;