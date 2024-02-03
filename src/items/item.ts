import allData from "@data/data";
import type { IAward, IItem } from "../types/item";
import Award from "./merits/award";

export class Item implements IItem {
  category: string;
  type: string;
  key: string;
  title: string;
  imgPath: string;
  importance: number;

  constructor(iItem: IItem) {
    this.category = iItem.category;
    this.type = iItem.type;
    this.key = iItem.key;
    this.title = iItem.title;
    this.imgPath = iItem.imgPath;
    this.importance = iItem.importance;
  }

  getTitle(): string {
    return this.title;
  }

  getSubtitle(): string {
    return '';
  }

  getLink(): string {
    return `/${this.category}/${this.type}/${this.key}`;
  }

  getBackLink(): string {
    return `/${this.category}/${this.type}`;
  }

  isStarred(): boolean {
    return this.importance >= 8;
  }

  isLarge(): boolean {
    return false;
  }

  getClassNames(): string {
    // class names for the preview element.
    let classNames = this.category + ' container row align-items-center preview';
    if (this.isLarge()) {
      classNames += '-lg';
    }
    if (this.isStarred()) {
      classNames += ' starred';
    }
    return classNames;
  }

  getHeaderText(): string {
    return this.getTitle().toUpperCase();
  }

  getFields(): string[] {
    return [];
  }

  hasMap(): boolean {
    return false;
  }
}

export function createItem(iitem: IItem): Item {
  switch (iitem.type) {
    case 'award':
      return new Award(iitem as IAward);
    default:
      return new Award(iitem as IAward);
  }
}

export const allItems: Item[] = [];
for (const [category, v] of Object.entries(allData)) {
  if (category === 'home') continue;
  const categoryData: Object = v.data;
  for (const [type, v] of Object.entries(categoryData)) {
    const typeData: Object = v.data;
    for (const [key, v] of Object.entries(typeData)) {
      const item: Item = createItem({ category, type, key, ...v });
      allItems.push(item);
    }
  }
}