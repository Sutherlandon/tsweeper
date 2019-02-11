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
    </Fragment>
  );
}

const Instructions = (props) => {
  let secondQ;
  if (props.action) {
    if (props.action === '1') {
      secondQ = (
        <Fragment>
          <div className='line'>> 1</div>
          <div className='line'>Enter the space you want to reveal:</div>
          <br />
        </Fragment>
      );
    } else if (props.action === '2') {
      secondQ = (
        <Fragment>
          <div className='line'>> 2</div>
          <div className='line'>Enter the space you want to flag:</div>
          <br />
        </Fragment>
      );
    }
  }

  return (
    <Fragment>
      <div className='line'>If you want to reveal a space type '1'</div>
      <div className='line'>If you want to flag a space, type '2'</div>
      <br />
      {secondQ}
    </Fragment>
  );
}

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      terminalInput: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this);

    // build the game
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
        row.push({ state: 'hidden', value: 0 });
      }
      board.push(row);
    }

    // distribute bombs
    let numBombs = 0;
    while (numBombs <= 9) {
      // get a random cell
      let x = Math.floor(Math.random() * Math.floor(9)) 
      let y = Math.floor(Math.random() * Math.floor(9)) 

      // if it is not a bomb make it one
      if (board[x][y].value !== -1) {
        board[x][y].value = -1;
        numBombs += 1;
      }
    }

    // calculates the value of a cell
    let countNeighbors = (x, y) => {
      let neighbors = 0;
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          // if this cell is not out of bounds and is a bomb
          if (!((i === x && j === y) || i < 0 || i >= 9 || j < 0 || j >= 9) &&
            board[i][j].value === -1
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
    this.state = { board };
  }

  componentDidMount() {
    this.terminalInput.focus();
    console.log(this.state);
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { action, terminalInput: value } = this.state;
    console.log('submited', value);

    if (!action) {
      this.setState({
        action: value,
         terminalInput: '',
      });
    } else {
      // parse the coordinates
      const x = value.substring(0, 1);
      const y = value.substring(1, 2);

      // reveal or flag the specified space
      if (action === '1') {
        this.revealSaidSpace(x, y);
      } else if (action === '2') {
        const { board } = this.state;
        board[x][y].state = 'flagged';
        this.setState({
          board,
          action: 0,
          terminalInput: '',
        });
      }
    }
  }

  revealSaidSpace(x, y) {
    const { board } = this.state;

    // ignore coordinates out of bounds
    if (x < 0 || x >= 9 || y < 0 || y >= 9 || board[x][y].state === 'revealed') {
			return;
    }

    // if it's a bomb, reveal all bombs
    if (board[x][y].value === -1) {
      board.forEach(row => {
        row.forEach(cell => {
          if (board[x][y] === -1) {
            board[x][y].state = 'revealed';
          }
        });
      });
    // reveal all neighbors
    } else if (board[x][y].value === 0) {
      board[x][y].state = 'revealed';
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          // if this cell is not out of bounds
          if (!((i === x && j === y) || i < 0 || i >= 9 || j < 0 || j >= 9)) {
            this.revealSaidSpace(i, j);
          }
        }
      }
    } else {
      board[x][y].state = 'revealed';
    }

    this.setState({
      board,
      action: 0,
      terminalInput: '',
    });
  }

  render() {
    return (
      <div className='terminal'>
        <div className='line'>
          Welcome to TSweeper a text based minesweeper.
        </div>
        <br/>
        <Frame board={this.state.board} />
        <Instructions action={this.state.action} />
        <div className='line'>
          <form onSubmit={this.handleSubmit}>
            > <input
                className='terminal-input'
                onChange={event => this.setState({terminalInput: event.target.value})}
                type='text' 
                ref={input => this.terminalInput = input}
                value={this.state.terminalInput}
              />
          </form>
        </div>
      </div>
    );
  }
}

export default Board;