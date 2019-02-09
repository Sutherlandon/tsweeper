import React, { Component, Fragment } from 'react';
import Cell from './cell';

const Line = (props) => {
  return (
    <div className='line'>
      <span className='index'>{props.index} </span>
      {props.cells.map((cell, i) =>
        <Cell key={`cell_${props.index}_${i}`} value={cell.value} state={cell.state} />
       )}
    </div>
  );
}

const Frame = (props) => {
  return (
    <Fragment>
      <div className='line index'>
        &nbsp;&nbsp;0 1 2 3 4 5 6 7 8
      </div>
      {props.board.map((line, i) => <Line key={`line_${i}`} index={i} cells={line} />)}
      <br />
      <div className='line'>If you want to Reveal a space, type 1</div>
      <div className='line'>If you want to flag a space, type 2</div>
      <br />
    </Fragment>
  );
}

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {}
    this.buildBoard();
  }

  // builds a new game to play
  buildBoard() {
    // a cell state can be flagged, hidden, or revealed
    // a cell value is the number of bombs it is neighboring or -1 if bomb
    let board = []
    while (board.length < 9) {
      let row = [];
      while (row.length < 9) {
        row.push({ state: 'revealed', value: 0 });
      }
      board.push(row);
    }

    // distribute bombs
    let numBombs = 0;
    while (numBombs <= 9) {
      // get a random cell
      let x = Math.floor(Math.random() * Math.floor(9)) 
      let y = Math.floor(Math.random() * Math.floor(9)) 

      console.log( x, y);
      // if it is not a bomb make it one
      if (board[x][y].value !== -1) {
        board[x][y].value = -1;
        numBombs += 1;
      }
    }

    console.log(board);

    // calculates the value of a cell
    let countNeighbors = (i, j) => {
      let neighbors = 0;
      for (let x = i - 1; x <= i + 1; x++) {
        for (let y = j - 1; y <= j + 1; y++) {
          // if this cell is not out of bounds and is a bomb +1 to neighbors
          if (
            !((j === i && y === j) || x < 0 || x >= 9 || y < 0 || y >= 9) &&
            board[x][y].value === -1
          ) {
            neighbors += 1;
          }
        }
      }
      return neighbors;
    }

    // calculate the rest of the cells values
    board.forEach((line, i) => {
      line.forEach((cell, j) => {
        if (cell.value !== -1) {
          cell.value = countNeighbors(i, j);
        }
      })
    })

    // we set state directly here because we are running this function in the
    // constructor of the board
    // eslint-disable-next-line
    this.state = { frames: [board] };
  }

  render() {
    console.log(this.state.board)
    return (
      <div className='terminal'>
        <div className='line'>
          Welcome to TSweeper a text based minesweeper.
        </div>
        <br/>
        {this.state.frames.map(board => (
          <Frame board={board} />
        ))}
        <div className='line'>
          > <input className='terminal-input' type='text' />
        </div>
      </div>
    );
  }
}

export default Board;