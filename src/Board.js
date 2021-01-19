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

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.20 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    // TODO: create array-of-arrays of true/false values
    // create the grid with a nested for lopp 
    for (let i = 0; i < ncols; i++) {
      let row = [];
      for (let j = 0; j < nrows; j++) {
        // push in a Boolean value based on a random number being lower than the chance a light starts on
        row.push(Math.random() < chanceLightStartsOn)

      }
      // push in the whole row which should now have a ncols number of boolean valyes in the array ie [t,t,f,t,f]
      initialBoard.push(row)

    }
    return initialBoard;
  }

  // a player wins by having all of the lights be off so we can check every cell and make sure there is a value of false in there 
  // we can use the every array method to make sure that every item in an array matches our 
  function hasWon() {
    // TODO: check the board in state to determine whether the player has won.
    // if the cells all come back as false then that means the player has met the win condition
    return board.every((row) => {
      row.every((cell) => !cell)
    })
  }


  function flipCellsAround(coord) {
    // going to update the state of the board, this will be passed down as a prop to the child component of the cell
    setBoard(oldBoard => {
      // receives a coordinate like '5-5' and returns an integer version of the coordinate => y=5, x=5 and we can find the cells around with this
      const [y, x] = coord.split("-").map(Number);
      // flip the current cell, can be used in conjunction with the coordinates to flip the cells around as well
      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          // flips true to false and vice versa
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // TODO: Make a (deep) copy of the oldBoard
      // as we have seen before we can just make a copy by using the spread operator for the array
      const boardCopy = oldBoard.map(row => [...row]);
      // TODO: in the copy, flip this cell and the cells around it
      // need to flip around the cells using the flip cell function
      flipCell(y, x, boardCopy);
      // check the coordinate to the left of the clicked on cell
      flipCell(y, x - 1, boardCopy);
      // check the coord to the right
      flipCell(y, x + 1, boardCopy);
      // check the coord one above
      flipCell(y + 1, x, boardCopy);
      // check the coord one below
      flipCell(y - 1, x, boardCopy);

      // TODO: return the copy
      return boardCopy;
    });


  };
  // if the game is won, just show a winning msg & render nothing else
  // check if the win condition has been met
  if (hasWon()) {
    return <div>You Win!</div>
  }
  // need to make a board for the table cells
  let tblBoard = [];
  // creating a grid
  for (let y = 0; y < nrows; y++) {
    // initialize the empty row
    let row = [];
    // for each cell in that row give it a coordinate 
    for (let x = 0; x < ncols; x++) {
      // set the coordinate based on the grid position
      let coord = `${y}-${x}`;
      // push a cell into each coordinate position
      row.push(
        // use our cell component
        <Cell
          // pass in a custom key to avoid a key error
          key={coord}
          // check the randomized boolean value of if a cell is lit
          isLit={board[y][x]}
          // pass down the ability to flip the cells around the clicked on by coordinate
          flipCellsAroundMe={() => flipCellsAround(coord)}
        />
      );
    }
    // push each row into the table grid with its custom key of the y coordinate only
    tblBoard.push(<tr key={y}>{row}</tr>);
  }
  // just return a board 
  return (

    <table className="Board">
      <tbody>{tblBoard}</tbody>
    </table>
  );
}

export default Board;
