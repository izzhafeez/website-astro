import { checkNxNy, checkPxNy, checkNxPy, checkPxPy } from "../utils";
import Piece from "./Piece";

class Bishop extends Piece {
  constructor(side: string, x: number, y: number) {
    super("B", side, x, y);
  }

  getValidMoves(board: { [key: string]: Piece }) {
    let validMoves = [];
    validMoves.push(...checkNxPy(this.x, this.y, board, this.side));
    validMoves.push(...checkPxPy(this.x, this.y, board, this.side));
    validMoves.push(...checkNxNy(this.x, this.y, board, this.side));
    validMoves.push(...checkPxNy(this.x, this.y, board, this.side));
    return validMoves;
  }
}

export default Bishop;