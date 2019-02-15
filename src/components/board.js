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

const Prompts = (props) => {
  if (props.gameState === 'win') {
    return <div className='line' style={{ color: 'green'}}>You Win! Refresh to play again.</div>
  }

  if (props.gameState === 'lose') {
    return <div className='line' style={{ color: 'red'}}>You Lose! Refresh to try again.</div>
  }

  let secondQ;
  if (props.action) {
    if (props.action === '1') {
      secondQ = (
        <Fragment>
          <div className='line'>> 1</div>
          <div className='line'>Space to reveal (ie. 34):</div>
        </Fragment>
      );
    } else if (props.action === '2') {
      secondQ = (
        <Fragment>
          <div className='line'>> 2</div>
          <div className='line'>Space to flag (ie: 29):</div>
        </Fragment>
      );
    }
  }

  return (
    <Fragment>
      <div className='line'>Commands: (1) Reveal, (2) flag</div>
      {secondQ}
    </Fragment>
  );
}

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      action: 0,
      gameState: '',
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
    this.state.board = board;
  }

  checkForWin() {
    const { board } = this.state;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        // if bomb and not revealed
        if (board[i][j].value !== -1 && board[i][j].state === 'hidden') {
          return false;
        }
      }
    }

    this.setState({ gameState: 'win' });
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

    if (!action) {
      // validate the command given
      if (value !== '1' && value !== '2') {
        this.setState({
          error: `${value} is not a valid command`,
          terminalInput: '',
        })
      } else {
        this.setState({
          action: value,
          error: '',
          terminalInput: '',
        });
      }
    } else {
      if (value.length < 2) {
        return;
      }

      // parse the coordinates
      const x = parseInt(value.substring(0, 1));
      const y = parseInt(value.substring(1, 2));

      // reveal or flag the specified space
      if (action === '1') {
        this.revealSaidSpace(x, y);
        this.checkForWin();
      } else if (action === '2') {
        const { board } = this.state;

        // validate the flag
        if (board[x][y].state === 'revealed') {
          this.setState({
            error: `${x},${y} has already been revealed`,
            action: 0,
            terminalInput: '',
          })

        } else {
          board[x][y].state = 'flagged';
          this.setState({
            action: 0,
            board,
            error: '',
            terminalInput: '',
          });
        }
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
    let gameState;
    if (board[x][y].value === -1) {
      board.forEach(row => {
        row.forEach(cell => {
          if (cell.value === -1) {
            cell.state = 'revealed';
          }
        });
      });

      gameState = 'lose';

    // reveal all neighbors
    } else if (board[x][y].value === 0) {
      // set this cell
      board[x][y].state = 'revealed';

      // reveal all neighbors
      this.revealSaidSpace(x + 1, y);
			this.revealSaidSpace(x - 1, y);
			this.revealSaidSpace(x, y + 1);
			this.revealSaidSpace(x, y - 1);

			this.revealSaidSpace(x - 1, y - 1);
			this.revealSaidSpace(x - 1, y + 1);
			this.revealSaidSpace(x + 1, y + 1);
      this.revealSaidSpace(x + 1, y - 1);
    } else {
      board[x][y].state = 'revealed';
    }

    this.setState({
      action: 0,
      board,
      gameState,
      terminalInput: '',
    });
  }

  render() {
    return (
      <div className='terminal'>
        <div className='line'>
          Welcome to T<span style={{color: 'red'}}>*</span>Sweeper a text based minesweeper.
        </div>
        <br/>
        <Frame board={this.state.board} />
        <Prompts action={this.state.action} gameState={this.state.gameState} />
        <div className='line' style={{ color: 'red' }}>{this.state.error}</div>
        {this.state.gameState !== 'win' && this.state.gameState !== 'lose'
        ? <div className='line'>
            <form onSubmit={this.handleSubmit}>
              > <input
                  className='terminal-input'
                  onChange={(event) => this.setState({
                    terminalInput: event.target.value.substring(0, this.state.action === 0 ? 1 : 2)
                  })}
                  type='number' 
                  ref={input => this.terminalInput = input}
                  value={this.state.terminalInput}
                />
            </form>
          </div>
        : null }
      </div>
    );
  }
}

export default Board;