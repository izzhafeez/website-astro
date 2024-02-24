import Item from "@items/item";
import type { IGraph } from "../../types/item";

class Graph extends Item implements IGraph {
  complexity: number;
  link: string;

  constructor(iGraph: IGraph) {
    super(iGraph);
    this.complexity = iGraph.complexity;
    this.link = iGraph.link;
  }

  override getSize(): string {
    return 'SMALL';
  }

  override getSubtitle(): string {
    return super.getStarScale(this.complexity);
  }
}

export default Graph;