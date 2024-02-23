import type { IItem } from "../types/item";

class Item implements IItem {
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
  };

  getOverview(): string {
    return '';
  }

  getBracketed(): string {
    return '';
  }

  getBracketedColor(): string {
    return '';
  }

  isStarred(): boolean {
    return this.importance >= 8;
  }

  getSize(): string {
    return 'MEDIUM';
  }

  getStarScale(value: number): string {
    const emptyStar = '☆';
    const fullStar = '★';
    const fullStarCount = Math.ceil(value / 2);
    const emptyStarCount = 5 - fullStarCount;
    return fullStar.repeat(fullStarCount) + emptyStar.repeat(emptyStarCount);
  }

  getHeaderText(): string {
    return this.getTitle().toUpperCase();
  }

  getFields(): string[] {
    return [];
  }

  getColor(): string {
    return 'black';
  }
}

export const ItemType = typeof Item;

export default Item;