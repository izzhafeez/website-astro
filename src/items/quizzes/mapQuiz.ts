import type { IMapQuiz } from "types/item";
import Quiz from "./quiz";

class MapQuiz extends Quiz implements IMapQuiz {
  data: {[key: string]: number[][]}
  constructor(iMapQuiz: IMapQuiz) {
    super(iMapQuiz);
    this.data = iMapQuiz.data;
  }

  override getPluralType(): string {
    return "map quizzes";
  }
}

export default MapQuiz;