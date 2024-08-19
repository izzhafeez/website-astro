import { getCoordKey } from "../utils";
import Piece from "./Piece";

class Pawn extends Piece {
  constructor(side: string, x: number, y: number) {
    super("P", side, x, y);
  }

  getValidMoves(board: { [key: string]: Piece }) {
    let validMoves = [];
    let direction = this.side === "W" ? 1 : -1;
    let key = getCoordKey(this.x, this.y + direction);
    if (!board[key]) {
      validMoves.push(key);
      if (this.y === 1 || this.y === 6) {
        key = getCoordKey(this.x, this.y + 2 * direction);
        if (!board[key]) {
          validMoves.push(key);
        }
      }
    }
    key = getCoordKey(this.x - 1, this.y + direction);
    if (board[key] && board[key].side !== this.side) {
      validMoves.push(key);
    }
    key = getCoordKey(this.x + 1, this.y + direction);
    if (board[key] && board[key].side !== this.side) {
      validMoves.push(key);
    }

    return validMoves;
  }
}

export default Pawn;