import React, { useState } from "react";
import { coordsToLetter, getCoordKey, isKingInCheck } from "./utils";
import Rook from "./pieces/Rook";
import Knight from "./pieces/Knight";
import Bishop from "./pieces/Bishop";
import Queen from "./pieces/Queen";
import King from "./pieces/King";
import Pawn from "./pieces/Pawn";
import type Piece from "./pieces/Piece";

function FactionChess() {
  const [side, setSide] = useState("W");
  const [board, setBoard] = useState({
    "0,0": new Rook("W", 0, 0 ),
    "1,0": new Knight("W", 1, 0),
    "2,0": new Bishop("W", 2, 0),
    "3,0": new Queen("W", 3, 0),
    "4,0": new King("W", 4, 0),
    "5,0": new Bishop("W", 5, 0),
    "6,0": new Knight("W", 6, 0),
    "7,0": new Rook("W", 7, 0),
    "0,1": new Pawn("W", 0, 1),
    "1,1": new Pawn("W", 1, 1),
    "2,1": new Pawn("W", 2, 1),
    "3,1": new Pawn("W", 3, 1),
    "4,1": new Pawn("W", 4, 1),
    "5,1": new Pawn("W", 5, 1),
    "6,1": new Pawn("W", 6, 1),
    "7,1": new Pawn("W", 7, 1),
    "0,7": new Rook("B", 0, 7),
    "1,7": new Knight("B", 1, 7),
    "2,7": new Bishop("B", 2, 7),
    "3,7": new Queen("B", 3, 7),
    "4,7": new King("B", 4, 7),
    "5,7": new Bishop("B", 5, 7),
    "6,7": new Knight("B", 6, 7),
    "7,7": new Rook("B", 7, 7),
    "0,6": new Pawn("B", 0, 6),
    "1,6": new Pawn("B", 1, 6),
    "2,6": new Pawn("B", 2, 6),
    "3,6": new Pawn("B", 3, 6),
    "4,6": new Pawn("B", 4, 6),
    "5,6": new Pawn("B", 5, 6),
    "6,6": new Pawn("B", 6, 6),
    "7,6": new Pawn("B", 7, 6),
  } as { [key: string]: any });
  const [currentClicked, setCurrentClicked] = useState(null as string | null);
  const [validMoves, setValidMoves] = useState([] as string[]);
  const [inCheck, setInCheck] = useState(null as string | null);
  const [history, setHistory] = useState([] as string[]);

  const handleClick = (i: number, j: number) => {
    console.log(i, j);

    const key = getCoordKey(i, j);
    if (validMoves.includes(key)) {
      handleMove(i, j);
      return;
    }

    if (currentClicked === null) {
      const key = getCoordKey(i, j);
      if (key in board && board[key].side === side) {
        showValidMoves(i, j);
        setCurrentClicked(key);
      }
      return;
    }

    if (key != currentClicked && key in board && board[key].side === side) {
      setCurrentClicked(key);
      showValidMoves(i, j);
      return;
    }

    if (key === currentClicked) {
      setCurrentClicked(null);
      setValidMoves([]);
      return;
    }
  }

  const showValidMoves = (i: number, j: number) => {
    const key = getCoordKey(i, j);
    const piece = board[key];
    if (!piece) {
      return;
    }
    const pieceValidMoves = piece.getValidMoves(board);
    // filter out moves that would put king in check
    const filteredValidMoves = pieceValidMoves.filter((move: string) => {
      const newBoard = { ...board };
      newBoard[move] = piece;
      delete newBoard[key];
      const checkedKing = isKingInCheck(newBoard, () => {});
      return !checkedKing || newBoard[checkedKing].side !== side;
    });
    setValidMoves(filteredValidMoves);
  }

  const isCheckmate = (boardToCheck: {[key: string]: Piece}) => {
    const validMoves = Object.values(boardToCheck).reduce((acc: string[], piece: any) => {
      if (piece.side !== side) {
        const pieceValidMoves = piece.getValidMoves(boardToCheck);
        // filter out moves that would put king in check
        const filteredValidMoves = pieceValidMoves.filter((move: string) => {
          const newBoard = { ...boardToCheck };
          newBoard[move] = piece;
          delete newBoard[getCoordKey(piece.x, piece.y)];
          return !isKingInCheck(newBoard, () => {});
        });
        if (filteredValidMoves.length > 0) {
          console.log(piece, filteredValidMoves);
        }
        acc.push(...filteredValidMoves);
      }
      return acc;
    }, []);

    return validMoves.length === 0;
  }

  const handleMove = (i: number, j: number) => {
    const key = getCoordKey(i, j);
    const newBoard = { ...board };
    newBoard[key] = board[currentClicked!];
    delete newBoard[currentClicked!];

    // promote pawn to queen
    if (newBoard[key].type === "P" && (j === 0 || j === 7)) {
      newBoard[key] = new Queen(side, i, j);
    }
    
    // update xy of piece
    newBoard[key].x = i;
    newBoard[key].y = j;

    setBoard(_ => newBoard);
    setValidMoves([]);
    isKingInCheck(newBoard, setInCheck);
    if (isCheckmate(newBoard)) {
      alert("Checkmate");
    }
    // add move to history
    const [currX, currY] = currentClicked?.split(",").map(val => parseInt(val)) as number[];
    setHistory([...history, `${side}: ${newBoard[key].type} ${coordsToLetter(currX, currY)} ${coordsToLetter(i, j)} ${board[key] ? 'x ' + board[key].type : ''}`]);

    // reset
    setCurrentClicked(_ => null);
    setSide(_ => side === "W" ? "B" : "W");
  }

  return (
    <div>
      <h1>Faction Chess</h1>
      <div>
        {["W", "B"].map((s) => (
          <button key={s} onClick={() => setSide(s)}>
            {s}
          </button>
        ))}
      </div>
      <div className="grid">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex grid-cols-8">
            {Array.from({ length: 8 }, (_, j) => {
              const key = getCoordKey(j, i);
              return (
                <div
                  key={j}
                  className={`w-20 h-20 flex justify-center items-center ${(i+j) % 2 === 0 ? "bg-dt-500" : "bg-dt-700"} ${key in board && board[key].side === "W" ? "text-white" : "text-black"} ${inCheck === key ? "bg-red-500" : ""}`}
                  onClick={() => handleClick(j, i)}
                >
                  {validMoves.includes(key) && <div className="absolute h-2 w-2 bg-black rounded-full"></div>}
                  {key in board ? board[key].type : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* history */}
      <div>
        <h2>History</h2>
        <ul>
          {history.map((move, i) => (
            <li key={i}>{move}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FactionChess;