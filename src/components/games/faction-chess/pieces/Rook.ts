import { checkNy, checkPy, checkNx, checkPx } from "../utils";
import Piece from "./Piece";

class Rook extends Piece {
  constructor(side: string, x: number, y: number) {
    super("R", side, x, y);
  }

  getValidMoves(board: { [key: string]: Piece }): string[] {
    let validMoves = [];
    validMoves.push(...checkPy(this.x, this.y, board, this.side));
    validMoves.push(...checkNy(this.x, this.y, board, this.side));
    validMoves.push(...checkNx(this.x, this.y, board, this.side));
    validMoves.push(...checkPx(this.x, this.y, board, this.side));
    return validMoves;
  }
}

export default Rook;