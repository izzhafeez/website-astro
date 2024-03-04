import type { IGuessQuiz } from "types/item";
import Quiz from "./quiz";

class GuessQuiz extends Quiz implements IGuessQuiz {
  data: {[key: string]: string}
  constructor(iGuessQuiz: IGuessQuiz) {
    super(iGuessQuiz);
    this.data = iGuessQuiz.data;
  }

  override getPluralType(): string {
    return "guess quizzes"
  }
}

export default GuessQuiz;