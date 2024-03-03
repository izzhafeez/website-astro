import guessData from "./guess";
import mapData from "./map";

const quizData = {
  guess: {
    data: guessData,
    limit: 5,
    description: "Guess quizzes"
  },
  map: {
    data: mapData,
    limit: 5,
    description: "Map quizzes"
  }
}

export default quizData;