abstract class Piece {
  type: string;
  side: string;
  x: number;
  y: number;
  constructor(type: string, side: string, x: number, y: number) {
    this.type = type;
    this.side = side;
    this.x = x;
    this.y = y;
  }

  getValidMoves(board: { [key: string]: Piece }): string[] {
    return [];
  }
}

export default Piece;