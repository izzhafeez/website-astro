import Item from "@items/item";
import type { IQuiz } from "../../types/item";

class Quiz extends Item implements IQuiz {
  link: string;

  constructor(iQuiz: IQuiz) {
    super(iQuiz);
    this.link = iQuiz.link;
  }
}

export default Quiz;