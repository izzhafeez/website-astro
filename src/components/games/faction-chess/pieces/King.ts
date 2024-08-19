import { getCoordKey } from "../utils";
import Piece from "./Piece";

class King extends Piece {
  constructor(side: string, x: number, y: number) {
    super("K", side, x, y);
  }

  getValidMoves(board: { [key: string]: Piece }) {
    let validMoves = [];
    for (let i = this.x - 1; i <= this.x + 1; i++) {
      for (let j = this.y - 1; j <= this.y + 1; j++) {
        if (i >= 0 && i < 8 && j >= 0 && j < 8) {
          if (i === this.x && j === this.y) {
            continue;
          }
          let key = getCoordKey(i, j);
          if (!board[key] || board[key].side !== this.side) {
            validMoves.push(key);
          }
        }
      }
    }
    return validMoves;
  }
}

export default King;