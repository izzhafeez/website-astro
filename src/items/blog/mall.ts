import Item from "@items/item";
import type { IMall } from "../../types/item";

class Mall extends Item implements IMall {
  constructor(iMall: IMall) {
    super(iMall);
  }
}

export default Mall;