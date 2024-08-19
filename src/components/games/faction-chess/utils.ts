import type Piece from "./pieces/Piece";

export const isInBounds = (x: number, y: number) => {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
}

export const getCoordKey = (x: number, y: number) => {
  return `${x},${y}`;
}

export const checkPy = (x: number, y: number, board: { [key: string]: Piece }, side: string) => {
  let validMoves = [];
  for (let i = y + 1; i < 8; i++) {
    let key = getCoordKey(x, i);
    if (board[key]) {
      if (board[key].side !== side) {
        validMoves.push(key);
      }
      break;
    } else {
      validMoves.push(key);
    }
  }
  return validMoves;
};

export const checkNy = (x: number, y: number, board: { [key: string]: Piece }, side: string) => {
  let validMoves = [];
  for (let i = y - 1; i >= 0; i--) {
    let key = getCoordKey(x, i);
    if (board[key]) {
      if (board[key].side !== side) {
        validMoves.push(key);
      }
      break;
    } else {
      validMoves.push(key);
    }
  }
  return validMoves;
};

export const checkNx = (x: number, y: number, board: { [key: string]: Piece }, side: string) => {
  let validMoves = [];
  for (let i = x - 1; i >= 0; i--) {
    let key = getCoordKey(i, y);
    if (board[key]) {
      if (board[key].side !== side) {
        validMoves.push(key);
      }
      break;
    } else {
      validMoves.push(key);
    }
  }
  return validMoves;
};

export const checkPx = (x: number, y: number, board: { [key: string]: Piece }, side: string) => {
  let validMoves = [];
  for (let i = x + 1; i < 8; i++) {
    let key = getCoordKey(i, y);
    if (board[key]) {
      if (board[key].side !== side) {
        validMoves.push(key);
      }
      break;
    } else {
      validMoves.push(key);
    }
  }
  return validMoves;
};

export const checkNxPy = (x: number, y: number, board: { [key: string]: Piece }, side: string) => {
  let validMoves = [];
  for (let i = 1; x - i >= 0 && y + i < 8; i++) {
    let key = getCoordKey(x - i, y + i);
    if (board[key]) {
      if (board[key].side !== side) {
        validMoves.push(key);
      }
      break;
    } else {
      validMoves.push(key);
    }
  }
  return validMoves;
};

export const checkPxPy = (x: number, y: number, board: { [key: string]: Piece }, side: string) => {
  let validMoves = [];
  for (let i = 1; x + i < 8 && y + i < 8; i++) {
    let key = getCoordKey(x + i, y + i);
    if (board[key]) {
      if (board[key].side !== side) {
        validMoves.push(key);
      }
      break;
    } else {
      validMoves.push(key);
    }
  }
  return validMoves;
};

export const checkNxNy = (x: number, y: number, board: { [key: string]: Piece }, side: string) => {
  let validMoves = [];
  for (let i = 1; x - i >= 0 && y - i >= 0; i++) {
    let key = getCoordKey(x - i, y - i);
    if (board[key]) {
      if (board[key].side !== side) {
        validMoves.push(key);
      }
      break;
    } else {
      validMoves.push(key);
    }
  }
  return validMoves;
};

export const checkPxNy = (x: number, y: number, board: { [key: string]: Piece }, side: string) => {
  let validMoves = [];
  for (let i = 1; x + i < 8 && y - i >= 0; i++) {
    let key = getCoordKey(x + i, y - i);
    if (board[key]) {
      if (board[key].side !== side) {
        validMoves.push(key);
      }
      break;
    } else {
      validMoves.push(key);
    }
  }
  return validMoves;
};

export const isKingInCheck = (board: {[key: string]: Piece}, setInCheck: (move: string | null) => void) => {
  for (let key in board) {
    const validMoves = board[key].getValidMoves(board);
    for (let validMove of validMoves) {
      if (!!board[validMove] && board[validMove].type === "K" && board[validMove].side !== board[key].side) {
        setInCheck(validMove);
        return validMove;
      }
    }
  }
  setInCheck(null);
  return null;
}

export const coordsToLetter = (x: number, y: number) => {
  return String.fromCharCode(97 + x) + (8 - y);
}