import type Line from "@components/map/Line";
import type { IItem, TDescription } from "../types/item";
import Location from "@components/map/Location";

class Item implements IItem {
  category: string;
  type: string;
  key: string;
  title: string;
  imgPath: string;
  importance: number;
  description: TDescription;
  related: string[];
  data?: any;

  constructor(iItem: IItem) {
    this.category = iItem.category;
    this.type = iItem.type;
    this.key = iItem.key;
    this.title = iItem.title;
    this.imgPath = iItem.imgPath;
    this.importance = iItem.importance;
    this.description = typeof iItem.description === 'string'
      ? [{ text: iItem.description }]
      : iItem.description === undefined
      ? []
      : iItem.description;
    this.related = iItem.related;
  }

  getTitle(): string {
    return this.title;
  }

  getSubtitle(): string {
    return '';
  };

  getOverview(): string {
    return '';
  }

  isStarred(): boolean {
    return this.importance >= 8;
  }

  getSize(): string {
    return 'MEDIUM';
  }

  getHeaderText(): string {
    return this.getTitle().toUpperCase();
  }

  getFields(): TDescription {
    return [];
  }

  getColor(): string {
    return 'black';
  }

  getPluralType(): string {
    return this.type;
  }

  isBigImage(): boolean {
    return false;
  }

  hasMap(): boolean {
    return false;
  }

  getLocations(): Location[] {
    return [];
  }

  getLines(): Line[] {
    return [];
  }
}

export const ItemType = typeof Item;

export default Item;