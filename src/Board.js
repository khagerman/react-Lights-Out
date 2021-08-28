import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 4, ncols = 4 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    // randomize true or false
    // push to intitialBoard in groups of rows
    // , Math.random() < 0.5
    for (let i = 0; i < nrows; i++) {
      initialBoard.push(Array.from({ length: ncols }));
      for (let j = 0; j < ncols; j++) {
        initialBoard[i][j] = Math.random() < 0.25;
      }
    }

    // create array bass on board size
    return initialBoard;
  }

  function hasWon() {
    return board.flat(Infinity).every((cell) => cell === true);
  }

  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };
      let oldBoardCopy = oldBoard.map((row) => [...row]);
      flipCell(y, x, oldBoardCopy);
      flipCell(y, x - 1, oldBoardCopy);
      flipCell(y, x + 1, oldBoardCopy);
      flipCell(y - 1, x, oldBoardCopy);
      flipCell(y + 1, x, oldBoardCopy);

      return oldBoardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return <h4>Yay! You won! 🎉🎉</h4>;
  }

  // make table board

  let tableBoard = [];
  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      let coord = `${y}-${x}`;

      row.push(
        <Cell
          key={coord}
          isLit={board[y][x]}
          flipCellsAroundMe={() => flipCellsAround(coord)}
        />
      );
    }
    tableBoard.push(<tr key={y}>{row}</tr>);
  }
  return (
    <table className="Board">
      <tbody>{tableBoard}</tbody>
    </table>
  );
}

export default Board;
