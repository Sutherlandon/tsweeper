import React, { Component } from 'react';
import Prompts from './prompts';
import Board from './board';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      action: 0,
      gameState: '',
      terminalInput: '',
    }
    
    this.handleChange = this.handleChange.bind(this);
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
    const countNeighborBombs = (x, y) => {
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
          cell.value = countNeighborBombs(i, j);
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
    console.log(this.state);
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  handleChange(event) {
    let terminalInput, { value } = event.target;
    if (value.match(/^[0-9]*/)) {
      console.log(this.state.action, value)
      if (['1', '2'].includes(this.state.action)) {
        terminalInput = value.substring(0, 2);
      } else {
        terminalInput = value.substring(0, 1);
      }

      this.setState({ terminalInput });
    }
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
        this.setState({ error: 'Your coordinates must be given as a two digit number'});
        return;
      }

      // parse the coordinates
      const x = parseInt(value.substring(0, 1));
      const y = parseInt(value.substring(1, 2));
      const { board } = this.state;

      // reveal or flag the specified space
      if (action === '1') {
        this.revealSaidSpace(x, y);
        this.checkForWin();
      } else if (action === '2') {
        // validate the flag
        if (board[x][y].state === 'revealed') {
          this.setState({
            error: `${x},${y} has already been revealed`,
            action: 0,
            terminalInput: '',
          });
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

  revealSaidSpace(x, y, cascade = false) {
    const { board } = this.state;

    // ignore coordinates out of bounds
    if (x < 0 || x >= 9 || y < 0 || y >= 9) {
      if (cascade) { return; }

      this.setState({
        action: 0,
        error: `${x},${y} is out of bounds`,
        terminalInput: '',
      });

    // ignore coordinates already revealed
    } else if (board[x][y].state === 'revealed') {
      if (cascade) { return; }

      this.setState({
        action: 0,
        error: `${x},${y} has already been revealed`,
        terminalInput: '',
      });
      
    // passed all pre-checks, reveal the space
    } else {
      // reveal the space
      board[x][y].state = 'revealed';

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

      // if no neighbors are bombs, reveal all neighbors
      } else if (board[x][y].value === 0) {
        // set this cell
        board[x][y].state = 'revealed';

        // reveal all neighbors
        // top row
        this.revealSaidSpace(x - 1, y - 1, true);
        this.revealSaidSpace(x, y - 1, true);
        this.revealSaidSpace(x + 1, y - 1, true);

        // let and right
        this.revealSaidSpace(x - 1, y, true);
        this.revealSaidSpace(x + 1, y, true);

        // bottom row
        this.revealSaidSpace(x - 1, y + 1, true);
        this.revealSaidSpace(x, y + 1, true);
        this.revealSaidSpace(x + 1, y + 1, true);
      }

      this.setState({
        action: 0,
        board,
        gameState,
        terminalInput: '',
      });
    }
  }

  /**
   * Reveals all the spaces around a cell that are not flagged if the number of flags
   * around the cell is the same as the number of bombs
   * @param {} x 
   * @param {*} y 
   */
  revealAllButFlaggedNeighbors(x, y) {
    const countNeighborFlags = (x, y) => {
      let neighbors = 0;
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          // if this cell is not out of bounds and is a bomb
          if (!((i === x && j === y) || i < 0 || i >= 9 || j < 0 || j >= 9) &&
            this.state.board[i][j].state === 'flagged'
          ) {
            neighbors += 1;
          }
        }
      }
      return neighbors;
    }

    // if all possible bombs are flagged, reveal the remaining spaces
    if (countNeighborFlags(x, y) === this.state.board[x][y].value) {
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          // if this cell is not out of bounds and is a bomb
          if (!((i === x && j === y) || i < 0 || i >= 9 || j < 0 || j >= 9) &&
            this.state.board[i][j].state !== 'flagged'
          ) {
            this.revealSaidSpace(i, j);
          }
        }
      }
    }
  }

  render() {
    return (
      <div className='terminal'>
        <div className='line'>
          Welcome to T<span style={{color: 'red'}}>*</span>Sweeper a text based minesweeper.
        </div>
        <br/>
        <Board board={this.state.board} />
        <Prompts action={this.state.action} gameState={this.state.gameState} />
        <div className='line' style={{ color: 'red' }}>{this.state.error}</div>
        <div className='line'>
          <form onSubmit={this.handleSubmit}>
            > <input
                className='terminal-input'
                onChange={this.handleChange}
                type='number' 
                value={this.state.terminalInput}
              />
          </form>
        </div>
      </div>
    );
  }
}

export default Game;