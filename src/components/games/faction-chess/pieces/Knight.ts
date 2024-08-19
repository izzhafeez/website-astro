import { getCoordKey, isInBounds } from "../utils";
import Piece from "./Piece";

class Knight extends Piece {
  constructor(side: string, x: number, y: number) {
    super("N", side, x, y);
  }

  getValidMoves(board: { [key: string]: Piece }) {
    let validMoves = [];
    let moves = [
      [this.x - 2, this.y + 1],
      [this.x - 2, this.y - 1],
      [this.x + 2, this.y + 1],
      [this.x + 2, this.y - 1],
      [this.x - 1, this.y + 2],
      [this.x - 1, this.y - 2],
      [this.x + 1, this.y + 2],
      [this.x + 1, this.y - 2]
    ];
    for (let move of moves) {
      if (isInBounds(move[0], move[1])) {
        let key = getCoordKey(move[0], move[1]);
        if (!board[key] || board[key].side !== this.side) {
          validMoves.push(key);
        }
      }
    }
    return validMoves;
  }
}

export default Knight;