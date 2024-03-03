import Item from "@items/item";
import type { IArtwork } from "../../types/item";
import getStarScale from "../../components/utils/StarScale";

class Artwork extends Item implements IArtwork {
  complexity: number;
  link: string;

  constructor(iArtwork: IArtwork) {
    super(iArtwork);
    this.complexity = iArtwork.complexity;
    this.link = iArtwork.link;
  }

  override getSize(): string {
    return 'SMALL';
  }

  override getSubtitle(): string {
    return getStarScale(this.complexity);
  }

  override isBigImage(): boolean {
    return true;
  }
}

export default Artwork;