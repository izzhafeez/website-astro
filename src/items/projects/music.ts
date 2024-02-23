import Item from "@items/item";
import type { IMusic } from "../../types/item";

class Music extends Item implements IMusic {
  artist: string;
  link: string;

  constructor(iMusic: IMusic) {
    super(iMusic);
    this.artist = iMusic.artist;
    this.link = iMusic.link;
  }
}

export default Music;