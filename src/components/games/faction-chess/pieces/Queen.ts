import { checkNy, checkNxNy, checkPxNy, checkPy, checkNxPy, checkPxPy, checkNx, checkPx } from "../utils";
import Piece from "./Piece";

class Queen extends Piece {
  constructor(side: string, x: number, y: number) {
    super("Q", side, x, y);
  }

  getValidMoves(board: { [key: string]: Piece }) {
    let validMoves = [];
    validMoves.push(...checkPy(this.x, this.y, board, this.side));
    validMoves.push(...checkNy(this.x, this.y, board, this.side));
    validMoves.push(...checkNx(this.x, this.y, board, this.side));
    validMoves.push(...checkPx(this.x, this.y, board, this.side));
    validMoves.push(...checkNxPy(this.x, this.y, board, this.side));
    validMoves.push(...checkPxPy(this.x, this.y, board, this.side));
    validMoves.push(...checkNxNy(this.x, this.y, board, this.side));
    validMoves.push(...checkPxNy(this.x, this.y, board, this.side));
    return validMoves;
  }
}

export default Queen;